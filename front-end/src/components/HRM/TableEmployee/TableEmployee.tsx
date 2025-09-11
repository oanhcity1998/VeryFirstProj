import { useState } from "react";
import { Table, Form, Checkbox, Button } from "antd";
import { generatePath, Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "./TableEmployee.css";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import { ROUTES_APP } from "@/app/routes";

interface Employee {
  key: string;
  id: string;
  fullName: string;
  birthDate: string;
  phone: string;
  position: string;
  gender: string;
  email: string;
  department: string;
  idNumber: string;
  issuePlace: string;
  issueDate: string;
  permanentAddress: string;
  temporaryAddress: string;
  personalTaxCode: string;
  socialInsuranceNumber: string;
  bankAccount: string;
  contractType: string;
  contractTerm: string;
  startDate: string;
  endDate: string;
  salary: number;
  bonus: number;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
}

interface TableEmployeeProps {
  data?: Employee[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
}

const TableEmployee: React.FC<TableEmployeeProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
}) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const [employeeData, setEmployeeData] = useState<Employee[]>([...data]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  // Chỉnh sửa nhân viên
  const handleEdit = (record: Employee) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Lưu dữ liệu từ form
  const handleSave = (values: Employee) => {
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
      const newEmployee: Employee = {
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
      render: (_: any, record: Employee) => (
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
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
      fixed: "left" as const,
      width: 120,
      align: "center" as const,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      fixed: "left" as const,
      width: 150,
      align: "center" as const,
      render: (text: string, record: Employee) => (
        <Link
          to={generatePath(ROUTES_APP.hrm.employeeDetail, { id: record.id })}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Số CCCD",
      dataIndex: "idNumber",
      key: "idNumber",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ngày cấp CCCD",
      dataIndex: "issueDate",
      key: "issueDate",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Nơi cấp CCCD",
      dataIndex: "issuePlace",
      key: "issuePlace",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Địa chỉ email",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Địa chỉ thường trú",
      dataIndex: "permanentAddress",
      key: "permanentAddress",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Địa chỉ tạm trú",
      dataIndex: "temporaryAddress",
      key: "temporaryAddress",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Mã số thuế TNCN",
      dataIndex: "personalTaxCode",
      key: "personalTaxCode",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Mã số BHXH",
      dataIndex: "socialInsuranceNumber",
      key: "socialInsuranceNumber",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bankAccount",
      key: "bankAccount",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contractType",
      key: "contractType",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Thời hạn hợp đồng",
      dataIndex: "contractTerm",
      key: "contractTerm",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      key: "salary",
      width: 150,
      align: "center" as const,
      render: (value: number) => Number(value).toLocaleString("en-US"),
    },
    {
      title: "Tiền thưởng",
      dataIndex: "bonus",
      key: "bonus",
      width: 150,
      align: "center" as const,
      render: (value: number) => Number(value).toLocaleString("en-US"),
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Employee) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="employee-edit-icon"
        ></Button>
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
        scroll={{ x: 2500, y: 600 }}
        sticky={{ offsetHeader: 64 }}
        rowClassName={(record: Employee) =>
          selectedRowKeys.includes(record.key) ? "selected-row" : ""
        }
      />

      {isModalVisible && (
        <EmployeeForm
          form={form}
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => {
            console.log("abcd"), setIsModalVisible(false);
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