import { Modal, Form, Input, DatePicker, InputNumber, Button, Progress, Card, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const DebtReportForm = ({ mode, role, open, onCancel, onOk, initialValues }: any) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  const [progress, setProgress] = useState<Record<string, number>>({});

  // Các field theo section
  const sectionFields: Record<string, (string | string[])[]> = {
    init: ["reportNo", "reportDate", "contract", "customer", "auditor", "director"],
    fee: ["fee", "exchangeRate", "feeUSD", "feeNoVAT", "feeWithVAT"],
    invoice: [
      ["invoice", "invoiceNo"],
      ["invoice", "invoiceDate"],
    ],
    payment: [
      ["payment", "paymentCode"],
      ["payment", "amount"],
    ],
    debt: ["debtNoVAT", "debtWithVAT"],
    collaborator: [
      ["collaborator", "name"],
      ["collaborator", "commissionRate"],
      ["collaborator", "amount"],
      ["collaborator", "remainingAmount"],
    ],
  };

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate) : null,
      });
      updateProgress();
    } else if (open) {
      form.resetFields();
      setProgress({});
    }
  }, [open, initialValues, form]);

  const updateProgress = () => {
    const values = form.getFieldsValue();
    const newProgress: Record<string, number> = {};

    Object.entries(sectionFields).forEach(([section, fields]) => {
      let filled = 0;
      fields.forEach((f) => {
        const val = Array.isArray(f) ? values?.[f[0]]?.[f[1]] : values?.[f];
        if (val !== undefined && val !== null && val !== "") filled++;
      });
      newProgress[section] = Math.round((filled / fields.length) * 100);
    });

    setProgress(newProgress);
  };

  const handleOk = (status?: "Khởi tạo" | "Chờ kế toán" | "Xác nhận") => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : null,
      };
      onOk?.(payload, status);
    });
  };

  const renderHeader = (label: string, key: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <Progress
        percent={progress[key] || 0}
        size="small"
        style={{ width: 120 }}
        status={progress[key] === 100 ? "success" : "active"}
      />
    </div>
  );

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa báo cáo" : "Tạo báo cáo mới"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        isEdit && (
          <Button key="save" onClick={() => handleOk("Chờ kế toán")}>
            Lưu tạm
          </Button>
        ),
        isEdit && (
          <Button type="primary" key="confirm" onClick={() => handleOk("Xác nhận")}>
            Xác nhận
          </Button>
        ),
        !isEdit && (
          <Button type="primary" key="create" onClick={() => handleOk("Khởi tạo")}>
            Tạo báo cáo
          </Button>
        ),
      ]}
      width={1000}
    >
      <Form form={form} layout="vertical" onValuesChange={updateProgress}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Thông tin khởi tạo */}
          <Card title={renderHeader("Thông tin khởi tạo", "init")}>
            <Form.Item name="reportNo" label="Số báo cáo" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="reportDate" label="Ngày báo cáo" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="contract" label="Hợp đồng" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="auditor" label="Kiểm toán viên">
              <Input />
            </Form.Item>
            <Form.Item name="director" label="Giám đốc phụ trách">
              <Input />
            </Form.Item>
          </Card>

          {role !== "HCNS" && (
            <>
              {/* Thông tin phí */}
              <Card title={renderHeader("Thông tin phí", "fee")}>
                <Form.Item name="fee" label="Phí">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="exchangeRate" label="Tỉ giá">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="feeUSD" label="Phí USD">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="feeNoVAT" label="Phí chưa VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="feeWithVAT" label="Phí gồm VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Card>

              {/* Hóa đơn */}
              <Card title={renderHeader("Hóa đơn", "invoice")}>
                <Form.Item name={["invoice", "invoiceNo"]} label="Số hóa đơn">
                  <Input />
                </Form.Item>
                <Form.Item name={["invoice", "invoiceDate"]} label="Ngày hóa đơn">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Card>

              {/* Thanh toán */}
              <Card title={renderHeader("Thanh toán", "payment")}>
                <Form.Item name={["payment", "paymentCode"]} label="Mã thanh toán">
                  <Input />
                </Form.Item>
                <Form.Item name={["payment", "amount"]} label="Số tiền đã thu">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Card>

              {/* Công nợ */}
              <Card title={renderHeader("Công nợ", "debt")}>
                <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Card>

              {/* Hoa hồng cộng tác viên */}
              <Card title={renderHeader("Hoa hồng cộng tác viên", "collaborator")}>
                <Form.Item name={["collaborator", "name"]} label="Tên cộng tác viên">
                  <Input />
                </Form.Item>
                <Form.Item name={["collaborator", "phone"]} label="Số điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item name={["collaborator", "commissionRate"]} label="Tỷ lệ hoa hồng (%)">
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name={["collaborator", "amount"]} label="Số tiền hoa hồng">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name={["collaborator", "remainingAmount"]} label="Số tiền còn phải chi">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Card>
            </>
          )}
        </Space>
      </Form>
    </Modal>
  );
};
