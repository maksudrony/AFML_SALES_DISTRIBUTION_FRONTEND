import ReactECharts from 'echarts-for-react';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  name?: string;
  height?: string;
}

export const PieChart = ({
  data,
  name = 'Value',
  height = '320px',
}: PieChartProps) => {
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

  const pieColors = [
    '#79E0EE', // Blue
    '#98EECC', // Green
    '#f59e0b', // Orange
    '#67e8f9', // Cyan
    '#E84393', // Pink
    '#6C5CE7', // Violet
    '#00B894', // Teal
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.10); border-radius: 8px;',

      formatter: (params: any) => {
        return `
          <div style="font-weight: 600; margin-bottom: 5px;">
          ${params.name}<br/>
          </div>
          Quantity: ${formatDecimal(params.value)}<br/>
          Percentage: ${params.percent}%
        `;
      },
    },

    legend: {
      type: 'scroll',
      bottom: 0,
      left: 'center',

      textStyle: {
        fontSize: 10,
        color: '#475569',
      },
    },

    series: [
      {
        name,
        type: 'pie',

        radius: ['40%', '70%'],

        center: ['50%', '45%'],

        avoidLabelOverlap: true,

        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5,
        },

        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 10,
          color: '#334155',
        },

        emphasis: {
          scale: true,
          scaleSize: 8,
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
        },

        data: data.map((item, index) => ({
          ...item,

          itemStyle: {
            color: pieColors[index % pieColors.length],
            borderRadius: 10,
            borderColor: '#ffffff',
            borderWidth: 5,
          },
        })),
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