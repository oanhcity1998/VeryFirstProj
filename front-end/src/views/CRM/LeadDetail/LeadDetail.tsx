import React, {useState} from "react";
import { Descriptions, Breadcrumb, Button, Card, Popover, Select, Steps, Form, Space, Modal } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./LeadDetail.css";
import { ROUTES_APP } from "../../../app/routes";

// Định nghĩa kiểu Activity
interface Activity {
  id: number;
  date: string;
  method: "Gọi" | "Gặp mặt";
  summary: string;
  owner: string;
  note: string;
}

export const opportunityStages = ["Mới", "Đạt yêu cầu", "Đàm phán", "Đóng", "Mất", "Đạt"] as const;

const LeadDetail: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageClose, setStageClose] = useState<"Mất" | "Đạt" | "Đóng">("Đóng");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [reasonLose, setReasonLose] = useState("");
  const [losing, setLosing] = useState(false);

  const { id } = useParams(); // 👈 get lead id from URL
  const [form] = Form.useForm();

  const navigate = useNavigate();


  const reasons = [
    { key: "1", label: "Khách hàng không quan tâm" },
    { key: "2", label: "Ngân sách hạn chế" },
    { key: "3", label: "Chọn nhà cung cấp khác" },
  ];

  // Mock data – later replace with API call
  const lead = {
    id,
    leadName: "Lead 1",
    contactName: "Nguyễn Thùy Linh",
    position: "Tạp vụ",
    company: "Piggy Hotel",
    email: "thuyinhvippro@gmail.com",
    phone: "0904157687",
    address: "HBT, Hanoi",
    website: "piggyhotel.com",
    source: "Website SEO",
    priority: "Cao",
    owner: "Nguyễn Văn A",
    status: "Mới",
  };

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

  return (
    <div className="lead-detail-container">
      <div className="lead-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <Breadcrumb className="lead-detail-breadcrumb" separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.leadList}>Danh sách khách hàng tiềm năng</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{lead.leadName}</Breadcrumb.Item>
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

      <Card className="lead-detail-content">
        <div className="lead-detail-title">Chi tiết {lead.leadName}</div>
        <div className="lead-detail-form">
          <div className="form-row first-row">
            <label>Tên lead:</label>
            <input value={lead.leadName} disabled />
          </div>
          <div className="form-row">
            <label>Tên liên hệ:</label>
            <input value={lead.contactName} disabled />
          </div>
          <div className="form-row">
            <label>Chức vụ:</label>
            <input value={lead.position} disabled />
          </div>
          <div className="form-row">
            <label>Công ty:</label>
            <input value={lead.company} disabled />
          </div>
          <div className="form-row">
            <label>Email:</label>
            <input value={lead.email} disabled />
          </div>
          <div className="form-row">
            <label>Số điện thoại:</label>
            <input value={lead.phone} disabled />
          </div>
          <div className="form-row">
            <label>Địa chỉ:</label>
            <input value={lead.address} disabled />
          </div>
          <div className="form-row">
            <label>Website:</label>
            <input value={lead.website} disabled />
          </div>
          <div className="form-row">
            <label>Nguồn:</label>
            <input value={lead.source} disabled />
          </div>
          <div className="form-row">
            <label>Ưu tiên:</label>
            <input value={lead.priority} disabled />
          </div>
          <div className="form-row">
            <label>Nhân viên phụ trách:</label>
            <input value={lead.owner} disabled />
          </div>
          <div className="form-row last-row">
            <label>Trạng thái:</label>
            <input value={lead.status} disabled />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeadDetail;
