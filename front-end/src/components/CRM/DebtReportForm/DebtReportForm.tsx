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
import { DebtReport } from "@/views/CRM/DebtReportList/DebtReportList";
import "@/index.css";

const { Option } = Select;

// Mock data
export const contractOptions = [
  { id: "HD001", name: "Hợp đồng 001" },
  { id: "HD002", name: "Hợp đồng 002" },
];

export const customerOptions = [
  { id: "KH001", name: "Công ty ABC" },
  { id: "KH002", name: "Công ty XYZ" },
];

export const auditorOptions = [
  { id: "auditor1", name: "Nguyễn Văn A" },
  { id: "auditor2", name: "Trần Thị B" },
  { id: "auditor3", name: "Phạm Văn C" },
];

export const directorOptions = [
  { id: "gd1", name: "Nguyễn Giám Đốc" },
  { id: "gd2", name: "Trần Giám Đốc" },
];

interface DebtReportFormProps {
  mode: "create" | "edit";
  role: string;
  open: boolean;
  onCancel: () => void;
  onOk: (values: DebtReport, status?: DebtReport["status"]) => void;
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
  const isEdit = mode === "edit";

  const [progress, setProgress] = useState<Record<string, number>>({});

  // Các field theo section
  const sectionFields: Record<string, (string | string[])[]> = {
    init: ["reportNo", "reportDate", "contract", "customer", "auditor", "director"],
    fee: ["exchangeRate", "feeUSD", "feeNoVAT", "feeVND", "feeWithVAT"],
    invoice: [
      ["invoice", "invoiceNo"],
      ["invoice", "invoiceDate"],
      ["invoice", "rate"],
      ["invoice", "amountNoVAT"],
    ],
    payment: [
      ["payments", "paymentCode"],
      ["payments", "amount"],
      ["payments", "paymentDate"],
      ["payments", "status"],
    ],
    debt: ["debtNoVAT", "debtWithVAT", "totalDebtRemaining", "badDebt"],
    collaborator: [
      ["collaborator", "name"],
      ["collaborator", "phone"],
      ["collaborator", "commissionRate"],
      ["collaborator", "amount"],
      ["collaborator", "remainingAmount"],
    ],
  };

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate, "YYYY-MM-DD") : null,
        invoice: initialValues.invoice
          ? {
            ...initialValues.invoice,
            invoiceDate: initialValues.invoice.invoiceDate
              ? dayjs(initialValues.invoice.invoiceDate, "YYYY-MM-DD")
              : null,
          }
          : undefined,
        payments: initialValues.payments?.map((p: any) => ({
          ...p,
          paymentDate: p.paymentDate ? dayjs(p.paymentDate, "YYYY-MM-DD") : null,
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

    Object.keys(sectionFields).forEach((section) => {
      newProgress[section] = calcSection(section, sectionFields[section]);
    });

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
      onOk?.(payload, status || values.status || "Khởi tạo");
      if (!isEdit) {
        form.resetFields();
      }
    });
  };

  const renderHeader = (label: string, key: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>{label}</span>
      {key === "init" && isEdit && (
        <Form.Item
          name="status"
          style={{ marginBottom: 0, minWidth: 200 }}
        >
          <Select placeholder="Chọn trạng thái" allowClear>
            <Option value="Khởi tạo">Khởi tạo</Option>
            <Option value="Chờ kế toán">Chờ kế toán</Option>
            <Option value="Xác nhận">Xác nhận</Option>
            <Option value="Hủy">Hủy</Option>
          </Select>
        </Form.Item>
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


  const numberFormatter = (value?: string | number) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const numberOnly = (value?: string | number) => String(value)?.replace(/\D/g, "");

  return (
    <Modal
      title={<h2>{isEdit ? "Chỉnh sửa báo cáo" : "Tạo báo cáo mới"}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        isEdit && (
          <Button key="save" type="primary" onClick={() => handleOk()}>
            Lưu thay đổi
          </Button>
        ),
        !isEdit && (
          <Button key="create" type="primary" onClick={() => handleOk("Khởi tạo")}>
            Tạo báo cáo
          </Button>
        ),
      ]}
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        labelAlign="left"
        onValuesChange={updateProgress}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Thông tin khởi tạo */}
          <Card title={renderHeader("Thông tin khởi tạo", "init")} className="card-section">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="reportNo"
                  label="Số báo cáo"
                  rules={[{ required: true, message: "Vui lòng nhập số báo cáo!" }]}
                >
                  <Input placeholder="Nhập số báo cáo" />
                </Form.Item>
                <Form.Item
                  name="contract"
                  label="Hợp đồng"
                  rules={[{ required: true, message: "Vui lòng chọn hợp đồng!" }]}
                >
                  <Select placeholder="Chọn hợp đồng">
                    {contractOptions.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="auditor"
                  label="Kiểm toán viên"
                  rules={[{ required: false }]}
                >
                  <Select mode="multiple" allowClear placeholder="Chọn kiểm toán viên">
                    {auditorOptions.map((a) => (
                      <Option key={a.id} value={a.name}>
                        {a.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reportDate"
                  label="Ngày lập"
                  rules={[{ required: true, message: "Vui lòng chọn ngày lập!" }]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="customer"
                  label="Khách hàng"
                  rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
                >
                  <Select placeholder="Chọn khách hàng">
                    {customerOptions.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="director"
                  label="Giám đốc phụ trách"
                  rules={[{ required: false }]}
                >
                  <Select placeholder="Chọn giám đốc" allowClear>
                    {directorOptions.map((d) => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {role !== "HCNS" && (
            <>
              {/* Thông tin phí */}
              <Card title={renderHeader("Thông tin phí", "fee")} className="card-section">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="exchangeRate"
                      label="Tỉ giá"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Tỉ giá phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="feeUSD"
                      label="Phí USD"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Phí USD phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="feeNoVAT"
                      label="Phí chưa VAT"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Phí chưa VAT phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="feeVND"
                      label="Phí VND"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Phí VND phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="feeWithVAT"
                      label="Phí gồm VAT"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Phí gồm VAT phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Hóa đơn */}
              <Card title={renderHeader("Hóa đơn", "invoice")} className="card-section">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={["invoice", "invoiceNo"]}
                      label="Số hóa đơn"
                      rules={[{ required: false }]}
                    >
                      <Input placeholder="Nhập số hóa đơn" />
                    </Form.Item>
                    <Form.Item
                      name={["invoice", "rate"]}
                      label="Tỉ lệ suất (%)"
                      rules={[
                        { required: false },
                        { type: "number", min: 0, max: 100, message: "Tỉ lệ suất phải từ 0 đến 100!" },
                      ]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                        max={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["invoice", "invoiceDate"]}
                      label="Ngày hóa đơn"
                      rules={[{ required: false }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name={["invoice", "amountNoVAT"]}
                      label="Giá trị chưa VAT"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Giá trị chưa VAT phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Thanh toán */}
              <Card title={renderHeader("Thanh toán", "payment")} className="card-section">
                <Form.List name="payments">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={24} key={key} style={{ marginBottom: 16 }}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "paymentCode"]}
                              label="Mã thanh toán"
                              rules={[{ required: true, message: "Vui lòng nhập mã thanh toán!" }]}
                            >
                              <Input placeholder="Nhập mã thanh toán" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "amount"]}
                              label="Số tiền đã thu"
                              rules={[
                                { required: true, message: "Vui lòng nhập số tiền!" },
                                { type: "number", min: 0, message: "Số tiền phải lớn hơn hoặc bằng 0!" },
                              ]}
                            >
                              <InputNumber
                                parser={numberOnly}
                                formatter={numberFormatter}
                                style={{ width: "100%" }}
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "paymentDate"]}
                              label="Ngày thu tiền"
                              rules={[{ required: true, message: "Vui lòng chọn ngày thu tiền!" }]}
                            >
                              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "status"]}
                              label="Trạng thái"
                              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                            >
                              <Select placeholder="Chọn trạng thái">
                                <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                                <Option value="Đã thanh toán">Đã thanh toán</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Button
                              style={{ width: "100%", marginBottom: 16 }}
                              danger
                              type="default"
                              onClick={() => remove(name)}
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button type="default" onClick={() => add()} block>
                          Thêm thanh toán
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Công nợ */}
              <Card title={renderHeader("Công nợ", "debt")} className="card-section">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="debtNoVAT"
                      label="Số tiền chưa VAT"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Số tiền chưa VAT phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="totalDebtRemaining"
                      label="Tổng công nợ còn phải thu (đã VAT)"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Tổng công nợ phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="debtWithVAT"
                      label="Số tiền đã VAT"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Số tiền đã VAT phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="badDebt"
                      label="Nợ khó đòi"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Nợ khó đòi phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Hoa hồng cộng tác viên */}
              <Card title={renderHeader("Hoa hồng cộng tác viên", "collaborator")} className="card-section">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name={["collaborator", "name"]}
                      label="Tên cộng tác viên"
                      rules={[{ required: false }]}
                    >
                      <Input placeholder="Nhập tên cộng tác viên" />
                    </Form.Item>
                    <Form.Item
                      name={["collaborator", "commissionRate"]}
                      label="Tỷ lệ hoa hồng (%)"
                      rules={[
                        { required: false },
                        { type: "number", min: 0, max: 100, message: "Tỷ lệ hoa hồng phải từ 0 đến 100!" },
                      ]}
                    >
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
                      rules={[{ required: false }, { type: "number", min: 0, message: "Số tiền còn phải chi phải lớn hơn hoặc bằng 0!" }]}
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
                      rules={[{ required: false }, { pattern: /^0\d{9}$/, message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!" }]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                      name={["collaborator", "amount"]}
                      label="Số tiền hoa hồng"
                      rules={[{ required: false }, { type: "number", min: 0, message: "Số tiền hoa hồng phải lớn hơn hoặc bằng 0!" }]}
                    >
                      <InputNumber
                        parser={numberOnly}
                        formatter={numberFormatter}
                        min={0}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </Space>
      </Form>
    </Modal>
  );
};