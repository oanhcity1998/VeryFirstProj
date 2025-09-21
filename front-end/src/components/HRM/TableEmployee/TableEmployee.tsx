import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { generatePath, useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";
import { Employee } from "@/models/HRM/employee.model";
import dayjs from "dayjs";

interface TableEmployeeProps {
  data?: Employee[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  loading?: boolean;
  onEdit?: (record: Employee) => void;
  onShowClick?: (record: Employee) => void;
  selectable?: boolean;
}

const TableEmployee: React.FC<TableEmployeeProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  loading = false,
  onEdit,
  onShowClick,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Employee) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      key: "code",
      align: "center",
      width: 150,
      fixed: "left",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 200,
      fixed: "left",
      render: (text: string, record: Employee) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.hrm.employeeDetail, { id: record.id.toString() }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 120,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      align: "center",
      width: 150,
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Số CCCD",
      dataIndex: "id_number",
      key: "id_number",
      align: "center",
      width: 180,
    },
    {
      title: "Địa chỉ thường trú",
      dataIndex: "permanent_address",
      key: "permanent_address",
      align: "center",
      width: 250,
    },
    {
      title: "Địa chỉ tạm trú",
      dataIndex: "temporary_address",
      key: "temporary_address",
      align: "center",
      width: 250,
    },
    {
      title: "Mã số thuế TNCN",
      dataIndex: "tax_id",
      key: "tax_id",
      align: "center",
      width: 180,
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bank_account",
      key: "bank_account",
      align: "center",
      width: 200,
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
      width: 180,
    },
    {
      title: "Vị trí",
      dataIndex: "job_name",
      key: "job_name",
      align: "center",
      width: 200,
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contract",
      key: "contract_type",
      align: "center",
      width: 200,
      render: (contract: Employee["contract"]) =>
        contract.length > 0 ? contract.map((c) => c.contract_type).join(", ") : "-",
    },
    {
      title: "",
      key: "action",
      width: 80,
      align: "center",
      render: (_: any, record: Employee) => (
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
      loading={loading}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={false}
    />
  );
};

export default TableEmployee;