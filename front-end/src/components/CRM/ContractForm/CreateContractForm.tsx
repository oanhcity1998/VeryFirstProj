import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Input, Select, Table } from "antd";

const { Option } = Select;

interface CreateContractFormProps {
  open: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
  title?: string; // ✅ new
  initialValues?: any; // ✅ new
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({
  open,
  onCancel,
  onSave,
  title = "Thêm mới báo giá & hợp đồng",
  initialValues,
}) => {
  const [products, setProducts] = useState(
    initialValues?.products || [
      { key: 1, name: "Dịch vụ kế toán", type: "Tháng", priceVND: 5000000, priceUSD: 400, vat: 10 },
      { key: 2, name: "Ghi chép sổ sách", type: "Gói", priceVND: 3000000, priceUSD: 200, vat: 10 },
    ]
  );

  // ✅ Controlled states for inputs
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    template: "",
    type: "",
    paymentTerms: "",
    validity: "",
    owner: "",
    approver: "",
    status: "",
    approvedAt: "",
  });

  // ✅ Fill data when editing
  useEffect(() => {
    if (initialValues) {
      setFormData({
        code: initialValues.code || "",
        name: initialValues.name || "",
        template: initialValues.template || "",
        type: initialValues.type || "",
        paymentTerms: initialValues.paymentTerms || "",
        validity: initialValues.validity || "",
        owner: initialValues.owner || "",
        approver: initialValues.approver || "",
        status: initialValues.status || "",
        approvedAt: initialValues.approvedAt || "",
      });
      setProducts(initialValues.products || []);
    }
  }, [initialValues]);

  const handleDelete = (key: number) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  const handleSave = () => {
    onSave({ ...formData, products });
  };

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

  return (
    <Modal
      title={title}
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
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Nhập mã"
          />
        </Col>
        <Col span={12}>
          <label>Tên báo giá & hợp đồng</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên"
          />
        </Col>

        <Col span={12}>
          <label>Mẫu báo giá</label>
          <Select
            value={formData.template || undefined}
            style={{ width: "100%" }}
            placeholder="Chọn mẫu"
            onChange={(val) => setFormData({ ...formData, template: val })}
          >
            <Option value="1">Mẫu 1</Option>
            <Option value="2">Mẫu 2</Option>
          </Select>
        </Col>
        <Col span={12}>
          <label>Loại</label>
          <Select
            value={formData.type || undefined}
            style={{ width: "100%" }}
            placeholder="Chọn loại"
            onChange={(val) => setFormData({ ...formData, type: val })}
          >
            <Option value="Báo giá">Báo giá</Option>
            <Option value="Hợp đồng">Hợp đồng</Option>
          </Select>
        </Col>

        <Col span={12}>
          <label>Điều khoản thanh toán</label>
          <Input
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
            placeholder="Nhập điều khoản"
          />
        </Col>
        <Col span={12}>
          <label>Thời hạn hiệu lực</label>
          <Input
            value={formData.validity}
            onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
            placeholder="Nhập thời hạn"
          />
        </Col>

        <Col span={12}>
          <label>Nhân viên phụ trách</label>
          <Input
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Nhập nhân viên"
          />
        </Col>
        <Col span={12}>
          <label>Người duyệt</label>
          <Input
            value={formData.approver}
            onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
            placeholder="Nhập người duyệt"
          />
        </Col>

        <Col span={12}>
          <label>Trạng thái</label>
          <Select
            value={formData.status || undefined}
            style={{ width: "100%" }}
            placeholder="Chọn trạng thái"
            onChange={(val) => setFormData({ ...formData, status: val })}
          >
            <Option value="Chờ duyệt">Chờ duyệt</Option>
            <Option value="Đã duyệt">Đã duyệt</Option>
          </Select>
        </Col>
        <Col span={12}>
          <label>Ngày duyệt</label>
          <Input
            value={formData.approvedAt}
            onChange={(e) => setFormData({ ...formData, approvedAt: e.target.value })}
            placeholder="dd/mm/yyyy"
          />
        </Col>
      </Row>

      <h3 style={{ marginTop: 20 }}>Danh sách sản phẩm</h3>
      <Table dataSource={products} columns={columns} pagination={false} bordered size="small" />
      <Button type="primary" style={{ marginTop: 10 }}>
        + Thêm sản phẩm
      </Button>
    </Modal>
  );
};

export default CreateContractForm;
