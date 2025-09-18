// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   Card,
//   Tabs,
//   Form,
//   Input,
//   DatePicker,
//   InputNumber,
//   Button,
//   Breadcrumb,
//   Row,
//   Col,
//   Select,
// } from "antd";
// import { DebtReport, mockDebtReportData } from "../DebtReportList/DebtReportList";
// import { ROUTES_APP } from "../../../routes";
// import { ArrowLeftOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { TabPane } = Tabs;

// const DebtReportDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form] = Form.useForm();

//   const report = mockDebtReportData.find((r) => r.id === Number(id));
//   if (!report) return <p>Không tìm thấy báo cáo</p>;

//   const numberFormatter = (value?: string | number) =>
//     `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   return (
//     <>
//       {/* Breadcrumb */}
//       <div className="header-container">
//         <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)} />
//         <Breadcrumb
//           items={[
//             { title: <Link to={ROUTES_APP.crm.debtReportList}>Danh sách báo cáo công nợ</Link> },
//             { title: "Thông tin chi tiết" },
//             { title: report.reportNo },
//           ]}
//           separator=">"
//         />
//       </div>

//       <Form
//         form={form}
//         layout="horizontal"
//         labelWrap
//         labelCol={{ span: 11 }}
//         wrapperCol={{ span: 13 }}
//         labelAlign="left"
//         initialValues={{
//           ...report,
//           reportDate: report.reportDate ? dayjs(report.reportDate) : null,
//         }}
//         disabled
//       >
//         {/* Card thông tin chung */}
//         <Card
//           title="Thông tin chung"
//           className="margin-bottom-16"
//           extra={
//             <Form.Item
//               name="status"
//               label="Trạng thái báo cáo"
//               labelCol={{ span: 10 }}
//               wrapperCol={{ span: 14 }}
//               className="margin-bottom-0"
//             >
//               <Input />
//             </Form.Item>
//           }
//         >
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item name="reportNo" label="Số báo cáo">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="reportDate" label="Ngày báo cáo">
//                 <DatePicker className="full-width" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="contract" label="Hợp đồng">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="customer" label="Khách hàng">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="auditor" label="Kiểm toán viên">
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item name="director" label="Giám đốc">
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Card>

//         {/* Tabs */}
//         <Card>
//           <Tabs defaultActiveKey="fee">
//             {/* Tab phí */}
//             <TabPane tab="Phí" key="fee">
//               <Card size="small" className="margin-bottom-16">
//                 <h3 className="text-bold-margin">
//                   Phí báo cáo công nợ {`<${report?.reportNo}>`}
//                 </h3>

//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item name="exchangeRate" label="Tỉ giá">
//                       <InputNumber disabled className="full-width" formatter={numberFormatter} />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item></Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="feeUSD" label="Phí USD">
//                       <InputNumber disabled className="full-width" formatter={numberFormatter} />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="feeVND" label="Phí VNĐ">
//                       <InputNumber disabled className="full-width" formatter={numberFormatter} />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="feeNoVAT" label="Phí chưa VAT">
//                       <InputNumber disabled className="full-width" formatter={numberFormatter} />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item name="feeWithVAT" label="Phí gồm VAT">
//                       <InputNumber disabled className="full-width" formatter={numberFormatter} />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Card>
//             </TabPane>

//             {/* Tab hóa đơn */}
//             <TabPane tab="Hóa đơn" key="invoice">
//               {(report.invoices || []).map((inv, idx) => (
//                 <Card key={idx} size="small" className="margin-bottom-16">
//                   <h3 className="text-bold-margin">
//                     Hóa đơn báo cáo công nợ {`<${report?.reportNo}>`}
//                   </h3>

//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item label="Số hóa đơn">
//                         <Input value={inv.invoiceNo} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Ngày hóa đơn">
//                         <Input value={inv.invoiceDate} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Tỉ lệ suất (%)">
//                         <InputNumber
//                           value={inv.rate}
//                           disabled
//                           className="full-width"
//                           formatter={numberFormatter}
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Giá trị chưa VAT">
//                         <InputNumber
//                           value={inv.amountNoVAT}
//                           disabled
//                           className="full-width"
//                           formatter={numberFormatter}
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Trạng thái">
//                         <Select value={inv.status} disabled>
//                           <Select.Option value="Chưa thanh toán">Chưa thanh toán</Select.Option>
//                           <Select.Option value="Thanh toán">Thanh toán</Select.Option>
//                         </Select>
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Tổng cộng">
//                         <InputNumber
//                           value={inv.totalAmount}
//                           disabled
//                           className="full-width"
//                           formatter={numberFormatter}
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </Card>
//               ))}
//             </TabPane>

//             {/* Tab thanh toán */}
//             <TabPane tab="Thanh toán" key="payment">
//               {(report.payments || []).map((pmt, idx) => (
//                 <Card key={idx} size="small" className="margin-bottom-16">
//                   <h3 className="text-bold-margin">
//                     Thanh toán báo cáo công nợ {`<${report?.reportNo}>`}
//                   </h3>

//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item label="Mã thanh toán">
//                         <Input value={pmt.paymentCode} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Ngày thu tiền">
//                         <Input value={pmt.paymentDate} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Số tiền đã thu">
//                         <InputNumber value={pmt.amount} disabled className="full-width" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Phương thức thanh toán ">
//                         <Input value={pmt.method} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Trạng thái thanh toán">
//                         <Input value={pmt.status} disabled />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </Card>
//               ))}
//             </TabPane>

//             {/* Tab công nợ */}
//             <TabPane tab="Công nợ" key="debt">
//               <h3 className="text-bold-margin">
//                 Công nợ {`<${report?.reportNo}>`}
//               </h3>

//               <Row gutter={16}>
//                 <Col span={12}>
//                   <Form.Item name="debtNoVAT" label="Số tiền chưa VAT">
//                     <InputNumber className="full-width" />
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item name="debtWithVAT" label="Số tiền đã VAT">
//                     <InputNumber className="full-width" />
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item
//                     name="totalDebtRemaining"
//                     label="Tổng công nợ còn phải thu (đã VAT)"
//                     // labelCol={{ span: 10 }}
//                     // wrapperCol={{ span: 14 }}
//                   >
//                     <InputNumber className="full-width" />
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item name="badDebt" label="Nợ khó đòi">
//                     <InputNumber className="full-width" />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             </TabPane>

//             {/* Tab hoa hồng CTV */}
//             <TabPane tab="Hoa hồng CTV" key="collaborator">
//               {(report.collaborators || []).map((ctv, idx) => (
//                 <Card key={idx} size="small" className="margin-bottom-16">
//                   <h3 className="text-bold-margin">
//                     Hoa hồng cộng tác viên {`<${report?.reportNo}>`}
//                   </h3>

//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item label="Tên cộng tác viên">
//                         <Input value={ctv.name} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Số điện thoại">
//                         <Input value={ctv.phone} disabled />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Tỷ lệ hoa hồng (%)">
//                         <InputNumber
//                           value={ctv.commissionRate}
//                           disabled
//                           className="full-width"
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Số tiền hoa hồng">
//                         <InputNumber value={ctv.amount} disabled className="full-width" />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="Số tiền còn phải chi">
//                         <InputNumber
//                           value={ctv.remainingAmount}
//                           disabled
//                           className="full-width"
//                         />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </Card>
//               ))}
//             </TabPane>
//           </Tabs>
//         </Card>
//       </Form>
//     </>
//   );
// };

// export default DebtReportDetail;
