import React from "react";
import { Button, Space, Table, Typography, Form, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import CreateCustomerForm from "../CustomerForm/CustomerForm";
import { ROUTES_APP } from "@/app/routes";

interface Customer {
  key: string;
  id: string;
  customerName: string;
  contractName: string;
  englishName: string;
  taxCode: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  industry: string;
  market: string;
  branches: number;
  employees: number;
  revenue: number;
  documentsPerMonth: number;
  taxSettlementStatus: string;
  taxSettlementYear: number;
  documents?: string;
}

interface TableCustomerProps {
  data?: Customer[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: React.Dispatch<React.SetStateAction<Key[]>>;
  onEdit?: (customer: Customer) => void;
  onShowClick?: (customer: Customer) => void;
  selectable?: boolean;
}

const TableCustomer: React.FC<TableCustomerProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  selectable = true,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);

  const handleEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = (values: any) => {
    if (onEdit && editingCustomer) {
      onEdit({ ...editingCustomer, ...values });
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingCustomer(null);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Mã khách hàng",
      dataIndex: "id",
      key: "id",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Customer) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.customerDetail, { id: record.id }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Tên DN ghi trên hợp đồng",
      dataIndex: "contractName",
      key: "contractName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Tên DN bằng tiếng Anh",
      dataIndex: "englishName",
      key: "englishName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
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
      title: "Số fax",
      dataIndex: "fax",
      key: "fax",
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center" as const,
      width: 250,
    },
    {
      title: "Ngành",
      dataIndex: "industry",
      key: "industry",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Thị trường chính",
      dataIndex: "market",
      key: "market",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Số lượng chi nhánh",
      dataIndex: "branches",
      key: "branches",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Số nhân sự",
      dataIndex: "employees",
      key: "employees",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Doanh thu TB/năm",
      dataIndex: "revenue",
      key: "revenue",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Văn bản TB/tháng",
      dataIndex: "documentsPerMonth",
      key: "documentsPerMonth",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái quyết toán thuế",
      dataIndex: "taxSettlementStatus",
      key: "taxSettlementStatus",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Năm quyết toán thuế",
      dataIndex: "taxSettlementYear",
      key: "taxSettlementYear",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      key: "documents",
      align: "center" as const,
      width: 150,
      render: (file: string) =>
        file ? (
          <a href={file} download target="_blank" rel="noopener noreferrer">
            📂 Tải xuống
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      align: "center" as const,
      render: (_: any, record: Customer) => (
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
  ];

  return (
    <div>
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
        dataSource={data}
        rowKey="key"
        scroll={{ x: "max-content" }}
        pagination={false}
      />

      <Modal
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <CreateCustomerForm form={form} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default TableCustomer;