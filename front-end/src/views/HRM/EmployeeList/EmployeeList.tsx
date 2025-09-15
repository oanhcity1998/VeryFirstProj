import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button, Modal, Popover, Upload, Space, Form, Pagination, Empty, Spin } from "antd";
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
  useBatchDeleteEmployeesMutation,
  useExportTemplateMutation,
  useImportEmployeesMutation,
  useExportEmployeesMutation,
} from "@/services/HRM/employee.service";
import { Employee, EmployeeRequest } from "@/models/HRM/employee.model";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

const EmployeeList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    department_id: searchParams.get("department_id") ? Number(searchParams.get("department_id")) : undefined,
    job_id: searchParams.get("job_id") ? Number(searchParams.get("job_id")) : undefined,
    status: searchParams.get("status") || undefined,
    contractType: searchParams.get("contractType") || undefined,
    gender: searchParams.get("gender") || undefined,
    employee_id: searchParams.get("employee_id") ? Number(searchParams.get("employee_id")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  });

  const { data, isLoading, isError, refetch } = useGetEmployeesQuery(queryParams);
  const [createEmployee, { isLoading: isCreating, isError: isCreateError }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [batchDeleteEmployees, { isLoading: isBatchDeleting }] = useBatchDeleteEmployeesMutation();
  const [exportTemplate, { isLoading: isExportingTemplate }] = useExportTemplateMutation();
  const [importEmployees, { isLoading: isImporting }] = useImportEmployeesMutation();
  const [exportEmployees, { isLoading: isExportingEmployees }] = useExportEmployeesMutation();

  useEffect(() => {
    if (data) {
      const cleanList = Array.isArray(data.data)
        ? data.data.filter((item) => item && item.id !== undefined && item.id !== null)
        : [];
      setEmployees(cleanList);
      if (data.meta) {
        setMeta({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
          pages: data.meta.page !== undefined ? data.meta.page : 1,
        });
      } else {
        setMeta(null);
      }
    }
  }, [data, isError, isCreateError, isUpdateError]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set("q", queryParams.q);
    if (queryParams.department_id) params.set("department_id", queryParams.department_id.toString());
    if (queryParams.job_id) params.set("job_id", queryParams.job_id.toString());
    if (queryParams.status) params.set("status", queryParams.status);
    if (queryParams.contractType) params.set("contractType", queryParams.contractType);
    if (queryParams.gender) params.set("gender", queryParams.gender);
    if (queryParams.employee_id) params.set("employee_id", queryParams.employee_id.toString());
    params.set("page", queryParams.page.toString());
    params.set("limit", queryParams.limit.toString());
    setSearchParams(params);
  }, [queryParams, setSearchParams]);

  const handleEdit = (record: Employee) => {
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
    if (selectedRowKeys.length === 0) return;
    try {
      setDeleting(true);
      const employeeIds = selectedRowKeys.map((id) => parseInt(id));
      const response = await batchDeleteEmployees(employeeIds).unwrap();
      if (response.error) {
        throw new Error(response.error);
      }
      const newData = (employees || []).filter((item) => !selectedRowKeys.includes(item.id.toString()));
      setEmployees(newData);
      setMeta((prev) => (prev ? { ...prev, total: newData.length } : null));
      toast.success("Xóa nhân sự thành công");
    } catch (err: any) {
      console.error("Batch delete error:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      toast.error(`Không thể xóa nhân sự: ${err.message || "Lỗi không xác định"}`);
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
        generateExcel((response as { data?: Employee[] }).data || [], "employee_template.xlsx");
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
      toast.error("File không hợp lệ. Vui lòng tải file .xlsx hoặc .csv.");
      return Upload.LIST_IGNORE;
    }
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await importEmployees(formData).unwrap();
      if (response.errors && response.errors.length > 0) {
        toast.error("Có lỗi trong file của bạn");
      } else {
        toast.success(response.message || "Import nhân sự thành công");
        const result = await refetch();
        if ((result as any).data) {
          const updated = (result as any).data;
          setEmployees(updated.data || []);
          setMeta(updated.meta || null);
        }
      }
      setImportOpen(false);
    } catch (err: any) {
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
        generateExcel((response as { data?: Employee[] }).data || [], `employees_export_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
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
      contractType: values.contractType || undefined,
      gender: values.gender || undefined,
      employee_id: values.employee_id || undefined,
      page: 1,
    });
    setFilterOpen(false);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, limit: pageSize });
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
        await updateEmployee({
          id: editingEmployee.id,
          data: values,
        }).unwrap();
        toast.success("Cập nhật nhân sự thành công");
        refetch();
      } else {
        const payload: EmployeeRequest = {
          ...values,
          department_id: values.department_id && values.department_id > 0 ? values.department_id : 1,
          job_id: values.job_id && values.job_id > 0 ? values.job_id : 1,
          contract: values.contract || [],
        };
        await createEmployee(payload).unwrap();
        toast.success("Thêm nhân sự thành công");
        refetch();
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

  const showLoading = isLoading || employees === null;

  return (
    <>
      <div className="employee-list-header">
        <h2>Danh sách nhân sự</h2>
        <div className="employee-list-actions">
          <Search
            className="employee-search-bar"
            placeholder="Tìm kiếm theo họ và tên"
            allowClear
            value={queryParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }} // Standardize width
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
            okButtonProps={{ danger: true, loading: deleting || isBatchDeleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} nhân sự này? Hành động này không thể hoàn tác.</p>
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

      {showLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : employees && employees.length > 0 ? (
        <>
          <TableEmployee
            data={employees || []}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            loading={isCreating || isUpdating || isBatchDeleting}
            onEdit={handleEdit}
          />
          {meta && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
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
        queryParams={queryParams} // Pass queryParams to initialize form
      />
    </>
  );
};

export default EmployeeList;