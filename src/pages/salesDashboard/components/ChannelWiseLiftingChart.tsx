import { BarLineChart } from '../../../components/charts/BarLineChart';

interface ChannelWiseLiftingItem {
  channelName: string;
  liftingQty: number;
}

interface ChannelWiseLiftingChartProps {
  data: ChannelWiseLiftingItem[];
}

export const ChannelWiseLiftingChart = ({
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
    <BarLineChart
      categories={data.map((item) => item.channelName)}
      barData={data.map((item) => item.liftingQty)}
      lineData={data.map((item) => item.liftingQty)}
      barName="Lifting Qty"
      lineName="Trend"
    />
  );
};