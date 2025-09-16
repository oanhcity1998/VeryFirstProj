import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Tabs,
  Table,
  Segmented,
  Breadcrumb,
  Space,
  Button,
  Timeline,
  Modal,
  message,
  Card,
  Steps,
  Popover,
  Dropdown,
  Select,
  DatePicker,
  Form,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "../../../app/routes";
import "./OpportunityDetail.css";
import { fmt } from "@/components/CRM/QuotationForm/QuotationForm";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { ColumnsType } from "antd/es/table";

dayjs.extend(isBetween);

// Fake data
const fakeData = [
  {
    id: 1,
    name: "Triển khai ERP cho công ty ABC",
    company: "Công ty ABC",
    expectedValue: 500000000,
    expectedCloseDate: "2025-09-15",
    service: [
      {
        id: 1,
        productName: "Máy in HP 107w",
        productType: "Thiết bị văn phòng",
        priceVND: 5000000,
        priceUSD: 210,
        vat: 10,
        afterVatVND: 5500000,
        afterVatUSD: 231,
      },
      {
        id: 2,
        productName: "Giấy A4 Double A",
        productType: "Vật tư tiêu hao",
        priceVND: 250000,
        priceUSD: 11,
        vat: 5,
        afterVatVND: 262500,
        afterVatUSD: 11.55,
      },
    ],
    contact: {
      key: "1",
      id: "1",
      contactName: "Nguyễn Văn A",
      customerName: "Công ty TNHH ABC",
      phone: "0901234567",
      email: "vana@abc.com",
      title: "Giám đốc",
      mainContact: "Nguyễn Văn A",
      note: "Khách hàng lâu năm",
    },
    probability: 70,
    priority: "Cao",
    owner: "Phạm Văn Quyết",
    stage: "Đàm phán",
  },
];

// Định nghĩa kiểu Activity
interface Activity {
  id: number;
  date: string;
  method: "Gọi" | "Gặp mặt";
  summary: string;
  owner: string;
  note: string;
}

const initialActivities: Activity[] = [
  {
    id: 1,
    date: "2025-09-01",
    method: "Gọi",
    summary: "Gọi điện cho khách hàng",
    owner: "Nguyễn Văn A",
    note: "",
  },
  {
    id: 2,
    date: "2025-09-02",
    method: "Gặp mặt",
    summary: "Gửi proposal",
    owner: "Phạm Văn Quyết",
    note: "Khách hàng yêu cầu demo",
  },
];

export const opportunityStages = ["Mới", "Đạt yêu cầu", "Đàm phán", "Đóng", "Mất", "Đạt"] as const;

const OpportunityDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [losing, setLosing] = useState(false);
  const [reasonLose, setReasonLose] = useState("");
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);

  const opportunity = fakeData.find((o) => o.id === Number(id));
  const [currentStage, setCurrentStage] = useState(0);
  const [stageClose, setStageClose] = useState<"Mất" | "Đạt" | "Đóng">("Đóng");

  // Activities state
  const [activities, setActivities] = useState(initialActivities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [filterMethod, setFilterMethod] = useState<string | undefined>();
  const [filterDateRange, setFilterDateRange] = useState(null);

  // Delete Activities state
  const [deletingActivities, setDeletingActivities] = useState(false);
  const [deleteActivitiesOpen, setDeleteActivitiesOpen] = useState(false);
  const [selectedActivitiesRowKeys, setSelectedActivitiesRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (editingActivity) {
      form.setFieldsValue({
        ...editingActivity,
        date: dayjs(editingActivity.date),
      });
    } else {
      form.resetFields();
    }
  }, [editingActivity, form]);

  const filteredActivities = activities.filter((a) => {
    const methodMatch = filterMethod ? a.method === filterMethod : true;
    const dateMatch = filterDateRange
      ? dayjs(a.date).isBetween(filterDateRange[0], filterDateRange[1], "day", "[]")
      : true;
    return methodMatch && dateMatch;
  });

  // 👉 Xóa
  const handleActivitiesDelete = async () => {
    try {
      setDeletingActivities(true);
      setActivities((prev) => prev.filter((item) => !selectedActivitiesRowKeys.includes(item.id)));
      setSelectedActivitiesRowKeys([]);
    } catch (err) {
      message.error("Không thể xóa cơ hội");
    } finally {
      setDeletingActivities(false);
      setDeleteActivitiesOpen(false);
    }
  };

  const activityColumns: ColumnsType<Activity> = [
    { title: "Ngày gặp mặt", dataIndex: "date" },
    { title: "Hình thức", dataIndex: "method" },
    { title: "Tóm tắt nội dung", dataIndex: "summary" },
    { title: "Người thực hiện", dataIndex: "owner" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      align: "center",
      render: (_, record: Activity) => (
        <Button
          type="link"
          onClick={() => {
            setEditingActivity(record);
            setIsModalOpen(true);
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  if (!opportunity) return <p>Không tìm thấy cơ hội</p>;

  const productColumns = [
    { title: "Sản phẩm", dataIndex: "productName" },
    { title: "Loại sản phẩm", dataIndex: "productType" },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      render: (value: number) => fmt(value),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      render: (value: number) => fmt(value),
    },
    { title: "VAT (%)", dataIndex: "vat" },
    {
      title: <p style={{ fontWeight: "bold" }}>Giá sau VAT (VND)</p>,
      dataIndex: "afterVatVND",
      render: (value: number) => fmt(value),
    },
    {
      title: <p style={{ fontWeight: "bold" }}>Giá sau VAT (USD)</p>,
      dataIndex: "afterVatUSD",
      render: (value: number) => fmt(value),
    },
  ];

  const handelLose = async (reason: string) => {
    try {
      setLosing(true);
      setCurrentStage(opportunityStages.length - 2);
      setStageClose("Mất");
      // alert(reason);
      // message.success("Đã xóa cơ hội");
      // navigate(ROUTES_APP.crm.opportunityList);
    } catch (err) {
      // message.error("Không thể xóa cơ hội");
    } finally {
      setLosing(false);
      setIsLoseModalOpen(false);
    }
  };

  const reasons = [
    { key: "1", label: "Khách hàng không quan tâm" },
    { key: "2", label: "Ngân sách hạn chế" },
    { key: "3", label: "Chọn nhà cung cấp khác" },
  ];

  return (
    <div className="opportunity-detail-container">
      {/* Header */}
      <div className="opportunity-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.opportunityList}>Danh sách cơ hội</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{opportunity.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card
        title="Giai đoạn"
        extra={
          <Popover
            content={
              <Space direction="vertical">
                <Button
                  disabled={currentStage > opportunityStages.length - 3}
                  type="primary"
                  onClick={() => setIsLoseModalOpen(true)}
                  danger
                >
                  Mất
                </Button>
                <Button
                  disabled={currentStage > opportunityStages.length - 3}
                  type="primary"
                  style={{ backgroundColor: "#60A917", borderColor: "#60A917" }}
                  onClick={() => {
                    setCurrentStage(opportunityStages.length - 1);
                    setStageClose("Đạt");
                  }}
                >
                  Đạt
                </Button>

                <Modal
                  open={isLoseModalOpen}
                  title="Xác nhận Xóa"
                  onOk={() => handelLose(reasonLose)}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                    form.resetFields(); // ✅ tránh giữ giá trị cũ
                  }}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, loading: losing }}
                  centered
                >
                  <Select
                    placeholder="Chọn lý do mất cơ hội"
                    onChange={(value) => {
                      setReasonLose(value);
                    }}
                  >
                    {reasons.map((r) => (
                      <Select.Option key={r.key} value={r.label}>
                        {r.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Modal>
              </Space>
            }
            trigger="click"
          >
            <Button disabled={currentStage > opportunityStages.length - 3} type="primary">
              Xác định
            </Button>
          </Popover>
        }
        style={{ marginBottom: 16 }}
      >
        <Steps
          current={currentStage}
          items={opportunityStages.slice(0, opportunityStages.length - 2).map((title) => ({
            title: title === "Đóng" ? stageClose : title,
            disabled: title === "Đóng" || currentStage > opportunityStages.length - 3,
          }))}
          onChange={(value) => setCurrentStage(value)}
        />
      </Card>

      <Card>
        {/* Tabs */}
        <Tabs
          defaultActiveKey="general"
          items={[
            {
              key: "general",
              label: "Thông tin chung",
              children: (
                <div className="detail-form">
                  <div className="form-row">
                    <label>Tên cơ hội:</label>
                    <input value={opportunity.name} disabled />
                  </div>
                  <div className="form-row">
                    <label>Ngày dự kiến chốt:</label>
                    <input value={opportunity.expectedCloseDate} disabled />
                  </div>
                  <div className="form-row">
                    <label>Giá trị dự kiến:</label>
                    <input value={opportunity.expectedValue.toLocaleString() + " VND"} disabled />
                  </div>
                  <div className="form-row">
                    <label>Xác suất:</label>
                    <input value={`${opportunity.probability}%`} disabled />
                  </div>
                  <div className="form-row">
                    <label>Ưu tiên:</label>
                    <input value={opportunity.priority} disabled />
                  </div>
                  <div className="form-row">
                    <label>Nhân viên phụ trách:</label>
                    <input value={opportunity.owner} disabled />
                  </div>
                </div>
              ),
            },
            {
              key: "contact",
              label: "Liên hệ",
              children: (
                <div className="detail-form">
                  <div className="form-row">
                    <label>Tên liên hệ:</label>
                    <input value={opportunity.contact.contactName} disabled />
                  </div>
                  <div className="form-row">
                    <label>Chức vụ:</label>
                    <input value={opportunity.contact.title} disabled />
                  </div>
                  <div className="form-row">
                    <label>Công ty:</label>
                    <input value={opportunity.contact.customerName} disabled />
                  </div>
                  <div className="form-row">
                    <label>Số điện thoại:</label>
                    <input value={opportunity.contact.phone} disabled />
                  </div>
                  <div className="form-row">
                    <label>Email:</label>
                    <input value={opportunity.contact.email} disabled />
                  </div>
                  <div className="form-row">
                    <label>Người liên hệ chính:</label>
                    <input value={opportunity.contact.mainContact} disabled />
                  </div>
                  <div className="form-row last-row">
                    <label>Ghi chú:</label>
                    <input value={opportunity.contact.note} disabled />
                  </div>
                </div>
              ),
            },
            {
              key: "products",
              label: "Sản phẩm dự kiến",
              children: (
                <Table
                  columns={productColumns}
                  dataSource={opportunity.service}
                  rowKey="id"
                  pagination={false}
                  bordered
                />
              ),
            },
            {
              key: "activities",
              label: "Hoạt động",
              children: (
                <>
                  <div
                    style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}
                  >
                    <h3>Danh sách hoạt động</h3>

                    <Space style={{ marginBottom: 16 }}>
                      {/* Filter type  */}
                      <Select
                        placeholder="Hình thức hoạt động"
                        allowClear
                        onChange={(value) => setFilterMethod(value)}
                        style={{ width: 150 }}
                        options={[
                          { value: "Gọi", label: "Gọi" },
                          { value: "Gặp mặt", label: "Gặp mặt" },
                        ]}
                      />

                      {/* Date picker Filter */}
                      <DatePicker.RangePicker
                        style={{ height: 32 }}
                        allowClear
                        placeholder={["Từ gặp mặt ngày", "Đến ngày"]}
                        onChange={(dates) => setFilterDateRange(dates as any)}
                      />

                      {/* Delete button */}
                      <Button
                        danger
                        onClick={() => setDeleteActivitiesOpen(true)}
                        disabled={selectedActivitiesRowKeys.length === 0}
                      >
                        Xóa
                      </Button>
                      <Modal
                        open={deleteActivitiesOpen}
                        title="Xác nhận xóa"
                        onOk={handleActivitiesDelete}
                        onCancel={() => setDeleteActivitiesOpen(false)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, loading: deletingActivities }}
                        centered
                      >
                        <p>
                          Bạn có chắc muốn xóa {selectedActivitiesRowKeys.length} hoạt động này?
                          Hành động này không thể hoàn tác.
                        </p>
                      </Modal>

                      {/* Add button */}
                      <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Tạo
                      </Button>
                    </Space>
                  </div>

                  <Table<Activity>
                    rowSelection={{
                      selectedRowKeys: selectedActivitiesRowKeys,
                      onChange: (keys) => {
                        setSelectedActivitiesRowKeys(keys as number[]);
                      },
                    }}
                    columns={activityColumns}
                    dataSource={filteredActivities}
                    rowKey="id"
                    bordered
                    pagination={{ position: ["bottomCenter"] }}
                  />

                  <Modal
                    open={isModalOpen}
                    title={editingActivity ? "Sửa hoạt động" : "Thêm hoạt động"}
                    onCancel={() => {
                      setIsModalOpen(false);
                      setEditingActivity(null);
                    }}
                    onOk={() => {
                      form.validateFields().then((values) => {
                        const payload = {
                          ...values,
                          date: values.date.format("YYYY-MM-DD"), // ép về string
                        };

                        if (editingActivity?.id) {
                          setActivities((prev) =>
                            prev.map((a) =>
                              a.id === editingActivity.id ? { ...a, ...payload } : a
                            )
                          );
                        } else {
                          setActivities((prev) => [...prev, { ...payload, id: Date.now() }]);
                        }

                        setIsModalOpen(false);
                        setEditingActivity(null);
                        form.resetFields();
                      });
                    }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        ...editingActivity,
                        date: editingActivity?.date ? dayjs(editingActivity.date) : null,
                      }}
                    >
                      <Form.Item
                        label="Ngày gặp mặt"
                        name="date"
                        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>

                      <Form.Item
                        label="Hình thức"
                        name="method"
                        rules={[{ required: true, message: "Vui lòng chọn hình thức" }]}
                      >
                        <Select
                          options={[
                            { value: "Gọi", label: "Gọi" },
                            { value: "Gặp mặt", label: "Gặp mặt" },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item label="Tóm tắt nội dung" name="summary">
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Người thực hiện"
                        name="owner"
                        rules={[{ required: true, message: "Vui lòng nhập người thực hiện" }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item label="Ghi chú" name="note">
                        <Input />
                      </Form.Item>
                    </Form>
                  </Modal>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default OpportunityDetail;
