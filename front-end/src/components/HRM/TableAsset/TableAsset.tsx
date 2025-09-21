import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { generatePath, useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";

interface Asset {
  key: string;
  id: string; // Mã tài sản
  name: string; // Tên tài sản
  purchaseDate: string; // Ngày mua
  value: number; // Giá trị ban đầu
  status: string; // Tình trạng (Mới/Cũ/Bảo trì)
  owner: string; // Nhân viên sở hữu
  warranty: string; // Hạn bảo hành
}

interface TableAssetProps {
  data?: Asset[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Asset) => void;
  onShowClick?: (record: Asset) => void;
  selectable?: boolean;
}

const TableAsset: React.FC<TableAssetProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Asset) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Asset> = [
    {
      title: "Mã tài sản",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên tài sản",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 150,
      fixed: "left",
      render: (text: string, record: Asset) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.hrm.assetDetail, { id: record.id }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      align: "center",
      width: 150,
    },
    {
      title: "Giá trị ban đầu",
      dataIndex: "value",
      key: "value",
      align: "center",
      width: 150,
      render: (value: number) => Number(value).toLocaleString("en-US"),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
    },
    {
      title: "Nhân viên sở hữu",
      dataIndex: "owner",
      key: "owner",
      align: "center",
      width: 150,
    },
    {
      title: "Hạn bảo hành",
      dataIndex: "warranty",
      key: "warranty",
      align: "center",
      width: 150,
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center",
      render: (_: any, record: Asset) => (
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
      pagination={false}
      rowKey="key"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TableAsset;