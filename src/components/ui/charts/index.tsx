import { FC } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export interface ChartProps {
  data: any[];
  xField?: string;
  yField?: string;
  valueField?: string;
  categoryField?: string;
  className?: string;
}

const Chart: FC<ChartProps> = ({ data, xField, yField, valueField, categoryField, className }) => {
  if (xField && yField) {
    const chartData = {
      labels: data.map(item => item[xField]),
      datasets: [{
        data: data.map(item => item[yField]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
    return <Line data={chartData} className={className} />
  }

  if (valueField && categoryField) {
    const chartData = {
      labels: data.map(item => item[categoryField]),
      datasets: [{
        data: data.map(item => item[valueField]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ]
      }]
    }
    return <Pie data={chartData} className={className} />
  }

  return null
}

export default Chart 