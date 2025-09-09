import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Progress,
  Card,
  Space,
  Col,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DebtReport } from "../../views/CRM/DebtReportList/DebtReportList";

export const DebtReportForm = ({ mode, role, open, onCancel, onOk, initialValues }: any) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  const [progress, setProgress] = useState<Record<string, number>>({});

  // Các field theo section
  const sectionFields: Record<string, (string | string[])[]> = {
    // Thông tin khởi tạo
    init: ["reportNo", "reportDate", "contract", "customer", "auditor", "director"],

    // Thông tin phí
    fee: ["exchangeRate", "feeUSD", "feeNoVAT", "feeVND", "feeWithVAT"],

    // Hóa đơn
    invoice: [
      ["invoice", "invoiceNo"],
      ["invoice", "invoiceDate"],
      ["invoice", "rate"],
      ["invoice", "amountNoVAT"],
    ],

    // Thanh toán
    payment: [
      ["payment", "paymentCode"],
      ["payment", "amount"],
      ["payment", "paymentDate"],
      ["payment", "status"],
    ],

    // Công nợ
    debt: ["debtNoVAT", "debtWithVAT", "totalDebtRemaining", "badDebt"],

    // Cộng tác viên
    collaborator: [
      ["collaborator", "name"],
      ["collaborator", "phone"],
      ["collaborator", "commissionRate"],
      ["collaborator", "amount"],
      ["collaborator", "remainingAmount"],
    ],
  };

  // Gom cho kế toán (toàn bộ fee + invoice + payment + debt + collaborator)
  sectionFields.accounting = [
    ...sectionFields.fee,
    ...sectionFields.invoice,
    ...sectionFields.payment,
    ...sectionFields.debt,
    ...sectionFields.collaborator,
  ];

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

  const handleOk = (status?: DebtReport["status"]) => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : null,
      };
      onOk?.(payload, status || payload.status);
    });
  };

  const renderHeader = (label: string, key: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: "bolder" }}>{label}</span>
      {key === "init" && (
        <Row style={{ width: "40%" }}>
          <Form.Item
            name="status"
            label="Trạng thái báo cáo"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 10 }}
            labelAlign="left"
            style={{ marginBottom: 0 }}
          >
            <Select allowClear>
              <Select.Option value="Khởi tạo">Khởi tạo</Select.Option>
              <Select.Option value="Chờ kế toán">Chờ kế toán</Select.Option>
              <Select.Option value="Xác nhận">Xác nhận</Select.Option>
              <Select.Option value="Hủy">Hủy</Select.Option>
            </Select>
          </Form.Item>
        </Row>
      )}

      {key !== "init" && (
        <Progress
          percent={progress[key] || 0}
          size="small"
          style={{ width: 120 }}
          status={progress[key] === 100 ? "success" : "active"}
        />
      )}
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
        // isEdit && (
        //   <Button key="save" onClick={() => handleOk("Chờ kế toán")}>
        //     Lưu tạm
        //   </Button>
        // ),
        // isEdit && (
        //   <Button type="primary" key="confirm" onClick={() => handleOk("Xác nhận")}>
        //     Xác nhận
        //   </Button>
        // ),
        // isEdit && (
        //   <Button type="primary" key="confirm" onClick={() => handleOk("Hủy")}>
        //     Hủy
        //   </Button>
        // ),
        isEdit && (
          <Button type="primary" key="confirm" onClick={() => handleOk()}>
            Lưu thay đổi
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
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 11 }}
        wrapperCol={{ span: 13 }}
        labelWrap
        labelAlign="left"
        onValuesChange={updateProgress}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Thông tin khởi tạo */}
          <Card title={renderHeader("Thông tin khởi tạo", "init")}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="reportNo" label="Số báo cáo" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="contract" label="Hợp đồng" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="auditor" label="Kiểm toán viên">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reportDate" label="Ngày lập" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="director" label="Giám đốc phụ trách">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {role !== "HCNS" && (
            <Card title={renderHeader("Thông tin chờ kế toán", "accounting")}>
              {/* Thông tin phí */}
              <Card title={renderHeader("Thông tin phí", "fee")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="exchangeRate" label="Tỉ giá">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="feeUSD" label="Phí USD">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="feeNoVAT" label="Phí chưa VAT">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item> </Form.Item>
                    <Form.Item name="feeVND" label="Phí VND">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="feeWithVAT" label="Phí gồm VAT">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Hóa đơn */}
              <Card title={renderHeader("Hóa đơn", "invoice")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={["invoice", "invoiceNo"]} label="Số hóa đơn">
                      <Input />
                    </Form.Item>
                    <Form.Item name={["invoice", "rate"]} label="Tỉ lệ suất (%)">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["invoice", "invoiceDate"]} label="Ngày hóa đơn">
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name={["invoice", "amountNoVAT"]} label="Giá trị chưa VAT">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Thanh toán */}
              <Card title={renderHeader("Thanh toán", "payment")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={["payment", "paymentCode"]} label="Mã thanh toán">
                      <Input />
                    </Form.Item>
                    <Form.Item name={["payment", "amount"]} label="Số tiền đã thu">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["payment", "paymentDate"]} label="Ngày thu tiền">
                      <Input />
                    </Form.Item>
                    <Form.Item name={["payment", "status"]} label="Trạng thái thanh toán">
                      <Select allowClear>
                        <Select.Option value="Chưa thanh toán">Chưa thanh toán</Select.Option>
                        <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Công nợ */}
              <Card title={renderHeader("Công nợ", "debt")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="totalDebtRemaining" label="Tổng công nợ còn phải thu (đã VAT)">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="badDebt" label="Nợ khó đòi">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Hoa hồng cộng tác viên */}
              <Card title={renderHeader("Hoa hồng cộng tác viên", "collaborator")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={["collaborator", "name"]} label="Tên cộng tác viên">
                      <Input />
                    </Form.Item>
                    <Form.Item name={["collaborator", "commissionRate"]} label="Tỷ lệ hoa hồng (%)">
                      <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name={["collaborator", "remainingAmount"]}
                      label="Số tiền còn phải chi"
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["collaborator", "phone"]} label="Số điện thoại">
                      <Input />
                    </Form.Item>
                    <Form.Item name={["collaborator", "amount"]} label="Số tiền hoa hồng">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>{" "}
                  </Col>
                </Row>
              </Card>
            </Card>
          )}
        </Space>
      </Form>
    </Modal>
  );
};
