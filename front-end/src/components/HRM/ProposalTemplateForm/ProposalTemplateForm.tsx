import { useEffect } from "react";
import { Modal, Form, Input, Button, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { ProposalTemplate } from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";

interface ProposalTemplateFormProps {
  onCancel: () => void;
  onSave: (values: ProposalTemplate) => void;
  template?: ProposalTemplate | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
}

const ProposalTemplateForm: React.FC<ProposalTemplateFormProps> = ({
  onCancel,
  onSave,
  template,
  open,
  modalTitle = "Thêm mới",
  cancelText = "Hủy",
  saveText = "Lưu",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (template) {
      form.setFieldsValue({
        ...template,
        createdDate: template.createdDate ? dayjs(template.createdDate, "DD/MM/YYYY") : null,
        approvalRequired: template.approvalRequired
          ? dayjs(template.approvalRequired, "DD/MM/YYYY")
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [template, form]);

  const onFinish = (values: any) => {
    onSave({
      ...values,
      createdDate: values.createdDate ? values.createdDate.format("DD/MM/YYYY") : "",
      approvalRequired: values.approvalRequired ? values.approvalRequired.format("DD/MM/YYYY") : "",
    });
    onCancel();
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {saveText}
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <h3>Thông tin mẫu đề xuất</h3>

          <Form.Item
            label="Tên mẫu đề xuất"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên mẫu đề xuất!" }]}
          >
            <Input placeholder="Nhập tên mẫu đề xuất" />
          </Form.Item>

          <Form.Item
            label="Loại mẫu"
            name="type"
            rules={[{ required: true, message: "Vui lòng nhập loại mẫu!" }]}
          >
            <Input placeholder="Nhập loại mẫu" />
          </Form.Item>

          <Form.Item
            label="Người tạo"
            name="creator"
            rules={[{ required: true, message: "Vui lòng nhập tên người tạo!" }]}
          >
            <Input placeholder="Nhập tên người tạo" />
          </Form.Item>

          <Form.Item
            label="Ngày tạo"
            name="createdDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày tạo!" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Số lượng đề xuất"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Bắt buộc phê duyệt"
            name="approvalRequired"
            rules={[{ required: true, message: "Vui lòng chọn ngày phê duyệt!" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select
              options={[
                { value: "Mới", label: "Mới" },
                { value: "Cũ", label: "Cũ" },
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ProposalTemplateForm;
