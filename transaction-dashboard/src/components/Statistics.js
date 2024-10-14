import React, { useState, useEffect } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/statistics/${month}`);
        const data = await response.json();

        if (response.ok) {
          setStatistics({
            totalSaleAmount: data.totalSaleAmount,
            totalSoldItems: data.totalSoldItems,
            totalNotSoldItems: data.totalNotSoldItems,
          });
        } else {
          setError(data.message || 'Error fetching statistics');
        }
      } catch (error) {
        setError('Failed to fetch statistics');
      }
    };

    if (month) {
      fetchStatistics();
    }
  }, [month]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e3f2f9',
      padding: '40px',
      borderRadius: '10px',
      height: '100%',
      marginTop: '10vh'
    }}>
      <h2 style={{ marginBottom: '20px', alignItems: 'flex-start' }}>
        Statistics - {monthNames[month - 1]}
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#fdf0bc',
        borderRadius: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '300px',
      }}>
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ marginRight: '20px' }}>Total Sale</strong> {statistics.totalSaleAmount.toFixed(2)}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ marginRight: '20px' }}>Total Sold Items</strong> {statistics.totalSoldItems}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ marginRight: '20px' }}>Total Not Sold Items</strong> {statistics.totalNotSoldItems}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
