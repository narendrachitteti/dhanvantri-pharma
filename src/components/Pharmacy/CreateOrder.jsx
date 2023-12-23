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
  const [stockistNames, setStockistNames] = useState([]);
  const [selectedStockist, setSelectedStockist] = useState('');
  const [products, setProducts] = useState([]);
  const [unitPerBoxes, setUnitPerBoxes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUnitPerBox, setSelectedUnitPerBox] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchUnitPerBoxes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/unitPerBoxes');
        setUnitPerBoxes(response.data);
      } catch (error) {
        console.error('Error fetching unit per boxes:', error);
      }
    };

    fetchProducts();
    fetchUnitPerBoxes();
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };
  const handleUnitPerBoxChange = (e) => {
    setSelectedUnitPerBox(e.target.value);
  };
  useEffect(() => {
    const fetchStockistNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-stockist-names'); // Replace with your API URL
        setStockistNames(response.data);
      } catch (error) {
        console.error('Error fetching stockist names:', error);
      }
    };
    fetchStockistNames();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedStockist(e.target.value);
  };
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
  const handleDeleteRow = (rowIndex) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(rowIndex, 1);
    setTableData(updatedTableData);
    window.alert("Order deleted successfully");
  };
    const openEditForm = (rowData) => {
      setIsEditFormOpen(true);
      setEditData({
        id: rowData._id,

        unitstrips: rowData.unitstrips,
        NoOfStrips: rowData.NoOfStrips,
      });
    };
    const closeEditForm = () => {
      setIsEditFormOpen(false);
    };
    const handleSave = () => {
      try {
        // Check if all required fields are filled
        if (!selectedProduct || !Manufacturer || !selectedUnitPerBox || !NoOfStrips) {
          window.alert("Please fill in all the required fields.");
          return;
        }
    
        // Calculate ordered quantity
        const orderedQuantity = selectedUnitPerBox * NoOfStrips;
    
        // Prepare the new item
        const newItem = {
          Medicine: selectedProduct,
          stockistName: selectedStockist,
          unitstrips: selectedUnitPerBox,
          NoOfStrips,
          orderedQuantity,
        };
    
        // Update the tableData state
        setTableData((prevData) => [...prevData, newItem]);
    
        // Clear input fields
        setMedicine("");
        setManufacturer("");
        setUnitStrip("");
        setNoOfStrips("");
    
        window.alert("Data saved successfully");
      } catch (error) {
        console.error("Error saving data:", error);
        window.alert("An error occurred while saving data. Please try again later.");
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
          "http://localhost:5000/api/createPurOrder",
          newOrder
        );
    
        if (response.status === 201) {
          const generatedCustomOrderId = response.data.customOrderId;
          setCustomOrderId(generatedCustomOrderId);
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
  const handleEditSubmit = () => {
    const newOrderedQuantity = editData.unitstrips * editData.NoOfStrips;
    const itemIndex = tableData.findIndex((item) => item._id === editData.id);

    if (itemIndex !== -1) {
      const updatedTableData = [...tableData];
      updatedTableData[itemIndex] = {
        ...updatedTableData[itemIndex],
        unitstrips: editData.unitstrips,
        NoOfStrips: editData.NoOfStrips,
        orderedQuantity: newOrderedQuantity,
      };
      setTableData(updatedTableData);
      setIsEditing(false);   
    } else {
      window.alert("Item not found for editing. Please try again.");
    }
  };

  useEffect(() => {
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
      width: "100px", 
    }),
  };

const [units, setUnits] = useState([]);
const [selectedUnit, setSelectedUnit] = useState('');
 
  
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/unitPerBox'); 
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };
    fetchUnits();
  }, []);


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
            <select value={selectedStockist} onChange={handleSelectChange}>
        <option value="">Select a stockist</option>
        {stockistNames.map((stockist, index) => (
          <option key={index} value={stockist.stockistName}> 
            {stockist.name} 
          </option>
        ))}
      </select>
          </div>
          <div className="stocklist-cpo1">
            <label className="cr-order-l" htmlFor="Medicine">Medicine Name</label>
            <select
        id="productSelect"
        className="createOrderInput"
        value={selectedProduct}
        onChange={handleProductChange}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product._id} value={product.product}>
            {product.product}
          </option>
        ))}
      </select>
            
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
        <label className="cr-order-l" htmlFor="UnitStrip">
          Unit / Strip
        </label>
        <select
          id="unitPerBoxSelect"
          className="createOrderInput"
          value={selectedUnitPerBox}
          onChange={handleUnitPerBoxChange}
        >
          <option value="">Select an option</option>
          {units.map((item) => (
            <option key={item._id} value={item.unitPerBox}>
              {item.unitPerBox}
            </option>
          ))}
        </select>
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
                  <th>Stockist Name</th>
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
    <td>{row.stockistName}</td>
    <td>{row.unitstrips}</td>
    <td>{row.NoOfStrips}</td>
    <td>{row.orderedQuantity}</td>
    <td>
      <button
        className="edit-po-button"
        style={{ border: "1px solid white" }}
        onClick={() => openEditForm(row)}
      >
        <BiEdit size={25} />
      </button>
      <button
        className="delete-po-button"
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