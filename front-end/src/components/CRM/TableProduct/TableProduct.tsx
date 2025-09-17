import { Table, Checkbox, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import "@/index.css";

export interface Product {
    id: string;
    name: string;
    description: string;
    type: string;
    priceVND: number;
    priceUSD: number;
    vat: number;
    priceAfterVatVND: number;
    priceAfterVatUSD: number;
}

interface TableProductProps {
    data?: Product[];
    selectedRowKeys?: string[];
    setSelectedRowKeys: (keys: string[]) => void;
    onEdit?: (record: Product) => void;
    loading?: boolean;
}

const TableProduct: React.FC<TableProductProps> = ({
    data = [],
    selectedRowKeys = [],
    setSelectedRowKeys,
    onEdit,
    loading = false,
}) => {
    const allKeys = data.map((item) => item.id);
    const isAllChecked = selectedRowKeys.length === data.length && data.length > 0;
    const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

    const columns: ColumnsType<Product> = [
        {
            title: (
                <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllChecked}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRowKeys(allKeys);
                        } else {
                            setSelectedRowKeys([]);
                        }
                    }}
                    disabled={data.length === 0}
                />
            ),
            dataIndex: "option",
            width: 60,
            fixed: "left",
            align: "center",
            render: (_: any, record: Product) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRowKeys([...selectedRowKeys, record.id]);
                        } else {
                            setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
                        }
                    }}
                />
            ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            width: 200,
            fixed: "left",
            align: "center",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            width: 200,
            align: "center",
        },
        {
            title: "Loại sản phẩm",
            dataIndex: "type",
            key: "type",
            width: 150,
            align: "center",
            render: (value: string) => (value === "package" ? "Theo gói" : "Theo tháng"),
        },
        {
            title: "Giá (VND)",
            dataIndex: "priceVND",
            key: "priceVND",
            width: 120,
            align: "center",
            render: (value: number) => value.toLocaleString("vi-VN"),
        },
        {
            title: "Giá (USD)",
            dataIndex: "priceUSD",
            key: "priceUSD",
            width: 120,
            align: "center",
            render: (value: number) => value.toLocaleString("en-US"),
        },
        {
            title: "VAT (%)",
            dataIndex: "vat",
            key: "vat",
            width: 100,
            align: "center",
        },
        {
            title: "Giá sau VAT (VND)",
            dataIndex: "priceAfterVatVND",
            key: "priceAfterVatVND",
            width: 150,
            align: "center",
            render: (value: number) => value.toLocaleString("vi-VN"),
        },
        {
            title: "Giá sau VAT (USD)",
            dataIndex: "priceAfterVatUSD",
            key: "priceAfterVatUSD",
            width: 150,
            align: "center",
            render: (value: number) => value.toLocaleString("en-US"),
        },
        {
            title: "",
            key: "action",
            width: 80,
            fixed: "right",
            align: "center",
            render: (_: any, record: Product) => (
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(record);
                        }}
                        className="base-edit-icon"
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <Table
            className="base-table"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: 1200 }}
            rowClassName={(record: Product) =>
                selectedRowKeys.includes(record.id) ? "selected-row" : ""
            }
        />
    );
};

export default TableProduct;