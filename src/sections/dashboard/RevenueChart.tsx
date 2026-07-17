import { useEffect, useState } from 'react';

// next
import dynamic from 'next/dynamic';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import useConfig from 'hooks/useConfig';

// third-party
import { Props as ChartProps } from 'react-apexcharts';
import { getRevenueReport } from 'services/reports';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yaxis: {
    title: {
      text: 'Amount'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `₹ ${val}`;
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

// ==============================|| SALES COLUMN CHART ||============================== //
interface Props {
  slot: 'week' | 'month' | 'year';
}

const RevenueChart = ({ slot }: Props) => {
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { mode } = useConfig();

  const legend = {
    income: true,
    cos: true
  };
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const currentDay = currentDate.getDate();

  const start = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01 00:00`;
  const end = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')} 00:00`;

  const [date, setDate] = useState<any>({ end: end, start: start })
  const [total, setTotal] = useState<Number>(0);

  const { income, cos } = legend;

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

  const initialSeries = [
    {
      name: 'Income',
      data: [180, 90, 135, 114, 120, 145]
    },
    {
      name: 'Cost Of Sales',
      data: [120, 45, 78, 150, 168, 99]
    }
  ];

  const [series, setSeries] = useState(initialSeries);


  // const handleLegendChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setLegend({ ...legend, [event.target.name]: event.target.checked });
  // };

  const [options, setOptions] = useState<ChartProps>(columnChartOptions);

  useEffect(() => {
    if (income && cos) {
      const fetchData = async () => {
        try {
          const mergedParams = { ...date, slot: slot };
          const response = await getRevenueReport({ slot: slot });
          const { data } = response.data;
          setOptions({
            ...options,
            xaxis: {
              ...options.xaxis,
              categories: data.revenue_months,
            },
          })
          setSeries([
            {
              name: 'Month',
              data: data.revenue_count
            }
          ]);
          setTotal(data.total);
        } catch (error) {
          console.error('Error fetching initial series:', error);
        }
      };
      fetchData();
      // setSeries(initialSeries);
    } else if (income) {
      setSeries([
        {
          name: 'Income',
          data: [180, 90, 135, 114, 120, 145]
        }
      ]);
    } else if (cos) {
      setSeries([
        {
          name: 'Cost Of Sales',
          data: [120, 45, 78, 150, 168, 99]
        }
      ]);
    } else {
      setSeries([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot, income, cos]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(income && cos) && cos ? [primaryMain] : [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: mode === 'dark' ? 'dark' : 'light'
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [mode, primary, secondary, line, warning, primaryMain, successDark, income, cos, xsDown]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <div id="chart">
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </div>
      </Box>
    </MainCard>
  );
};

export default RevenueChart;
