import { useEffect, useState } from "react";
import { Button, Modal, Popover, Upload, Space, Form, Pagination, Empty } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  FilterOutlined,
  InboxOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./EmployeeList.css";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import TableEmployee from "@/components/HRM/TableEmployee/TableEmployee";
import EmployeeForm from "@/components/HRM/EmployeeForm/EmployeeForm";
import FilterDrawerEmployee from "@/components/HRM/FilterEmployee/FilterDrawerEmployee";
import { toast } from "react-toastify";
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useExportTemplateMutation,
  useImportEmployeesMutation,
  useExportEmployeesMutation,
} from "@/services/HRM/employee.service";
import { Employee, EmployeeRequest, EmployeeResponse } from "@/models/HRM/employee.model";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

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
  const [exporting, setExporting] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [employees, setEmployeesState] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  const [queryParams, setQueryParams] = useState({
    q: "",
    department_id: undefined,
    job_id: undefined,
    status: undefined,
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } = useGetEmployeesQuery(queryParams);
  const [createEmployee, { isLoading: isCreating, isError: isCreateError }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [exportTemplate, { isLoading: isExportingTemplate }] = useExportTemplateMutation();
  const [importEmployees, { isLoading: isImporting }] = useImportEmployeesMutation();
  const [exportEmployees, { isLoading: isExportingEmployees }] = useExportEmployeesMutation();

  useEffect(() => {
    if (data) {
      setEmployeesState(data.data || []);
      setMeta(data.meta || null);
    }
    if (isError || isCreateError || isUpdateError) {
      toast.error("Không thể tải, thêm hoặc cập nhật nhân sự");
    }
  }, [data, isError, isCreateError, isUpdateError]);

  const handleEdit = (record: Employee) => {
    console.log("Editing employee:", record);
    setEditingEmployee(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      birthday: record.birthday ? dayjs(record.birthday, "YYYY-MM-DD") : null,
      gender: record.gender,
      work_phone: record.work_phone,
      work_email: record.work_email,
      department_id: record.department_id && record.department_id > 0 ? record.department_id : undefined,
      job_id: record.job_id && record.job_id > 0 ? record.job_id : undefined,
      status: record.status,
      id_number: record.id_number,
      id_issued_place: record.id_issued_place,
      id_issued_date: record.id_issued_date ? dayjs(record.id_issued_date, "YYYY-MM-DD") : null,
      permanent_address: record.permanent_address,
      temporary_address: record.temporary_address || "",
      tax_id: record.tax_id || "",
      insurance_id: record.insurance_id || "",
      bank_account: record.bank_account || "",
      contracts: record.contract.map((c) => ({
        id: c.id,
        name: c.name || "",
        contract_type: c.contract_type || "",
        contract_term: c.contract_term || "",
        date_start: c.date_start ? dayjs(c.date_start, "YYYY-MM-DD") : null,
        date_end: c.date_end ? dayjs(c.date_end, "YYYY-MM-DD") : null,
        wage: c.wage || 0,
        bonus: c.bonus || 0,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const promises = selectedRowKeys.map((id) => deleteEmployee(parseInt(id)).unwrap());
      const results = await Promise.all(promises);

      const hasError = results.some((result) => "error" in result);
      if (!hasError) {
        const newData = employees.filter((item) => !selectedRowKeys.includes(item.id.toString()));
        setEmployeesState(newData);
        setMeta((prev) => prev ? { ...prev, total: newData.length } : null);
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

  const generateExcel = (data: Employee[], filename: string) => {
    const headers = [
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
      "contract_1_name",
      "contract_1_type",
      "contract_1_term",
      "contract_1_date_start",
      "contract_1_date_end",
      "contract_1_wage",
      "contract_1_bonus",
      "contract_2_name",
      "contract_2_type",
      "contract_2_term",
      "contract_2_date_start",
      "contract_2_date_end",
      "contract_2_wage",
      "contract_2_bonus",
    ];

    const rows = data.map((employee) => {
      const row: any = { ...employee };
      employee.contract.forEach((contract, index) => {
        row[`contract_${index + 1}_name`] = contract.name || "";
        row[`contract_${index + 1}_type`] = contract.contract_type || "";
        row[`contract_${index + 1}_term`] = contract.contract_term || "";
        row[`contract_${index + 1}_date_start`] = contract.date_start || "";
        row[`contract_${index + 1}_date_end`] = contract.date_end || "";
        row[`contract_${index + 1}_wage`] = contract.wage || 0;
        row[`contract_${index + 1}_bonus`] = contract.bonus || 0;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  const handleExportTemplate = async () => {
    try {
      setExporting(true);
      const response = await exportTemplate().unwrap();
      if (response instanceof Blob) {
        if (response.size === 0) {
          throw new Error("File Excel trả về rỗng");
        }
        saveAs(response, "employee_template.xlsx");
        toast.success("Tải mẫu Excel thành công");
      } else {
        generateExcel(response.data || [], "employee_template.xlsx");
        toast.success("Tải mẫu Excel thành công");
      }
    } catch (err: any) {
      console.error("Export template error:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      toast.error("Không thể tải mẫu Excel: " + (err.message || "Lỗi không xác định"));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "xlsx" && fileType !== "csv") {
      toast.error("File không hợp lệ. Vui lòng tải lên file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importEmployees(formData).unwrap();
      if (response.errors && response.errors.length > 0) {
        toast.error(
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <p>Có lỗi trong file của bạn:</p>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {response.errors.join("\n")}
            </pre>
          </div>,
          { autoClose: 5000 }
        );
      } else {
        toast.success(response.message || "Import nhân sự thành công");
        // Refetch data after successful import
        const updatedData = await useGetEmployeesQuery(queryParams).refetch().unwrap();
        setEmployeesState(updatedData.data || []);
        setMeta(updatedData.meta || null);
      }
      setImportOpen(false);
    } catch (err: any) {
      console.error("Import error:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      toast.error("Không thể import nhân sự: " + (err.message || "Lỗi không xác định"));
    } finally {
      setImporting(false);
    }
    return false;
  };

  const handleExportEmployees = async () => {
    try {
      setExporting(true);
      const response = await exportEmployees(queryParams).unwrap();
      if (response instanceof Blob) {
        if (response.size === 0) {
          throw new Error("File Excel trả về rỗng");
        }
        saveAs(response, `employees_export_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
        toast.success("Xuất danh sách nhân sự thành công");
      } else {
        generateExcel(response.data || [], `employees_export_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
        toast.success("Xuất danh sách nhân sự thành công");
      }
    } catch (err: any) {
      console.error("Export employees error:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      toast.error("Không thể xuất danh sách nhân sự: " + (err.message || "Lỗi không xác định"));
    } finally {
      setExporting(false);
    }
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

  const handleSave = async (values: EmployeeRequest) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const requiredFields = [
        "name",
        "code",
        "birthday",
        "gender",
        "work_phone",
        "work_email",
        "department_id",
        "job_id",
        "id_number",
        "id_issued_place",
        "id_issued_date",
        "permanent_address",
      ];

      const missingFields = requiredFields.filter((field) => !values[field as keyof EmployeeRequest]);
      if (missingFields.length > 0) {
        toast.error(`Vui lòng điền các trường bắt buộc: ${missingFields.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      if (!values.contract || values.contract.length === 0) {
        toast.error("Vui lòng thêm ít nhất một hợp đồng!");
        setIsSubmitting(false);
        return;
      }

      for (const [index, contract] of values.contract.entries()) {
        if (!contract.contract_type || !contract.date_start || contract.wage === undefined || contract.bonus === undefined) {
          toast.error(`Hợp đồng ${index + 1} thiếu các trường bắt buộc: loại hợp đồng, ngày bắt đầu, mức lương, hoặc tiền thưởng`);
          setIsSubmitting(false);
          return;
        }
      }

      if (editingEmployee) {
        console.log("Update payload:", { id: editingEmployee.id, data: values });
        const response = await updateEmployee({
          id: editingEmployee.id,
          data: values,
        }).unwrap();
        setEmployeesState((prev) =>
          prev.map((emp) =>
            emp.id === editingEmployee.id ? { ...emp, ...response } : emp
          )
        );
        toast.success("Cập nhật nhân sự thành công");
      } else {
        const payload: EmployeeRequest = {
          ...values,
          department_id: values.department_id && values.department_id > 0 ? values.department_id : 1,
          job_id: values.job_id && values.job_id > 0 ? values.job_id : 1,
          contract: values.contract || [],
        };
        console.log("Create payload:", payload);
        const response = await createEmployee(payload).unwrap();
        setEmployeesState((prev) => [...prev, response as Employee]);
        setMeta((prev) => prev ? { ...prev, total: prev.total + 1 } : null);
        toast.success("Thêm nhân sự thành công");
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      form.resetFields();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(`Không thể ${editingEmployee ? "cập nhật" : "thêm"} nhân sự: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setIsSubmitting(false);
    }
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
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="text"
                  onClick={handleExportTemplate}
                  disabled={exporting || isExportingTemplate}
                  icon={<DownloadOutlined />}
                  block
                >
                  Tải mẫu Excel
                </Button>
                <Button
                  type="text"
                  onClick={() => setImportOpen(true)}
                  disabled={importing || isImporting}
                  icon={<UploadOutlined />}
                  block
                >
                  Nhập nhân sự
                </Button>
                <Button
                  type="text"
                  onClick={handleExportEmployees}
                  disabled={exporting || isExportingEmployees}
                  icon={<DownloadOutlined />}
                  block
                >
                  Xuất nhân sự
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
            title="Import dữ liệu nhân sự"
            onCancel={() => setImportOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setImportOpen(false)}>
                Hủy
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={importing || isImporting}
                disabled={importing || isImporting}
              >
                Tải lên
              </Button>,
            ]}
            centered
            width={600}
            bodyStyle={{ padding: "24px" }}
          >
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={handleImport}
              showUploadList={false}
              disabled={importing || isImporting}
              style={{
                border: "1px dashed #d9d9d9",
                borderRadius: "4px",
                background: "#fafafa",
                padding: "16px",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#1890ff", fontSize: "48px" }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: "16px", color: "#000" }}>
                Kéo thả file hoặc click để tải lên
              </p>
              <p className="ant-upload-hint" style={{ fontSize: "14px", color: "#888" }}>
                Chỉ chấp nhận file .xlsx hoặc .csv
              </p>
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
            okButtonProps={{ danger: true, loading: deleting || isDeleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa nhân sự này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingEmployee(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      {(employees?.length ?? 0) > 0 ? (
        <>
          <TableEmployee
            data={employees}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            loading={isLoading || isCreating || isUpdating || isDeleting}
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
        onCancel={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
          form.resetFields();
        }}
        onSave={handleSave}
        employee={editingEmployee}
        modalTitle={editingEmployee ? "Chỉnh sửa nhân sự" : "Thêm nhân sự"}
        infoTitle="Thông tin nhân sự"
        extraInfoTitle="Thông tin bổ sung"
        contractTitle="Thông tin hợp đồng"
        cancelText="Hủy"
        saveText="Lưu"
        loading={isSubmitting || isCreating || isUpdating}
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