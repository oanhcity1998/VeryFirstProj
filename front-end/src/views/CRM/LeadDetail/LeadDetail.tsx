import React, { useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Popover,
  Select,
  Steps,
  Form,
  Space,
  Modal,
  Input,
  Checkbox,
  Row,
  Col,
} from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
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

// ✅ Modal chuyển đổi
const ConvertLeadModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [customerOption, setCustomerOption] = useState<"new" | "update" | null>(null);
  const [contactOption, setContactOption] = useState<"new" | "update" | null>(null);
  const [opportunityOption, setOpportunityOption] = useState<"new" | "update" | null>(null);

  return (
    <Modal
      title="Chuyển đổi khách hàng tiềm năng"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary">
          Lưu
        </Button>,
      ]}
    >
      <Card>
      {/* Khách hàng */}
      <Row className="option-row">
        <h3 className="option-label">Khách hàng</h3>
          <Checkbox
            checked={customerOption === "new"}
            onChange={() => setCustomerOption("new")}
          >
            Tạo mới
          </Checkbox>
          <Checkbox
            checked={customerOption === "update"}
            onChange={() => setCustomerOption("update")}
          >
            Cập nhật
          </Checkbox>
      </Row>

      {customerOption === "new" && (
        <Card>
          <Form layout="horizontal" 
            labelCol={{ span: 8 }} 
            wrapperCol={{ span: 16 }} 
            labelAlign="left" 
            className="convert-form"
            >
              <Form.Item label="Tên khách hàng"><Input /></Form.Item>
              <Form.Item label="Số điện thoại"><Input /></Form.Item>
              <Form.Item label="Email"><Input /></Form.Item>
          </Form>
        </Card>
      )}

        {customerOption === "update" && (
          <Card className="update-card">
            <Form.Item label="Tên khách hàng" className="cutomer-name">
              <Select options={[{ value: "Piggy Hotel", label: "Piggy Hotel" }]} />
            </Form.Item>
          </Card>
        )}

        {/* Liên hệ */}
        <div className="option-row">
          <h3 className="option-label">Liên hệ</h3>
          <Checkbox checked={contactOption === "new"} onChange={() => setContactOption("new")}>
            Tạo mới
          </Checkbox>
          <Checkbox
            checked={contactOption === "update"}
            onChange={() => setContactOption("update")}
          >
            Cập nhật
          </Checkbox>
        </div>

      {contactOption === "new" && (
        <Card>
          <Form layout="horizontal" 
            labelCol={{ span: 8 }} 
            wrapperCol={{ span: 16 }} 
            labelAlign="left" 
            className="convert-form"
            >
              <Form.Item label="Tên liên hệ"><Input /></Form.Item>
              <Form.Item label="Số điện thoại"><Input /></Form.Item>
              <Form.Item label="Email"><Input /></Form.Item>
          </Form>
        </Card>
      )}

        {contactOption === "update" && (
          <Card className="update-card">
            <Form.Item label="Tên liên hệ">
              <Select options={[{ value: "Nguyễn Thùy Linh", label: "Nguyễn Thùy Linh" }]} />
            </Form.Item>
          </Card>
        )}

        {/* Cơ hội */}
        <div className="option-row">
          <h3 className="option-label">Cơ hội</h3>
          <Checkbox
            checked={opportunityOption === "new"}
            onChange={() => setOpportunityOption("new")}
          >
            Tạo mới
          </Checkbox>
          <Checkbox
            checked={opportunityOption === "update"}
            onChange={() => setOpportunityOption("update")}
          >
            Cập nhật
          </Checkbox>
        </div>

      {opportunityOption === "new" && (
        <Card>
          <Form layout="horizontal" 
            labelCol={{ span: 8 }} 
            wrapperCol={{ span: 16 }} 
            labelAlign="left" 
            className="convert-form"
            >
              <Form.Item label="Tên cơ hội"><Input /></Form.Item>
              <Form.Item label="Giai đoạn"><Select options={[{ value: "Mới", label: "Mới" }]} /></Form.Item>
          </Form>
        </Card>
      )}

        {opportunityOption === "update" && (
          <Card className="update-card">
            <Form.Item label="Tên cơ hội">
              <Select options={[{ value: "Deal 1", label: "Deal 1" }]} />
            </Form.Item>
          </Card>
        )}
      </Card>
    </Modal>
  );
};

const LeadDetail: React.FC = () => {
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageClose, setStageClose] = useState<"Mất" | "Đạt" | "Đóng">("Đóng");
  const [reasonLose, setReasonLose] = useState("");
  const [losing, setLosing] = useState(false);

  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const reasons = [
    { key: "1", label: "Khách hàng không quan tâm" },
    { key: "2", label: "Ngân sách hạn chế" },
    { key: "3", label: "Chọn nhà cung cấp khác" },
  ];

  // Mock data
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
    } finally {
      setLosing(false);
      setIsLoseModalOpen(false);
      setReasonLose(""); // ✅ reset when closed
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <Breadcrumb className="detail-breadcrumb" separator=">">
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
              <Space direction="vertical" className="popover-buttons">
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
                  className="green-btn"
                  onClick={() => setIsConvertModalOpen(true)}
                >
                  Chuyển đổi
                </Button>
              </Space>
            }
            trigger="click"
          >
            <Button disabled={currentStage > opportunityStages.length - 3} type="primary">
              Xác định
            </Button>
          </Popover>
        }
        className="margin-bottom-16"
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

      <Card className="detail-content">
        <div className="detail-title">Chi tiết {lead.leadName}</div>
        <div className="detail-form">
          <div className="form-row first-row">
            <label>Tên khách hàng tiềm năng:</label>
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

      {/* Lose Modal */}
      <Modal
        open={isLoseModalOpen}
        title="Lí do mất khách hàng tiềm năng"
        onOk={() => handelLose(reasonLose)}
        onCancel={() => {
          setIsLoseModalOpen(false);
          setReasonLose(""); // ✅ reset when closed
        }}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          type: "primary",
          loading: losing,
          disabled: !reasonLose, // ✅ disable until selected
        }}
        cancelButtonProps={{ type: "default" }}
        centered
      >
        <Form layout="vertical" className="reason-form">
          <Card>
            <Form.Item label="Lí do">
              <Select
                placeholder="Chọn lí do"
                onChange={(value) => setReasonLose(value)}
                value={reasonLose}
              >
                {reasons.map((r) => (
                  <Select.Option key={r.key} value={r.label}>
                    {r.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
        </Form>
      </Modal>

      {/* Convert Modal */}
      <ConvertLeadModal open={isConvertModalOpen} onClose={() => setIsConvertModalOpen(false)} />
    </div>
  );
};

export default LeadDetail;
