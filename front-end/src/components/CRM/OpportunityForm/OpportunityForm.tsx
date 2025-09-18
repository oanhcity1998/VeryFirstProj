import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Input, Select, Card, Form, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

// Mock serviceOpportunityOptions
export const serviceOpportunityOptions: Product[] = [
  {
    id: 1,
    productName: "Dịch vụ A",
    productType: "Thiết bị văn phòng",
    priceVND: 10000000,
    priceUSD: 400,
    vat: 10,
    afterVatVND: 11000000,
    afterVatUSD: 440,
  },
  {
    id: 2,
    productName: "Dịch vụ B",
    productType: "Vật tư tiêu hao",
    priceVND: 5000000,
    priceUSD: 200,
    vat: 8,
    afterVatVND: 5400000,
    afterVatUSD: 216,
  },
];

// Mock opportunityStages
export const opportunityStages = ["Mới", "Đạt yêu cầu", "Đàm phán", "Đóng"] as const;

interface Product {
  id: number;
  productName: string;
  productType: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  afterVatVND: number;
  afterVatUSD: number;
}

interface Opportunity {
  id: string;
  name: string;
  contactName: string;
  company: string;
  expectedValue: number;
  expectedCloseDate: string;
  service: Product[];
  probability: number;
  priority: "Low" | "Medium" | "High";
  owner: string;
  stage: "Mới" | "Đạt yêu cầu" | "Đàm phán" | "Đóng";
}

interface OpportunityFormProps {
  mode: "create" | "edit";
  open: boolean;
  onCancel: () => void;
  onSave: (data: Opportunity) => void;
  modalTitle?: string;
  cardTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
  initialValues?: Opportunity | null;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  mode,
  open,
  onCancel,
  onSave,
  modalTitle,
  cardTitle = "Thông tin cơ hội",
  cancelText = "Hủy",
  saveText = mode === "create" ? "Xác nhận" : "Lưu thay đổi",
  loading = false,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues && open) {
      form.setFieldsValue({
        name: initialValues.name,
        contactName: initialValues.contactName,
        company: initialValues.company,
        expectedValue: initialValues.expectedValue,
        expectedCloseDate: initialValues.expectedCloseDate
          ? dayjs(initialValues.expectedCloseDate, "YYYY-MM-DD")
          : null,
        service: initialValues.service?.map((s) => s.id),
        probability: initialValues.probability,
        priority: initialValues.priority,
        owner: initialValues.owner,
        stage: initialValues.stage,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [initialValues, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const selectedProducts =
        values.service?.map((id: number) => serviceOpportunityOptions.find((p) => p.id === id)) ||
        [];

      const payload: Opportunity = {
        id: initialValues?.id || String(Date.now()),
        name: values.name,
        contactName: values.contactName,
        company: values.company,
        expectedValue: values.expectedValue,
        expectedCloseDate: values.expectedCloseDate
          ? values.expectedCloseDate.format("YYYY-MM-DD")
          : "",
        service: selectedProducts,
        probability: values.probability,
        priority: values.priority,
        owner: values.owner,
        stage: values.stage,
      };

      onSave(payload);
      if (mode === "create") {
        form.resetFields();
      }
    });
  };

  return (
    <Modal
      title={<h2>{modalTitle || (mode === "create" ? "Thêm cơ hội" : "Chỉnh sửa cơ hội")}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button key="save" type="primary" onClick={handleOk} loading={loading}>
          {saveText}
        </Button>,
      ]}
      className="width-800"
      destroyOnClose
    >
      <Form form={form} layout="vertical" labelAlign="left">
        <Card title={cardTitle} className="card-section">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên cơ hội"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên cơ hội!" }]}
              >
                <Input placeholder="Nhập tên cơ hội" />
              </Form.Item>
              <Form.Item
                label="Tên liên hệ"
                name="contactName"
                rules={[{ required: true, message: "Vui lòng nhập tên liên hệ!" }]}
              >
                <Input placeholder="Nhập tên liên hệ" />
              </Form.Item>
              <Form.Item
                label="Công ty"
                name="company"
                rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
              <Form.Item
                label="Giá trị dự kiến (VND)"
                name="expectedValue"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị dự kiến!" },
                  { type: "number", min: 0, message: "Giá trị dự kiến phải lớn hơn hoặc bằng 0!" },
                ]}
              >
                <InputNumber
                  className="full-width"
                  min={0}
                  step={1000000}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value?.replace(/\D/g, "") as any}
                />
              </Form.Item>
              <Form.Item
                label="Ngày chốt dự kiến"
                name="expectedCloseDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày chốt dự kiến!" }]}
              >
                <DatePicker format="YYYY-MM-DD" className="full-width" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xác suất (%)"
                name="probability"
                rules={[
                  { required: true, message: "Vui lòng nhập xác suất!" },
                  { type: "number", min: 0, max: 100, message: "Xác suất phải từ 0 đến 100!" },
                ]}
              >
                <InputNumber className="full-width" min={0} max={100} placeholder="Nhập xác suất" />
              </Form.Item>
              <Form.Item
                label="Ưu tiên"
                name="priority"
                rules={[{ required: true, message: "Vui lòng chọn mức ưu tiên!" }]}
              >
                <Select placeholder="Chọn mức ưu tiên">
                  <Option value="High">Cao</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="Low">Thấp</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Nhân viên phụ trách"
                name="owner"
                rules={[{ required: true, message: "Vui lòng nhập nhân viên phụ trách!" }]}
              >
                <Input placeholder="Nhập nhân viên phụ trách" />
              </Form.Item>
              <Form.Item
                label="Giai đoạn"
                name="stage"
                rules={[{ required: true, message: "Vui lòng chọn giai đoạn!" }]}
              >
                <Select placeholder="Chọn giai đoạn">
                  {opportunityStages.map((stage) => (
                    <Option key={stage} value={stage}>
                      {stage}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Sản phẩm dự kiến"
                name="service"
                rules={[{ required: true, message: "Vui lòng chọn ít nhất một sản phẩm!" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn sản phẩm"
                  allowClear
                  options={serviceOpportunityOptions.map((p) => ({
                    label: p.productName,
                    value: p.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default OpportunityForm;
