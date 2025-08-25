import {useEffect} from "react"
import { Modal, Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./CreateCustomerForm.css";

const { Option } = Select;

const CreateCustomerForm = ({ onSave, customer  }) => {
  const [form] = Form.useForm();

  useEffect(() => {
      if (customer) {
        form.setFieldsValue(customer);
      } else {
        form.resetFields();
      }
    }, [customer, form]);
  
    const onFinish = (values) => {
      onSave(values);
    };

  // const handleOk = () => {
  //   form.validateFields().then(values => {
  //     console.log("Form values:", values);
  //     onOk(values);
  //     form.resetFields();
  //   });
  // };

  return (
    // <Modal
    //   title="Danh sách khách hàng / Tạo mới"
    //   open={open}
    //   onCancel={onCancel}
    //   footer={[
    //     <Button key="cancel" danger onClick={onCancel}>
    //       Huỷ
    //     </Button>,
    //     <Button key="submit" type="primary" onClick={handleOk}>
    //       Xác nhận
    //     </Button>,
    //   ]}
    //   width={800}
    // >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ✅ Thông tin khách hàng */}
        <div className="form-section">
          <h3>Thông tin khách hàng</h3>

          <Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item label="Tên doanh nghiệp ghi trên hợp đồng" name="companyContractName">
            <Input />
          </Form.Item>

          <Form.Item label="Tên doanh nghiệp bằng tiếng Anh" name="companyEnglishName">
            <Input />
          </Form.Item>

          <Form.Item label="Mã số thuế" name="taxCode">
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Số fax" name="fax">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Ngành" name="industry">
            <Input />
          </Form.Item>

          <Form.Item label="Thị trường chính" name="mainMarket">
            <Input />
          </Form.Item>
        </div>

        {/* ✅ Thông tin bổ sung */}
        <div className="form-section">
          <h3>Thông tin bổ sung</h3>

          <Form.Item label="Số lượng chi nhánh hoạt động" name="branchCount">
            <Input />
          </Form.Item>

          <Form.Item label="Số nhân sự hiện tại của khách hàng" name="currentStaff">
            <Input />
          </Form.Item>

          <Form.Item label="Doanh thu trung bình mỗi năm" name="avgRevenue">
            <Input />
          </Form.Item>

          <Form.Item label="Số lượng văn bản trao đổi mỗi tháng" name="monthlyDocs">
            <Input />
          </Form.Item>

          <Form.Item label="Tài liệu" name="documents">
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Trạng thái quyết toán thuế" name="taxStatus">
            <Select placeholder="Chọn trạng thái">
              <Option value="done">Đã quyết toán</Option>
              <Option value="pending">Chưa quyết toán</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    // </Modal>
  );
};

export default CreateCustomerForm;
