import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/bar-chart/${month}`);
        const data = res.data;

        const labels = Object.keys(data);
        const values = Object.values(data);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Books in Price Range',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching chart data');
        setLoading(false);
      }
    };

    fetchChartData();
  }, [month]);

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Bar Chart Stats - {monthNames[month - 1]}
      </h2>
      <div style={{ width: '50%', minWidth: '300px', height: '300px' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false, 
                },
              },
              y: {
                beginAtZero: true,
                min: 0,
                max: 80,
                ticks: {
                  stepSize: 20,
                },
                grid: {
                  display: true,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;
