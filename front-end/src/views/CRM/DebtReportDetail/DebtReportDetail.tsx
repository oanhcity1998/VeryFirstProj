import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Tabs, Descriptions, Button, Table, Breadcrumb } from "antd";
import { DebtReport, mockDebtReportData } from "../DebtReportList/DebtReportList";
import { ROUTES_APP } from "../../../routes";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const DebtReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const report = mockDebtReportData.find((r) => r.id === Number(id));
  if (!report) return <p>Không tìm thấy báo cáo</p>;

  const breadcrumbItems = [
    { title: <Link to={ROUTES_APP.crm.debtReportList}>Danh sách báo cáo công nợ</Link> },
    { title: "Thông tin chi tiết" },
    { title: report.reportNo },
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <Breadcrumb items={breadcrumbItems} separator=">" />
      </div>
      <Card>
        <Tabs defaultActiveKey="init">
          {/* Tab 1: Thông tin khởi tạo */}
          <TabPane tab="Khởi tạo" key="init">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Số báo cáo">{report.reportNo}</Descriptions.Item>
              <Descriptions.Item label="Ngày báo cáo">{report.reportDate}</Descriptions.Item>
              <Descriptions.Item label="Hợp đồng">{report.contract}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{report.customer}</Descriptions.Item>
              <Descriptions.Item label="Kiểm toán viên">{report.auditor}</Descriptions.Item>
              <Descriptions.Item label="Giám đốc">{report.director}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{report.status}</Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* Tab 2: Thông tin phí / kế toán */}
          <TabPane tab="Kế toán (Phí)" key="fee">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Phí">{report.fee}</Descriptions.Item>
              <Descriptions.Item label="Tỉ giá">{report.exchangeRate}</Descriptions.Item>
              <Descriptions.Item label="Phí USD">{report.feeUSD}</Descriptions.Item>
              <Descriptions.Item label="Phí chưa VAT">{report.feeNoVAT}</Descriptions.Item>
              <Descriptions.Item label="Phí VNĐ">{report.feeVND}</Descriptions.Item>
              <Descriptions.Item label="Phí gồm VAT">{report.feeWithVAT}</Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* Tab 3: Hóa đơn */}
          <TabPane tab="Hóa đơn" key="invoice">
            <Table
              rowKey="invoiceNo"
              dataSource={report.invoices || []}
              pagination={false}
              columns={[
                { title: "Số hóa đơn", dataIndex: "invoiceNo" },
                { title: "Ngày hóa đơn", dataIndex: "invoiceDate" },
                { title: "Tỉ lệ suất (%)", dataIndex: "rate" },
                { title: "Giá trị chưa VAT", dataIndex: "amountNoVAT" },
              ]}
            />
          </TabPane>

          {/* Tab 4: Thanh toán */}
          <TabPane tab="Thanh toán" key="payment">
            <Table
              rowKey="paymentCode"
              dataSource={report.payments || []}
              pagination={false}
              columns={[
                { title: "Mã thanh toán", dataIndex: "paymentCode" },
                { title: "Ngày thu tiền", dataIndex: "paymentDate" },
                { title: "Số tiền đã thu", dataIndex: "amount" },
                { title: "Phương thức", dataIndex: "method" },
              ]}
            />
          </TabPane>

          {/* Tab 5: Công nợ */}
          <TabPane tab="Công nợ" key="debt">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Số tiền chưa VAT">{report.debtNoVAT}</Descriptions.Item>
              <Descriptions.Item label="Số tiền đã VAT">{report.debtWithVAT}</Descriptions.Item>
              <Descriptions.Item label="Tổng công nợ còn phải thu">
                {report.totalDebtRemaining}
              </Descriptions.Item>
              <Descriptions.Item label="Nợ khó đòi">{report.badDebt}</Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* Tab 6: Hoa hồng cộng tác viên */}
          <TabPane tab="Hoa hồng CTV" key="collaborator">
            <Table
              rowKey="name"
              dataSource={report.collaborators || []}
              pagination={false}
              columns={[
                { title: "Tên CTV", dataIndex: "name" },
                { title: "Số điện thoại", dataIndex: "phone" },
                { title: "Tỷ lệ hoa hồng (%)", dataIndex: "commissionRate" },
                { title: "Số tiền hoa hồng", dataIndex: "amount" },
              ]}
            />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default DebtReportDetail;
