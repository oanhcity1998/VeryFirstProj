import React from "react";
import { Table, Tooltip } from "antd";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { generatePath, Link } from "react-router-dom";
import { ColumnsType, TableProps } from "antd/es/table";
import { ROUTES_APP } from "@/routes";

export interface KVTableColumn {
  title: string;
  dataIndex: string;
  type?: "text" | "number" | "date" | "link" | "tag" | "actions";
  linkTo?: string; // 👉 route key, ví dụ "crm.opportunityDetail"
  width?: number;
  align?: "left" | "center" | "right";
}

export interface KVTableConfig {
  columns: KVTableColumn[];
  rowActions?: string[];
}

interface KVTableProps<T> {
  data: T[];
  config: KVTableConfig;
  rowKey: string;
  selectedRowKeys?: React.Key[];
  setSelectedRowKeys?: (keys: React.Key[]) => void;
  onEditClick?: (record: T) => void;
  rowSelection?: TableProps<T>["rowSelection"];
}

function getRoutePath(pathKey: string, params: any) {
  // 👉 hỗ trợ lấy route từ ROUTES_APP qua string key, ví dụ "crm.opportunityDetail"
  const keys = pathKey.split(".");
  let route: any = ROUTES_APP;
  for (const k of keys) {
    route = route?.[k];
  }
  return generatePath(route, params);
}

export function KVTable<T extends { id: number | string }>({
  data,
  config,
  rowKey,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
}: KVTableProps<T>) {
  const columns: ColumnsType<T> = config.columns.map((col) => {
    return {
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      align: col.align ?? "center",
      width: col.width,
      render: (value: any, record: T) => {
        if (col.type === "link" && col.linkTo) {
          const recordId = record[rowKey as keyof T] as string | number;
          return (
            <Link to={getRoutePath(col.linkTo, { id: recordId })}>
              <FileTextOutlined style={{ marginRight: 6, color: "#1890ff" }} />
              {value}
            </Link>
          );
        }
        if (col.type === "number") {
          return value != null ? value.toLocaleString() : "-";
        }
        return value ?? "-";
      },
    };
  });

  // 👉 Luôn thêm cột hành động cuối cùng nếu có
  // if (config.rowActions?.includes("edit")) {
  columns.push({
    title: "Hành động",
    key: "action",
    align: "center",
    fixed: "right",
    width: 80,
    render: (_, record) => (
      <Tooltip title="Chỉnh sửa">
        <EditOutlined
          style={{
            fontSize: 18,
            color: "#1890ff",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.(record);
          }}
        />
      </Tooltip>
    ),
  });
  // }

  return (
    <Table<T>
      rowSelection={
        setSelectedRowKeys
          ? {
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }
          : undefined
      }
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      scroll={{ x: "max-content", y: "calc(100vh - 150px)" }}
      pagination={{
        pageSize: 10,
        position: ["bottomCenter"],
      }}
    />
  );
}

export default KVTable;
