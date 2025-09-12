import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
  Card,
  Checkbox,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import {
  FieldMeta,
  ProposalTemplate,
  statusProposalTemplateOptions,
} from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";

interface ProposalTemplateFormProps {
  onCancel: () => void;
  onSave: (values: ProposalTemplate) => void;
  template?: ProposalTemplate | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
}

const dataTypeOptions = [
  { value: "string", label: "Chuỗi ký tự" },
  { value: "number", label: "Số" },
  { value: "date", label: "Ngày tháng" },
  { value: "boolean", label: "Đúng / Sai" },
];

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
        approvalRequired: template.approvalRequired === "Có",
      });

      // nếu template có sẵn fieldRows thì load vào
      if ((template as any).fields) {
        setFieldRows(
          (template as any).fields.map((f: FieldMeta) => ({
            ...f,
            id: String(f.id ?? Date.now()),
          }))
        );
      }
    } else {
      form.resetFields();
      setFieldRows([]); // reset rows khi thêm mới
    }
  }, [template, form]);

  const onFinish = (values: any) => {
    const isCreate = !template;

    const payload: ProposalTemplate & { fields: FieldMeta[] } = {
      ...values,
      quantity: values.quantity ? values.quantity : template?.quantity ?? 0,
      creator: values.creator ? values.creator : template?.creator ?? "Nguyễn Văn A",
      createdDate: isCreate
        ? dayjs().format("DD/MM/YYYY") // ✅ tạo mới thì lấy hôm nay
        : template?.createdDate ?? dayjs().format("DD/MM/YYYY"), // sửa thì giữ ngày cũ
      approvalRequired: values.approvalRequired ? "Có" : "Không",
      fields: fieldRows, // ✅ thêm danh sách trường
    };

    onSave(payload);
    onCancel();
  };

  // +++++++++++++++++++++++
  const [fieldRows, setFieldRows] = useState<FieldMeta[]>([]);

  const addFieldRow = () => {
    setFieldRows((prev) => [
      ...prev,
      {
        id: -Date.now(),
        fieldName: "",
        dataType: "string",
        required: false,
        example: "",
        note: "",
      },
    ]);
  };

  const handleDeleteField = (id: number) => {
    setFieldRows((prev) => prev.filter((row) => row.id !== id));
  };

  const fieldColumns = [
    {
      title: "Tên trường",
      dataIndex: "fieldName",
      render: (value: string, record: FieldMeta) => (
        <Input
          value={record.fieldName}
          onChange={(e) =>
            setFieldRows((prev) =>
              prev.map((row) =>
                row.id === record.id ? { ...row, fieldName: e.target.value } : row
              )
            )
          }
        />
      ),
    },
    {
      title: "Loại dữ liệu",
      dataIndex: "dataType",
      render: (value: string, record: FieldMeta) => (
        <Select
          value={record.dataType}
          onChange={(val) =>
            setFieldRows((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, dataType: val } : row))
            )
          }
        >
          {dataTypeOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Bắt buộc",
      dataIndex: "required",
      render: (value: boolean, record: FieldMeta) => (
        <Select
          value={record.required ? "Có" : "Không"}
          onChange={(val) =>
            setFieldRows((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, required: val === "Có" } : row))
            )
          }
        >
          <Select.Option value="Có">Có</Select.Option>
          <Select.Option value="Không">Không</Select.Option>
        </Select>
      ),
    },
    {
      title: "Ví dụ",
      dataIndex: "example",
      render: (value: string, record: FieldMeta) => (
        <Input
          value={record.example}
          onChange={(e) =>
            setFieldRows((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, example: e.target.value } : row))
            )
          }
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (value: string, record: FieldMeta) => (
        <Input
          value={record.note}
          onChange={(e) =>
            setFieldRows((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, note: e.target.value } : row))
            )
          }
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_: any, record: FieldMeta) => (
        <Button danger size="small" onClick={() => handleDeleteField(record.id)}>
          Xoá
        </Button>
      ),
    },
  ];

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
      <Form form={form} layout="horizontal" onFinish={onFinish}>
        <div className="form-section">
          <h3>Thông tin mẫu đề xuất</h3>

          <Card size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              labelAlign="left"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Tên nhóm mẫu đề xuất"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên nhóm mẫu đề xuất!" }]}
            >
              <Input placeholder="Nhập tên mẫu đề xuất" />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                options={statusProposalTemplateOptions.map((s) => ({ value: s, label: s }))}
              />
            </Form.Item>
          </Card>

          <Card size="small" title="Danh sách trường của mẫu đề xuất">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Danh sách trường</h3>
              <Button type="primary" onClick={addFieldRow}>
                + Thêm dòng
              </Button>
            </div>

            <Table<FieldMeta>
              columns={fieldColumns}
              dataSource={fieldRows}
              id="id"
              pagination={false}
              bordered
            />

            <Form.Item
              style={{ marginTop: 16 }}
              name="approvalRequired"
              valuePropName="checked" // ✅ rất quan trọng
              getValueFromEvent={(e) => (e.target.checked ? "Có" : "Không")}
              initialValue={template?.approvalRequired === "Có"}
            >
              <Checkbox>Có cần phải phê duyệt không?</Checkbox>
            </Form.Item>
          </Card>
        </div>
      </Form>
    </Modal>
  );
};

export default ProposalTemplateForm;
