import { useState } from "react";
import { Button, Modal, message, Popover, Upload, Space, Form } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  FilterOutlined,
  InboxOutlined,
  DeleteFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import "./EmployeeList.css";
import TableEmployee from "../../../components/TableEmployee/TableEmployee";
import EmployeeForm from "../../../components/EmployeeForm/EmployeeForm";
import * as XLSX from "xlsx";
import dayjs, { Dayjs } from "dayjs";
import Search from "antd/es/input/Search";
import FilterDrawerEmployee from "../../../components/FilterEmployee/FilterDrawerEmployee";

export interface Employee {
  key: string;
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  idNumber: string;
  issueDate: string;
  issuePlace: string;
  phone: string;
  email: string;
  permanentAddress: string;
  temporaryAddress: string;
  personalTaxCode: string;
  socialInsuranceNumber: string;
  bankAccount: string;
  department: string;
  position: string;
  contractType: string;
  contractTerm: string;
  startDate: string;
  endDate: string;
  salary: string;
  bonus: string;
}

const EmployeeList: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Employee[]>([
    {
      key: "1",
      id: "82334",
      fullName: "Nguyễn Nhật Huy",
      gender: "Nam",
      birthDate: "04/12/1978",
      idNumber: "523943855",
      issueDate: "16/08/2013",
      issuePlace: "7529 E Pecan St.",
      phone: "+84 678 890 000",
      email: "huy.nguyen@example.com",
      permanentAddress: "123 Đường A, TP.HCM",
      temporaryAddress: "456 Đường B, Hà Nội",
      personalTaxCode: "123456789",
      socialInsuranceNumber: "987654321",
      bankAccount: "0987654321 - Vietcombank",
      department: "Phòng 1",
      position: "Nhân viên kinh doanh",
      contractType: "Hợp đồng xác định thời hạn",
      contractTerm: "12 tháng",
      startDate: "01/01/2020",
      endDate: "31/12/2021",
      salary: "15000000",
      bonus: "2000000",
    },
    {
      key: "2",
      id: "80938",
      fullName: "Võ Bão Châu",
      gender: "Nữ",
      birthDate: "02/01/1980",
      idNumber: "982598195",
      issueDate: "28/10/2012",
      issuePlace: "3900 Poplar Dr.",
      phone: "+84 915 343 643",
      email: "chau.vo@example.com",
      permanentAddress: "789 Đường C, Đà Nẵng",
      temporaryAddress: "101 Đường D, Huế",
      personalTaxCode: "987654321",
      socialInsuranceNumber: "123456789",
      bankAccount: "1122334455 - Techcombank",
      department: "Phòng 2",
      position: "Trưởng phòng",
      contractType: "Hợp đồng không xác định thời hạn",
      contractTerm: "",
      startDate: "01/03/2019",
      endDate: "",
      salary: "20000000",
      bonus: "3000000",
    },
    {
      key: "3",
      id: "82278",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "4",
      id: "82279",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "5",
      id: "82280",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "6",
      id: "82281",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "7",
      id: "82282",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "8",
      id: "82283",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "9",
      id: "82284",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
    {
      key: "10",
      id: "82285",
      fullName: "Lê Khánh An",
      gender: "Nữ",
      birthDate: "20/06/1988",
      idNumber: "081595952",
      issueDate: "12/06/2020",
      issuePlace: "3900 Parker Rd.",
      phone: "+84 889 988 123",
      email: "an.le@example.com",
      permanentAddress: "321 Đường E, Cần Thơ",
      temporaryAddress: "654 Đường F, Hải Phòng",
      personalTaxCode: "456789123",
      socialInsuranceNumber: "789123456",
      bankAccount: "5566778899 - BIDV",
      department: "Phòng 3",
      position: "Nhân viên kế toán",
      contractType: "Hợp đồng thử việc",
      contractTerm: "2 tháng",
      startDate: "01/07/2023",
      endDate: "30/08/2023",
      salary: "12000000",
      bonus: "1000000",
    },
  ]);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newData = data.filter((item) => !selectedRowKeys.includes(item.key));
      setData(newData);
      message.success("Đã xóa nhân sự");
    } catch (err) {
      message.error("Không thể xóa nhân sự");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (fileType !== "xlsx" && fileType !== "csv") {
      message.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const bstr = e.target?.result as string;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const requiredFields = [
        "id",
        "fullName",
        "gender",
        "birthDate",
        "idNumber",
        "issueDate",
        "issuePlace",
        "phone",
        "email",
        "permanentAddress",
        "temporaryAddress",
        "personalTaxCode",
        "socialInsuranceNumber",
        "bankAccount",
        "department",
        "position",
        "contractType",
        "contractTerm",
        "startDate",
        "endDate",
        "salary",
        "bonus",
      ];

      const headerRow = (json[0] as string[]) || [];
      const newEmployees: Employee[] = [];
      const errors: string[] = [];

      const missingHeaders = requiredFields.filter((field) => !headerRow.includes(field));
      if (missingHeaders.length > 0) {
        message.error(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i] as any[];
        const newEmployee: Partial<Employee> = {};
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof Employee;
          const value = row[j];

          if (!value && requiredFields.includes(key)) {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "${key}": Dữ liệu bị trống.`);
            rowHasError = true;
          }
          newEmployee[key] = value;
        }

        if (rowHasError) {
          continue;
        }

        newEmployee.key = `imported-${Date.now()}-${i}`;
        newEmployees.push(newEmployee as Employee);
      }

      if (errors.length > 0) {
        const errorMessages = errors.join("\n");
        message.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi trong file của bạn:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{errorMessages}</pre>
          </div>,
          5
        );
        setImporting(false);
      } else {
        setData((prevData) => [...prevData, ...newEmployees]);

        const timestamp = dayjs().format("HH:mm:ss DD/MM/YYYY");
        const currentUser = "admin";
        console.log(
          `[Import Log] Tải lên thành công ${newEmployees.length} nhân viên lúc ${timestamp} bởi ${currentUser}`
        );

        message.success(`${newEmployees.length} nhân viên đã được import thành công.`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  return (
    <>
      <div className="employee-list-header">
        <h2>Danh sách nhân sự</h2>
        <div className="employee-list-actions">
          <Search
            className="employee-search-bar"
            placeholder="Tìm kiếm theo họ và tên"
            allowClear
            name="search"
          />
          <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
            Bộ lọc
          </Button>
          <Popover
            content={
              <Space direction="vertical">
                <Button type="text" onClick={() => setImportOpen(true)}>
                  Import
                </Button>
                <Button type="text" onClick={() => console.log("Export clicked")}>
                  Export
                </Button>
              </Space>
            }
            trigger="click"
            placement="bottom"
          >
            <Button icon={<SettingOutlined />}>Cài đặt</Button>
          </Popover>
          <Modal
            open={importOpen}
            title="Import dữ liệu"
            onCancel={() => setImportOpen(false)}
            footer={null}
            centered
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={importing}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây để Import</p>
              <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
            </Upload.Dragger>
          </Modal>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteOpen(true)}
          >
            Xóa
          </Button>
          <Modal
            open={deleteOpen}
            title="Xác nhận xóa"
            onOk={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa nhân sự này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tạo
          </Button>
        </div>
      </div>

      <TableEmployee
        data={data as any[]}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      <EmployeeForm
        form={form}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={(values: Employee) => {
          const newEmployee: Employee = {
            key: `10${data.length + 1}`,
            id: `10${data.length + 1}`,
            fullName: values.fullName,
            birthDate: values.birthDate,
            phone: values.phone,
            position: values.position,
            gender: values.gender,
            email: values.email,
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
            department: values.department,
          };
          setData([...data, newEmployee]);
          setIsModalOpen(false);
        }}
        modalTitle="Thêm nhân sự"
        infoTitle="Thông tin nhân sự"
        extraInfoTitle="Thông tin bổ sung"
        contractTitle="Thông tin hợp đồng"
        cancelText="Hủy"
        saveText="Lưu"
      />

      <FilterDrawerEmployee
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={(values) => console.log("Apply filter:", values)}
      />
    </>
  );
};

export default EmployeeList;
