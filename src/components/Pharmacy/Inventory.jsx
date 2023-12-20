import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inventory.css";
import { AiOutlineAlignLeft, AiOutlineAlignRight } from "react-icons/ai";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import ReactJsPagination from "react-js-pagination";

function Inventory() {
  const [activeCategory, setActiveCategory] = useState("stocks");
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchInventoryData(activeCategory);
  }, [activeCategory]);

  const fetchInventoryData = async (category) => {
    try {
      let response = null;

      switch (category) {
        case "stocks":
          response = await axios.get("http://127.0.0.1:5000/api/getInvoices");
          break;
        case "expiry":
          response = await axios.get("http://127.0.0.1:5000/api/getInvoices");
          break;
        case "low":
          response = await axios.get("http://127.0.0.1:5000/api.getInvoices");
          break;
        case "zero":
          response = await axios.get("http://127.0.0.1:5000/api/getInvoices");
          break;
        default:
          break;
      }

      if (response) {
        const filteredData = response.data.filter((item) => {
          if (category === "stocks") {
            const quantity = parseInt(item.medicines[0].Quantity);
            return quantity > 0;
          } else if (category === "expiry") {
            const currentDate = new Date();
            const expiryDate = new Date(item.medicines[0].BatchExpiry);
            return expiryDate < currentDate;
          } else if (category === "low") {
            const quantity = parseInt(item.medicines[0].Quantity);
            return quantity > 0 && quantity <= 50;
          } else if (category === "zero") {
            const quantity = parseInt(item.medicines[0].Quantity);
            return quantity === 0;
          }
          return true;
        });

        const medicines = Array.from(new Set(filteredData.flatMap((item) => item.medicines)));
        setInventoryData(medicines);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // const calculateUnitsPerPrice = (unit, price) => {
  //   if (unit && price) {
  //     const result = (unit / price).toFixed(2);
  //     return result;
  //   }
  //   return "";
  // };

  const renderTable = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredInventoryData = inventoryData.filter((medicine) =>
      medicine.Medicine.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedData = filteredInventoryData.slice(startIndex, endIndex);

    if (filteredInventoryData.length === 0) {
      return <div>No data available for this category.</div>;
    }

    return (
      <div className="inventory-OP">
        <div className="searchbar-OP" style={{ fontFamily: "Inria Serif" }}>
          <input
            type="text"
            placeholder={`Search ${activeCategory} stocks`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="data-table-OP">
          <thead>
            <tr>
              <th>
                Medicine Name <AiOutlineAlignLeft />
              </th>
              <th>
                Remaining Units <AiOutlineAlignRight />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((medicine, index) => (
              <tr key={index}>
                <td>{medicine.Medicine}</td>
                <td>{medicine.Quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {/* <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span> */}
          
          {/* <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button> */}
        </div>
      </div>
    );
  };

  const filteredInventoryData = inventoryData.filter((medicine) =>
    medicine.Medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredInventoryData.length / itemsPerPage);

  return (
    <>
      <PharmacyNav />
      <div className="cont-OP">
        <p className="heading-top-OP">
          <strong>
            <Link to="/PharmacyHome" style={{ color: "#9b8bf4" }}>
              <FaArrowCircleLeft />
            </Link>
            &nbsp;Inventory Stocks
          </strong>
        </p>
        <div className="heading-table-OP">
          <div
            className={`heading-cell-OP ${
              activeCategory === "stocks" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("stocks")}
          >
            Stocks
          </div>
          <div
            className={`heading-cell-OP ${
              activeCategory === "expiry" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("expiry")}
          >
            Expiry Stocks
          </div>
          <div
            className={`heading-cell-OP ${
              activeCategory === "low" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("low")}
          >
            Low Stocks
          </div>
          <div
            className={`heading-cell-OP ${
              activeCategory === "zero" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("zero")}
          >
            Zero Stocks
          </div>
        </div>
        {activeCategory && renderTable()}
        <div className="pagination">
          <ReactJsPagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredInventoryData.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default Inventory;