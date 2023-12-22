import React, { useState, useEffect } from "react";
import "./Stockists.css";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import ReactJsPagination from "react-js-pagination";

const Stockists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [stockists, setStockists] = useState([]);
  const [newStockistData, setNewStockistData] = useState({
    name: "",
    gstno: "",
    email: "",
  });

  
  const [selectedStockist, setSelectedStockist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stockists")
      .then((response) => {
        setStockists(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stockists:", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Check if the date is valid before formatting
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", options);
    } else {
      return "Invalid Date"; // Handle invalid dates
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddStockist = () => {
    // Make sure all fields are filled
    if (
      !newStockistData.name ||
      !newStockistData.gstno ||
      !newStockistData.email
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Prepare the data for the POST request
    const postData = {
      name: newStockistData.name,
      gstNumber: newStockistData.gstno,
      email: newStockistData.email,
    };

    // Send a POST request to add a new stockist
    axios
      .post("http://localhost:5000/api/stockists", postData)

      .then((response) => {
        // Handle the success case
        alert("Stockist added successfully.");

        // Clear the newStockistData state and close the popup
        setNewStockistData({
          name: "",
          gstno: "",
          email: "",
        });
        setShowPopup(false);

        // Fetch the updated stockists data here
        axios
          .get("http://localhost:5000/api/stockists")
          .then((response) => {
            setStockists(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching stockists:", error);
          });
      })
      .catch((error) => {
        // Handle the error case
        console.error("Error adding stockist:", error);
        alert("Error adding stockist. Please try again.");
      });
  };

  const handleEdit = (stockist) => {
    setSelectedStockist(stockist);
    // Calculate and autofill the Balance based on Total Billed and Total Paid
    const totalBilled = parseFloat(stockist.totalBilled || 0);
    const totalPaid = parseFloat(stockist.totalPaid || 0);
    const balance = totalBilled - totalPaid;

    setSelectedStockist({
      ...stockist,
      balance: balance.toFixed(2), // Assuming you want to display balance with 2 decimal places
    });
  };

  const handleSaveEdit = () => {
    // Implement logic to save the edited stockist here
    if (selectedStockist) {
      // Prepare the data for the PUT request
      const editedData = {
        name: selectedStockist.name,
        gstNumber: selectedStockist.gstNumber,
        email: selectedStockist.email,
        // Add the fields for Total Billed, Total Paid, and Balance here
        totalBilled: selectedStockist.totalBilled,
        totalPaid: selectedStockist.totalPaid,
        balance: selectedStockist.balance,
      };

      axios
        .put(
          `http://localhost:5000/api/stockists/${selectedStockist._id}`,
          editedData
        )
        .then((response) => {
          toast.success("stockist updated successfully", {
            autoClose: 2000,
          });

          // Clear selectedStockist after update
          setSelectedStockist(null);

          // Fetch the updated stockists data here
          axios
            .get("http://localhost:5000/api/stockists")
            .then((response) => {
              setStockists(response.data);
            })
            .catch((error) => {
              console.error("Error fetching stockists:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating stockist:", error);
          toast.error("Error updating stockist");
        });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <PharmacyNav />

      <div className="stockists-container">
        <div
          className="stockheaderv"
          style={{ fontFamily: "Inria Serif" }}
        ></div>
        <h3>
          <Link to="/PharmacyHome">
            <FaArrowCircleLeft style={{color:'#9b8bf4'}} />
          </Link>{" "}
          &nbsp; Pharmacy Stockists
        </h3>
        <div className="search-add-container">
          <div className="searchtopheader">
            <div className="search-bar">
              <input className="search-input-stock"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontFamily: "Inria Serif" }}
              />
              <i className="fa fa-search"></i>
            </div>
            <button
              className="add-stockists-button"
              onClick={togglePopup}
              style={{ fontFamily: "Inria Serif" }}
            >
              Add Stockists
            </button>
          </div>
          <table className="stockists-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Name</th>
                <th>GST Number</th>
                <th>Email</th>
                <th>Added Date</th>
                <th>Total Billed</th>
                <th>Total Paid</th>
                <th>Balance</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {stockists
                .filter((stockAdjustment) =>
                  Object.values(stockAdjustment)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((stockist) => (
                  <tr key={stockist.uniqueId}>
                    <td>{stockist.uniqueId}</td>
                    <td>{stockist.name}</td>
                    <td>{stockist.gstNumber}</td>
                    <td>{stockist.email}</td>
                    <td>{formatDate(stockist.addDate)}</td>
                    <td>{stockist.totalBilled}</td>
                    <td>{stockist.totalPaid}</td>
                    <td>{stockist.balance}</td>
                    <td>
                    <button
                          className="edit-button_5"
                          onClick={() => handleEdit(stockist)}
                        >
                          <BiEdit size={25} />
                        </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">
            <ReactJsPagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={stockists.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
          {showPopup && (
            <div className="popupv">
              <div className="popupv-header">
                Add Stockists
                <button className="close-button" onClick={togglePopup}>
                  X
                </button>
              </div>
              <hr />
              <div className="popupv-content">
                <input
                  type="text"
                  placeholder="Stockist Name"
                  value={newStockistData.name}
                  onChange={(e) =>
                    setNewStockistData({
                      ...newStockistData,
                      name: e.target.value,
                    })
                  }
                />
                &nbsp;&nbsp;
                <input
                  type="text"
                  placeholder="GST Number"
                  value={newStockistData.gstno}
                  onChange={(e) =>
                    setNewStockistData({
                      ...newStockistData,
                      gstno: e.target.value,
                    })
                  }
                />
                &nbsp;&nbsp;
                <input
                  type="email"
                  placeholder="Stockist Email"
                  value={newStockistData.email}
                  onChange={(e) =>
                    setNewStockistData({
                      ...newStockistData,
                      email:e.target.value,
                    })
                  }
                />
                &nbsp;&nbsp;
                <button className="addclose-button" onClick={handleAddStockist}>
                  Add
                </button>
              </div>
            </div>
          )}
          {selectedStockist && (
  <div className="popup-1">
    <div className="popup-header-1">
      Edit Stockist
      <button
        className="close-button"
        onClick={() => setSelectedStockist(null)}
      >
        <AiOutlineCloseCircle size={25} />
      </button>
    </div>
    <div className="popup-content-ss">
      <input
        type="text"
        placeholder="Name"
        value={selectedStockist.name}
        onChange={(e) =>
          setSelectedStockist({
            ...selectedStockist,
            name: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="GST Number"
        value={selectedStockist.gstNumber}
        onChange={(e) =>
          setSelectedStockist({
            ...selectedStockist,
            gstNumber: e.target.value,
          })
        }
      />
      <input
        type="email"
        placeholder="Email"
        value={selectedStockist.email}
        onChange={(e) =>
          setSelectedStockist({
            ...selectedStockist,
            email: e.target.value,
          })
        }
      />
      {/* Add fields for Total Billed, Total Paid, and Balance here */}
      <input
        type="text"
        placeholder="Total Billed"
        value={selectedStockist.totalBilled}
        onChange={(e) =>
          setSelectedStockist({
            ...selectedStockist,
            totalBilled: e.target.value,
            // Update Balance based on Total Billed and Total Paid
            balance: (
              parseFloat(e.target.value || 0) -
              parseFloat(selectedStockist.totalPaid || 0)
            ).toFixed(2),
          })
        }
      />
      <input
        type="text"
        placeholder="Total Paid"
        value={selectedStockist.totalPaid}
        onChange={(e) =>
          setSelectedStockist({
            ...selectedStockist,
            totalPaid: e.target.value,
            // Update Balance based on Total Billed and Total Paid
            balance: (
              parseFloat(selectedStockist.totalBilled || 0) -
              parseFloat(e.target.value || 0)
            ).toFixed(2),
          })
        }
      />
      <input
        type="text"
        placeholder="Balance"
        value={selectedStockist.balance}
        readOnly // Make the Balance field read-only
      />
      {/* Save button */}
      <button className="save-stockist-button" onClick={handleSaveEdit}>
        <FiSave size={25} />
      </button>
    </div>
  </div>
)}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Stockists;