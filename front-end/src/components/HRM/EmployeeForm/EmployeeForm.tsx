import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Card,
  InputNumber,
  FormInstance,
  Select,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import "./EmployeeForm.css";
import { Employee } from "@/models/HRM/employee.model";

interface EmployeeFormProps {
  onCancel: () => void;
  onSave: (values: Employee) => void;
  employee?: Employee | null;
  open: boolean;
  modalTitle?: string;
  infoTitle?: string;
  extraInfoTitle?: string;
  contractTitle?: string;
  cancelText?: string;
  saveText?: string;
  form: FormInstance;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  form,
  onCancel,
  onSave,
  employee,
  open,
  modalTitle = "Thêm nhân sự",
  infoTitle = "Thông tin nhân sự",
  extraInfoTitle = "Thông tin bổ sung",
  contractTitle = "Thông tin hợp đồng",
  cancelText = "Hủy",
  saveText = "Lưu",
  loading = false,
}) => {
  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        name: employee.name,
        employee_code: employee.employee_code || "", // New field
        birthday: employee.birthday ? dayjs(employee.birthday, "YYYY-MM-DD") : null,
        gender: employee.gender,
        work_phone: employee.work_phone,
        work_email: employee.work_email,
        department: employee.department,
        job_name: employee.job_name,
        status: employee.status,
        cccd: employee.cccd,
        issued_date_cccd: employee.issued_date_cccd
          ? dayjs(employee.issued_date_cccd, "YYYY-MM-DD")
          : null,
        issued_place_cccd: employee.issued_place_cccd,
        permanent_address: employee.permanent_address,
        temporary_address: employee.temporary_address,
        tax_id: employee.tax_id,
        insurance_id: employee.insurance_id,
        bank_account: employee.bank_account,
        contract: employee.contract?.[0] || {
          id: Date.now(),
          x_contract_type: "",
          x_contract_term: false,
          date_start: null,
          date_end: null,
          wage: 0,
          x_bonus: 0,
        },
      });
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  const onFinish = (values: any) => {
    const formattedValues: Employee = {
      id: values.id || Date.now(), // Still generated here for local use, but not in form
      name: values.name,
      employee_code: values.employee_code || "", // New field
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : "",
      gender: values.gender,
      work_phone: values.work_phone,
      work_email: values.work_email,
      department_id: 0, // Placeholder, to be set by backend
      department: values.department || "",
      job_id: 0, // Placeholder, to be set by backend
      job_name: values.job_name || "",
      status: values.status || "Active",
      cccd: values.cccd,
      issued_date_cccd: values.issued_date_cccd
        ? values.issued_date_cccd.format("YYYY-MM-DD")
        : "",
      issued_place_cccd: values.issued_place_cccd,
      permanent_address: values.permanent_address,
      temporary_address: values.temporary_address || "",
      tax_id: values.tax_id || "",
      insurance_id: values.insurance_id || "",
      bank_account: values.bank_account || "",
      contract: [
        {
          id: values.contract?.id || Date.now(),
          x_contract_type: values.contract?.x_contract_type || "",
          x_contract_term: values.contract?.x_contract_term || false,
          date_start: values.contract?.date_start
            ? values.contract.date_start.format("YYYY-MM-DD")
            : "",
          date_end: values.contract?.date_end
            ? values.contract.date_end.format("YYYY-MM-DD")
            : "",
          wage: values.contract?.wage || 0,
          x_bonus: values.contract?.x_bonus || 0,
        },
      ],
    };
    onSave(formattedValues);
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          danger
          onClick={onCancel}
          style={{ backgroundColor: "red", color: "white" }}
        >
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          {saveText}
        </Button>,
      ]}
      width={1100}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "80vh", overflowY: "hidden" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: "0 16px" }}>
        <Row gutter={16} align="stretch">
          <Col span={8}>
            <Card title={infoTitle} bordered className="employee-card">
              <Form.Item
                label="Mã nhân viên"
                name="employee_code"
                rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
              >
                <Input placeholder="Nhập mã nhân viên" />
              </Form.Item>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="birthday"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="work_phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="work_email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                label="Phòng ban"
                name="department"
                rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
              >
                <Input placeholder="Nhập tên phòng ban" />
              </Form.Item>
              <Form.Item
                label="Vị trí"
                name="job_name"
                rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
              >
                <Input placeholder="Nhập tên vị trí" />
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card title={extraInfoTitle} bordered className="employee-card">
              <Form.Item
                label="Số CCCD"
                name="cccd"
                rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
              >
                <Input placeholder="Nhập số CCCD" />
              </Form.Item>
              <Form.Item
                label="Ngày cấp CCCD"
                name="issued_date_cccd"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày cấp"
                />
              </Form.Item>
              <Form.Item
                label="Nơi cấp CCCD"
                name="issued_place_cccd"
                rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
              >
                <Input placeholder="Nhập nơi cấp CCCD" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ thường trú"
                name="permanent_address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ thường trú!" }]}
              >
                <Input placeholder="Nhập địa chỉ thường trú" />
              </Form.Item>
              <Form.Item label="Địa chỉ tạm trú" name="temporary_address">
                <Input placeholder="Nhập địa chỉ tạm trú" />
              </Form.Item>
              <Form.Item label="Mã số thuế TNCN" name="tax_id">
                <Input placeholder="Nhập mã số thuế TNCN" />
              </Form.Item>
              <Form.Item label="Mã số BHXH" name="insurance_id">
                <Input placeholder="Nhập mã số BHXH" />
              </Form.Item>
              <Form.Item label="Tài khoản ngân hàng" name="bank_account">
                <Input placeholder="Nhập số tài khoản ngân hàng" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card title={contractTitle} bordered className="employee-card">
              <Form.Item
                label="Loại hợp đồng"
                name={["contract", "x_contract_type"]}
                rules={[{ required: true, message: "Vui lòng nhập loại hợp đồng!" }]}
              >
                <Input placeholder="Nhập loại hợp đồng" />
              </Form.Item>
              <Form.Item
                label="Thời hạn hợp đồng"
                name={["contract", "x_contract_term"]}
                valuePropName="checked"
              >
                <Checkbox>Có thời hạn</Checkbox>
              </Form.Item>
              <Form.Item
                label="Ngày bắt đầu"
                name={["contract", "date_start"]}
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
              <Form.Item
                label="Ngày kết thúc"
                name={["contract", "date_end"]}
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
              <Form.Item
                label="Mức lương"
                name={["contract", "wage"]}
                rules={[{ required: true, message: "Vui lòng nhập mức lương!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập mức lương"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/,/g, "") as any}
                />
              </Form.Item>
              <Form.Item
                label="Tiền thưởng"
                name={["contract", "x_bonus"]}
                rules={[{ required: true, message: "Vui lòng nhập tiền thưởng!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập tiền thưởng"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/,/g, "") as any}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;