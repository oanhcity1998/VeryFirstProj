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
} from "antd";
import dayjs from "dayjs";
import "./EmployeeForm.css";

interface Employee {
  fullName?: string;
  birthDate?: string;
  phone?: string;
  position?: string;
  gender?: string;
  email?: string;
  department?: string;
  idNumber?: string;
  issuePlace?: string;
  issueDate?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  personalTaxCode?: string;
  socialInsuranceNumber?: string;
  bankAccount?: string;
  contractType?: string;
  contractTerm?: string;
  startDate?: string;
  endDate?: string;
  salary?: string;
  bonus?: string;
}

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
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
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
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        birthDate: employee.birthDate
          ? dayjs(employee.birthDate, "DD/MM/YYYY")
          : null,
        issueDate: employee.issueDate
          ? dayjs(employee.issueDate, "DD/MM/YYYY")
          : null,
        startDate: employee.startDate
          ? dayjs(employee.startDate, "DD/MM/YYYY")
          : null,
        endDate: employee.endDate
          ? dayjs(employee.endDate, "DD/MM/YYYY")
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  const onFinish = (values: any) => {
    onSave({
      ...values,
      birthDate: values.birthDate
        ? values.birthDate.format("DD/MM/YYYY")
        : null,
      issueDate: values.issueDate
        ? values.issueDate.format("DD/MM/YYYY")
        : null,
      startDate: values.startDate
        ? values.startDate.format("DD/MM/YYYY")
        : null,
      endDate: values.endDate ? values.endDate.format("DD/MM/YYYY") : null,
      salary: values.salary ? values.salary.toString() : null,
      bonus: values.bonus ? values.bonus.toString() : null,
    });
    onCancel();
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
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {saveText}
        </Button>,
      ]}
      width={1100}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="stretch">
          <Col span={8}>
            <Card title={infoTitle} bordered className="employee-card">
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="birthDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
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
                label="Vị trí"
                name="position"
                rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
              >
                <Input placeholder="Nhập vị trí công việc" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
              >
                <Input placeholder="Nam / Nữ" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
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
                rules={[{ required: true, message: "Vui lòng nhập phòng ban!" }]}
              >
                <Input placeholder="Nhập tên phòng ban" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card title={extraInfoTitle} bordered className="employee-card">
              <Form.Item
                label="Số CCCD"
                name="idNumber"
                rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
              >
                <Input placeholder="Nhập số CCCD" />
              </Form.Item>
              <Form.Item
                label="Nơi cấp"
                name="issuePlace"
                rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
              >
                <Input placeholder="Nhập nơi cấp CCCD" />
              </Form.Item>
              <Form.Item
                label="Ngày cấp"
                name="issueDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày cấp"
                />
              </Form.Item>
              <Form.Item
                label="Địa chỉ thường trú"
                name="permanentAddress"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ thường trú!" },
                ]}
              >
                <Input placeholder="Nhập địa chỉ thường trú" />
              </Form.Item>
              <Form.Item label="Địa chỉ tạm trú" name="temporaryAddress">
                <Input placeholder="Nhập địa chỉ tạm trú" />
              </Form.Item>
              <Form.Item label="Mã số TNCN" name="personalTaxCode">
                <Input placeholder="Nhập mã số TNCN" />
              </Form.Item>
              <Form.Item label="Mã số BHXH" name="socialInsuranceNumber">
                <Input placeholder="Nhập mã số BHXH" />
              </Form.Item>
              <Form.Item label="Tài khoản ngân hàng" name="bankAccount">
                <Input placeholder="Nhập số tài khoản ngân hàng" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card title={contractTitle} bordered className="employee-card">
              <Form.Item
                label="Loại hợp đồng lao động"
                name="contractType"
                rules={[{ required: true, message: "Vui lòng nhập loại hợp đồng!" }]}
              >
                <Input placeholder="VD: Hợp đồng xác định thời hạn" />
              </Form.Item>
              <Form.Item label="Thời hạn hợp đồng lao động" name="contractTerm">
                <Input placeholder="VD: 12 tháng" />
              </Form.Item>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
              <Form.Item label="Mức lương" name="salary">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập mức lương"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/,/g, "")}
                />
              </Form.Item>
              <Form.Item label="Tiền thưởng" name="bonus">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tiền thưởng"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/,/g, "")}
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
