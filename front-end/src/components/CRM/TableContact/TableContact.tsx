import React, { useMemo } from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";

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
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Contact) => void;
  onShowClick?: (record: Contact) => void;
  selectable?: boolean;
  showEdit?: boolean;
}

const TableContact: React.FC<TableContactProps> = ({
  data,
  searchText,
  filterCustomer,
  filterMainContact,
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  selectable = true,
  showEdit = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Contact) => {
    if (onEdit) {
      onEdit(record);
    }
  };

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
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Contact) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.contactDetail, { id: record.id }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Chức danh",
      dataIndex: "title",
      key: "title",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Liên hệ chính",
      dataIndex: "mainContact",
      key: "mainContact",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center" as const,
      width: 150,
    },
    ...(showEdit
      ? [
        {
          title: "",
          key: "action",
          width: 60,
          align: "center" as const,
          render: (_: any, record: Contact) => (
            <Space size="middle">
              <Button
                className="base-edit-icon"
                type="link"
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              />
            </Space>
          ),
        },
      ]
      : []),
  ];

  return (
    <Table
      {...(selectable && setSelectedRowKeys
        ? {
          rowSelection: {
            selectedRowKeys,
            onChange: (keys: Key[]) => setSelectedRowKeys(keys),
          },
        }
        : {})}
      className="base-table"
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
};

export default TableContact;