import { PieChart } from '../../../components/charts/PieChart';

interface ChannelWiseLiftingItem {
  channelName: string;
  liftingQty: number;
}

interface ChannelWiseLiftingChartProps {
  data: ChannelWiseLiftingItem[];
}

export const ChannelWiseLiftingPieChart = ({
  data,
}: ChannelWiseLiftingChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">
        No Channel Wise Lifting Data Found
      </div>
    );
  }

  return (
    <PieChart
      data={data.map((item) => ({
        name: item.channelName,
        value: item.liftingQty,
      }))}
      name="Lifting Qty"
    />
  );
};