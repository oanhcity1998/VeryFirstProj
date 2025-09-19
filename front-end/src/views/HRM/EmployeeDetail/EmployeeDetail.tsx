import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Row, Col, Card, Input, DatePicker, Breadcrumb, Spin } from "antd";
import dayjs from "dayjs";
import { ROUTES_APP } from "../../../app/routes";
import { useGetEmployeeByIdQuery } from "@/services/HRM/employee.service";

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data, isLoading, isError } = useGetEmployeeByIdQuery(Number(id));

  useEffect(() => {
    if (data) {
      const { profile, contracts } = data;

      form.setFieldsValue({
        fullName: profile.name,
        birthDate: profile.birthday ? dayjs(profile.birthday) : null,
        gender: profile.gender,
        phone: profile.work_phone,
        email: profile.work_email,
        position: profile.job_name,
        department: profile.department_name,
        idNumber: profile.id_number,
        issueDate: profile.id_issued_date ? dayjs(profile.id_issued_date) : null,
        issuePlace: profile.id_issued_place,
        permanentAddress: profile.permanent_address,
        temporaryAddress: profile.temporary_address,
        personalTaxCode: profile.tax_id,
        socialInsuranceNumber: profile.insurance_id,
        bankAccount: profile.bank_account,
        ...(contracts && contracts.length > 0
          ? {
              contractType: contracts[0].contract_type || "",
              contractTerm: contracts[0].contract_term ? "Có thời hạn" : "Không thời hạn",
              startDate: contracts[0].date_start ? dayjs(contracts[0].date_start) : null,
              endDate: contracts[0].date_end ? dayjs(contracts[0].date_end) : null,
              salary: contracts[0].wage ? Number(contracts[0].wage).toLocaleString("en-US") : "",
              bonus: contracts[0].bonus ? Number(contracts[0].bonus).toLocaleString("en-US") : "",
            }
          : {
              contractType: "",
              contractTerm: "",
              startDate: null,
              endDate: null,
              salary: "",
              bonus: "",
            }),
      });
    } else if (isError) {
      navigate(ROUTES_APP.hrm.employeeList);
    }
  }, [data, isError, form, navigate, id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return <div className="empty-message">Không tìm thấy nhân viên</div>;
  }

  const { profile } = data;

  return (
    <>
      <div className="detail-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.hrm.employeeList}>Danh sách nhân sự</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Chi tiết nhân sự</Breadcrumb.Item>
          <Breadcrumb.Item>{profile.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<h2 className="card-title">Chi tiết nhân sự: {profile.name}</h2>}
            variant="outlined"
            className="card-section"
          >
            <Form form={form} layout="vertical" disabled={true}>
              <Row gutter={16} align="stretch">
                {/* Cột 1 */}
                <Col span={8}>
                  <Card
                    title="Thông tin nhân sự"
                    variant="outlined"
                    className="card-height card-section"
                  >
                    <Form.Item label="Họ và tên" name="fullName">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="birthDate">
                      <DatePicker format="DD/MM/YYYY" className="full-width" />
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

                {/* Cột 2 */}
                <Col span={8}>
                  <Card
                    title="Thông tin bổ sung"
                    variant="outlined"
                    className="card-height card-section"
                  >
                    <Form.Item label="Số CCCD" name="idNumber">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Nơi cấp" name="issuePlace">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày cấp" name="issueDate">
                      <DatePicker format="DD/MM/YYYY" className="full-width" />
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

                {/* Cột 3 */}
                <Col span={8}>
                  <Card
                    title="Thông tin hợp đồng"
                    variant="outlined"
                    className="card-height card-section"
                  >
                    <Form.Item label="Loại hợp đồng lao động" name="contractType">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Thời hạn hợp đồng lao động" name="contractTerm">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate">
                      <DatePicker format="DD/MM/YYYY" className="full-width" />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                      <DatePicker format="DD/MM/YYYY" className="full-width" />
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
    </>
  );
};

export default EmployeeDetail;
