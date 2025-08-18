import React from "react";
import { Drawer, Form, Button, Select } from "antd";
import "./FilterDrawer.css";

const { Option } = Select;

const FilterDrawer = ({ open, onClose, onConfirm }) => {
  const [form] = Form.useForm();

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      console.log("Filter values:", values);
      onConfirm(values);
      onClose();
    });
  };

  return (
    <Drawer
      title="Bộ lọc"
      placement="right"
      open={open}
      onClose={onClose}
      width={350}
      footer={
        <div className="filter-footer">
          <Button danger onClick={onClose}>
            Huỷ
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            Xác nhận
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        {/* Tên khách hàng */}
        <Form.Item label="Tên khách hàng" name="customerName">
          <Select placeholder="Chọn khách hàng">
            <Option value="kh1">Khách hàng 1</Option>
            <Option value="kh2">Khách hàng 2</Option>
            <Option value="kh3">Khách hàng 3</Option>
          </Select>
        </Form.Item>

        {/* Mã khách hàng */}
        <Form.Item label="Mã khách hàng" name="customerCode">
          <Select placeholder="Chọn mã khách hàng">
            <Option value="001">001</Option>
            <Option value="002">002</Option>
            <Option value="003">003</Option>
          </Select>
        </Form.Item>

        {/* Trạng thái quyết toán */}
        <Form.Item label="Trạng thái quyết toán" name="taxStatus">
          <Select placeholder="Chọn trạng thái">
            <Option value="done">Đã quyết toán</Option>
            <Option value="pending">Chưa quyết toán</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterDrawer;
