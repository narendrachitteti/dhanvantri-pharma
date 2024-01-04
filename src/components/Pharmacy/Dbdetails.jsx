import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dbdetails.css";
import PharmacyNav from "./PharmacyNav";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactJsPagination from "react-js-pagination"; // Import pagination component

const Dbdetails = () => {
  const [pharmacyData, setPharmacyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  useEffect(() => {
    // Fetch data from the backend API for Pharmacy billing
    axios
      .get("http://localhost:5000/api/pharmacy-billing")
      .then((response) => {
        console.log("Received pharmacy data:", response.data);
        setPharmacyData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = pharmacyData.slice(startIndex, endIndex);

  return (
    <div>
      <PharmacyNav />
      <div className="pharma-container123db">
        <div className="sk14-arrows143db">

          <div className="heading6789db">
            <Link to="/BillingDashboard" style={{ fontSize: '2rem', color: '#9b8bf4' }}>
              <FaArrowCircleLeft />
            </Link>
            <h1 className="h1cvvroyaldb">Pharmacy Billing Data</h1>
          </div>
        </div>
        <div className="table-containerdb">
          <table border="1" className="pharmacy-details-table">
            <thead className="fixed-header">
              <tr className="pharmacy-table-header">
                <th className="pharmacy-table-data">S.No</th>
                <th className="pharmacy-table-data">Name</th>
                <th className="pharmacy-table-data">Bill Number</th>
                <th className="pharmacy-table-data">Date</th>
                <th className="pharmacy-table-data">Total Amount</th>
                <th className="pharmacy-table-data">Payment Method</th>
              </tr>
            </thead>
            <tbody className="scrollable-body">
              {displayedData.map((item, index) => (
                <tr key={item._id.$oid}>
                  <td>{index + 1}</td>
                  <td>{item.patientDetails.name}</td>
                  <td>{item.billId}</td>
                  <td>
                    {new Date(item.patientDetails.billdate).toLocaleDateString()}
                  </td>
                  <td>{item.paidAmount}</td>
                  <td>{item.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <ReactJsPagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={pharmacyData.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Dbdetails;
