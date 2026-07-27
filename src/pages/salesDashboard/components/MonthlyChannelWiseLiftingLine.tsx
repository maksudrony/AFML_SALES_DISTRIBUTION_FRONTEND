import ReactECharts from 'echarts-for-react';

interface MonthlyChannelWiseLiftingDto {
  dcMonName: string;
  channelId: number;
  channelName: string;
  liftingQty: number;
}

interface MonthlyChannelWiseLiftingLineProps {
  monthlyData: MonthlyChannelWiseLiftingDto[];
}

export const MonthlyChannelWiseLiftingLine = ({
  monthlyData,
}: MonthlyChannelWiseLiftingLineProps) => {

  const months = [
    ...new Set(
      monthlyData.map((item) => item.dcMonName)
    ),
  ];

  const channels = [
    ...new Set(
      monthlyData.map((item) => item.channelName)
    ),
  ];

  const option = {
    tooltip: {
      trigger: 'axis',

      axisPointer: {
        type: 'cross',
      },

      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.10); border-radius: 8px;',
    },

    legend: {
      data: channels,
    },

    grid: {
      left: '4%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      boundaryGap: false, //ekbare kono borderGap thakbe na 0 thekei suru hbe

      data: months,
    },

    yAxis: {
      type: 'value',
      name: 'Lifting Quantity',
      nameLocation: 'middle',
      nameGap: 75,           
      nameRotate: 90,      
      axisLabel: {
        fontSize: 10,
      },  
      nameTextStyle: {
        fontStyle: 'italic', 
        fontSize: 15,
        fontWeight: 'bold',  
        color: '#64748b',    
      },
    },

    // Prottek channel er jonno alada line
    series: channels.map((channel) => ({
      name: channel,

      type: 'line',
      smooth: true, 

      emphasis: {
        focus: 'series', // Hover on Lines
      },

      data: months.map((month) => {
        const item = monthlyData.find(
          (x) =>
            x.dcMonName === month &&
            x.channelName === channel
        );

        return item?.liftingQty ?? 0;
      }),

    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: '500px',
        width: '100%',
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};