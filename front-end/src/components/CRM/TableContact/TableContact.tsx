import React, { useMemo } from "react";
import { Table, Typography, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";

const { Link } = Typography;

export interface Contact {
  id: string;
  contactName: string;
  customerName: string;
  phone: string;
  email: string;
  title: string;
  mainContact: string;
  note: string;
}

interface TableContactProps {
  data: Contact[];
  searchText: string;
  filterCustomer: string | null;
  filterMainContact: string | null;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEditClick?: (record: Contact) => void;
}

const TableContact: React.FC<TableContactProps> = ({
  data,
  searchText,
  filterCustomer,
  filterMainContact,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
}) => {
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText.toLowerCase();
      const matchSearch =
        item.contactName.toLowerCase().includes(text) ||
        item.customerName.toLowerCase().includes(text) ||
        item.email.toLowerCase().includes(text);
      const matchCustomer = filterCustomer ? item.customerName === filterCustomer : true;
      const matchMainContact = filterMainContact ? item.mainContact === filterMainContact : true;
      return matchSearch && matchCustomer && matchMainContact;
    });
  }, [data, searchText, filterCustomer, filterMainContact]);

  const columns: ColumnsType<Contact> = [
    {
      title: "Tên liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      width: 150,
      render: (text, record) => (
        <Link
          className="contact-link"
          onClick={() => navigate(generatePath(ROUTES_APP.crm.contactDetail, { id: record.id }))}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Chức danh",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "Liên hệ chính",
      dataIndex: "mainContact",
      key: "mainContact",
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            style={{
              fontSize: 20,
              cursor: "pointer",
              color: "#1890ff",
              padding: 8,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEditClick?.(record);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as string[]),
      }}
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={false}
      className="base-table"
      scroll={{ x: 1050 }}
    />
  );
};

export default TableContact;