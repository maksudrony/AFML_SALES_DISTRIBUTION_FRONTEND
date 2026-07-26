import { PieChart } from '../../../components/charts/PieChart';

interface ChannelWiseSalesItem {
  channelName: string;
  salesQty: number;
}

interface ChannelWiseSalesChartProps {
  data: ChannelWiseSalesItem[];
}

export const ChannelWiseSalesPieChart = ({
  data,
}: ChannelWiseSalesChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">
        No Channel Wise Sales Data Found
      </div>
    );
  }

  return (
    <PieChart
      data={data.map((item) => ({
        name: item.channelName,
        value: item.salesQty,
      }))}
      name="Sales Qty"
    />
  );
};