import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Input, Select, Table, Card, Form, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "@/index.css";

const { Option } = Select;

interface Product {
  id: number;
  productName: string;
  productType: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  afterVatVND: number;
  afterVatUSD: number;
}

interface Opportunity {
  id: number;
  name: string;
  contactName: string;
  company: string;
  expectedValue: number;
  expectedCloseDate: string;
  service: Product[];
  probability: number;
  priority: "Low" | "Medium" | "High";
  owner: string;
  stage: "Mới" | "Đạt yêu cầu" | "Đàm phán" | "Đóng";
}

interface OpportunityFormProps {
  mode: "create" | "edit";
  open: boolean;
  onCancel: () => void;
  onSave: (data: Opportunity) => void;
  modalTitle?: string;
  cardTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
  initialValues?: Opportunity | null;
  form: any;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  mode,
  open,
  onCancel,
  onSave,
  modalTitle = "Thêm cơ hội",
  cardTitle = "Thông tin cơ hội",
  cancelText = "Hủy",
  saveText = "Xác nhận",
  loading = false,
  initialValues,
  form,
}) => {
  const [services, setServices] = useState<Product[]>(
    initialValues?.service || []
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name || "",
        contactName: initialValues.contactName || "",
        company: initialValues.company || "",
        expectedValue: initialValues.expectedValue || undefined,
        expectedCloseDate: initialValues.expectedCloseDate
          ? dayjs(initialValues.expectedCloseDate, "YYYY-MM-DD")
          : null,
        probability: initialValues.probability || undefined,
        priority: initialValues.priority || undefined,
        owner: initialValues.owner || "",
        stage: initialValues.stage || undefined,
      });
      setServices(initialValues.service || []);
    } else {
      form.resetFields();
      setServices([]);
    }
  }, [initialValues, form]);

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleAddService = () => {
    const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    setServices([
      ...services,
      {
        id: newId,
        productName: "",
        productType: "Thiết bị văn phòng",
        priceVND: 0,
        priceUSD: 0,
        vat: 10,
        afterVatVND: 0,
        afterVatUSD: 0,
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (services.length === 0) {
        form.setFields([
          {
            name: "service",
            errors: ["Vui lòng thêm ít nhất một dịch vụ!"],
          },
        ]);
        return;
      }
      onSave({
        ...values,
        id: initialValues?.id || Date.now(),
        expectedCloseDate: values.expectedCloseDate
          ? values.expectedCloseDate.format("YYYY-MM-DD")
          : "",
        service: services.map((s) => ({
          ...s,
          afterVatVND: (s.priceVND * (100 + s.vat)) / 100,
          afterVatUSD: (s.priceUSD * (100 + s.vat)) / 100,
        })),
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "productName",
      key: "productName",
      render: (_: any, record: Product, index: number) => (
        <Input
          value={record.productName}
          onChange={(e) => {
            const newServices = [...services];
            newServices[index].productName = e.target.value;
            setServices(newServices);
          }}
          placeholder="Nhập tên dịch vụ"
        />
      ),
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "productType",
      key: "productType",
      render: (_: any, record: Product, index: number) => (
        <Select
          value={record.productType}
          onChange={(value) => {
            const newServices = [...services];
            newServices[index].productType = value;
            setServices(newServices);
          }}
          style={{ width: "100%" }}
        >
          <Option value="Thiết bị văn phòng">Thiết bị văn phòng</Option>
          <Option value="Vật tư tiêu hao">Vật tư tiêu hao</Option>
        </Select>
      ),
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.priceVND}
          onChange={(e) => {
            const newServices = [...services];
            newServices[index].priceVND = Number(e.target.value);
            setServices(newServices);
          }}
          placeholder="Nhập giá VND"
        />
      ),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.priceUSD}
          onChange={(e) => {
            const newServices = [...services];
            newServices[index].priceUSD = Number(e.target.value);
            setServices(newServices);
          }}
          placeholder="Nhập giá USD"
        />
      ),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.vat}
          onChange={(e) => {
            const newServices = [...services];
            newServices[index].vat = Number(e.target.value);
            setServices(newServices);
          }}
          placeholder="Nhập VAT (%)"
        />
      ),
    },
    {
      title: "Giá sau VAT (VND)",
      key: "afterVatVND",
      render: (_: any, record: Product) =>
        ((record.priceVND * (100 + record.vat)) / 100).toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      key: "afterVatUSD",
      render: (_: any, record: Product) =>
        ((record.priceUSD * (100 + record.vat)) / 100).toLocaleString("en-US"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Button danger type="text" onClick={() => handleDelete(record.id)}>
          ❌
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          {saveText}
        </Button>,
      ]}
      width={1000}
    >
      <Form form={form} layout="vertical" labelAlign="left">
        <Card title={cardTitle} className="card-section">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên cơ hội"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên cơ hội!" }]}
              >
                <Input placeholder="Nhập tên cơ hội" />
              </Form.Item>
              <Form.Item
                label="Tên liên hệ"
                name="contactName"
                rules={[{ required: true, message: "Vui lòng nhập tên liên hệ!" }]}
              >
                <Input placeholder="Nhập tên liên hệ" />
              </Form.Item>
              <Form.Item
                label="Công ty"
                name="company"
                rules={[{ required: true, message: "Vui lòng nhập công ty!" }]}
              >
                <Input placeholder="Nhập công ty" />
              </Form.Item>
              <Form.Item
                label="Giá trị dự kiến (VND)"
                name="expectedValue"
                rules={[{ required: true, message: "Vui lòng nhập giá trị dự kiến!" }]}
              >
                <Input type="number" placeholder="Nhập giá trị dự kiến" />
              </Form.Item>
              <Form.Item
                label="Ngày chốt dự kiến"
                name="expectedCloseDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày chốt dự kiến!" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xác suất (%)"
                name="probability"
                rules={[{ required: true, message: "Vui lòng nhập xác suất!" }]}
              >
                <Input type="number" placeholder="Nhập xác suất" min={0} max={100} />
              </Form.Item>
              <Form.Item
                label="Ưu tiên"
                name="priority"
                rules={[{ required: true, message: "Vui lòng chọn mức ưu tiên!" }]}
              >
                <Select style={{ width: "100%" }} placeholder="Chọn mức ưu tiên">
                  <Option value="High">Cao</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="Low">Thấp</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Nhân viên phụ trách"
                name="owner"
                rules={[{ required: true, message: "Vui lòng nhập nhân viên phụ trách!" }]}
              >
                <Input placeholder="Nhập nhân viên phụ trách" />
              </Form.Item>
              <Form.Item
                label="Giai đoạn"
                name="stage"
                rules={[{ required: true, message: "Vui lòng chọn giai đoạn!" }]}
              >
                <Select style={{ width: "100%" }} placeholder="Chọn giai đoạn">
                  <Option value="Mới">Mới</Option>
                  <Option value="Đạt yêu cầu">Đạt yêu cầu</Option>
                  <Option value="Đàm phán">Đàm phán</Option>
                  <Option value="Đóng">Đóng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="card-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>Danh sách dịch vụ</h3>
            <Button type="primary" onClick={handleAddService}>
              <PlusOutlined /> Thêm dịch vụ
            </Button>
          </div>
          <Form.Item
            name="service"
            rules={[{ validator: () => (services.length > 0 ? Promise.resolve() : Promise.reject(new Error("Vui lòng thêm ít nhất một dịch vụ!"))) }]}
          >
            <Table dataSource={services} columns={columns} pagination={false} bordered size="small" />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default OpportunityForm;