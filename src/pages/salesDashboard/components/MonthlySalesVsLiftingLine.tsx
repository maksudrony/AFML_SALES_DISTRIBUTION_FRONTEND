import ReactECharts from 'echarts-for-react';

interface MonthlySalesVsLiftingDto {
  doMonName: string;
  salesQty: number;
  liftingQty: number;
}

interface MonthlySalesVsLiftingLineProps {
  data: MonthlySalesVsLiftingDto[];
}

export const MonthlySalesVsLiftingLine = ({data,}: MonthlySalesVsLiftingLineProps) => {
  const formatDecimal = (
    num: number | undefined | null
  ): string => {
    if (
      num === undefined ||
      num === null ||
      isNaN(Number(num))
    ) {
      return '0';
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
      top: 10,
      left: 'center',
      data: ['Sales', 'Lifting'],
    },

    grid: {
      left: '5%',
      right: '11%',
      bottom: '10%',
      top: '18%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: data.map((item) => item.doMonName),
      boundaryGap: false,
    },

    yAxis: {
      type: 'value',
      name: 'Quantity',
      axisLabel: {
        formatter: (value: number) => formatDecimal(value),
      },
    },

    series: [
      {
        name: 'Sales',
        type: 'line',
        data: data.map((item) => item.salesQty),
        smooth: false,
        symbol: 'circle',
				endLabel: {
					show: true,
					formatter: (params: any) => {
						return `Sales: ${formatDecimal(params.value)}`;
					},
				},

				labelLayout: {
					moveOverlap: 'shiftY',
				},
        symbolSize: 8,
        lineStyle: {
          width: 3,
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: 'Lifting',
        type: 'line',
        data: data.map((item) => item.liftingQty),
        smooth: false,
        symbol: 'circle',
				endLabel: {
					show: true,
					formatter: (params: any) => {
						return `Lifting: ${formatDecimal(params.value)}`;
					},
				},

				labelLayout: {
					moveOverlap: 'shiftY',
				},
        symbolSize: 8,
        lineStyle: {
          width: 3,
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      notMerge={true}
      lazyUpdate={true}
      style={{
        width: '100%',
        height: '400px',
      }}
    />
  );
};
