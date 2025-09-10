import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Row, Col, Card, Input, DatePicker, Breadcrumb } from "antd";
import dayjs from "dayjs";
import "./EmployeeDetail.css";
import { ROUTES_APP } from "../../../routes";

interface Employee {
  key: string;
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  idNumber: string;
  issueDate: string;
  issuePlace: string;
  phone: string;
  email: string;
  permanentAddress: string;
  temporaryAddress: string;
  personalTaxCode: string;
  socialInsuranceNumber: string;
  bankAccount: string;
  department: string;
  position: string;
  contractType: string;
  contractTerm: string;
  startDate: string;
  endDate: string;
  salary: string;
  bonus: string;
}

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const employees: Employee[] = [
    {
      key: "1",
      id: "82334",
      fullName: "Nguyễn Nhật Huy",
      gender: "Nam",
      birthDate: "04/12/1978",
      idNumber: "523943855",
      issueDate: "16/08/2013",
      issuePlace: "7529 E Pecan St.",
      phone: "+84 678 890 000",
      email: "huy.nguyen@example.com",
      permanentAddress: "123 Đường A, TP.HCM",
      temporaryAddress: "456 Đường B, Hà Nội",
      personalTaxCode: "123456789",
      socialInsuranceNumber: "987654321",
      bankAccount: "0987654321 - Vietcombank",
      department: "Phòng 1",
      position: "Nhân viên kinh doanh",
      contractType: "Hợp đồng xác định thời hạn",
      contractTerm: "12 tháng",
      startDate: "01/01/2020",
      endDate: "31/12/2021",
      salary: "15000000",
      bonus: "2000000",
    },
  ];

  useEffect(() => {
    const foundEmployee = employees.find((emp) => emp.id === id);
    if (foundEmployee) {
      setEmployee(foundEmployee);
      form.setFieldsValue({
        ...foundEmployee,
        birthDate: foundEmployee.birthDate
          ? dayjs(foundEmployee.birthDate, "DD/MM/YYYY")
          : null,
        issueDate: foundEmployee.issueDate
          ? dayjs(foundEmployee.issueDate, "DD/MM/YYYY")
          : null,
        startDate: foundEmployee.startDate
          ? dayjs(foundEmployee.startDate, "DD/MM/YYYY")
          : null,
        endDate: foundEmployee.endDate
          ? dayjs(foundEmployee.endDate, "DD/MM/YYYY")
          : null,
        salary: new Intl.NumberFormat("en-US").format(
          Number(foundEmployee.salary)
        ),
        bonus: new Intl.NumberFormat("en-US").format(
          Number(foundEmployee.bonus)
        ),
      });
    } else {
      navigate(ROUTES_APP.hrm.employeeList);
    }
  }, [id, form, navigate]);

  if (!employee) return <div>Đang tải...</div>;

  return (
    <div className="employee-detail-container">
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link to={ROUTES_APP.hrm.employeeList}>Danh sách nhân sự</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết nhân sự</Breadcrumb.Item>
        <Breadcrumb.Item>{employee.fullName}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<h2 style={{ margin: 0 }}>Chi tiết nhân sự {employee.fullName}</h2>}
            variant="outlined"
          >
            <Form form={form} layout="vertical" disabled={true}>
              <Row gutter={16} align="stretch">
                {/* Thông tin nhân sự */}
                <Col span={8}>
                  <Card
                    title="Thông tin nhân sự"
                    variant="outlined"
                    className="employee-card"
                  >
                    <Form.Item label="Họ và tên" name="fullName">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="birthDate">
                      <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Vị trí" name="position">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Phòng ban" name="department">
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>

                {/* Thông tin bổ sung */}
                <Col span={8}>
                  <Card
                    title="Thông tin bổ sung"
                    variant="outlined"
                    className="employee-card"
                  >
                    <Form.Item label="Số CCCD" name="idNumber">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Nơi cấp" name="issuePlace">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày cấp" name="issueDate">
                      <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Địa chỉ thường trú" name="permanentAddress">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ tạm trú" name="temporaryAddress">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Mã số TNCN" name="personalTaxCode">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Mã số BHXH" name="socialInsuranceNumber">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Tài khoản ngân hàng" name="bankAccount">
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>

                {/* Thông tin hợp đồng */}
                <Col span={8}>
                  <Card
                    title="Thông tin hợp đồng"
                    variant="outlined"
                    className="employee-card"
                  >
                    <Form.Item label="Loại hợp đồng lao động" name="contractType">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Thời hạn hợp đồng lao động" name="contractTerm">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate">
                      <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                      <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Mức lương" name="salary">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Tiền thưởng" name="bonus">
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetail;
