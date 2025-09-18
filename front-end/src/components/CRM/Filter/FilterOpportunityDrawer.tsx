import { Drawer, Form, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

interface FilterOpportunityDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: React.MouseEvent<HTMLButtonElement>) => void;
  filterPriority: string | null;
  setFilterPriority: (v: string | null) => void;
  filterStage: string | null;
  setFilterStage: (v: string | null) => void;
  filterDate: [string, string] | null;
  setFilterDate: (v: [string, string] | null) => void;
}

const { RangePicker } = DatePicker;

export const FilterOpportunityDrawer = ({
  open,
  onClose,
  onConfirm,
  filterPriority,
  setFilterPriority,
  filterStage,
  setFilterStage,
  filterDate,
  setFilterDate,
}: FilterOpportunityDrawerProps) => {
  return (
    <Drawer
      title="Bộ lọc cơ hội"
      placement="right"
      onClose={onClose}
      open={open}
      className="width-350"
    >
      <Form layout="vertical">
        <Form.Item label="Ngày dự kiến chốt">
          <RangePicker
            className="full-width"
            format="YYYY-MM-DD"
            value={filterDate ? [dayjs(filterDate[0]), dayjs(filterDate[1])] : undefined}
            onChange={(dates) =>
              setFilterDate(
                dates ? [dates[0]!.format("YYYY-MM-DD"), dates[1]!.format("YYYY-MM-DD")] : null
              )
            }
          />
        </Form.Item>

        <Form.Item label="Ưu tiên">
          <Select
            allowClear
            value={filterPriority ?? undefined}
            onChange={(val) => setFilterPriority(val || null)}
          >
            <Select.Option value="High">High</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Low">Low</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Giai đoạn">
          <Select
            allowClear
            value={filterStage ?? undefined}
            onChange={(val) => setFilterStage(val || null)}
          >
            <Select.Option value="Qualification">Qualification</Select.Option>
            <Select.Option value="Proposal">Proposal</Select.Option>
            <Select.Option value="Negotiation">Negotiation</Select.Option>
            <Select.Option value="Closed Won">Closed Won</Select.Option>
            <Select.Option value="Closed Lost">Closed Lost</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" onClick={onConfirm} block>
          Lọc
        </Button>
      </Form>
    </Drawer>
  );
};
