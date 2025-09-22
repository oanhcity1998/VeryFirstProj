// import {
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   InputNumber,
//   Button,
//   Progress,
//   Card,
//   Space,
//   Col,
//   Row,
//   Select,
// } from "antd";
// import { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import { DebtReport } from "../../views/CRM/DebtReportList/DebtReportList  -  nhiều hóa đơn và cộng tác viên";

// export const DebtReportForm = ({ mode, role, open, onCancel, onOk, initialValues }: any) => {
//   const [form] = Form.useForm();
//   const isEdit = mode === "edit";
//   const [progress, setProgress] = useState<Record<string, number>>({});

//   // Các section để tính % hoàn thành
//   const sectionFields: Record<string, (string | string[])[]> = {
//     init: ["reportNo", "reportDate", "contract", "customer", "auditor", "director"],
//     fee: ["exchangeRate", "feeUSD", "feeNoVAT", "feeVND", "feeWithVAT"],
//     debt: ["debtNoVAT", "debtWithVAT", "totalDebtRemaining", "badDebt"],
//   };
//   sectionFields.accounting = [...sectionFields.fee, ...sectionFields.debt];

//   // Khi mở modal, set giá trị form
//   useEffect(() => {
//     if (open && initialValues) {
//       form.setFieldsValue({
//         ...initialValues,
//         reportDate: initialValues.reportDate ? dayjs(initialValues.reportDate) : null,
//         invoices: initialValues.invoices?.map((inv: any) => ({
//           ...inv,
//           invoiceDate: inv.invoiceDate ? dayjs(inv.invoiceDate) : null,
//         })),
//         payments: initialValues.payments?.map((p: any) => ({
//           ...p,
//           paymentDate: p.paymentDate ? dayjs(p.paymentDate) : null,
//         })),
//         collaborators: initialValues.collaborators || [],
//       });
//       updateProgress();
//     } else if (open) {
//       form.resetFields();
//       setProgress({});
//     }
//   }, [open, initialValues, form]);

//   // Tính % hoàn thành
//   const updateProgress = () => {
//     const values = form.getFieldsValue();
//     const newProgress: Record<string, number> = {};

//     Object.entries(sectionFields).forEach(([section, fields]) => {
//       let filled = 0;
//       fields.forEach((f) => {
//         const val = Array.isArray(f) ? values?.[f[0]]?.[f[1]] : values?.[f];
//         if (val !== undefined && val !== null && val !== "") filled++;
//       });
//       newProgress[section] = Math.round((filled / fields.length) * 100);
//     });

//     setProgress(newProgress);
//   };

//   const handleOk = (status?: DebtReport["status"]) => {
//     form.validateFields().then((values) => {
//       const payload = {
//         ...values,
//         reportDate: values.reportDate ? values.reportDate.format("YYYY-MM-DD") : null,
//         invoices: values.invoices?.map((inv: any) => ({
//           ...inv,
//           invoiceDate: inv.invoiceDate ? inv.invoiceDate.format("YYYY-MM-DD") : null,
//         })),
//         payments: values.payments?.map((p: any) => ({
//           ...p,
//           paymentDate: p.paymentDate ? p.paymentDate.format("YYYY-MM-DD") : null,
//         })),
//         collaborators: values.collaborators,
//       };
//       onOk?.(payload, status || payload.status);
//     });
//   };

//   const renderHeader = (label: string, key: string) => (
//     <div className="form-header-container">
//       <span className="font-bolder">{label}</span>
//       {key === "init" && (
//         <Row className="header-row">
//           <Form.Item
//             name="status"
//             label="Trạng thái báo cáo"
//             labelCol={{ span: 14 }}
//             wrapperCol={{ span: 10 }}
//             labelAlign="left"
//             className="margin-bottom-0 "
//           >
//             <Select allowClear>
//               <Select.Option value="Khởi tạo">Khởi tạo</Select.Option>
//               <Select.Option value="Chờ kế toán">Chờ kế toán</Select.Option>
//               <Select.Option value="Xác nhận">Xác nhận</Select.Option>
//               <Select.Option value="Hủy">Hủy</Select.Option>
//             </Select>
//           </Form.Item>
//         </Row>
//       )}
//       {key !== "init" && (
//         <Progress
//           percent={progress[key] || 0}
//           size="small"
//           className="width-150"
//           status={progress[key] === 100 ? "success" : "active"}
//         />
//       )}
//     </div>
//   );

//   return (
//     <Modal
//       title={isEdit ? "Chỉnh sửa báo cáo" : "Tạo báo cáo mới"}
//       open={open}
//       onCancel={onCancel}
//       footer={[
//         <Button key="cancel" onClick={onCancel}>
//           Huỷ
//         </Button>,
//         isEdit && (
//           <Button key="save" onClick={() => handleOk("Chờ kế toán")}>
//             Lưu tạm
//           </Button>
//         ),
//         isEdit && (
//           <Button type="primary" key="confirm" onClick={() => handleOk("Xác nhận")}>
//             Xác nhận
//           </Button>
//         ),
//         isEdit && (
//           <Button danger key="cancelReport" onClick={() => handleOk("Hủy")}>
//             Hủy báo cáo
//           </Button>
//         ),
//         !isEdit && (
//           <Button type="primary" key="create" onClick={() => handleOk("Khởi tạo")}>
//             Tạo báo cáo
//           </Button>
//         ),
//       ]}
//             className="width-1100"
//     >
//       <Form
//         form={form}
//         layout="horizontal"
//         labelCol={{ span: 11 }}
//         wrapperCol={{ span: 13 }}
//         labelWrap
//         labelAlign="left"
//         onValuesChange={updateProgress}
//       >
//         <Space direction="vertical" className="full-width" size="large">
//           {/* Thông tin khởi tạo */}
//           <Card title={renderHeader("Thông tin khởi tạo", "init")}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item name="reportNo" label="Số báo cáo" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="contract" label="Hợp đồng" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="auditor" label="Kiểm toán viên">
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item name="reportDate" label="Ngày lập" rules={[{ required: true }]}>
//                   <DatePicker className="full-width" />
//                 </Form.Item>
//                 <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name="director" label="Giám đốc phụ trách">
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Card>

