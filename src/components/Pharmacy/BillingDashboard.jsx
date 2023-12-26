/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./BillingDashboard.css";
import axios from "axios";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";

function BillingDashboard() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [fastMovingProducts, setFastMovingProducts] = useState([]);
  const [filteredFastMovingProducts, setFilteredFastMovingProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [currentInventoryCost, setCurrentInventoryCost] = useState(0);
  const [currentInventoryMRP, setCurrentInventoryMRP] = useState(0);
  const [inStockInventoryQuantity, setInStockInventoryQuantity] = useState(0);
  const [medicineOutOfStock, setMedicineOutOfStock] = useState(0);
  const [salesSearchQuery, setSalesSearchQuery] = useState("");
  const [totalCollection, setTotalCollection] = useState(0);
  const [totalbills, setTotalbills] = useState(0);

  const initialData = {
    Billed: 0,
    Collection: 0,
    Cash: 0,
    Card: 0,
    UPI: 0,
  };

  const [billingData, setBillingData] = useState(initialData);
  const fromDateId = 'fromDate';
  const toDateId = 'toDate';

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    axios
      .get('http://localhost:5000/api/pharmacybilling/filter', {
        params: {
          fromDate,
          toDate,
        },
      })
      .then((response) => {
        setBillingData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchFastMovingMedicines();
    fetchInventoryData();
    fetchCollectionData();
  }, [fromDate, toDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/pharmacybilling"
      );
      setSalesData(response.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const renderSalesData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = salesData.slice(startIndex, endIndex);

    return slicedData.map((data, index) => (
      <tr key={index}>
        <td>{startIndex + index + 1}</td>
        <td>{data.patientDetails.name}</td>
        <td>{data.billId}</td>
        <td>{data.paidAmount}</td>
        <td>{data.paymentMode}</td>
      </tr>
    ));
  };

  const fetchFastMovingMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fastMovingMedicines");
      const fastMovingMedicinesData = response.data
        .map((item) => item.pharmacyTable)
        .flat()
        .filter((medicine) => medicine.quantity >= 100);
      setFastMovingProducts(fastMovingMedicinesData);
    } catch (error) {
      console.error("Error fetching fast-moving medicines:", error);
    }
  };

  const renderFastMovingMedicines = () => {
    return fastMovingProducts.map((medicine, index) => (
      <tr key={index}>
        <td>{medicine.medicineName}</td>
        <td>{medicine.quantity}</td>
      </tr>
    ));
  };

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getInvoices");
      let totalMedicines = 0;
      let currentInventoryCost = 0;
      let currentInventoryMRP = 0;
      let inStockInventoryQuantity = 0;
      let medicineOutOfStock = 0;

      response.data.forEach((invoice) => {
        totalMedicines += invoice.medicines.length;

        invoice.medicines.forEach((medicine) => {
          const quantity = parseFloat(medicine.Quantity);
          const price = parseFloat(medicine.price);
          const mrp = parseFloat(medicine.MRP);

          if (quantity === 0) {
            medicineOutOfStock++;
          } else {
            inStockInventoryQuantity += quantity;
          }

          currentInventoryCost += price * quantity;
          currentInventoryMRP += mrp * quantity;
        });
      });

      setTotalMedicines(totalMedicines);
      setCurrentInventoryCost(currentInventoryCost);
      setCurrentInventoryMRP(currentInventoryMRP);
      setInStockInventoryQuantity(inStockInventoryQuantity);
      setMedicineOutOfStock(medicineOutOfStock);
    } catch (error) {
      console.error("API Error:", error);
    }
  };


  useEffect(() => {
    fetchCollectionData();
 }, []);

 const fetchCollectionData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/getIn");
    console.log("Response Data:", response.data);

    // Check if the response data has the expected structure
    if (response.data && typeof response.data === 'object') {
      // Extract relevant properties from the response
      const { totalSubtotalWithGST, totalBills, PatientBills } = response.data;

      // Log the structure of PatientBills
      console.log("PatientBills:", PatientBills);

      // Check if PatientBills is an array
      if (PatientBills && Array.isArray(PatientBills)) {
        // Iterate over the array of invoices
        PatientBills.forEach((invoice) => {
          // Log each invoice for further inspection
          console.log("Invoice:", invoice);

          // ... existing logic ...
        });

        // Set the calculated values to state
        setTotalCollection(totalSubtotalWithGST);
        setTotalbills(totalBills);
      } else {
        console.error("Invalid response format. 'PatientBills' is not an array.");
      }
    } else {
      console.error("Invalid response format. Expected an object.");
    }
  } catch (error) {
    console.error("API Error:", error);
  }
};


  
  

  return (
    <>
      <PharmacyNav />
      <div className="Appbilldb">
        <div className="date-head-container">
          <h1 className="date2" >
            Billing Dashboard
          </h1>
          <div className="date-container">
            <label className="la-bill-dash" >From: </label>
            <input className="billing-data-sel"
              type="date"
              id={fromDateId}
              value={fromDate}
              name="fromDate"
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label className="la-bill-dash" >To:</label>
            <input className="billing-data-sel"
              type="date"
              id={toDateId}
              name="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button className="billing-dash-go" onClick={handleFilter}>Go</button>
          </div>
        </div>
        <hr />
        <div className="dbicon-box">
          <Link to="/Dbdetails" className="dbcard-container">
            <div className="dbcard">
              <label>Total Bills</label>
              <p>{totalbills}</p>
            </div>
          </Link>
          <Link to="/Dbdetails" className="dbcard-container">
            <div className="dbcard">
              <label>Total Collection</label>
              <p>{totalCollection}</p>
            </div>
          </Link>
          <Link to="/Dbdetails" className="dbcard-container">
            <div className="dbcard">
              <label>Collected by Cash</label>
              <p>₹&nbsp;{billingData.Cash}</p>
            </div>
          </Link>
          <Link to="/Dbdetails" className="dbcard-container">
            <div className="dbcard">
              <label>Collected by Card</label>
              <p>₹&nbsp;{billingData.Card}</p>
            </div>
          </Link>
          <Link to="/Dbdetails" className="dbcard-container">
            <div className="dbcard">
              <label>Collected by UPI</label>
              <p>₹&nbsp;{billingData.UPI}</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="card-container2" style={{ fontFamily: "Inria Serif" }}>
        <div className="card2">
          <h4 className="card-heading">Statistics</h4>
          <div className="card-content">
            <div className="statistic">
              <label>Total Medicines</label>
              <p>{totalMedicines}</p>
            </div>
            <div className="statistic">
              <label>Medicine out of stock</label>
              <p>{medicineOutOfStock}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingDashboard;
