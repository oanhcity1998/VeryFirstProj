import React, { useState } from "react";
import { Button, Space, Typography, Input, Select, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./QuoteList.css";
import { generatePath, useNavigate } from "react-router-dom";
import QuoteTable, {Contract} from "@/components/CRM/TableQuote/TableQuote"
import CreateContractForm from "@/components/CRM/ContractForm/CreateContractForm";
import QuoteDetail from "../QuoteDetail/QuoteDetail";
import { ROUTES_APP } from "@/app/routes";

const { Search } = Input;
const { Option } = Select;
type ViewDetail = {
  loai: "baogia" | "hopdong";
  record: Contract;
} | null;

const QuoteList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [openForm, setOpenForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<ViewDetail>(null);
  const [editRecord, setEditRecord] = useState<Contract | null>(null);

  const navigate = useNavigate();

//   // ContractList.tsx
//   const handleRowClick = (record: Contract) => {
//     navigate(
//       `${generatePath(ROUTES_APP.crm.contractDetail, { id: record.id })}?loai=${
//         record.type === "Báo giá" ? "baogia" : "hopdong"
//       }`
//     );
//   };

  if (viewDetail) {
    return <QuoteDetail loai={viewDetail.loai} onBack={() => setViewDetail(null)} />;
  }

  const handleSave = (data: any) => {
    console.log("Dữ liệu hợp đồng mới:", data);
    setOpenForm(false);
  };

  const data: Contract[] = [
    {
      id: "1",
      code: "AF25_BG1",
      name: "Báo giá Piggy hotel",
      type: "Báo giá",
      customer: "Piggy hotel",
      total: 10000000,
      owner: "Văn A",
      createdAt: "20/02/2025",
      approver: "Trần B",
      approvedAt: "",
      status: "Chờ duyệt",
    },
    {
      id: "2",
      code: "AC25_HD1",
      name: "Hợp đồng trường A",
      type: "Hợp đồng",
      customer: "Trường A",
      total: 15000000,
      owner: "Duy Khoa",
      createdAt: "25/05/2025",
      approver: "Trần B",
      approvedAt: "30/05/2025",
      status: "Đã duyệt",
    },
  ];

  // filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesType = typeFilter ? item.type === typeFilter : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="quote-list-container">
      {/* Header */}
      <div className="quote-list-header">
        <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ flexWrap: "wrap" }}>
            <Col>
            <h2 className="quote-title">Danh sách báo giá</h2>
            </Col>

            <Col flex="auto">
            <Space wrap style={{ justifyContent: "flex-end", width: "100%" }}>
                <Search
                placeholder="Tìm kiếm hợp đồng..."
                allowClear
                onSearch={(val) => setSearchText(val)}
                style={{ minWidth: 180, maxWidth: 240, width: "100%" }}
                />
                <Select
                placeholder="Trạng thái"
                allowClear
                style={{ minWidth: 140 }}
                onChange={(val) => setStatusFilter(val)}
                >
                <Option value="Chờ duyệt">Chờ duyệt</Option>
                <Option value="Đã duyệt">Đã duyệt</Option>
                <Option value="Huỷ">Huỷ</Option>
                </Select>
                <Select
                placeholder="Loại hợp đồng"
                allowClear
                style={{ minWidth: 140 }}
                onChange={(val) => setTypeFilter(val)}
                >
                <Option value="Báo giá">Báo giá</Option>
                <Option value="Hợp đồng">Hợp đồng</Option>
                </Select>
                <Button danger disabled={selectedRowKeys.length === 0} icon={<DeleteOutlined />}>
                Xoá
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
                Tạo
                </Button>
            </Space>
            </Col>
        </Row>
        </div>


      {/* Table (separated component) */}
      <QuoteTable
        data={filteredData}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={setSelectedRowKeys}
        onEditClick={(record) => setEditRecord(record)}
      />

      {/* Form modal */}
      <CreateContractForm
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onSave={handleSave}
      />

      <CreateContractForm
        open={!!editRecord}
        onCancel={() => setEditRecord(null)}
        onSave={(data) => {
            console.log("Edited data:", data);
            setEditRecord(null);
        }}
        title="Chỉnh sửa báo giá & hợp đồng" // ✅ new title
        initialValues={editRecord || undefined} // ✅ pass record data
        />
    </div>
  );
};

export default QuoteList;
