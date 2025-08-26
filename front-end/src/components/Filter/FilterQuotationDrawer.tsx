import React from "react";
import { Drawer, Form, Button, Select } from "antd";
// import "./FilterQuotationDrawer.css";

const { Option } = Select;

const FilterQuotationDrawer = ({
  open,
  onClose,
  onConfirm,
  filterVAT,
  setFilterVAT,
  filterProduct,
  setFilterProduct,
  filterStatus,
  setFilterStatus,
  VATOptions,
  ProductOptions,
  StatusOptions,
}) => {
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
        {/* VAT */}
        <Form.Item label="VAT" name="VAT">
          <Select
            allowClear
            style={{ width: 200 }}
            value={filterVAT}
            onChange={(val) => setFilterVAT(val)}
            options={VATOptions.map((c) => ({ label: c, value: c }))}
          />
        </Form.Item>

        {/* Sản phẩm */}
        <Form.Item label="Sản phẩm" name="productCode">
          <Select
            allowClear
            style={{ width: 200 }}
            value={filterProduct}
            onChange={(val) => setFilterProduct(val)}
            options={ProductOptions.map((c) => ({ label: c, value: c }))}
          />
        </Form.Item>

        {/* Trạng thái */}
        <Form.Item label="Trạng thái" name="status">
          <Select
            allowClear
            style={{ width: 200 }}
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={StatusOptions.map((c) => ({ label: c, value: c }))}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterQuotationDrawer;
