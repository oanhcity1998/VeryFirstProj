import React, { useState, useEffect } from "react";
import { Button, Input, Select, Modal, Pagination, Empty, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import TableContract, { Contract } from "@/components/CRM/TableContract/TableContract";
import ContractForm from "@/components/CRM/ContractForm/ContractForm";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Search } = Input;
const { Option } = Select;

type ViewDetail = {
  loai: "baogia" | "hopdong";
  record: Contract;
} | null;

const ContractList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [openForm, setOpenForm] = useState(false);
  const [editRecord, setEditRecord] = useState<Contract | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 5,
  });
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  });

  const navigate = useNavigate();

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
      products: [
        { key: 1, name: "Dịch vụ kế toán", type: "Tháng", priceVND: 5000000, priceUSD: 400, vat: 10 },
        { key: 2, name: "Ghi chép sổ sách", type: "Gói", priceVND: 3000000, priceUSD: 200, vat: 10 },
      ],
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
      products: [
        { key: 1, name: "Dịch vụ tư vấn", type: "Gói", priceVND: 10000000, priceUSD: 600, vat: 10 },
      ],
    },
  ];

  useEffect(() => {
    setMeta({
      page: queryParams.page,
      limit: queryParams.limit,
      total: data.length,
      pages: Math.ceil(data.length / queryParams.limit),
    });
  }, [queryParams.limit, data.length]);

  const handleRowClick = (record: Contract) => {
    navigate(
      generatePath(ROUTES_APP.crm.contractDetail, { id: record.id }) +
      `?loai=${record.type === "Báo giá" ? "baogia" : "hopdong"}`
    );
  };

  const handleSave = (data: Contract) => {
    if (editRecord) {
      setData((prev) => prev.map((item) => (item.id === editRecord.id ? { ...item, ...data } : item)));
      message.success("Cập nhật hợp đồng thành công");
    } else {
      const newContract: Contract = {
        id: String(Date.now()),
        ...data,
      };
      setData((prev) => [...prev, newContract]);
      setMeta((prev) => ({
        ...prev,
        total: prev.total + 1,
        pages: Math.ceil((prev.total + 1) / prev.limit),
      }));
      message.success("Thêm hợp đồng thành công");
    }
    setOpenForm(false);
    setEditRecord(null);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setMeta((prev) => ({
        ...prev,
        total: prev.total - selectedRowKeys.length,
        pages: Math.ceil((prev.total - selectedRowKeys.length) / prev.limit),
      }));
      setSelectedRowKeys([]);
      message.success("Đã xóa hợp đồng thành công");
    } catch {
      message.error("Không thể xóa hợp đồng");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ page, limit: pageSize });
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesType = typeFilter ? item.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedData = filteredData.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  const [setData] = useState<Contract[]>(data);

  return (
    <>
      <div className="list-header">
        <h2>Danh sách hợp đồng</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Tìm kiếm theo tên hợp đồng, khách hàng"
            allowClear
            onSearch={(val) => setSearchText(val)}
          />
          <Select
            className="filter-bar"
            placeholder="Trạng thái"
            allowClear
            onChange={(val) => setStatusFilter(val)}
          >
            <Option value="Chờ duyệt">Chờ duyệt</Option>
            <Option value="Đã duyệt">Đã duyệt</Option>
            <Option value="Huỷ">Huỷ</Option>
          </Select>
          <Select
            className="filter-bar"
            placeholder="Loại"
            allowClear
            onChange={(val) => setTypeFilter(val)}
          >
            <Option value="Báo giá">Báo giá</Option>
            <Option value="Hợp đồng">Hợp đồng</Option>
          </Select>
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            icon={<DeleteOutlined />}
            onClick={() => setDeleteOpen(true)}
          >
            Xoá
          </Button>
          <Modal
            open={deleteOpen}
            title="Xác nhận xóa"
            onOk={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} hợp đồng đã chọn?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có hợp đồng nào để hiển thị" />
          <p>Hiện tại không có dữ liệu hợp đồng. Vui lòng thêm mới!</p>
        </div>
      ) : (
        <>
          <TableContract
            data={paginatedData}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onEdit={(record) => {
              setEditRecord(record);
              setOpenForm(true);
            }}
            onRowClick={handleRowClick}
          />
          <div className="pagination-container">
            <Pagination
              current={meta.page}
              pageSize={meta.limit}
              total={meta.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
            />
          </div>
        </>
      )}

      <ContractForm
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setEditRecord(null);
        }}
        onSave={handleSave}
        title={editRecord ? "Chỉnh sửa báo giá & hợp đồng" : "Thêm mới báo giá & hợp đồng"}
        initialValues={editRecord}
      />
    </>
  );
};

export default ContractList;