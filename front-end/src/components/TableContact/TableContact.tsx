import { Table, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

// Định nghĩa type cho Contact
export interface Contact {
  key: string;
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
  selectedRowKeys: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onShowClick?: (record: Contact) => void; // 👈 thêm
  onEditClick?: (record: Contact) => void;
  selectable?: boolean;
  showEdit?: boolean;
}

const TableContact = ({
  data,
  searchText,
  filterCustomer,
  filterMainContact,
  selectedRowKeys,
  setSelectedRowKeys,
  onShowClick,
  onEditClick,
  selectable = true,
  showEdit = true,
}: TableContactProps) => {
  // 🔎 lọc theo search + filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.contactName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.mainContact.toLowerCase().includes(searchText.toLowerCase());

      const matchCustomer = filterCustomer ? item.customerName === filterCustomer : true;
      const matchMainContact = filterMainContact ? item.mainContact === filterMainContact : true;

      return matchSearch && matchCustomer && matchMainContact;
    });
  }, [data, searchText, filterCustomer, filterMainContact]);

  const columns: ColumnsType<Contact> = [
    {
      title: "Tên người liên hệ",
      dataIndex: "contactName",
      width: 200,
      fixed: "left",
      render: (_, record) => (
        <Link onClick={() => onShowClick && onShowClick(record)} to={"#"}>
          {record.contactName}
        </Link>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      width: 200,
      fixed: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Chức danh",
      dataIndex: "title",
      width: 150,
    },
    {
      title: "Người liên hệ chính",
      dataIndex: "mainContact",
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 200,
    },
  ];

  if (showEdit) {
    columns.push({
      title: "",
      dataIndex: "",
      width: 60,
      fixed: "right",
      render: (_, record) => (
        <EditOutlined
          style={{
            fontSize: "20px",
            display: "block",
            cursor: "pointer",
            color: "#1890ff",
            padding: "8px",
          }}
          onClick={(e) => {
            e.stopPropagation(); // ❌ chặn click row
            onEditClick?.(record);
          }}
        />
      ),
    });
  }

  return (
    <Table<Contact>
      rowSelection={
        selectable
          ? {
              selectedRowKeys,
              onChange: (keys) => {
                setSelectedRowKeys(keys as string[]); // 👈 ép kiểu vì React.Key có thể là string | number
              },
            }
          : undefined
      }
      columns={columns}
      dataSource={filteredData}
      rowKey="key"
      scroll={{ x: "max-content", y: "calc(100vh - 330px)" }}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default TableContact;
