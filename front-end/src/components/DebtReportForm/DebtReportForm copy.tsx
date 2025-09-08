import { Button, Modal, Form, Input, DatePicker, InputNumber, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";
import { DebtReport } from "../../views/CRM/DebtReportList/DebtReportList";

interface DebtReportFormProps {
  mode: "create" | "edit";
  role: "HCNS" | "KETOAN";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any, status?: "Khởi tạo" | "Chờ kế toán" | "Xác nhận") => void;
  initialValues?: DebtReport | null;
}

export const DebtReportForm = ({
  mode,
  role,
  open,
  onCancel,
  onOk,
  initialValues,
}: DebtReportFormProps) => {
  const [form] = Form.useForm();

  // set giá trị khi mở modal
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate) : null,
        invoices: initialValues.invoices?.map((i) => ({
          ...i,
          invoiceDate: i.invoiceDate ? dayjs(i.invoiceDate) : null,
        })),
        payments: initialValues.payments?.map((p) => ({
          ...p,
          paymentDate: p.paymentDate ? dayjs(p.paymentDate) : null,
        })),
      });
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  // handle submit
  const handleSave = (status: "Khởi tạo" | "Chờ kế toán" | "Xác nhận") => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : null,
        invoices: values.invoices?.map((i: any) => ({
          ...i,
          invoiceDate: i.invoiceDate ? i.invoiceDate.format("YYYY-MM-DD") : null,
        })),
        payments: values.payments?.map((p: any) => ({
          ...p,
          paymentDate: p.paymentDate ? p.paymentDate.format("YYYY-MM-DD") : null,
        })),
      };
      onOk?.(payload, status);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={mode === "create" ? "Tạo báo cáo công nợ" : "Chỉnh sửa báo cáo công nợ"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          Huỷ
        </Button>,
        role === "HCNS" && mode === "create" && (
          <Button key="create" type="primary" onClick={() => handleSave("Khởi tạo")}>
            Lưu khởi tạo
          </Button>
        ),
        role === "KETOAN" && mode === "edit" && (
          <>
            <Button key="save" type="default" onClick={() => handleSave("Chờ kế toán")}>
              Lưu tạm
            </Button>
            <Button key="confirm" type="primary" onClick={() => handleSave("Xác nhận")}>
              Xác nhận
            </Button>
          </>
        ),
      ]}
      width={1000}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        {/* ---------------- HCNS nhập ---------------- */}
        {(role === "HCNS" || role === "KETOAN") && (
          <>
            <Form.Item
              label="Số báo cáo"
              name="reportNo"
              rules={[{ required: true, message: "Vui lòng nhập số báo cáo" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày báo cáo"
              name="reportDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="Hợp đồng"
              name="contract"
              rules={[{ required: true, message: "Vui lòng nhập hợp đồng" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Khách hàng"
              name="customer"
              rules={[{ required: true, message: "Vui lòng nhập khách hàng" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Kiểm toán viên" name="auditor">
              <Input />
            </Form.Item>
            <Form.Item label="Giám đốc phụ trách" name="director">
              <Input />
            </Form.Item>
          </>
        )}

        {/* ---------------- Kế toán nhập ---------------- */}
        {role === "KETOAN" && (
          <>
            <Form.Item label="Phí" name="fee">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Tỉ giá" name="exchangeRate">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Phí USD" name="feeUSD">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Phí chưa VAT" name="feeNoVAT">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Phí VNĐ" name="feeVND">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Phí gồm VAT" name="feeWithVAT">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            {/* Hóa đơn */}
            <Form.List name="invoices">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <b>Hóa đơn</b>
                  </label>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...rest}
                        name={[name, "invoiceNo"]}
                        rules={[{ required: true, message: "Nhập số hóa đơn" }]}
                      >
                        <Input placeholder="Số hóa đơn" />
                      </Form.Item>
                      <Form.Item
                        {...rest}
                        name={[name, "invoiceDate"]}
                        rules={[{ required: true, message: "Chọn ngày" }]}
                      >
                        <DatePicker format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "rate"]}>
                        <InputNumber placeholder="Tỉ lệ (%)" min={0} max={100} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "amountNoVAT"]}>
                        <InputNumber placeholder="Giá trị chưa VAT" min={0} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm hóa đơn
                  </Button>
                </>
              )}
            </Form.List>

            {/* Thanh toán */}
            <Form.List name="payments">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <b>Thanh toán</b>
                  </label>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...rest}
                        name={[name, "paymentCode"]}
                        rules={[{ required: true, message: "Mã thanh toán?" }]}
                      >
                        <Input placeholder="Mã thanh toán" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "amount"]} rules={[{ required: true }]}>
                        <InputNumber placeholder="Số tiền" min={0} />
                      </Form.Item>
                      <Form.Item
                        {...rest}
                        name={[name, "paymentDate"]}
                        rules={[{ required: true, message: "Chọn ngày" }]}
                      >
                        <DatePicker format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "method"]} rules={[{ required: true }]}>
                        <Select placeholder="Phương thức">
                          <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                          <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm thanh toán
                  </Button>
                </>
              )}
            </Form.List>

            {/* Công nợ */}
            <Form.Item label="Nợ chưa VAT" name="debtNoVAT">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Nợ đã VAT" name="debtWithVAT">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Công nợ còn lại (VAT)" name="totalDebtRemaining">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item label="Nợ khó đòi" name="badDebt">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            {/* CTV */}
            <Form.List name="collaborators">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <b>Hoa hồng CTV</b>
                  </label>
                  {fields.map(({ key, name, ...rest }) => (
                    <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item {...rest} name={[name, "name"]} rules={[{ required: true }]}>
                        <Input placeholder="Tên CTV" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "phone"]}>
                        <Input placeholder="Số điện thoại" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "commissionRate"]}>
                        <InputNumber placeholder="Tỷ lệ (%)" min={0} max={100} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "amount"]}>
                        <InputNumber placeholder="Số tiền" min={0} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm CTV
                  </Button>
                </>
              )}
            </Form.List>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default DebtReportForm;
