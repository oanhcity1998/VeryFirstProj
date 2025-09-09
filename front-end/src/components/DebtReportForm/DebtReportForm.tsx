import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Progress,
  Card,
  Space,
  Col,
  Row,
  Select,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DebtReport } from "../../views/CRM/DebtReportList/DebtReportList";

// Mock data
const contractOptions = [
  { id: "HD001", name: "Hợp đồng 001" },
  { id: "HD002", name: "Hợp đồng 002" },
];

const customerOptions = [
  { id: "KH001", name: "Công ty ABC" },
  { id: "KH002", name: "Công ty XYZ" },
];

const auditorOptions = [
  { id: "auditor1", name: "Nguyễn Văn A" },
  { id: "auditor2", name: "Trần Thị B" },
  { id: "auditor3", name: "Phạm Văn C" },
];

const directorOptions = [
  { id: "gd1", name: "Nguyễn Giám Đốc" },
  { id: "gd2", name: "Trần Giám Đốc" },
];

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
        // Report date
        reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate) : null,
        // Invoice date
        invoice: initialValues.invoice
          ? {
              ...initialValues.invoice,
              invoiceDate: initialValues.invoice.invoiceDate
                ? dayjs(initialValues.invoice.invoiceDate)
                : null,
            }
          : undefined,
        // Payments array
        payments: initialValues.payments?.map((p: any) => ({
          ...p,
          paymentDate: p.paymentDate ? dayjs(p.paymentDate) : null,
        })),
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

    const calcSection = (section: string, fields: (string | string[])[]) => {
      let filled = 0;
      let total = 0;

      if (section === "payment") {
        const arr = values?.payments;
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach((p) => {
            let blockFilled = 0;
            let blockTotal = 0;
            fields.forEach((f) => {
              const [, child] = f as [string, string];
              blockTotal++;
              const val = p?.[child];
              if (val !== undefined && val !== null && val !== "") blockFilled++;
            });
            filled += blockFilled / blockTotal;
            total++;
          });
        }
        return total > 0 ? Math.round((filled / total) * 100) : 0;
      }

      fields.forEach((f) => {
        if (Array.isArray(f)) {
          const [parent, child] = f;
          const val = values?.[parent];
          if (typeof val === "object" && val !== null) {
            total++;
            if (val?.[child] !== undefined && val?.[child] !== null && val?.[child] !== "") {
              filled++;
            }
          } else {
            total++;
          }
        } else {
          total++;
          const val = values?.[f];
          if (val !== undefined && val !== null && val !== "") filled++;
        }
      });

      return total > 0 ? Math.round((filled / total) * 100) : 0;
    };

    // Tính cho từng section con
    Object.entries(sectionFields).forEach(([section, fields]) => {
      if (section === "accounting") return; // bỏ qua, xử lý riêng
      newProgress[section] = calcSection(section, fields);
    });

    // Tính accounting = trung bình các section con
    const accountingSections = ["fee", "invoice", "payment", "debt", "collaborator"];
    const sum = accountingSections.reduce((acc, s) => acc + (newProgress[s] || 0), 0);
    newProgress.accounting = Math.round(sum / accountingSections.length);

    setProgress(newProgress);
  };

  const handleOk = (status?: DebtReport["status"]) => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        reportDate: values.reportDate?.format("YYYY-MM-DD") || null,
        invoice: values.invoice
          ? {
              ...values.invoice,
              invoiceDate: values.invoice.invoiceDate?.format("YYYY-MM-DD") || null,
            }
          : undefined,
        payments: values.payments?.map((p: any) => ({
          ...p,
          paymentDate: p.paymentDate?.format("YYYY-MM-DD") || null,
        })),
      };
      onOk?.(payload, status || payload.status);
    });
  };

  const renderHeader = (label: string, key: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: "bolder" }}>{label}</span>

      {key === "init" && isEdit && (
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

      {key !== "init" &&
        (progress[key] === 0 ? (
          <span style={{ fontSize: 12, color: "#999" }}>Optional</span>
        ) : (
          <Progress
            percent={progress[key] || 0}
            size="small"
            style={{ width: 120 }}
            status={progress[key] === 100 ? "success" : "active"}
          />
        ))}
    </div>
  );

  const numberFormatter = (value?: string | number) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const numberOnly = (value) => value?.replace(/\D/g, "");

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

                {/* Hợp đồng */}
                <Form.Item name="contract" label="Hợp đồng" rules={[{ required: true }]}>
                  <Select placeholder="Chọn hợp đồng">
                    {contractOptions.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Kiểm toán viên */}
                <Form.Item name="auditor" label="Kiểm toán viên">
                  <Select mode="multiple" allowClear placeholder="Chọn kiểm toán viên">
                    {auditorOptions.map((a) => (
                      <Select.Option key={a.id} value={a.name}>
                        {a.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reportDate" label="Ngày lập" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                {/* Khách hàng */}
                <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
                  <Select placeholder="Chọn khách hàng">
                    {customerOptions.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Giám đốc phụ trách */}
                <Form.Item name="director" label="Giám đốc phụ trách">
                  <Select placeholder="Chọn giám đốc">
                    {directorOptions.map((d) => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.name}
                      </Select.Option>
                    ))}
                  </Select>
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
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item name="feeUSD" label="Phí USD">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item name="feeNoVAT" label="Phí chưa VAT">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item> </Form.Item>
                    <Form.Item name="feeVND" label="Phí VND">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item name="feeWithVAT" label="Phí gồm VAT">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
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
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Thanh toán */}
              <Card title={renderHeader("Thanh toán", "payment")}>
                <Form.List name="payments">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={16} key={key} align="middle">
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "paymentCode"]}
                              label="Mã thanh toán"
                              rules={[{ required: true, message: "Nhập mã thanh toán" }]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "amount"]}
                              label="Số tiền đã thu"
                              rules={[{ required: true, message: "Nhập số tiền" }]}
                            >
                              <InputNumber
                                parser={numberOnly}
                                formatter={numberFormatter}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "paymentDate"]}
                              label="Ngày thu tiền"
                              rules={[{ required: true, message: "Chọn ngày" }]}
                            >
                              <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "status"]}
                              label="Trạng thái"
                              rules={[{ required: true, message: "Chọn trạng thái" }]}
                            >
                              <Select>
                                <Select.Option value="Chưa thanh toán">
                                  Chưa thanh toán
                                </Select.Option>
                                <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Button
                              style={{ width: "100%", marginBottom: 24 }}
                              danger
                              type="default"
                              onClick={() => remove(name)}
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>
                      ))}

                      <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="default" onClick={() => add()} block>
                          Thêm thanh toán
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Công nợ */}
              <Card title={renderHeader("Công nợ", "debt")}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item name="totalDebtRemaining" label="Tổng công nợ còn phải thu (đã VAT)">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item name="badDebt" label="Nợ khó đòi">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                      />
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
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={["collaborator", "remainingAmount"]}
                      label="Số tiền còn phải chi"
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        min={0}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["collaborator", "phone"]}
                      label="Số điện thoại"
                      rules={[{ pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name={["collaborator", "amount"]} label="Số tiền hoa hồng">
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        min={0}
                        style={{ width: "100%" }}
                      />
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
