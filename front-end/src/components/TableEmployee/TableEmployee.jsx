import { useState } from "react";
import { Table, Form, Checkbox, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./TableEmployee.css";
import EmployeeForm from "../EmployeeForm/EmployeeForm";

const TableEmployee = ({ data = [], selectedRowKeys = [], setSelectedRowKeys }) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const [employeeData, setEmployeeData] = useState([...data]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  // Chỉnh sửa nhân viên
  const handleEdit = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Lưu dữ liệu từ form
  const handleSave = (values) => {
    if (editingEmployee) {
      setEmployeeData((prev) =>
        prev.map((item) =>
          item.key === editingEmployee.key
            ? {
                ...item,
                fullName: values.fullName,
                birthDate: values.birthDate,
                phone: values.phone,
                position: values.position,
                gender: values.gender,
                email: values.email,
                department: values.department,
                idNumber: values.idNumber,
                issuePlace: values.issuePlace,
                issueDate: values.issueDate,
                permanentAddress: values.permanentAddress,
                temporaryAddress: values.temporaryAddress,
                personalTaxCode: values.personalTaxCode,
                socialInsuranceNumber: values.socialInsuranceNumber,
                bankAccount: values.bankAccount,
                contractType: values.contractType,
                contractTerm: values.contractTerm,
                startDate: values.startDate,
                endDate: values.endDate,
                salary: values.salary,
                bonus: values.bonus,
                updatedAt: dayjs(),
              }
            : item
        )
      );
    } else {
      const newEmployee = {
        key: Date.now().toString(),
        id: `10${employeeData.length + 1}`, // Tạo ID tự động
        fullName: values.fullName,
        birthDate: values.birthDate,
        phone: values.phone,
        position: values.position,
        gender: values.gender,
        email: values.email,
        department: values.department,
        idNumber: values.idNumber,
        issuePlace: values.issuePlace,
        issueDate: values.issueDate,
        permanentAddress: values.permanentAddress,
        temporaryAddress: values.temporaryAddress,
        personalTaxCode: values.personalTaxCode,
        socialInsuranceNumber: values.socialInsuranceNumber,
        bankAccount: values.bankAccount,
        contractType: values.contractType,
        contractTerm: values.contractTerm,
        startDate: values.startDate,
        endDate: values.endDate,
        salary: values.salary,
        bonus: values.bonus,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      };
      setEmployeeData((prev) => [...prev, newEmployee]);
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
      fixed: "left",
      align: "center",
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
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      fixed: "left",
      width: 150,
      align: "center",
      render: (text, record) => <Link to={`/hrm/employee-list/${record.id}`}>{text}</Link>,
    },
    { title: "Giới tính", dataIndex: "gender", key: "gender", width: 100, align: "center" },
    { title: "Ngày sinh", dataIndex: "birthDate", key: "birthDate", width: 120, align: "center" },
    { title: "Số CCCD", dataIndex: "idNumber", key: "idNumber", width: 150, align: "center" },
    { title: "Ngày cấp CCCD", dataIndex: "issueDate", key: "issueDate", width: 150, align: "center" },
    { title: "Nơi cấp CCCD", dataIndex: "issuePlace", key: "issuePlace", width: 200, align: "center" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 150, align: "center" },
    { title: "Địa chỉ email", dataIndex: "email", key: "email", width: 200, align: "center" },
    { title: "Địa chỉ thường trú", dataIndex: "permanentAddress", key: "permanentAddress", width: 200, align: "center" },
    { title: "Địa chỉ tạm trú", dataIndex: "temporaryAddress", key: "temporaryAddress", width: 200, align: "center" },
    { title: "Mã số thuế TNCN", dataIndex: "personalTaxCode", key: "personalTaxCode", width: 150, align: "center" },
    { title: "Mã số BHXH", dataIndex: "socialInsuranceNumber", key: "socialInsuranceNumber", width: 150, align: "center" },
    { title: "Tài khoản ngân hàng", dataIndex: "bankAccount", key: "bankAccount", width: 150, align: "center" },
    { title: "Phòng ban", dataIndex: "department", key: "department", width: 120, align: "center" },
    { title: "Vị trí", dataIndex: "position", key: "position", width: 150, align: "center" },
    { title: "Loại hợp đồng", dataIndex: "contractType", key: "contractType", width: 150, align: "center" },
    { title: "Thời hạn hợp đồng", dataIndex: "contractTerm", key: "contractTerm", width: 150, align: "center" },
    { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate", width: 150, align: "center" },
    { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate", width: 150, align: "center" },
    { title: "Mức lương", dataIndex: "salary", key: "salary", width: 150, align: "center" },
    { title: "Tiền thưởng", dataIndex: "bonus", key: "bonus", width: 150, align: "center" },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
        <Table
        columns={columns}
        dataSource={employeeData}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
          showSizeChanger: false,
        }}
        rowKey="key"
        scroll={{ x: 2500 }}
        rowClassName={(record) =>
          selectedRowKeys.includes(record.key) ? "selected-row" : ""
        }
      />

        {isModalVisible && (
          <EmployeeForm
            form={form}
            employee={editingEmployee}
            onSave={handleSave}
            onCancel={() => {
              console.log("abcd"),
              setIsModalVisible(false)
            }}
            open={isModalVisible}
            modalTitle={editingEmployee ? "Chỉnh sửa nhân sự" : "Thêm nhân viên"}
            infoTitle="Thông tin nhân sự"
            extraInfoTitle="Thông tin bổ sung"
            contractTitle="Thông tin hợp đồng"
            cancelText="Hủy"
            saveText="Lưu"
          />
        )}
    </div>
  );
};

export default TableEmployee;