//           {role !== "HCNS" && (
//             <Card title={renderHeader("Thông tin kế toán", "accounting")}>
//               {/* Thông tin phí */}
//               <Card title={renderHeader("Thông tin phí", "fee")}>
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item name="exchangeRate" label="Tỉ giá">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                     <Form.Item name="feeUSD" label="Phí USD">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                     <Form.Item name="feeNoVAT" label="Phí chưa VAT">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="feeVND" label="Phí VND">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                     <Form.Item name="feeWithVAT" label="Phí gồm VAT">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Card>

//               {/* Hóa đơn */}
//               <Card title="Hóa đơn">
//                 <Form.List name="invoices">
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...rest }) => (
//                         <Row key={key} gutter={16} align="middle">
//                           <Col span={5}>
//                             <Form.Item {...rest} name={[name, "invoiceNo"]} label="Số hóa đơn">
//                               <Input />
//                             </Form.Item>
//                           </Col>
//                           <Col span={5}>
//                             <Form.Item {...rest} name={[name, "invoiceDate"]} label="Ngày">
//                               <DatePicker className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "rate"]} label="Tỉ lệ (%)">
//                               <InputNumber className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={6}>
//                             <Form.Item
//                               {...rest}
//                               name={[name, "amountNoVAT"]}
//                               label="Giá trị chưa VAT"
//                             >
//                               <InputNumber className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={2}>
//                             <Button danger onClick={() => remove(name)}>
//                               Xóa
//                             </Button>
//                           </Col>
//                         </Row>
//                       ))}
//                       <Button type="dashed" onClick={() => add()} block>
//                         + Thêm hóa đơn
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//               </Card>

//               {/* Thanh toán */}
//               <Card title="Thanh toán">
//                 <Form.List name="payments">
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...rest }) => (
//                         <Row key={key} gutter={16} align="middle">
//                           <Col span={6}>
//                             <Form.Item {...rest} name={[name, "paymentCode"]} label="Mã thanh toán">
//                               <Input />
//                             </Form.Item>
//                           </Col>
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "amount"]} label="Số tiền">
//                               <InputNumber className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={6}>
//                             <Form.Item {...rest} name={[name, "paymentDate"]} label="Ngày">
//                               <DatePicker className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={6}>
//                             <Form.Item {...rest} name={[name, "status"]} label="Trạng thái">
//                               <Select allowClear>
//                                 <Select.Option value="Chưa thanh toán">
//                                   Chưa thanh toán
//                                 </Select.Option>
//                                 <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
//                               </Select>
//                             </Form.Item>
//                           </Col>
//                           <Col span={2}>
//                             <Button danger onClick={() => remove(name)}>
//                               Xóa
//                             </Button>
//                           </Col>
//                         </Row>
//                       ))}
//                       <Button type="dashed" onClick={() => add()} block>
//                         + Thêm thanh toán
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//               </Card>

//               {/* Công nợ */}
//               <Card title={renderHeader("Công nợ", "debt")}>
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                     <Form.Item name="totalDebtRemaining" label="Công nợ còn phải thu (đã VAT)">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                     <Form.Item name="badDebt" label="Nợ khó đòi">
//                       <InputNumber className="full-width" />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Card>

//               {/* Cộng tác viên */}
//               <Card title="Hoa hồng cộng tác viên">
//                 <Form.List name="collaborators">
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...rest }) => (
//                         <Row key={key} gutter={16} align="middle">
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "name"]} label="Tên">
//                               <Input />
//                             </Form.Item>
//                           </Col>
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "phone"]} label="Điện thoại">
//                               <Input />
//                             </Form.Item>
//                           </Col>
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "commissionRate"]} label="Tỷ lệ (%)">
//                               <InputNumber min={0} max={100} className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={4}>
//                             <Form.Item {...rest} name={[name, "amount"]} label="Hoa hồng">
//                               <InputNumber min={0} className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={6}>
//                             <Form.Item
//                               {...rest}
//                               name={[name, "remainingAmount"]}
//                               label="Còn phải chi"
//                             >
//                               <InputNumber min={0} className="full-width" />
//                             </Form.Item>
//                           </Col>
//                           <Col span={2}>
//                             <Button danger onClick={() => remove(name)}>
//                               Xóa
//                             </Button>
//                           </Col>
//                         </Row>
//                       ))}
//                       <Button type="dashed" onClick={() => add()} block>
//                         + Thêm cộng tác viên
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//               </Card>
//             </Card>
//           )}
//         </Space>
//       </Form>
//     </Modal>
//   );
// };
