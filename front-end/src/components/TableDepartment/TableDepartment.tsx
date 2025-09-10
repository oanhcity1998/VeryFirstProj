import { useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./TableDepartment.css";

interface Department {
    key: string;
    id: string;
    departmentName: string;
    head: string;
    note?: string;
}

interface TableDepartmentProps {
    data?: Department[];
    selectedRowKeys?: string[];
    setSelectedRowKeys: (keys: string[]) => void;
    onEdit?: (record: Department) => void;
}

const TableDepartment: React.FC<TableDepartmentProps> = ({
    data = [],
    selectedRowKeys = [],
    setSelectedRowKeys,
    onEdit,
}) => {
    const allKeys = data.map((item) => item.key);
    const isAllChecked = selectedRowKeys.length === data.length;
    const isIndeterminate =
        selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

    const [departmentData, setDepartmentData] = useState<Department[]>([...data]);

    const handleEdit = (record: Department) => {
        if (onEdit) onEdit(record);
    };

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
            render: (_: any, record: Department) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.key)}
                    onChange={(e: { target: { checked: boolean } }) => {
                        if (e.target.checked) {
                            setSelectedRowKeys([...selectedRowKeys, record.key]);
                        } else {
                            setSelectedRowKeys(
                                selectedRowKeys.filter((key) => key !== record.key)
                            );
                        }
                    }}
                />
            ),
        },
        {
            title: "Mã phòng ban",
            dataIndex: "id",
            key: "id",
            fixed: "left" as const,
            width: 120,
            align: "center" as const,
        },
        {
            title: "Tên phòng ban",
            dataIndex: "departmentName",
            key: "departmentName",
            width: 200,
            align: "center" as const,
        },
        {
            title: "Trưởng phòng",
            dataIndex: "head",
            key: "head",
            width: 150,
            align: "center" as const,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            width: 200,
            align: "center" as const,
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
                    onClick={() => handleEdit(record)}
                    className="department-edit-icon"
                ></Button>
            ),
        },
    ];

    return (
        <Table
            className="department-table"
            columns={columns}
            dataSource={departmentData}
            pagination={{
                position: ["bottomCenter"],
                pageSize: 10,
                showSizeChanger: false,
            }}
            rowKey="key"
            scroll={{ x: 800, y: 600 }}
            rowClassName={(record: Department) =>
                selectedRowKeys.includes(record.key) ? "selected-row" : ""
            }
        />
    );
};

export default TableDepartment;