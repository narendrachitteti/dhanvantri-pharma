import React, { useState, useEffect } from "react";
import "./OrderList.css";
import { BiEdit } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import ReactJsPagination from "react-js-pagination";

function Search({ filterText, onFilterTextChange }) {
  return (
    <div className="searchBox-main" style={{ fontFamily: "Inria Serif"  }}>
      <div className="search-box-tnx" style={{ background: "white" }}>
        <input
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function OrderList() {
  const [filterText, setFilterText] = useState("");
  const [table1, setTable1] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:5000/api/getCreatePurchaseOrders")
      .then((response) => response.json())
      .then((data) => {
        const initialOrders = data.map((order) => ({
          customOrderId: order.customOrderId,
          stockistName: order.stockistName,
          date: order.date,
          status: order.status,
        }));
        setTable1(initialOrders);
        setFilteredOrders(initialOrders);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filterOrders = (query) => {
      const filtered = table1.filter(
        (row) =>
          row.customOrderId?.toLowerCase().includes(query.toLowerCase()) ||
          row.stockistName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrders(filtered);
    };

    filterOrders(filterText);
  }, [filterText, table1]);

  const updateStatus = async (customOrderId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/updateOrder/${customOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.customOrderId === customOrderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again later.");
    }
  };

  const handleDeleteOrder = (customOrderId) => {
    const confirmDelete = window.confirm("Do you want to delete this order?");
    if (confirmDelete) {
      deleteOrder(customOrderId);
    }
  };

  const deleteOrder = async (customOrderId) => {
    try {
      await fetch(`http://localhost:5000/api/deleteOrder/${customOrderId}`, {
        method: "DELETE",
      });

      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order.customOrderId !== customOrderId)
      );

      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again later.");
    }
  };

  const handleEditOrder = (customOrderId) => {
    const confirmEdit = window.confirm("Do you want to save the changes?");
    if (confirmEdit) {
      saveChanges(customOrderId);
    }
  };

  const saveChanges = async (customOrderId) => {
    try {
      const editedOrder = filteredOrders.find(
        (order) => order.customOrderId === customOrderId
      );

      await fetch(`http://localhost:5000/api/updateOrder/${customOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedOrder),
      });

      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.customOrderId === customOrderId
            ? { ...order, editing: false }
            : order
        )
      );

      toast.success("Status changed successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again later.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredOrders.slice(startIndex, endIndex).map((row) => (
      <tr key={row.customOrderId}>
        <td>{row.customOrderId}</td>
        <td>{row.stockistName}</td>
        <td>{row.date}</td>
        <td>
          {row.editing ? (
            <select
              value={row.status}
              onChange={(e) => updateStatus(row.customOrderId, e.target.value)}
            >
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
              <option value="successful">Successful</option>
            </select>
          ) : (
            row.status
          )}
        </td>
        <td>
          {row.editing ? (
            <button className="save-ol" onClick={() => handleEditOrder(row.customOrderId)}>
             <FiSave size={25} />
            </button>
          ) : (
            <button className="edit-ol"
              onClick={() =>
                setFilteredOrders((prevOrders) =>
                  prevOrders.map((order) =>
                    order.customOrderId === row.customOrderId
                      ? { ...order, editing: !row.editing }
                      : order
                  )
                )
              }
            >
              {row.editing ? (
                <FiSave size={25} />
              ) : (
                <BiEdit size={25} />
              )}
            </button>
          )}
        </td>
        <td>
          <button className="delete-ol" onClick={() => handleDeleteOrder(row.customOrderId)}>
          <MdDelete size={25} />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <PharmacyNav />
      <div
        className="OrderList-main"
        style={{  fontFamily: "Inria Serif" }}
      ><br/>
        <h2>
          <Link to="/PharmacyHome" style={{color: "#9b8bf4" }}>
            <FaArrowCircleLeft />
          </Link>{" "}
         &nbsp;Purchase Order
        </h2>
        <hr style={{ backgroundColor: "black", padding: "1px" }} />
        <Search filterText={filterText} onFilterTextChange={setFilterText} />
        <div className="dropdown-table">
          <table className="table-dropdown">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Stockist</th>
                <th>Date</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{renderOrders()}</tbody>
          </table>
        </div>
        <div className="pagination01">
        <ReactJsPagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredOrders.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default OrderList;