import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Typography,
    Input,
    DatePicker,
    Breadcrumb,
    Upload,
} from "antd";
import dayjs from "dayjs";
import "./AssetDetail.css";
import { ROUTES_APP } from "../../../routes";

const { Title } = Typography;

interface Asset {
    key: string;
    id: string; // Mã tài sản
    name: string; // Tên tài sản
    type: string; // Loại tài sản
    description: string; // Mô tả
    purchaseDate: string; // Ngày mua
    department: string; // Phòng ban sở hữu
    position: string; // Vị trí
    warranty: string; // Hạn bảo hành
    value: string; // Giá trị ban đầu
    owner: string; // Nhân viên sở hữu
    status: string; // Trạng thái
    image?: string;
}

const AssetDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [form] = Form.useForm();

    const assets: Asset[] = [
        {
            key: "1",
            id: "TL82334",
            name: "Laptop Macbook Pro M2",
            type: "Máy tính",
            description: "Máy tính cá nhân công ty cấp cho nhân viên",
            purchaseDate: "22/07/2022",
            department: "Kế toán",
            position: "Nhân viên kế toán",
            warranty: "30/08/2025",
            value: "30000000",
            owner: "Thị Mão",
            status: "Cũ",
        },
    ];

    useEffect(() => {
        if (asset) {
            form.setFieldsValue({
                ...asset,
                purchaseDate: asset.purchaseDate
                    ? dayjs(asset.purchaseDate, "DD/MM/YYYY")
                    : null,
                warranty: asset.warranty
                    ? dayjs(asset.warranty, "DD/MM/YYYY")
                    : null,
                value: asset.value
                    ? Number(asset.value).toLocaleString("en-US") // 👉 format US
                    : "",
            });
        }
    }, [asset, form]);


    useEffect(() => {
        const foundAsset = assets.find((a) => a.id === id);
        if (foundAsset) {
            setAsset(foundAsset);
            form.setFieldsValue({
                ...foundAsset,
                purchaseDate: foundAsset.purchaseDate
                    ? dayjs(foundAsset.purchaseDate, "DD/MM/YYYY")
                    : null,
                warranty: foundAsset.warranty
                    ? dayjs(foundAsset.warranty, "DD/MM/YYYY")
                    : null,
            });
        } else {
            navigate(ROUTES_APP.hrm.assetList);
        }
    }, [id, form, navigate]);

    if (!asset) return <div>Đang tải...</div>;

    return (
        <div className="asset-detail-container">
            <Breadcrumb style={{ marginBottom: "16px" }}>
                <Breadcrumb.Item>
                    <Link to={ROUTES_APP.hrm.assetList}>Danh sách tài sản</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Chi tiết tài sản</Breadcrumb.Item>
                <Breadcrumb.Item>{asset.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={16}>
                <Col span={24}>
                    <Card
                        title={<h2 style={{ margin: 0 }}>Chi tiết tài sản {asset.name}</h2>}
                        variant="outlined"
                    >
                        <Form form={form} layout="vertical" disabled>
                            <Row gutter={16} align={'stretch'}>
                                {/* Cột 1 */}
                                <Col span={8}>
                                    <Card title="Thông tin cơ bản" variant="outlined" className="asset-card">
                                        <Form.Item label="Mã tài sản" name="id">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Tên tài sản" name="name" >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Loại sản phẩm" name="type">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Mô tả" name="description">
                                            <Input />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                {/* Cột 2 */}
                                <Col span={8}>
                                    <Card title="Thông tin sở hữu" variant="outlined" className="asset-card">
                                        <Form.Item label="Phòng ban sở hữu" name="department">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Vị trí" name="position">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Nhân viên sở hữu" name="owner">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Trạng thái" name="status">
                                            <Input />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                {/* Cột 3 */}
                                <Col span={8}>
                                    <Card title="Thông tin khác" variant="outlined" className="asset-card">
                                        <Form.Item label="Ngày mua" name="purchaseDate">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Hạn bảo hành" name="warranty">
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Giá trị ban đầu" name="value">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Ảnh sản phẩm" name="image">
                                            {asset.image ? (
                                                <img
                                                    src={asset.image}
                                                    alt="Ảnh sản phẩm"
                                                    style={{ width: "100%", maxHeight: "200px", objectFit: "contain", border: "1px solid #f0f0f0", borderRadius: 4 }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        border: "1px dashed #d9d9d9",
                                                        borderRadius: 4,
                                                        padding: "32px",
                                                        textAlign: "center",
                                                        color: "#999",
                                                    }}
                                                >
                                                    Không có ảnh
                                                </div>
                                            )}
                                        </Form.Item>

                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AssetDetail;
