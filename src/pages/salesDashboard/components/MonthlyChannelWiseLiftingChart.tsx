import ReactECharts from 'echarts-for-react';

interface MonthlyChannelWiseLiftingDto {
  dcMonName: string;
  channelId: number;
  channelName: string;
  liftingQty: number;
}

interface MonthlyChannelWiseLiftingChartProps {
  monthlyData: MonthlyChannelWiseLiftingDto[];
}

export const MonthlyChannelWiseLiftingChart = ({
  monthlyData,
}: MonthlyChannelWiseLiftingChartProps) => {

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
        type: 'shadow',
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

      data: months,

      axisPointer: {
        type: 'shadow',
      },
    },

    yAxis: {
      type: 'value',
      name: 'Lifting Quantity',
			nameLocation: 'middle',
      nameGap: 75,           
      nameRotate: 90,      
			axisLabel: {
      // rotate: 15,
      fontSize: 10,
      },  
      nameTextStyle: {
        fontStyle: 'italic', 
        fontSize: 15,
        fontWeight: 'bold',  
        color: '#64748b',    
      },
    },

    // Prottek channel er jonno alada bar
    series: channels.map((channel) => ({
      name: channel,
      type: 'bar',

			emphasis: {
        focus: 'series', //For hover on Bars
      },

      data: months.map((month) => {
        const item = monthlyData.find(
          (x) =>
            x.dcMonName === month &&
            x.channelName === channel
        );

        return item?.liftingQty ?? 0;
      }),

      barMaxWidth: 40,

			itemStyle: {
				borderRadius: [8, 8, 0, 0],
			},

			label: {
				show: false,
			  position: 'inside',
				formatter: channel,
				rotate: 90,
			},

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