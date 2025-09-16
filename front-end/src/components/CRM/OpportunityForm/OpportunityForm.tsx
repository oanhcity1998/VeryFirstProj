import {
  Button,
  Modal,
  Form,
  Input,
  Breadcrumb,
  Select,
  InputNumber,
  DatePicker,
  Card,
} from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { opportunityStages } from "@/views/CRM/OpportunityDetail/OpportunityDetail";
import {
  Opportunity,
  serviceOpportunityOptions,
} from "@/views/CRM/OpportunityList/OpportunityList";

interface OpportunityFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
  initialValues?: Opportunity | null;
}

export const OpportunityForm = ({
  mode,
  open,
  onCancel,
  onOk,
  initialValues,
}: OpportunityFormProps) => {
  const [form] = Form.useForm();
  const isDetail = mode === "detail";

  // Gán giá trị form khi mở modal
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        expectedCloseDate: initialValues.expectedCloseDate
          ? dayjs(initialValues.expectedCloseDate)
          : null,
        // 👇 convert object -> id để Select hiển thị
        service: initialValues.service?.map((s) => s.id),
      });
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  const handleOk = () => {
    if (isDetail) {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      const selectedProducts = values.service.map((id: number) =>
        serviceOpportunityOptions.find((p) => p.id === id)
      );

      const payload = {
        ...values,
        expectedCloseDate: values.expectedCloseDate
          ? values.expectedCloseDate.format("YYYY-MM-DD")
          : null,
        service: selectedProducts, // 👈 gán lại danh sách object
      };

      onOk?.(payload);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={`${mode === "create" ? "Tạo" : mode === "edit" ? "Chỉnh sửa" : "Chi tiết"} cơ hội`}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          {isDetail ? "Đóng" : "Huỷ"}
        </Button>,
        !isDetail && (
          <Button key="submit" type="primary" onClick={handleOk}>
            {mode === "create" ? "Xác nhận" : "Lưu thay đổi"}
          </Button>
        ),
      ]}
      width={800}
    >
      <Card>
        <h3>Thông tin cơ hội</h3>

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          disabled={isDetail}
        >
          <Form.Item
            style={{ fontWeight: "500" }}
            label="Tên cơ hội"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên cơ hội" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Tên liên hệ"
            name="contactName"
            rules={[{ required: true, message: "Vui lòng nhập tên liên hệ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Công ty"
            name="company"
            rules={[{ required: true, message: "Vui lòng nhập công ty" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Giá trị dự kiến (VND)"
            name="expectedValue"
            rules={[{ required: true, message: "Vui lòng nhập giá trị dự kiến" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={1000000} />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Ngày dự kiến chốt"
            name="expectedCloseDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến chốt" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Sản phẩm dự kiến"
            name="service"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một sản phẩm" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              allowClear
              // Hiển thị productName nhưng giá trị là id
              options={serviceOpportunityOptions.map((p) => ({
                label: p.productName,
                value: p.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Xác suất (%)"
            name="probability"
            rules={[{ required: true, type: "number", min: 0, max: 100 }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Ưu tiên"
            name="priority"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Nhân viên phụ trách"
            name="owner"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "500" }}
            label="Giai đoạn"
            name="stage"
            rules={[{ required: true }]}
          >
            <Select>
              {opportunityStages.map((stage) => (
                <Select.Option key={stage} value={stage}>
                  {stage}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};
