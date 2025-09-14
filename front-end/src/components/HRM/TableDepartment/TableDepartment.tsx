import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./TableDepartment.css";
import { Department } from "@/models/HRM/department.model";

interface TableDepartmentProps {
    data?: Department[];
    selectedRowKeys?: string[];
    setSelectedRowKeys: (keys: string[]) => void;
    onEdit?: (record: Department) => void;
    loading?: boolean;
}

const TableDepartment: React.FC<TableDepartmentProps> = ({
    data = [],
    selectedRowKeys = [],
    setSelectedRowKeys,
    onEdit,
    loading = false,
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
            fixed: "left" as const,
            align: "center" as const,
            render: (_: any, record: Department) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id.toString())}
                    onChange={(e) => {
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
            title: "Mã phòng ban",
            dataIndex: "code",
            key: "code",
            fixed: "left" as const,
            width: 120,
            align: "center" as const,
            render: (code: string | null) => code || "-",
        },
        {
            title: "Tên phòng ban",
            dataIndex: "name",
            key: "name",
            width: 200,
            align: "center" as const,
        },
        {
            title: "Trưởng phòng",
            dataIndex: "manager_name",
            key: "manager_name",
            width: 150,
            align: "center" as const,
            render: (manager_name: string | null) => manager_name || "-",
        },
        {
            title: "Số nhân viên",
            dataIndex: "employee_count",
            key: "employee_count",
            width: 100,
            align: "center" as const,
            render: (count: number | undefined) => count ?? "-",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            width: 200,
            align: "center" as const,
            render: (note: string | null) => note || "-",
        },
        {
            title: "",
            key: "action",
            fixed: "right" as const,
            width: 80,
            align: "center" as const,
            render: (_: any, record: Department) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                        console.log("Edit clicked for record:", record); // Debug edit click
                        onEdit?.(record);
                    }}
                    className="department-edit-icon"
                />
            ),
        },
    ];

    return (
        <Table
            className="department-table"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: 800, y: 600 }}
            rowClassName={(record: Department) =>
                selectedRowKeys.includes(record.id.toString()) ? "selected-row" : ""
            }
        />
    );
};

export default TableDepartment;