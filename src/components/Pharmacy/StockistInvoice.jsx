/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockistInvoice.css";
import PharmacyNav from "./PharmacyNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaEdit ,FaTrash,FaCheck,FaTimes,FaSave} from 'react-icons/fa';
import ReactJsPagination from "react-js-pagination";

const StockistInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPaidList, setTotalPaidList] = useState([]);
  const [balanceList, setBalanceList] = useState([]);
  const [returnAmountList, setReturnAmountList] = useState([]);
  const [payStatusList, setPayStatusList] = useState([]);
  const [returnStatusList, setReturnStatusList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getInvoices");
      const fetchedInvoices = response.data;
      setInvoices(fetchedInvoices);

      const filtered = fetchedInvoices.filter((invoice) => {
        const totalBilled = parseFloat(invoice.Total);
        const searchValue = searchQuery.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(searchValue) ||
          totalBilled.toString().includes(searchValue)
        );
      });

      setTotalPaidList(new Array(filtered.length).fill(""));
      setReturnAmountList(new Array(filtered.length).fill(""));
      setPayStatusList(new Array(filtered.length).fill(""));
      setReturnStatusList(new Array(filtered.length).fill(""));

      setEditingInvoiceId(null);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices()
  }, [searchQuery]); 
  

  const handleConfirmDelete = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteInvoice/${invoiceId}`);
      fetchInvoices();
      setConfirmDeleteId(null);
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Error deleting invoice");
    }
  };

  const handleEdit = (invoiceId) => {
    setEditingInvoiceId(invoiceId);
  };

  const handleSave = async (invoiceId, index) => {
    try {
      const updatedInvoice = {
        TotalPaid: totalPaidList[index],
        Balance: balanceList[index],
        ReturnAmount: returnAmountList[index],
        PayStatus: payStatusList[index],
        ReturnStatus: returnStatusList[index],
      };

      await axios.put(
        `http://localhost:5000/api/updateInvoice/${invoiceId}`,
        updatedInvoice
      );

      fetchInvoices();
      toast.success("Invoice edited and saved successfully");
    } catch (error) {
      console.error("Error editing invoice:", error);
      toast.error("Error editing invoice");
    }
  };

  const handleTotalPaidChange = (index, value) => {
    setTotalPaidList((prev) => {
      const newList = [...prev];
      newList[index] = value;
  
      const totalBilled = parseFloat(invoices[index].Total);
      const totalPaid = parseFloat(value);
      let balance = 0.00;
      let returnAmount = 0.00;
  
      if (totalPaid >= totalBilled) {
        balance = 0.00;
        returnAmount = (totalPaid - totalBilled).toFixed(2);
      } else {
        balance = (totalBilled - totalPaid).toFixed(2);
        returnAmount = 0.00;
      }
  
      setBalanceList((prevBalanceList) => {
        const newBalanceList = [...prevBalanceList];
        newBalanceList[index] = balance;
        return newBalanceList;
      });
  
      setReturnAmountList((prevReturnAmountList) => {
        const newReturnAmountList = [...prevReturnAmountList];
        newReturnAmountList[index] = returnAmount;
        return newReturnAmountList;
      });
  
      return newList;
    });
  };
  
  

  const handlePayStatusChange = (index, value) => {
    setPayStatusList((prev) => {
      const newList = [...prev];
      newList[index] = value;
      return newList;
    });
  };

  const handleReturnStatusChange = (index, value) => {
    setReturnStatusList((prev) => {
      const newList = [...prev];
      newList[index] = value;
      return newList;
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderInvoices = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return invoices.slice(startIndex, endIndex).map((invoice, index) => (
      <tr key={invoice._id}>
        <td>{invoice.invoiceNumber}</td>
        <td>{invoice.date}</td>
        <td>{invoice.Total}</td>
        <td>
          {editingInvoiceId === invoice._id ? (
            <input
              type="text"
              value={totalPaidList[index]}
              onChange={(e) => handleTotalPaidChange(index, e.target.value)}
            />
          ) : (
            invoice.TotalPaid
          )}
        </td>
        <td>
          {invoice.TotalPaid
            ? (
                parseFloat(invoice.Total) -
                parseFloat(invoice.TotalPaid)
              ).toFixed(2)
            : parseFloat(invoice.Total).toFixed(2)}
        </td>
        <td>{returnAmountList[index]}</td>
        <td>
          {confirmDeleteId !== invoice._id ? (
            <div className="status-dropdown_si">
              <select
                value={payStatusList[index]}
                onChange={(e) => handlePayStatusChange(index, e.target.value)}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          ) : null}
        </td>
        <td>
          {confirmDeleteId !== invoice._id ? (
            <div className="status-dropdown_si">
              <select
                value={returnStatusList[index]}
                onChange={(e) =>
                  handleReturnStatusChange(index, e.target.value)
                }
              >
                <option value="Returned">Returned</option>
                <option value="Not Returned">Not Returned</option>
              </select>
            </div>
          ) : null}
        </td>
        <td>
          {editingInvoiceId === invoice._id ? (
            <div>
              <button
                className="save-button_si"
                onClick={() => handleSave(invoice._id, index)}
              >
                <FaSave />
              </button>
              <button
                className="cancel-button_si"
                onClick={() => setEditingInvoiceId(null)}
              >
               <FaTimes />
              </button>
            </div>
          ) : (
            <button
              className="edit-button_si"
              onClick={() => handleEdit(invoice._id)}
            >
             <FaEdit />
            </button>
          )}
        </td>
        <td>
          {confirmDeleteId === invoice._id ? (
            <td>
              <button
                className="confirm-delete-button_si"
                onClick={() => handleConfirmDelete(invoice._id)}
              >
               <FaCheck />
              </button>
              <button
                className="cancel-delete-button_si"
                onClick={() => setConfirmDeleteId(null)}
              >
                <FaTimes />
              </button>
            </td>
          ) : (
            <td>
              <button
                className="delete-button_si"
                onClick={() => setConfirmDeleteId(invoice._id)}
              >
                <FaTrash /> 
              </button>
            </td>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <>
      <PharmacyNav/>
      <div className="container_si" style={{ fontFamily: "Inria Serif" }}>
        <h3>
          <Link to="/PharmacyHome" style={{color:'#9b8bf4'}}>
            <FaArrowCircleLeft />
          </Link>{" "}
          &nbsp; Stockist Invoices
        </h3>
        <div className="red-container-177">
          <div className="search-bar-container-177">
            <input
              type="text"
              className="search-bar-177"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <table className="invoice-table_si">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Total Billed</th>
              <th>Total Paid</th>
              <th>Balance</th>
              <th>Return Amount</th>
              <th>Pay</th>
              <th>Return</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderInvoices()}</tbody>
        </table>
        <div className="pagination">
        <ReactJsPagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={invoices.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default StockistInvoice;