import React, { useState, useEffect } from 'react';
import Statistics from './Statistics';
import BarChart from './BarChart';

const TransactionsTable = () => {
  const [month, setMonth] = useState(3);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
    setPage(1);
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books?month=${month}&page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      setTransactions(data.books);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : description;
  };

  const truncateTitle = (title) => {
    const words = title.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : title;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#fffff',
    }}>
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        backgroundColor: '#e3f2f9',
        borderRadius: '50px',
        padding: '40px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '24px',
          color: '#000000',
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          padding: '20px',
          width: '250px',
          margin: '0 auto',
        }}>
          Transaction Dashboard
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <input
            type="text"
            placeholder="Search transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '20px',
              width: '20%',
              border: '2px solid #f5b240',
              backgroundColor: '#fdf0bc',
              color: '#000000',
            }}
          />

          <select
            value={month}
            onChange={handleMonthChange}
            style={{
              padding: '10px',
              borderRadius: '20px',
              width: '20%',
              border: '2px solid #f5b240',
              backgroundColor: '#fdf0bc',
              color: '#000000',
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <table style={{
          width: '100%',
          backgroundColor: '#fdf0bc',
          borderRadius: '10px',
          padding: '10px',
          borderCollapse: 'collapse',
          marginBottom: '20px',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5b240', color: '#000' }}>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>ID</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Title</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Description</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Price</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Category</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Sold</th>
              <th style={{ padding: '15px', border: '2px solid #000000' }}>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{transaction.id}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{truncateTitle(transaction.title)}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{truncateDescription(transaction.description)}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{transaction.price}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{transaction.category}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>{transaction.sold ? 'Yes' : 'No'}</td>
                <td style={{ padding: '10px', border: '2px solid #000000' }}>
                  <img src={transaction.image} alt="transaction" style={{ width: '50px', height: '50px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          <span>Page No: {page}</span>
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                borderRadius: '20px',
                border: '2px solid #000000',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                color:"black"
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: '2px solid #000000',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                color:"black"
              }}
            >
              Next
            </button>
          </div>
          <span>Per Page: 10</span>
        </div>

        <Statistics month={month} />
        <BarChart month={month} />
      </div>
    </div>
  );
};

export default TransactionsTable;
