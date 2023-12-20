import React, { useState, useEffect } from "react";
import "./CreateOrder.css";
import axios from "axios";
import Select from "react-select"; 
import { AiFillPrinter } from "react-icons/ai";
import { BiSolidDownload } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import PharmacyNav from "./PharmacyNav";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft , FaSave  } from "react-icons/fa";

const CreatePurchaseOrder = () => {


  
  const [stockistValue, setStockistValue] = useState("");
  const [date, setdate] = useState("");
  const [Medicine, setMedicine] = useState("");
  const [Manufacturer, setManufacturer] = useState("");
  const [UnitStrip, setUnitStrip] = useState("");
  const [NoOfStrips, setNoOfStrips] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [, setIsEditing] = useState(false);
  const [stockistOptions, setStockistOptions] = useState([]);
  const [customOrderId, setCustomOrderId] = useState(""); // State for custom order ID
  const [editData, setEditData] = useState({
    id: "",
    unitstrips: "",
    NoOfStrips: "",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/downloadOrdersCSV"
      );
      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "purchase_orders.csv";
      downloadLink.click();
    } catch (error) {
      console.error("Error downloading orders:", error);
    }
  };

  // Update your handleDeleteRow function to handle the delete operation
  const handleDeleteRow = (rowIndex) => {
    // Filter out the row at the specified index from the tableData
    const updatedTableData = [...tableData];
    updatedTableData.splice(rowIndex, 1);
    setTableData(updatedTableData);
    window.alert("Order deleted successfully");
  };

    // Function to open the edit form
    const openEditForm = (rowData) => {
      setIsEditFormOpen(true);
      setEditData({
        id: rowData._id,
        unitstrips: rowData.unitstrips,
        NoOfStrips: rowData.NoOfStrips,
      });
    };
  
    // Function to close the edit form
    const closeEditForm = () => {
      setIsEditFormOpen(false);
    };
  

  const handleSave = () => {
    if (UnitStrip && NoOfStrips && Manufacturer) {
      const orderedQuantity = UnitStrip * NoOfStrips;
      const newItem = {
        Medicine: Medicine || "",
        Manufacturer: Manufacturer,
        unitstrips: UnitStrip,
        NoOfStrips: NoOfStrips,
        orderedQuantity: orderedQuantity,
      };

      // Add the new item to tableData
      setTableData((prevData) => [...prevData, newItem]);

      // Clear the input fields
      setMedicine("");
      setManufacturer("");
      setUnitStrip("");
      setNoOfStrips("");
    } else {
      window.alert("Please fill in all the required fields.");
    }
  };

  const handleClearInputs = () => {
    setMedicine("");
    setManufacturer("");
    setUnitStrip("");
    setNoOfStrips("");
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (tableData.length === 0) {
      window.alert("Please add items to the order before saving.");
      return;
    }

    try {
      const newOrder = {
        stockistName: stockistValue,
        date,
        items: tableData,
        status: "ongoing",
      };

      const response = await axios.post(
        "http://localhost:5000/api/addCreatePurchaseOrder",
        newOrder
      );

      if (response.status === 201) {
        // Retrieve the custom order ID from the response
        const generatedCustomOrderId = response.data.customOrderId;
        setCustomOrderId(generatedCustomOrderId); // Set the custom order ID in state

        window.alert("Order saved successfully");
        fetchCreateOrder();
        setStockistValue("");
        setdate("");
      } else {
        console.error("Failed to save order:", response.statusText);
        window.alert("Failed to save order. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      window.alert(
        "An error occurred while saving the order. Please try again later."
      );
    }
  };

  const fetchCreateOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getCreatePurchaseOrders"
      );
      const orders = response.data;

      const orderDetailsPromises = orders.map(async (order) => {
        const stockistResponse = await axios.get(
          `http://localhost:5000/api/stockists/${order.stockistName}`
        );
        const stockist = stockistResponse.data;
        return {
          ...order,
          stockistName: stockist.name,
        };
      });

      const updatedOrders = await Promise.all(orderDetailsPromises);

      setTableData(updatedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  // // Update your handleEdit function to set the editData state and open the edit form
  // const handleEdit = (rowData) => {
  //   setIsEditing(true);
  //   setEditData({
  //     id: rowData._id, // Assuming _id is the unique identifier for your items
  //     itemId: rowData._id, // Replace 'item_id' with the actual property name in your data
  //     unitstrips: rowData.unitstrips,
  //     NoOfStrips: rowData.NoOfStrips,
  //   });
  // };

  const handleEditSubmit = () => {
    // Calculate the new orderedQuantity based on the updated unitstrips and NoOfStrips
    const newOrderedQuantity = editData.unitstrips * editData.NoOfStrips;

    // Find the index of the edited item in tableData
    const itemIndex = tableData.findIndex((item) => item._id === editData.id);

    if (itemIndex !== -1) {
      // Update the item in tableData with the new data
      const updatedTableData = [...tableData];
      updatedTableData[itemIndex] = {
        ...updatedTableData[itemIndex],
        unitstrips: editData.unitstrips,
        NoOfStrips: editData.NoOfStrips,
        orderedQuantity: newOrderedQuantity,
      };

      // Update the state with the updated tableData
      setTableData(updatedTableData);

      // Reset the edit state
      setIsEditing(false);
    } else {
      window.alert("Item not found for editing. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch stockist options from the backend
    const fetchStockistOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stockists");
        const stockistData = response.data;
        const options = stockistData.map((stockist) => ({
          value: stockist.name,
          label: stockist.name,
        }));
        setStockistOptions(options);
      } catch (error) {
        console.error("Error fetching stockist options:", error);
      }
    };

    fetchStockistOptions();
  }, []);

  useEffect(() => {
    fetchCreateOrder();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100px", // Adjust the width as needed
    }),
  };

  return (
    <>
      <PharmacyNav />
      <div className="create-purchase-order" style={{fontFamily:"Inria Serif"}}>
        <div className="header-cpo">
          <h2 style={{fontWeight:'25px'}}>
            {" "}
            <Link to="/PharmacyHome" style={{color:"#9b8bf4" ,fontSize:'1.2em' , marginBottom:'0em'}}>
              <FaArrowCircleLeft />
            </Link>{" "}
            &nbsp; &nbsp; Create Purchase Order
          </h2>
        </div>
        <hr />
        <div className="stocklist-cpo">
          <div className="stocklist-cpo1">
            <label className="cr-order-l" htmlFor="stockName">Stockist Name</label>
            <Select
              options={stockistOptions}
              value={stockistOptions.find((option) => option.value === stockistValue)}
              onChange={(selectedOption) => setStockistValue(selectedOption.value)}
              styles={customStyles}
            />
          </div>
          <div className="stocklist-cpo1">
            <label className="cr-order-l" htmlFor="Medicine">Medicine Name</label>
            <input className="createOrderInput"
              type="text"
              id="Medicine"
              value={Medicine}
              onChange={(e) => setMedicine(e.target.value)}
            />
          </div>
          <div className="stocklist-cpo1">
            <label className="cr-order-l" htmlFor="Manufacturer">Manufacturer Name</label>
            <input className="createOrderInput"
              type="text"
              id="Manufacturer"
              value={Manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>
          <div className="stocklist-cpo1">
            <label className="cr-order-l" htmlFor="date">Order Date</label>
            <input className="createOrderInput"
              type="date"
              id="date"
              value={date}
              onChange={(e) => setdate(e.target.value)}
            />
          </div>
        </div>
        <div className="stocklist-cposecond">
          <div className="stocklist-cpo2">
            <label className="cr-order-l" htmlFor="UnitStrip">Unit / Strip</label>
            <input className="createOrderInput"
              type="text"
              id="UnitStrip"
              value={UnitStrip}
              onChange={(e) => setUnitStrip(e.target.value)}
            />
          </div>
          <div className="stocklist-cpo2">
            <label className="cr-order-l" htmlFor="NoOfStrips">No Of Strips</label>
            <input className="createOrderInput"
              type="text"
              id="NoOfStrips"
              value={NoOfStrips}
              onChange={(e) => setNoOfStrips(e.target.value)}
            />
          </div>
          
          <div className="stocklist-cpo2">
            <button className="button-cpos" onClick={handleSave}>
              Save
            </button>
          </div>
          <div className="stocklist-cpo2">
            <button className="button-cpoc" onClick={handleClearInputs}>
              Clear
            </button>
          </div>
        
        </div>
        <div className="print-container">
          <div className="stocklist-cpo-table">
            <table className="stocklist-table-cpo">
              <thead style={{backgroundColor:'#9b8bf4'}}>
                <tr>
                  <th>Medicine</th>
                  <th>Manufacturer</th>
                  <th>Units per Strips</th>
                  <th>No Of Strips</th>
                  <th>Ordered Quantity</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.Medicine}</td>
                    <td>{row.Manufacturer}</td>
                    <td>{row.unitstrips}</td>
                    <td>{row.NoOfStrips}</td>
                    <td>{row.orderedQuantity}</td>
                    <td>
                      <button className="edit-po-button"
                        style={{ border: "1px solid white" }}
                        onClick={() => openEditForm(row)}
                      >
                        <BiEdit size={25} />
                      </button>
                      <button className="delete-po-button"
                        style={{ color: "red", border: "1px solid white" }}
                        onClick={() => handleDeleteRow(index)}
                      >
                        <MdDelete size={25} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="stocklist-cpo-buttonsecond">
          <div className="hidden-element">Custom Order ID: {customOrderId}</div>
          <button
            className="print-co"
            onClick={handleSaveOrder}
            disabled={tableData.length === 0}
             >
           <FaSave />
          </button>&nbsp;&nbsp;
          <button
            className="print-co"
            onClick={handlePrint}
            disabled={tableData.length === 0}
          style={{backgroundColor:"#9b8bf4"}}>
            <AiFillPrinter />
          </button>
          <button
            className="download-co"
            onClick={handleDownload}
            disabled={tableData.length === 0}
            style={{backgroundColor:"#9b8bf4"}} >
            <BiSolidDownload />
          </button>
        </div>
        {isEditFormOpen && (
          <div className="popup-edit-form">
            <div className="edit-form">
              <h3>Edit Purchase Order</h3>
              <label className="cr-order-l" htmlFor="editUnitStrips">Unit/Strips:</label>
              <input
                type="text"
                id="editUnitStrips"
                value={editData.unitstrips}
                onChange={(e) =>
                  setEditData({ ...editData, unitstrips: e.target.value })
                }
              />
              <label className="cr-order-l" htmlFor="editNoOfStrips">No. of Strips:</label>
              <input
                type="text"
                id="editNoOfStrips"
                value={editData.NoOfStrips}
                onChange={(e) =>
                  setEditData({ ...editData, NoOfStrips: e.target.value })
                }
              />
              <button className="button-save-po" onClick={handleEditSubmit}>
                <FiSave size={30} />
              </button>
              <button className="button-cancel-po" onClick={closeEditForm}>
                <AiOutlineCloseCircle size={30} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePurchaseOrder;