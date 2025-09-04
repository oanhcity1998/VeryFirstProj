import React, { useState } from "react";
import { Button, Space, Typography, Input, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ContractList.css";
import { useNavigate } from "react-router-dom";
import ContractTable, { Contract } from "../../../components/TableContract/TableContract";
import CreateContractForm from "../../../components/ContractForm/CreateContractForm";
import ContractDetail from "../ContractDetail/ContractDetail"

const { Search } = Input;
const { Option } = Select;
type ViewDetail =
  | {
      loai: "baogia" | "hopdong";
      record: Contract;
    }
  | null;



const ContractList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [openForm, setOpenForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<ViewDetail>(null);

  const navigate = useNavigate();


  // ContractList.tsx
    const handleRowClick = (record: Contract) => {
    navigate(`/contracts/${record.id}?loai=${record.type === "Báo giá" ? "baogia" : "hopdong"}`);
    };

    if (viewDetail) {
        return (
            <ContractDetail
            loai={viewDetail.loai}
            onBack={() => setViewDetail(null)}
            />
        );
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
    <div className="contract-list-container">
      {/* Header */}
      <div className="contract-list-header">
        <h2 className="contract-title">Danh sách hợp đồng</h2>
        <div className="contract-actions">
          <Search
            placeholder="Tìm kiếm hợp đồng..."
            allowClear
            onSearch={(val) => setSearchText(val)}
            style={{ width: 220 }}
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: 150 }}
            onChange={(val) => setStatusFilter(val)}
          >
            <Option value="Chờ duyệt">Chờ duyệt</Option>
            <Option value="Đã duyệt">Đã duyệt</Option>
            <Option value="Huỷ">Huỷ</Option>
          </Select>
          <Select
            placeholder="Loại hợp đồng"
            allowClear
            style={{ width: 150 }}
            onChange={(val) => setTypeFilter(val)}
          >
            <Option value="Báo giá">Báo giá</Option>
            <Option value="Hợp đồng">Hợp đồng</Option>
          </Select>
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            icon={<DeleteOutlined />}
          >
            Xoá
          </Button>
          <Button type="primary" icon={<PlusOutlined />}  onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {/* Table (separated component) */}
      <ContractTable
        data={filteredData}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={setSelectedRowKeys}
        onRow={(record) => ({
            onClick: () => handleRowClick(record),
        })}
      />


      {/* Form modal */}
      <CreateContractForm
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ContractList;
