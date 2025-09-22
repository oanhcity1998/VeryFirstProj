import { useEffect } from "react";
import { Modal, Form, Input, Button, DatePicker, Select, Card } from "antd";
import dayjs from "dayjs";
import {
  Proposal,
  proposalTypeOptions,
  statusProposalOptions,
} from "@/views/HRM/ProposalList/ProposalList";

interface ProposalFormProps {
  onCancel: () => void;
  onSave: (values: Proposal) => void;
  proposal?: Proposal | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  onCancel,
  onSave,
  proposal,
  open,
  modalTitle = "Thêm mới đề xuất",
  cancelText = "Hủy",
  saveText = "Xác nhận",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (proposal) {
        form.setFieldsValue({
          ...proposal,
          createdDate: proposal.createdDate ? dayjs(proposal.createdDate, "DD/MM/YYYY") : null,
          approvedDate: proposal.approvedDate ? dayjs(proposal.approvedDate, "DD/MM/YYYY") : null,
          dayoff: proposal.dayoff ? dayjs(proposal.dayoff, "DD/MM/YYYY") : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [proposal, open, form]);

  const onFinish = (values: any) => {
    const isCreate = !proposal;

    const payload: Proposal = {
      key: proposal?.key ?? "P" + Date.now(),
      title: values.title,
      type: values.type,
      creator: proposal?.creator ?? "Nguyễn Văn A",
      approver: values.approver ?? proposal?.approver ?? "",
      createdDate: isCreate
        ? dayjs().format("DD/MM/YYYY")
        : proposal?.createdDate ?? dayjs().format("DD/MM/YYYY"),
      approvedDate: values.approvedDate ? values.approvedDate.format("DD/MM/YYYY") : "",
      reason: values.reason,
      dayoff: values.dayoff ? values.dayoff.format("DD/MM/YYYY") : undefined,
      status: values.status ?? proposal?.status ?? "Chưa duyệt",
    };

    onSave(payload);
    onCancel();
  };

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {saveText}
        </Button>,
      ]}
      className="width-600"
    >
      <Card title="Thông tin đề xuất">
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên đề xuất"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên đề xuất!" }]}
          >
            <Input placeholder="Nhập tên đề xuất" />
          </Form.Item>

          <Form.Item
            label="Loại đề xuất"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại đề xuất!" }]}
          >
            <Select placeholder="Chọn loại đề xuất" options={proposalTypeOptions} />
          </Form.Item>

          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do" />
          </Form.Item>

          <Form.Item
            label="Ngày nghỉ"
            name="dayoff" // 👈 thống nhất với Proposal model
            rules={[{ required: true, message: "Vui lòng chọn ngày nghỉ!" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          {/* Trường chỉ hiển thị khi edit */}
          {proposal && (
            <>
              <Form.Item label="Người duyệt" name="approver">
                <Input placeholder="Nhập tên người duyệt" />
              </Form.Item>

              <Form.Item label="Ngày duyệt" name="approvedDate">
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Trạng thái" name="status">
                <Select options={statusProposalOptions} />
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    </Modal>
  );
};

export default ProposalForm;
