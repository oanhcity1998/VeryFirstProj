import { useEffect, useState } from "react";
import { Button, Modal, Popover, Upload, Space, Form, Pagination } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  FilterOutlined,
  InboxOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./EmployeeList.css";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import TableEmployee from "@/components/HRM/TableEmployee/TableEmployee";
import EmployeeForm from "@/components/HRM/EmployeeForm/EmployeeForm";
import FilterDrawerEmployee from "@/components/HRM/FilterEmployee/FilterDrawerEmployee";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toast } from "react-toastify";
import { useGetEmployeesQuery } from "@/services/HRM/employee.service";
import { setEmployees, setError } from "@/redux/HRM/slices/employeeSlice";
import { Employee, EmployeeResponse } from "@/models/HRM/employee.model";

const { Dragger } = Upload;

const EmployeeList: React.FC = () => {
  const [form] = Form.useForm();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState({
    q: "",
    department_id: undefined,
    job_id: undefined,
    status: undefined,
    page: 1,
    limit: 25,
  });

  const dispatch = useAppDispatch();
  const { employees, meta, error } = useAppSelector((state) => state.employee);

  const { data, isLoading, isError } = useGetEmployeesQuery(queryParams);

  useEffect(() => {
    if (data) {
      dispatch(setEmployees(data));
    }
    if (isError) {
      dispatch(setError("Failed to fetch employees"));
      toast.error("Failed to fetch employees");
    }
  }, [data, isError, dispatch]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      const newData = employees.filter((item) => !selectedRowKeys.includes(item.id.toString()));
      dispatch(setEmployees({ employees: newData, meta: { ...meta!, total: newData.length } } as EmployeeResponse));
      toast.success("Đã xóa nhân sự");
    } catch (err) {
      toast.error("Không thể xóa nhân sự");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  const handleUpload = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();

    if (fileType !== "xlsx" && fileType !== "csv") {
      toast.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
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
        "name",
        "gender",
        "birthday",
        "work_phone",
        "work_email",
        "department_id",
        "job_id",
        "status",
        "cccd",
        "issued_date_cccd",
        "issued_place_cccd",
        "permanent_address",
        "temporary_address",
        "tax_id",
        "insurance_id",
        "bank_account",
        "x_contract_type",
        "date_start",
        "date_end",
        "wage",
        "x_bonus",
      ];

      const headerRow = (json[0] as string[]) || [];
      const newEmployees: Employee[] = [];
      const errors: string[] = [];

      const missingHeaders = requiredFields.filter((field) => !headerRow.includes(field));
      if (missingHeaders.length > 0) {
        toast.error(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
        setImporting(false);
        setImportOpen(false);
        return;
      }

      for (let i = 1; i < json.length; i++) {
        const row = json[i] as any[];
        const newEmployee: Partial<Employee> = { contract: [] };
        let rowHasError = false;

        for (let j = 0; j < headerRow.length; j++) {
          const key = headerRow[j] as keyof Employee;
          const value = row[j];

          if (!value && requiredFields.includes(key)) {
            errors.push(`Lỗi tại hàng ${i + 1}, cột "${key}": Dữ liệu bị trống.`);
            rowHasError = true;
          }
          if (key === "contract") {
            newEmployee.contract = [{
              id: i,
              x_contract_type: row[j] as string,
              x_contract_term: false,
              date_start: row[j + 1] as string,
              date_end: row[j + 2] as string,
              wage: parseFloat(row[j + 3] as string) || 0,
              x_bonus: parseFloat(row[j + 4] as string) || 0,
            }];
            j += 4; // Skip contract fields
          } else {
            newEmployee[key] = value;
          }
        }

        if (rowHasError) continue;

        newEmployee.id = parseInt(newEmployee.id as string, 10);
        newEmployee.department_id = parseInt(newEmployee.department_id as string, 10) || 0;
        newEmployee.job_id = parseInt(newEmployee.job_id as string, 10) || 0;
        newEmployees.push(newEmployee as Employee);
      }

      if (errors.length > 0) {
        toast.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi trong file của bạn:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{errors.join("\n")}</pre>
          </div>,
          { autoClose: 5000 }
        );
        setImporting(false);
      } else {
        dispatch(setEmployees({ employees: [...employees, ...newEmployees], meta: { ...meta!, total: employees.length + newEmployees.length } } as EmployeeResponse));
        const timestamp = dayjs().format("HH:mm:ss DD/MM/YYYY");
        console.log(`[Import Log] Tải lên thành công ${newEmployees.length} nhân viên lúc ${timestamp} bởi admin`);
        toast.success(`${newEmployees.length} nhân viên đã được import thành công.`);
        setImportOpen(false);
        setImporting(false);
      }
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handleFilter = (values: any) => {
    setQueryParams({
      ...queryParams,
      department_id: values.department_id || undefined,
      job_id: values.job_id || undefined,
      status: values.status || undefined,
      page: 1,
    });
    setFilterOpen(false);
  };

  const handlePageChange = (page: number) => {
    setQueryParams({ ...queryParams, page });
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
            onSearch={handleSearch}
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
            <Dragger
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
            </Dragger>
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
        data={employees as any[]}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        loading={isLoading}
      />

      <EmployeeForm
        form={form}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={(values: Employee) => {
          const newEmployee: Employee = {
            id: values.id,
            name: values.name,
            birthday: values.birthday,
            gender: values.gender,
            work_phone: values.work_phone,
            work_email: values.work_email,
            department_id: values.department_id,
            department: values.department,
            job_id: values.job_id,
            job: values.job,
            status: values.status,
            cccd: values.cccd,
            issued_date_cccd: values.issued_date_cccd,
            issued_place_cccd: values.issued_place_cccd,
            permanent_address: values.permanent_address,
            temporary_address: values.temporary_address,
            tax_id: values.tax_id,
            insurance_id: values.insurance_id,
            bank_account: values.bank_account,
            contract: [{
              id: Date.now(),
              x_contract_type: values.contract[0].x_contract_type,
              x_contract_term: values.contract[0].x_contract_term,
              date_start: values.contract[0].date_start,
              date_end: values.contract[0].date_end,
              wage: values.contract[0].wage,
              x_bonus: values.contract[0].x_bonus,
            }],
          };
          dispatch(setEmployees({ employees: [...employees, newEmployee], meta: { ...meta!, total: (meta?.total || 0) + 1 } } as EmployeeResponse));
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
        onConfirm={handleFilter}
      />

      {meta && (
        <Pagination
          current={meta.page}
          pageSize={meta.limit}
          total={meta.total}
          onChange={handlePageChange}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      )}
    </>
  );
};

export default EmployeeList;