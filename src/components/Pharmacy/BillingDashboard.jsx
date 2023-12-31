/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./BillingDashboard.css";
import axios from "axios";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../Services/Helper";

function BillingDashboard() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [fastMovingProducts, setFastMovingProducts] = useState([]);
  
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalManufacturers, setTotalManufacturers] = useState(0);
  const [currentInventoryCost, setCurrentInventoryCost] = useState(0);
  const [currentInventoryMRP, setCurrentInventoryMRP] = useState(0);
  const [inStockInventoryQuantity, setInStockInventoryQuantity] = useState(0);
  const [medicineOutOfStock, setMedicineOutOfStock] = useState(0);
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

  useEffect(() => {
    fetchData();
    fetchFastMovingMedicines();
    fetchInventoryData();
  }, []);

  useEffect(() => {
    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/pharmacy-billing`
      );
      setSalesData(response.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };


  // Function to fetch fast-moving medicines
  const fetchFastMovingMedicines = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/pharmacy-billing`);
      const fastMovingMedicinesData = response.data
        .map((item) => item.pharmacyTable) // Extract the pharmacyTable from each item
        .flat() // Flatten the array
        .filter((medicine) => medicine.quantity >= 100);
      setFastMovingProducts(fastMovingMedicinesData);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getInvoices`);

      // Initialize variables to store calculated values
      let totalMedicines = 0;
      let totalManufacturers = new Set(); // Use a Set to keep track of unique manufacturers
      let currentInventoryCost = 0;
      let currentInventoryMRP = 0;
      let inStockInventoryQuantity = 0;
      let medicineOutOfStock = 0;

      // Loop through each invoice in the API response
      response.data.forEach((invoice) => {
        // Calculate the total number of medicines
        totalMedicines += invoice.medicines.length;

        // Collect unique manufacturers in this invoice
        invoice.medicines.forEach((medicine) => {
          totalManufacturers.add(medicine.Manufacturer);

          // Ensure that you're parsing quantity, price, and MRP as floats to avoid NaN
          const quantity = parseFloat(medicine.Quantity);
          const price = parseFloat(medicine.price);
          const mrp = parseFloat(medicine.MRP);

          // Check if the medicine is in stock or out of stock
          if (quantity === 0) {
            medicineOutOfStock++;
          } else {
            inStockInventoryQuantity += quantity;
          }

          // Calculate the current inventory cost and MRP
          currentInventoryCost += price * quantity;
          currentInventoryMRP += mrp * quantity;
        });
      });

      // Calculate the actual total manufacturers count
      totalManufacturers = totalManufacturers.size;

      // Set the calculated values to state
      setTotalMedicines(totalMedicines);
      setTotalManufacturers(totalManufacturers);
      setCurrentInventoryCost(currentInventoryCost);
      setCurrentInventoryMRP(currentInventoryMRP);
      setInStockInventoryQuantity(inStockInventoryQuantity);
      setMedicineOutOfStock(medicineOutOfStock);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchCollectionData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/getIn`);
    const data = response.data;
    const totalCollectionSum = data.reduce((sum, item) => {
      return sum + (item.Collection || 0); // Use 0 if Collection is undefined or null
    }, 0);
    setTotalCollection(totalCollectionSum);
  } catch (error) {
    console.error("API Error:", error);
  }
};


  useEffect(() => {
    fetchCollectionData();

  },);

  const fetchTotalBilldata = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getIn`);
      const totalbills = response.data.length;
      setTotalbills(totalbills);

    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    fetchTotalBilldata();
  },);

  return (
    <>
      <PharmacyNav />
      <div className="Appbilldb">
        <div className="date-head-container">
          <h1 className="date2" >
            Billing Dashboard
          </h1>
          {/* <div className="date-container">
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
            <button className="billing-dash-go" >Go</button>
          </div> */}
        </div>
        <hr />
        <div className="dbicon-box">
          <Link to="/BillingDashboard" className="dbcard-container">
            <div className="dbcard">
              <label>Total Bills</label>
              {/* <p>{billingData.Billed}</p> */}
              <p>{totalbills}</p>
            </div>
          </Link>
          <Link to="/BillingDashboard" className="dbcard-container">
            <div className="dbcard">
              <label>Total Collection</label>
              {/* <p>₹&nbsp;{billingData.Collection}</p> */}
              <p>{totalCollection}</p>
            </div>
          </Link>
          <Link to="/BillingDashboard" className="dbcard-container">
            <div className="dbcard">
              <label>Collected by Cash</label>
              <p>₹&nbsp;{totalCollection}</p>
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