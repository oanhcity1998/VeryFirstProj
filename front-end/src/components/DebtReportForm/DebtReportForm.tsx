import { Modal, Form, Input, DatePicker, InputNumber, Select, Collapse, Button } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const { Panel } = Collapse;

export const DebtReportForm = ({ mode, role, open, onCancel, onOk, initialValues }: any) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate) : null,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleOk = (status?: "Khởi tạo" | "Chờ kế toán" | "Xác nhận") => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : null,
      };
      onOk?.(payload, status);
    });
  };

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
      <Form form={form} layout="vertical">
        <Collapse defaultActiveKey={["init"]}>
          {/* Thông tin khởi tạo */}
          <Panel header="Thông tin khởi tạo" key="init">
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
          </Panel>

          {/* Thông tin kế toán */}
          {role !== "HCNS" && (
            <>
              <Panel header="Thông tin phí" key="fee">
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
              </Panel>

              <Panel header="Hóa đơn" key="invoice">
                {/* Có thể dùng Form.List để lặp nhiều hóa đơn */}
                <Form.Item name={["invoice", "invoiceNo"]} label="Số hóa đơn">
                  <Input />
                </Form.Item>
                <Form.Item name={["invoice", "invoiceDate"]} label="Ngày hóa đơn">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Panel>

              <Panel header="Thanh toán" key="payment">
                <Form.Item name={["payment", "paymentCode"]} label="Mã thanh toán">
                  <Input />
                </Form.Item>
                <Form.Item name={["payment", "amount"]} label="Số tiền đã thu">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Panel>

              <Panel header="Công nợ" key="debt">
                <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Panel>

              <Panel header="Hoa hồng cộng tác viên" key="collaborator">
                <Form.Item name={["collaborator", "name"]} label="Tên cộng tác viên">
                  <Input />
                </Form.Item>
                <Form.Item name={["collaborator", "commissionRate"]} label="Tỷ lệ hoa hồng (%)">
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Panel>
            </>
          )}
        </Collapse>
      </Form>
    </Modal>
  );
};
