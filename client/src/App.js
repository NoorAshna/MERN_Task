import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [parents, setParents] = useState([]);
  const [childData, setChildData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    fetchParents();
  }, [page]);

  const fetchParents = () => {
    fetch(`http://localhost:3001/api/parents?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch parent transactions');
        }
        return response.json();
      })
      .then((data) => setParents(data.data))
      .catch((error) => setError(error.message));
  };

  const fetchChildData = (parentId) => {
    fetch(`http://localhost:3001/api/child?parentId=${parentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch child transactions');
        }
        return response.json();
      })
      .then((data) => {
        const childTransactions = data.map((child) => {
          const parent = parents.find((parent) => parent.id === child.parentId);
          return {
            id: child.id,
            sender: parent.sender,
            receiver: parent.receiver,
            totalAmount: parent.totalAmount,
            paidAmount: child.paidAmount,
          };
        });
        setChildData(childTransactions);
      })
      .catch((error) => setError(error.message));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Parent Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Parent ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Total Amount</th>
            <th>Total Paid Amount</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((parent) => (
            <tr key={parent.id}>
              <td>{parent.id}</td>
              <td>{parent.sender}</td>
              <td>{parent.receiver}</td>
              <td>{parent.totalAmount}</td>
              <td>{parent.totalPaidAmount}</td>
              <td>
                <button onClick={() => fetchChildData(parent.id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className="prevButton" onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button className="prevButton" onClick={handleNextPage}>Next</button>
      </div>

      <h1>Child Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Child ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          {childData.map((child) => (
            <tr key={child.id}>
              <td>{child.id}</td>
              <td>{child.sender}</td>
              <td>{child.receiver}</td>
              <td>{child.totalAmount}</td>
              <td>{child.paidAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
