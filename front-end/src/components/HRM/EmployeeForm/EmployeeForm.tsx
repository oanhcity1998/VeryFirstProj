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
} from "antd";
import dayjs from "dayjs";
import { Employee } from "@/models/HRM/employee.model";
import { useGetDepartmentsQuery } from "@/services/HRM/department.service";
import { useGetJobsQuery } from "@/services/HRM/position.service";
import "./EmployeeForm.css"

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
  saveText = "Xác nhận",
  loading = false,
}) => {
  const { data: departmentData } = useGetDepartmentsQuery();
  const { data: jobData } = useGetJobsQuery();

  useEffect(() => {
    console.log("Employee prop in form:", employee); // Debug
    if (employee) {
      form.setFieldsValue({
        name: employee.name,
        code: employee.code || "",
        birthday: employee.birthday ? dayjs(employee.birthday, "YYYY-MM-DD") : null,
        gender: employee.gender,
        work_phone: employee.work_phone,
        work_email: employee.work_email,
        department_id: employee.department_id || undefined,
        job_id: employee.job_id || undefined,
        status: employee.status,
        id_number: employee.id_number,
        id_issued_date: employee.id_issued_date ? dayjs(employee.id_issued_date, "YYYY-MM-DD") : null,
        id_issued_place: employee.id_issued_place,
        permanent_address: employee.permanent_address,
        temporary_address: employee.temporary_address,
        tax_id: employee.tax_id,
        insurance_id: employee.insurance_id,
        bank_account: employee.bank_account,
        contract: {
          name: employee.contract?.[0]?.name || "",
          contract_type: employee.contract?.[0]?.contract_type || "",
          contract_term: employee.contract?.[0]?.contract_term || "",
          date_start: employee.contract?.[0]?.date_start
            ? dayjs(employee.contract[0].date_start, "YYYY-MM-DD")
            : null,
          date_end: employee.contract?.[0]?.date_end
            ? dayjs(employee.contract[0].date_end, "YYYY-MM-DD")
            : null,
          wage: employee.contract?.[0]?.wage || 0,
          bonus: employee.contract?.[0]?.bonus || 0,
        },
      });
    } else {
      form.resetFields();
    }
  }, [employee, form, departmentData, jobData]);

  const onFinish = (values: any) => {
    console.log("Form values on submit:", values); // Debug
    const formattedValues: Employee = {
      id: values.id || Date.now(),
      name: values.name,
      code: values.code || "",
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : "",
      gender: values.gender,
      work_phone: values.work_phone,
      work_email: values.work_email,
      department_id: values.department_id || 0,
      department_name: departmentData?.data.find((d) => d.id === values.department_id)?.name || "",
      job_id: values.job_id || 0,
      job_name: jobData?.data.find((j) => j.id === values.job_id)?.name || "",
      status: values.status || "active",
      id_number: values.id_number,
      id_issued_date: values.id_issued_date ? values.id_issued_date.format("YYYY-MM-DD") : "",
      id_issued_place: values.id_issued_place,
      permanent_address: values.permanent_address,
      temporary_address: values.temporary_address || "",
      tax_id: values.tax_id || "",
      insurance_id: values.insurance_id || "",
      bank_account: values.bank_account || "",
      contract: values.contract
        ? [{
          id: employee?.contract?.[0]?.id || Date.now(),
          name: values.contract.name || "",
          contract_type: values.contract.contract_type || "",
          contract_term: values.contract.contract_term || "",
          date_start: values.contract.date_start ? values.contract.date_start.format("YYYY-MM-DD") : "",
          date_end: values.contract.date_end ? values.contract.date_end.format("YYYY-MM-DD") : "",
          wage: values.contract.wage || 0,
          bonus: values.contract.bonus || 0,
        }]
        : [],
    };
    onSave(formattedValues);
  };

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          danger
          onClick={onCancel}
        >
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          {saveText}
        </Button>,
      ]}
      width={1100}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="stretch">
          <Col span={8}>
            <Card title={infoTitle} className="card-section employee-card">
              <Form.Item
                label="Mã nhân viên"
                name="code"
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
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="birthday"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%", height: 30 }}
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
                name="department_id"
                rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
              >
                <Select
                  placeholder="Chọn phòng ban"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  style={{ width: "100%" }}
                >
                  {departmentData?.data.map((dept) => (
                    <Select.Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Vị trí"
                name="job_id"
                rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
              >
                <Select
                  placeholder="Chọn vị trí"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  style={{ width: "100%" }}
                >
                  {jobData?.data.map((job) => (
                    <Select.Option key={job.id} value={job.id}>
                      {job.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card title={extraInfoTitle} bordered className="card-section employee-card">
              <Form.Item
                label="Số CCCD"
                name="id_number"
                rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
              >
                <Input placeholder="Nhập số CCCD" />
              </Form.Item>
              <Form.Item
                label="Ngày cấp CCCD"
                name="id_issued_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày cấp"
                  style={{ width: "100%", height: 30 }}
                />
              </Form.Item>
              <Form.Item
                label="Nơi cấp CCCD"
                name="id_issued_place"
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
            <Card title={contractTitle} bordered className="card-section employee-card">
              <Form.Item
                label="Tên hợp đồng"
                name={["contract", "name"]}
              >
                <Input placeholder="Nhập tên hợp đồng" />
              </Form.Item>
              <Form.Item
                label="Loại hợp đồng"
                name={["contract", "contract_type"]}
                rules={[{ required: true, message: "Vui lòng chọn loại hợp đồng!" }]}
              >
                <Select placeholder="Chọn loại hợp đồng">
                  <Select.Option value="Hợp đồng lao động xác định thời hạn">Hợp đồng lao động xác định thời hạn</Select.Option>
                  <Select.Option value="Hợp đồng lao động không xác định thời hạn">Hợp đồng lao động không xác định thời hạn</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Thời hạn hợp đồng"
                name={["contract", "contract_term"]}
                rules={[{ required: true, message: "Vui lòng nhập thời hạn hợp đồng!" }]}
              >
                <Input placeholder="Nhập thời hạn hợp đồng (VD: 12 tháng, không xác định...)" />
              </Form.Item>
              <Form.Item
                label="Ngày bắt đầu"
                name={["contract", "date_start"]}
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%", height: 30 }}
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
              <Form.Item
                label="Ngày kết thúc"
                name={["contract", "date_end"]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%", height: 30 }}
                  placeholder="Chọn ngày kết thúc (không bắt buộc)"
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
                name={["contract", "bonus"]}
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