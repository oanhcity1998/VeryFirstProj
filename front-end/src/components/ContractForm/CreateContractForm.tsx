import React, { useState } from "react";
import { Modal, Button, Row, Col, Input, Select, Table } from "antd";

const { Option } = Select;

interface CreateContractFormProps {
  open: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({ open, onCancel, onSave }) => {
  const [products, setProducts] = useState([
    { key: 1, name: "Dịch vụ kế toán", type: "Tháng", priceVND: 5000000, priceUSD: 400, vat: 10 },
    { key: 2, name: "Ghi chép sổ sách", type: "Gói", priceVND: 3000000, priceUSD: 200, vat: 10 },
  ]);

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Loại sản phẩm", dataIndex: "type", key: "type" },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      render: (val: number) => val.toLocaleString("vi-VN"),
    },
    { title: "Giá (USD)", dataIndex: "priceUSD", key: "priceUSD" },
    { title: "VAT", dataIndex: "vat", key: "vat", render: (val: number) => `${val}%` },
    {
      title: "Giá sau VAT (VND)",
      key: "afterVATVND",
      render: (_: any, record: any) =>
        ((record.priceVND * (100 + record.vat)) / 100).toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      key: "afterVATUSD",
      render: (_: any, record: any) =>
        ((record.priceUSD * (100 + record.vat)) / 100).toLocaleString("en-US"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button danger type="text" onClick={() => handleDelete(record.key)}>
          ❌
        </Button>
      ),
    },
  ];

  const handleDelete = (key: number) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  const handleSave = () => {
    onSave({ products });
  };

  return (
    <Modal
      title="Thêm mới báo giá & hợp đồng (Chỉnh sửa)"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
      width={1000}
    >
      {/* 2-column form */}
      <Row gutter={24}>
        <Col span={12}>
          <label>Mã báo giá & hợp đồng</label>
          <Input placeholder="Nhập mã" />
        </Col>
        <Col span={12}>
          <label>Tên báo giá & hợp đồng</label>
          <Input placeholder="Nhập tên" />
        </Col>

        <Col span={12}>
          <label>Mẫu báo giá</label>
          <Select style={{ width: "100%" }} placeholder="Chọn mẫu">
            <Option value="1">Mẫu 1</Option>
            <Option value="2">Mẫu 2</Option>
          </Select>
        </Col>
        <Col span={12}>
          <label>Loại</label>
          <Select style={{ width: "100%" }} placeholder="Chọn loại">
            <Option value="Tháng">Tháng</Option>
            <Option value="Gói">Gói</Option>
          </Select>
        </Col>

        <Col span={12}>
          <label>Điều khoản thanh toán</label>
          <Input placeholder="Nhập điều khoản" />
        </Col>
        <Col span={12}>
          <label>Thời hạn hiệu lực</label>
          <Input placeholder="Nhập thời hạn" />
        </Col>

        <Col span={12}>
          <label>Nhân viên phụ trách</label>
          <Select style={{ width: "100%" }} placeholder="Chọn nhân viên">
            <Option value="A">Văn A</Option>
            <Option value="B">Văn B</Option>
          </Select>
        </Col>
        <Col span={12}>
          <label>Người duyệt</label>
          <Select style={{ width: "100%" }} placeholder="Chọn người duyệt">
            <Option value="B">Trần B</Option>
          </Select>
        </Col>

        <Col span={12}>
          <label>Trạng thái</label>
          <Select style={{ width: "100%" }} placeholder="Chọn trạng thái">
            <Option value="draft">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
          </Select>
        </Col>
        <Col span={12}>
          <label>Ngày duyệt</label>
          <Input placeholder="dd/mm/yyyy" />
        </Col>
      </Row>

      <h3 style={{ marginTop: 20 }}>Danh sách sản phẩm</h3>
      <Table
        dataSource={products}
        columns={columns}
        pagination={false}
        bordered
        size="small"
      />

      <Button type="primary" style={{ marginTop: 10 }}>
        + Thêm sản phẩm
      </Button>
    </Modal>
  );
};

export default CreateContractForm;
