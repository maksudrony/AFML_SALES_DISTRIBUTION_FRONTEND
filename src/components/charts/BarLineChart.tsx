import ReactECharts from 'echarts-for-react';

interface BarLineChartProps {
  categories: string[];
  barData: number[];
  lineData: number[];
  barName?: string;
  lineName?: string;
  height?: string;
}

export const BarLineChart = ({
  categories,
  barData,
  lineData,
  barName = 'Bar',
  lineName = 'Trend',
  height = '320px',
}: BarLineChartProps) => {
  const formatDecimal = (num: number | undefined | null): string => {
    if (
      num === undefined ||
      num === null ||
      isNaN(Number(num))
    ) {
      return '0.00';
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(num));
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // type: 'cross',
        type: 'shadow',
      },
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.10); border-radius: 8px;',
    },

    legend: {
      top: 5,
      left: 'center',
      data: [barName, lineName],
      itemWidth: 24,

      itemHeight: 12,

      textStyle: {
        color: 'black',
        fontSize: 12,
      },
    },

    grid: {
      left: '5%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: categories,

      // axisLine: {
      //   lineStyle: {
      //     color: '#94a3b8',
      //   },
      // },

      // axisTick: {
      //   show: false,
      // },

      axisLabel: {
        interval: 0,
        rotate: categories.length > 5 ? 25 : 0,
        fontSize: 10,
        fontWeight: 500,
        color: 'black',
      },
    },

    yAxis: {
      type: 'value',
      name: 'Quantity',
      // nameLocation: 'middle',
      // nameGap: 50,
      axisLabel: {
      rotate: 15,
      fontSize: 10,
      },

      nameLocation: 'middle',
      nameGap: 75,           
      nameRotate: 90,        
      nameTextStyle: {
        fontStyle: 'italic', 
        fontSize: 15,
        fontWeight: 'bold',  
        color: '#64748b',    
      },
    },

    series: [
      {
        name: barName,
        type: 'bar',

        data: barData.map((value, index) => ({
          value,

          itemStyle: {
            color: [
              '#00B8D9', // Cyan
              '#E13F7C', // Dark Magenta
              '#FF9F43', // Orange
              '#00B8D9', // Cyan
              '#E84393', // Pink
              '#6C5CE7', // Violet
              '#00B894', // Teal
            ][index % 8],

            borderRadius: [8, 8, 0, 0],
          },
        })),

        barMaxWidth: 45,

        itemStyle: {
          color: '#CD104D',
          borderRadius: [8,8,0,0,],
        },

        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#475569',

          formatter: (params: any) =>
            formatDecimal(params.value),
        },

        emphasis: {
          focus: 'series',

          itemStyle: {
            color: '#CD104D',
          },
        },
      },

      {
        name: lineName,
        type: 'line',

        smooth: true,

        data: lineData,

        symbol: 'circle',
        symbolSize: 10,

        lineStyle: {
          width: 3,
          color: '#A8D42A',
        },

        itemStyle: {
          color: '#A8D42A',
          borderColor: '#ffffff',
          borderWidth: 2,
        },

        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#B2054C',
          },
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height,
        width: '100%',
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};