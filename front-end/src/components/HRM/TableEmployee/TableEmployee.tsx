import { Table, Checkbox, Button } from "antd";
import { generatePath, Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import "./TableEmployee.css";
import { ROUTES_APP } from "@/app/routes";
import { Employee } from "@/models/HRM/employee.model";

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
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys(allKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: Employee) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id.toString())}
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id.toString()]);
            } else {
              setSelectedRowKeys(
                selectedRowKeys.filter((key) => key !== record.id.toString())
              );
            }
          }}
        />
      ),
    },
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
      fixed: "left" as const,
      width: 120,
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      fixed: "left" as const,
      width: 150,
      align: "center" as const,
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
      align: "center" as const,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Số CCCD",
      dataIndex: "cccd",
      key: "cccd",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ngày cấp CCCD",
      dataIndex: "issued_date_cccd",
      key: "issued_date_cccd",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Nơi cấp CCCD",
      dataIndex: "issued_place_cccd",
      key: "issued_place_cccd",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Số điện thoại",
      dataIndex: "work_phone",
      key: "work_phone",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Địa chỉ email",
      dataIndex: "work_email",
      key: "work_email",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Địa chỉ thường trú",
      dataIndex: "permanent_address",
      key: "permanent_address",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Địa chỉ tạm trú",
      dataIndex: "temporary_address",
      key: "temporary_address",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Mã số thuế TNCN",
      dataIndex: "tax_id",
      key: "tax_id",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Mã số BHXH",
      dataIndex: "insurance_id",
      key: "insurance_id",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bank_account",
      key: "bank_account",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Vị trí",
      dataIndex: "job",
      key: "job",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contract",
      key: "contract_type",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) => contract[0]?.x_contract_type || "-",
    },
    {
      title: "Thời hạn hợp đồng",
      dataIndex: "contract",
      key: "contract_term",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) =>
        contract[0]?.x_contract_term ? "Có thời hạn" : "Không thời hạn",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "contract",
      key: "date_start",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) => contract[0]?.date_start || "-",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "contract",
      key: "date_end",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) => contract[0]?.date_end || "-",
    },
    {
      title: "Mức lương",
      dataIndex: "contract",
      key: "wage",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) =>
        contract[0]?.wage ? Number(contract[0].wage).toLocaleString("en-US") : "-",
    },
    {
      title: "Tiền thưởng",
      dataIndex: "contract",
      key: "x_bonus",
      width: 150,
      align: "center" as const,
      render: (contract: Employee["contract"]) =>
        contract[0]?.x_bonus ? Number(contract[0].x_bonus).toLocaleString("en-US") : "-",
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Employee) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit?.(record)}
          className="employee-edit-icon"
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      scroll={{ x: 2500, y: 600 }}
      sticky={{ offsetHeader: 64 }}
      rowClassName={(record: Employee) =>
        selectedRowKeys.includes(record.id.toString()) ? "selected-row" : ""
      }
    />
  );
};

export default TableEmployee;