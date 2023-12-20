

import React, { useState, useEffect } from 'react';
import './AllBills.css';
import { BsFilterLeft } from "react-icons/bs";
import axios from 'axios';
import { AiFillPrinter,AiOutlineDelete } from "react-icons/ai";
 import PharmacyNav from './PharmacyNav'


function AllBills() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [grandTotalSales, setGrandTotalSales] = useState(0);
  const [grandTotalSalesCount, setGrandTotalSalesCount] = useState(0);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalCashAmount, setTotalCashAmount] = useState(0);
  const [totalCardAmount, setTotalCardAmount] = useState(0);
  const [totalOtherAmount, setTotalOtherAmount] = useState(0);
  const [returnbycash, setReturnByCash] = useState(0);
  const [returnbycard, setReturnByCard] = useState(0);
  const [returnbyothers, setReturnByOthers] = useState(0);
  const [countCash, setCountCash] = useState(0);
  const [countCard, setCountCard] = useState(0);
  const [countOther, setCountOther] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/getAllData') 
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data);

        const totalSales = data.reduce((acc, patient) => {
          const salesTotal = patient.sales.reduce((salesAcc, sale) => {
            return salesAcc + parseFloat(sale.amount);
          }, 0);
          return acc + salesTotal;
        }, 0);

        setGrandTotalSales(totalSales);

        const totalSalesCount = data.reduce((acc, patient) => {
          return acc + patient.sales.length;
        }, 0);

        setGrandTotalSalesCount(totalSalesCount);

        setTotalPatientsCount(data.length);

        const totalAmount = data.reduce((acc, patient) => {
          return acc + parseFloat(patient.billAmount);
        }, 0);

        setTotalBillAmount(totalAmount);

        let cashAmount = 0;
        let cardAmount = 0;
        let otherAmount = 0;
        let cashCount = 0;
        let cardCount = 0;
        let otherCount = 0;

        data.forEach((patient) => {
          const paymentMethod = patient.selectedPaymentMethod;
          const billAmount = parseFloat(patient.billAmount);

          if (paymentMethod === 'cash') {
            cashAmount += billAmount;
            cashCount++;
          } else if (paymentMethod === 'card') {
            cardAmount += billAmount;
            cardCount++;
          } else {
            otherAmount += billAmount;
            otherCount++;
          }
        });

        setTotalCashAmount(cashAmount);
        setTotalCardAmount(cardAmount);
        setTotalOtherAmount(otherAmount);
        setCountCash(cashCount);
        setCountCard(cardCount);
        setCountOther(otherCount);

        setFilteredData(data);

      })
      .catch((error) => console.error(error));
  }, []);
  const handleSearch = () => {
    fetch(`http://localhost:5000/search?query=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => console.error(error));
  };
  
  const handleFilterClick = () => {
    if (startDate && endDate) {
      const filtered = patientData.filter((patient) => {
        const billDate = new Date(patient.billdate);
        return billDate >= new Date(startDate) && billDate <= new Date(endDate);
      });

      const {
        totalSalesCount,
        totalPatientsCount,
        totalBillAmount,
        cashAmount,
        cardAmount,
        otherAmount,
      } = calculateTotals(filtered);

      setFilteredData(filtered);
      setGrandTotalSalesCount(totalSalesCount);
      setTotalPatientsCount(totalPatientsCount);
      setTotalBillAmount(totalBillAmount);
      setTotalCashAmount(cashAmount);
      setTotalCardAmount(cardAmount);
      setTotalOtherAmount(otherAmount);
    }
  };
  const calculateTotals = (data) => {
    const totalSalesCount = data.reduce((acc, patient) => {
      return acc + patient.sales.length;
    }, 0);

    const totalPatientsCount = data.length;

    const totalBillAmount = data.reduce((acc, patient) => {
      return acc + parseFloat(patient.billAmount);
    }, 0);

    const cashAmount = data.reduce((acc, patient) => {
      if (patient.selectedPaymentMethod === 'cash') {
        return acc + parseFloat(patient.billAmount);
      }
      return acc;
    }, 0);

    const cardAmount = data.reduce((acc, patient) => {
      if (patient.selectedPaymentMethod === 'card') {
        return acc + parseFloat(patient.billAmount);
      }
      return acc;
    }, 0);

    const otherAmount = data.reduce((acc, patient) => {
      if (patient.selectedPaymentMethod !== 'cash' && patient.selectedPaymentMethod !== 'card') {
        return acc + parseFloat(patient.billAmount);
      }
      return acc;
    }, 0);

    return {
      totalSalesCount,
      totalPatientsCount,
      totalBillAmount,
      cashAmount,
      cardAmount,
      otherAmount,
    };
  };
  const [searchQuery, setSearchQuery] = useState('');

  const handlePrintTable = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
  
    printWindow.document.write('<html><head><title>Print Table</title></head><body>');
    printWindow.document.write('<h1>Table Data</h1>');
    printWindow.document.write('<table border="1">');
    
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>Order Id</th>');
    printWindow.document.write('<th>Name</th>');
    printWindow.document.write('<th>Time</th>');
    printWindow.document.write('<th>TotalAmount</th>');
    printWindow.document.write('<th>PaidAmount</th>');
    printWindow.document.write('<th>Balance</th>');
    printWindow.document.write('<th>Collection</th>');
    printWindow.document.write('<th>Return</th>');

  
    printWindow.document.write('</tr></thead>');
  
    printWindow.document.write('<tbody>');
    salesData.forEach((data) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(<td>${data.OrderID}</td>);
      printWindow.document.write(<td>${data.name}</td>);
      printWindow.document.write(<td>${data.time}</td>);
      printWindow.document.write(<td>${data.totalAmount}</td>);
      printWindow.document.write(<td>${data.paidAmount}</td>);
      printWindow.document.write(<td>${data.balance}</td>);
      printWindow.document.write(<td>${data.Totalcollect}</td>);
      printWindow.document.write(<td>${data.Return}</td>);


    
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
  
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  const handleDeleteRow = (index) => {
    const updatedSalesData = [...salesData];
    updatedSalesData.splice(index, 1);
    setSalesData(updatedSalesData);
  };
  
const renderSalesData = () => {
  return salesData.map((data, index) => (
    <tr key={index}>
      <td>{data.OrderID}</td>
      <td>{data.name}</td>
      <td>{data.time}</td>
      <td>{data.totalAmount}</td>
      <td>{data.paidAmount}</td>
      <td>{data.balance}</td>
      <td>{data.Totalcollect}</td>
      <td><button onClick={handlePrintTable}><AiFillPrinter/></button></td>
      <td>{data.Return}</td>
      <td><button onClick={() => handleDeleteRow(index)}><AiOutlineDelete/></button></td>

    </tr>
  ));
};

  return (
    <>
    <PharmacyNav/>
    <div className="Allbillsform">
        <h3 className='date2'>Date Range</h3>
        <div className="date-container">
        <label>From:</label>
        <input
          className="date3"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleFilterClick}>Go</button>
      </div>
      
      <div className="date-container12">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className='searching-sales' onClick={handleSearch}>Search</button>
              </div>
      <hr/>
      <div className="card-container">
        <div className="card">
          <label>Total Billed</label>
          <p>{totalPatientsCount}</p>
        </div>
        <div className="card">
          <label>Collected By Cash</label>
          <p>{totalCashAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <label>Collected by Card</label>
          <p>{totalCardAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <label>Collect by Others</label>
          <p>{totalOtherAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <label>Return by Cash</label>
          <p>{returnbycash}</p>
        </div>
        <div className="card">
          <label>Return by Card</label>
          <p>{returnbycard}</p>
        </div>
        <div className="card">
          <label>Return by others</label>
          <p>{returnbyothers}</p>
        </div>
      </div>
      <div className="card-container2">
        <div className="card2">
          <div className="card-content">
            
            <div className='table-container'>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Order Id&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Name&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Time&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Total Amount&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Paid Amount&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Balance&nbsp;&nbsp;&nbsp;<BsFilterLeft/></th>
                  <th>Collection</th>
                  <th>Print</th>
                  <th>Return</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{renderSalesData()}</tbody>
            </table>
            </div>
            <br/>
            {salesData.length === 0 && <span>No data available in table</span>}
            </div>
        
        </div>
    
      </div>
    </div>
    </>
  );
}

export default AllBills;
