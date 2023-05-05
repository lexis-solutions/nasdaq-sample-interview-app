export const lineChartCommonOptions = {
  options: {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
      position: 'nearest',
    },
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback(value: string | number) {
            return `$${Number(value).toFixed(2)}`;
          },
        },
      },
    },
  },
  legend: {
    display: false,
  },
};
