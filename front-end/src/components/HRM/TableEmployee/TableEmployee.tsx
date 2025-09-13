import { useEffect, useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { generatePath, Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import "./TableEmployee.css";
import { ROUTES_APP } from "@/app/routes";
import { Employee } from "@/models/HRM/employee.model";
import dayjs from "dayjs";

interface TableEmployeeProps {
  data?: Employee[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  loading?: boolean;
  onEdit?: (record: Employee) => void;
}

const TableEmployee: React.FC<TableEmployeeProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  loading = false,
  onEdit,
}) => {
  const allKeys = data.map((item) => item.id.toString());
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => {
            if (e.target.checked) setSelectedRowKeys(allKeys);
            else setSelectedRowKeys([]);
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left",
      align: "center",
      render: (_: any, record: Employee) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id.toString())}
          onChange={(e) => {
            if (e.target.checked) setSelectedRowKeys([...selectedRowKeys, record.id.toString()]);
            else setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id.toString()));
          }}
        />
      ),
    },
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      key: "code",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 150,
      align: "center",
      render: (text: string, record: Employee) => (
        <Link to={generatePath(ROUTES_APP.hrm.employeeDetail, { id: record.id.toString() })}>
          {text}
        </Link>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      width: 120,
      align: "center",
      render: (date: string) => (date ? dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Số CCCD",
      dataIndex: "cccd",
      key: "cccd",
      width: 150,
      align: "center",
    },
    {
      title: "Địa chỉ thường trú",
      dataIndex: "permanent_address",
      key: "permanent_address",
      width: 200,
      align: "center",
    },
    {
      title: "Địa chỉ tạm trú",
      dataIndex: "temporary_address",
      key: "temporary_address",
      width: 200,
      align: "center",
    },
    {
      title: "Mã số thuế TNCN",
      dataIndex: "tax_id",
      key: "tax_id",
      width: 150,
      align: "center",
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bank_account",
      key: "bank_account",
      width: 150,
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 120,
      align: "center",
    },
    {
      title: "Vị trí",
      dataIndex: "job_name",
      key: "job_name",
      width: 150,
      align: "center",
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contract",
      key: "contract_type",
      width: 150,
      align: "center",
      render: (contract: Employee["contract"]) => contract[0]?.contract_type || "-",
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_: any, record: Employee) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(record)} className="employee-edit-icon" />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 1500, y: 600 }}
      sticky={{ offsetHeader: 64 }}
      rowClassName={(record: Employee) => (selectedRowKeys.includes(record.id.toString()) ? "selected-row" : "")}
      pagination={false}
    />
  );
};

export default TableEmployee;