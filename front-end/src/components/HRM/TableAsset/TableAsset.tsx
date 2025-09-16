import { useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { generatePath, Link } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";

interface Asset {
    key: string;
    id: string;            // Mã tài sản
    name: string;          // Tên tài sản
    purchaseDate: string;  // Ngày mua
    value: number;         // Giá trị ban đầu
    status: string;        // Tình trạng (Mới/Cũ/Bảo trì)
    owner: string;         // Nhân viên sở hữu
    warranty: string;      // Hạn bảo hành
}

interface TableAssetProps {
    data?: Asset[];
    selectedRowKeys?: string[];
    setSelectedRowKeys: (keys: string[]) => void;
    onEdit?: (record: Asset) => void;
}

const TableAsset: React.FC<TableAssetProps> = ({
    data = [],
    selectedRowKeys = [],
    setSelectedRowKeys,
    onEdit,
}) => {
    const allKeys = data.map((item) => item.key);
    const isAllChecked = selectedRowKeys.length === data.length;
    const isIndeterminate =
        selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

    const [assetData, setAssetData] = useState<Asset[]>([...data]);

    const handleEdit = (record: Asset) => {
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
            render: (_: any, record: Asset) => (
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
            title: "Mã tài sản",
            dataIndex: "id",
            key: "id",
            fixed: "left" as const,
            width: 120,
            align: "center" as const,
        },
        {
            title: "Tên tài sản",
            dataIndex: "name",
            key: "name",
            width: 200,
            align: "center" as const,
            render: (text: string, record: Asset) => (
                <Link
                    to={generatePath(ROUTES_APP.hrm.assetDetail, { id: record.id })}
                >
                    {text}
                </Link>
            ),
        },
        {
            title: "Ngày mua",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            width: 200,
            align: "center" as const,
        },
        {
            title: "Giá trị ban đầu",
            dataIndex: "value",
            key: "value",
            align: "center" as const,
            render: (value: number) => Number(value).toLocaleString("en-US"),

        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            width: 150,
            align: "center" as const,
        },
        {
            title: "Nhân viên sở hữu",
            dataIndex: "owner",
            key: "owner",
            width: 200,
            align: "center" as const,
        },
        {
            title: "Hạn bảo hành",
            dataIndex: "warranty",
            key: "warranty",
            width: 200,
            align: "center" as const,
        },
        {
            title: "",
            key: "action",
            fixed: "right" as const,
            width: 80,
            align: "center" as const,
            render: (_: any, record: Asset) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    className="base-edit-icon"
                ></Button>
            ),
        },
    ];

    return (
        <Table
            className="base-table"
            columns={columns}
            dataSource={assetData}
            pagination={{
                position: ["bottomCenter"],
                pageSize: 10,
                showSizeChanger: false,
            }}
            rowKey="key"
            scroll={{ x: "max-content", y: 600 }}
            rowClassName={(record: Asset) =>
                selectedRowKeys.includes(record.key) ? "selected-row" : ""
            }
        />
    );
};

export default TableAsset;