import {useState} from "react"
import { Table, Form, Checkbox, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import CreateCustomerForm from "../CustomerForm/CreateCustomerForm"
import dayjs from "dayjs";

import "./TableCustomer.css"

const TableCustomer = ({ data = [], selectedRowKeys = [], setSelectedRowKeys, onEdit }) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const [customerdata, setcustomerData] = useState([...data]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form] = Form.useForm();

  // Chỉnh sửa sản phẩm
  const handleEdit = (record) => {
    setEditingCustomer(record);
    form.setFieldsValue(record); // ✅ preload values
    setIsModalVisible(true);
  };

  // Lưu dữ liệu từ form
  const handleSave = (values) => {
    if (editingProduct) {
      setcustomerData((prev) =>
        prev.map((item) =>
          item.key === editingProduct.key
            ? { ...item, ...values, updatedAt: dayjs() }
            : item
        )
      );
    } else {
      const newProduct = {
        key: Date.now().toString(),
        ...values,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      };
      setcustomerData((prev) => [...prev, newProduct]);
    }
    setIsModalVisible(false);
  };

  const columns = [
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
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left", // ✅ fixed
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.key));
            }
          }}
        />
      ),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "id",
      width: 120,
      fixed: "left", // ✅ fixed
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      width: 200,
      fixed: "left", // ✅ fixed
      render: (text, record) => <Link to={`/customerlist/${record.id}`}>{text}</Link>,
    },
    { title: "Tên DN ghi trên hợp đồng", dataIndex: "contractName", width: 200 },
    { title: "Tên DN bằng tiếng Anh", dataIndex: "englishName", width: 200 },
    { title: "Mã số thuế", dataIndex: "taxCode", width: 150 },
    { title: "Số điện thoại", dataIndex: "phone", width: 150 },
    { title: "Số fax", dataIndex: "fax", width: 150 },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "Địa chỉ", dataIndex: "address", width: 250 },
    { title: "Ngành", dataIndex: "industry", width: 180 },
    { title: "Thị trường chính", dataIndex: "market", width: 180 },
    { title: "Số lượng chi nhánh", dataIndex: "branches", width: 180 },
    { title: "Số nhân sự", dataIndex: "employees", width: 180 },
    { title: "Doanh thu TB/năm", dataIndex: "revenue", width: 180 },
    { title: "Văn bản TB/tháng", dataIndex: "documentsPerMonth", width: 180 },
    { title: "Trạng thái quyết toán thuế ", dataIndex: "taxSettlementStatus", width: 180 },
    { title: "Năm quyết toán thuế ", dataIndex: "taxSettlementYear", width: 180 },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      width: 200,
      render: (file) =>
        file ? (
          <a href={file} download target="_blank" rel="noopener noreferrer">
            📂 Tải xuống
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",   // 👈 always stick on the right
      width: 80,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => onEdit(record)}
        />
      ),
    }, 
  ];

  return (
    <div>
      <Table
      columns={columns}
      dataSource={data}
      pagination={{position: ['bottomCenter'],}} // center positioning
      rowKey="key"
      scroll={{ x: 2500, y: 600 }} // enable horizontal scroll
      rowClassName={(record) =>
        selectedRowKeys.includes(record.key) ? "selected-row" : ""
      }
    />
    
      <Modal
        title={editingCustomer ? "Sửa khách hàng" : "Thêm khách hàng"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <CreateCustomerForm form={form} onFinish={handleSave} />
      </Modal>

      {/* <Modal
        title={editingProduct ? "Sửa khách hàng" : "Thêm khách hàng"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        afterClose={() => {
          setEditingProduct(null); // reset
          form.resetFields();
        }}
      >
        <EditCustomerForm
          form={form}
          initialValues={editingProduct || {}} // ✅ if editing, pre-fill data
        />
      </Modal> */}


    </div>
  );

  
};

export default TableCustomer;
