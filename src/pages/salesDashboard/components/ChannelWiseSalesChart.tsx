import { BarLineChart } from '../../../components/charts/BarLineChart';

interface ChannelWiseSalesItem {
  channelName: string;
  salesQty: number;
}

interface ChannelWiseSalesChartProps {
  data: ChannelWiseSalesItem[];
}

export const ChannelWiseSalesChart = ({
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
    <BarLineChart
      categories={data.map((item) => item.channelName)}
      barData={data.map((item) => item.salesQty)}
      lineData={data.map((item) => item.salesQty)}
      barName="Sales Qty"
      lineName="Trend"
    />
  );
};