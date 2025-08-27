import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, Typography, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import "./EmployeeDetail.css";

const { Title } = Typography;

const EmployeeDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [form] = Form.useForm(); // Sử dụng Form.useForm() từ Ant Design

  const employees = [
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
    console.log("ID from URL:", id); // Debug
    const foundEmployee = employees.find((emp) => emp.id === id);
    if (foundEmployee) {
      setEmployee(foundEmployee);
      form.setFieldsValue({
        ...foundEmployee,
        birthDate: foundEmployee.birthDate ? dayjs(foundEmployee.birthDate, "DD/MM/YYYY") : null,
        issueDate: foundEmployee.issueDate ? dayjs(foundEmployee.issueDate, "DD/MM/YYYY") : null,
        startDate: foundEmployee.startDate ? dayjs(foundEmployee.startDate, "DD/MM/YYYY") : null,
        endDate: foundEmployee.endDate ? dayjs(foundEmployee.endDate, "DD/MM/YYYY") : null,
      });
    } else {
      navigate("/employeelist"); // Quay lại nếu không tìm thấy
    }
  }, [id, form, navigate]);

  if (!employee) return <div>Đang tải...</div>;

  return (
    <div className="employee-detail-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <Title level={2}>Chi tiết nhân sự</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate("/hrm/employee-list")}>
            Quay lại
          </Button>
          {/* <Button
            type="default"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate(`/employeelist/edit/${id}`)}
          >
            Sửa
          </Button> */}
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Thông tin nhân sự" variant="outlined">
            <Form form={form} layout="vertical" disabled={true}>
              <Row gutter={16}>
                {/* Cột thông tin nhân sự */}
                <Col span={8}>
                  <Card title="Thông tin nhân sự" variant="outlined">
                    <Form.Item label="Họ và tên" name="fullName">
                      <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="birthDate">
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày sinh"
                      />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item label="Vị trí" name="position">
                      <Input placeholder="Nhập vị trí công việc" />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender">
                      <Input placeholder="Nam / Nữ" />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                      <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item label="Phòng ban" name="department">
                      <Input placeholder="Nhập tên phòng ban" />
                    </Form.Item>
                  </Card>
                </Col>

                {/* Cột thông tin bổ sung */}
                <Col span={8}>
                  <Card title="Thông tin bổ sung" variant="outlined">
                    <Form.Item label="Số CCCD" name="idNumber">
                      <Input placeholder="Nhập số CCCD" />
                    </Form.Item>
                    <Form.Item label="Nơi cấp" name="issuePlace">
                      <Input placeholder="Nhập nơi cấp CCCD" />
                    </Form.Item>
                    <Form.Item label="Ngày cấp" name="issueDate">
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày cấp"
                      />
                    </Form.Item>
                    <Form.Item label="Địa chỉ thường trú" name="permanentAddress">
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

                {/* Cột thông tin hợp đồng */}
                <Col span={8}>
                  <Card title="Thông tin hợp đồng" variant="outlined">
                    <Form.Item label="Loại hợp đồng lao động" name="contractType">
                      <Input placeholder="VD: Hợp đồng xác định thời hạn" />
                    </Form.Item>
                    <Form.Item label="Thời hạn hợp đồng lao động" name="contractTerm">
                      <Input placeholder="VD: 12 tháng" />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate">
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày bắt đầu"
                      />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày kết thúc"
                      />
                    </Form.Item>
                    <Form.Item label="Mức lương" name="salary">
                      <Input placeholder="Nhập mức lương" />
                    </Form.Item>
                    <Form.Item label="Tiền thưởng" name="bonus">
                      <Input placeholder="Nhập tiền thưởng" />
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