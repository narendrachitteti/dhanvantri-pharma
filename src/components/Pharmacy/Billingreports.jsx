/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Billingreports.css';
import PharmacyNav from './PharmacyNav';
import { BASE_URL } from "../../Services/Helper";


function Billingreports() {
  const initialData = {
    Billed: 0,
    Collection: 0,
    Cash: 0,
    Card: 0,
    UPI: 0,
  };

  const [billingData, setBillingData] = useState(initialData);
  const [pharmacyData, setPharmacyData] = useState([]);
  const fromDateId = 'fromDate';
  const toDateId = 'toDate';
  const dateRangeTitle = 'Date Range';
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);


  const handleFilter = () => {
    axios
      .get(`${BASE_URL}/api/pharmacy-billing/filter`, {
        params: {
          fromDate,
          toDate,
        },
      })
      .then((response) => {
        setBillingData(response.data);
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios
      .get(`${BASE_URL}/api/pharmacy-billing`, {
        params: {
          fromDate,
          toDate,
        },
      })
      .then((response) => {
        setPharmacyData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    if (!dataLoaded) {
      setBillingData(initialData);
    } else {
      handleFilter();
    }
  }, [fromDate, toDate, dataLoaded]);

  const filteredPharmacyData = pharmacyData.filter((data) => {
    const billDate = new Date(data.patientDetails.billdate);
    return billDate >= new Date(fromDate) && billDate <= new Date(toDate);
  });

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.table_to_sheet(document.querySelector('.report-table'));
    XLSX.utils.book_append_sheet(wb, ws1, 'Billing Reports');

    const ws2 = XLSX.utils.table_to_sheet(document.querySelector('.report-table-br'));
    XLSX.utils.book_append_sheet(wb, ws2, 'Detailed Data');

    const ws3 = XLSX.utils.aoa_to_sheet([['Selected Date Range:', `${fromDate} to ${toDate}`]]);
    XLSX.utils.book_append_sheet(wb, ws3, 'Selected Dates');

    XLSX.writeFile(wb, 'billing_report.xlsx');
  };





  return (
    <div>
      <PharmacyNav />
      <div className="page-containerven">
        <div className="content-containerven">
          <div className="Bleft-sideven">
            <h1><Link to="/PharmacyHome">
              <FaArrowCircleLeft style={{ fontSize: '1.5em', marginBottom: '0.1em', color: '#9b8bf4' }} />
            </Link>&nbsp;&nbsp; &nbsp; Billing Reports</h1>
          </div>
        </div>
        <div className='bexport1'>
          <div className="bexportSectionven">
            <div className="bexportTitlev">{dateRangeTitle}</div>
            <br />
            <div className="bexport-contentv">
              <div>
                <label htmlFor={fromDateId}>From:</label>
                <input
                  className="stockistsfromven"
                  type="date"
                  id={fromDateId}
                  name="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              &nbsp;&nbsp;&nbsp;
              <div>
                <label className='todate' htmlFor={toDateId}>To:</label>
                <input
                  className="stockiststoven"
                  type="date"
                  id={toDateId}
                  name="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              &nbsp;&nbsp;&nbsp;
              <br />

            </div>
            <br />
            <div>
              <button className="bexportButtonv" onClick={handleFilter}>
                Go
              </button>&nbsp;&nbsp;&nbsp;
              <button className="bexportButtonv" onClick={handleExport}>
                Export
              </button>
            </div>
          </div>


          <div className="table-containerven">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#9b8bf4' }} colSpan={4}>Billing Reports</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className='colour456'>Billed</th>
                  <td>{billingData.Billed}</td>

                </tr>
                <tr>
                  <th>Collection</th>
                  <td>₹&nbsp;{billingData.Collection}</td>
                </tr>
                <tr>
                  <th className='colour456'>Cash</th>
                  <td>₹&nbsp;{billingData.Cash}</td>

                </tr>
                <tr>
                  <th>Card</th>
                  <td>₹&nbsp;{billingData.Card}</td>

                </tr>
                <tr>
                  <th className='colour456'>UPI</th>
                  <td>₹&nbsp;{billingData.UPI}</td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Detailed Data Table */}
        <div className="table-containerven-br">
          <table className="report-table-br">
            <thead style={{ color: 'black' }}>
              <tr style={{ backgroundColor: '#9b8bf4' }}>
                <th>S.No</th>
                <th>Bill Date</th>
                <th>Bill No</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {/* Map and render the filtered data */
                filteredPharmacyData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{new Date(data.patientDetails.billdate).toLocaleDateString()}</td>
                    <td>{data.billId}</td>
                    <td>{data.patientDetails.name}</td>
                    <td>₹&nbsp;{data.paidAmount}</td>
                    <td>{data.paymentMode}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billingreports