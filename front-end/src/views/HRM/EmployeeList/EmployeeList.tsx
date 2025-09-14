import { useEffect, useState } from "react";
import { Button, Modal, Popover, Upload, Space, Form, Pagination, Empty } from "antd";
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
import { useCreateEmployeeMutation, useGetEmployeesQuery, useDeleteEmployeeMutation } from "@/services/HRM/employee.service";
import { setEmployees, setError } from "@/redux/HRM/slices/employeeSlice";
import { Employee, EmployeeCreateRequest, EmployeeResponse } from "@/models/HRM/employee.model";

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
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [queryParams, setQueryParams] = useState({
    q: "",
    department_id: undefined,
    job_id: undefined,
    status: undefined,
    page: 1,
    limit: 10,
  });

  const dispatch = useAppDispatch();
  const { employees, meta, error } = useAppSelector((state) => state.employee);

  const { data, isLoading, isError } = useGetEmployeesQuery(queryParams);
  const [createEmployee, { isLoading: isCreating, isError: isCreateError }] = useCreateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  useEffect(() => {
    if (data) dispatch(setEmployees(data));
    if (isError || isCreateError) {
      dispatch(setError("Failed to fetch or create employees"));
      toast.error("Failed to fetch or create employees");
    }
  }, [data, isError, isCreateError, dispatch]);

  const handleEdit = (record: Employee) => {
    const mappedEmployee: EmployeeCreateRequest = {
      name: record.name,
      code: record.code,
      birthday: record.birthday,
      gender: record.gender,
      work_phone: record.work_phone,
      work_email: record.work_email,
      department_id: record.department_id && record.department_id > 0 ? record.department_id : 1,
      job_id: record.job_id && record.job_id > 0 ? record.job_id : 1,
      id_number: record.id_number,
      id_issued_place: record.id_issued_place,
      id_issued_date: record.id_issued_date,
      permanent_address: record.permanent_address,
      temporary_address: record.temporary_address || "",
      tax_id: record.tax_id || "",
      insurance_id: record.insurance_id || "",
      bank_account: record.bank_account || "",
      contract: {
        name: record.contract[0]?.name || "",
        contract_type: (record.contract[0]?.contract_type as "Hợp đồng lao động xác định thời hạn" | "Hợp đồng lao động không xác định thời hạn") || "",
        contract_term: record.contract[0]?.contract_term || "",
        date_start: record.contract[0]?.date_start || "",
        date_end: record.contract[0]?.date_end || "",
        wage: record.contract[0]?.wage || 0,
        bonus: record.contract[0]?.bonus || 0,
      },
    };
    setEditingEmployee(record);
    form.setFieldsValue(mappedEmployee);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const promises = selectedRowKeys.map((id) => deleteEmployee(parseInt(id)).unwrap());
      const results = await Promise.all(promises);

      // Check results for any errors
      const hasError = results.some((result) => "error" in result);
      if (!hasError) {
        const newData = employees.filter((item) => !selectedRowKeys.includes(item.id.toString()));
        const newResponse: EmployeeResponse = {
          data: newData,
          meta: { ...meta!, total: newData.length },
        };
        dispatch(setEmployees(newResponse));
        toast.success("Xóa nhân sự thành công");
      } else {
        throw new Error("Có lỗi xảy ra khi xóa nhân sự");
      }
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
        "code",
        "name",
        "gender",
        "birthday",
        "work_phone",
        "work_email",
        "department_id",
        "job_id",
        "id_number",
        "id_issued_date",
        "id_issued_place",
        "permanent_address",
        "temporary_address",
        "tax_id",
        "insurance_id",
        "bank_account",
        "contract_type",
        "date_start",
        "date_end",
        "wage",
        "bonus",
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
            newEmployee.contract = [
              {
                id: i,
                name: "",
                contract_type: row[j] as string,
                contract_term: "",
                date_start: row[j + 1] as string,
                date_end: row[j + 2] as string,
                wage: parseFloat(row[j + 3] as string) || 0,
                bonus: parseFloat(row[j + 4] as string) || 0,
              },
            ];
            j += 4;
          } else {
            newEmployee[key] = value;
          }
        }

        if (rowHasError) continue;

        newEmployee.id = parseInt(newEmployee.id as string, 10) || Date.now();
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
        const newResponse: EmployeeResponse = {
          data: [...employees, ...newEmployees],
          meta: { page: meta?.page ?? 1, limit: meta?.limit ?? 10, total: (meta?.total ?? 0) + newEmployees.length },
        };
        dispatch(setEmployees(newResponse));
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

  const handleSave = async (values: EmployeeCreateRequest) => {
    try {
      const payload = {
        ...values,
        department_id: values.department_id && values.department_id > 0 ? values.department_id : 1,
        job_id: values.job_id && values.job_id > 0 ? values.job_id : 1,
      };

      const response = await createEmployee(payload).unwrap();
      dispatch(setEmployees(response));

      toast.success(editingEmployee ? "Cập nhật nhân sự thành công" : "Thêm nhân sự thành công");

      // ✅ Chỉ đóng modal khi thành công
      setIsModalOpen(false);
      setEditingEmployee(null);
      form.resetFields();

    } catch (err) {
      toast.error("Không thể thêm hoặc cập nhật nhân sự");
    }
  };


  return (
    <>
      <div className="employee-list-header">
        <h2>Danh sách nhân sự</h2>
        <div className="employee-list-actions">
          <Search className="employee-search-bar" placeholder="Tìm kiếm theo họ và tên" allowClear onSearch={handleSearch} name="search" />
          <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>Bộ lọc</Button>
          <Popover
            content={
              <Space direction="vertical">
                <Button type="text" onClick={() => setImportOpen(true)}>Import</Button>
                <Button type="text" onClick={() => console.log("Export clicked")}>Export</Button>
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
            <Dragger name="file" multiple={false} beforeUpload={handleUpload} showUploadList={false} disabled={importing}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây để Import</p>
              <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
            </Dragger>
          </Modal>
          <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => setDeleteOpen(true)}>Xóa</Button>
          <Modal
            open={deleteOpen}
            title="Xác nhận xóa"
            onOk={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deleting || isDeleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa nhân sự này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingEmployee(null); form.resetFields(); setIsModalOpen(true); }}>Tạo</Button>
        </div>
      </div>

      {(employees?.length ?? 0) > 0 ? (
        <>
          <TableEmployee
            data={employees}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            loading={isLoading || isCreating || isDeleting}
            onEdit={handleEdit}
          />
          {meta && employees.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
          <Empty description="Không có nhân viên nào để hiển thị" />
          <p>Hiện tại không có dữ liệu nhân sự. Vui lòng thêm nhân viên mới!</p>
        </div>
      )}

      <EmployeeForm
        form={form}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingEmployee(null); form.resetFields(); }}
        onSave={handleSave}
        employee={editingEmployee ? editingEmployee : null}
        modalTitle={editingEmployee ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}
        infoTitle="Thông tin nhân sự"
        extraInfoTitle="Thông tin bổ sung"
        contractTitle="Thông tin hợp đồng"
        cancelText="Hủy"
        saveText="Lưu"
        loading={isCreating}
      />

      <FilterDrawerEmployee
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={handleFilter}
      />
    </>
  );
};

export default EmployeeList;