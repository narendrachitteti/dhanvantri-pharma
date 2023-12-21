/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiFillDelete } from "react-icons/ai";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Select from "react-select";
import "./InvoiceStock.css";
import PharmacyNav from "./PharmacyNav";

const InvoiceStock = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [tableData, setTableData] = useState([]);
const [stockName, /* setStockName */] = useState("");
  const [date, setDate] = useState("");
  const [Medicine, setMedicine] = useState("");
  const [Manufacturer, setManufacturer] = useState("");
  const [Category, setCategory] = useState("");
  const [Batch, setBatch] = useState("");
  const [BatchExpiry, setBatchExpiry] = useState("");
  const [Unit, setUnit] = useState("");
  const [strips, setstrips] = useState("");
  const [Freestrips, setFreestrips] = useState("");
  const [ Gst , setGst] = useState("");
  const [supplieddate, setSupplieddate] = useState("");
  const [ /*CGst */, setCGst] = useState("");
  const [/*SGst */, setSGst] = useState("");
  const [price, setPrice] = useState("");
  const [MRP, setMRP] = useState("");
  const [Discount, setDiscount] = useState("");
  const [Total, setTotal] = useState("");
  const [HSNcode, setHSNcode] = useState("");
  const [RackNo, setRackNo] = useState("");
  const [BookNo, setBookNo] = useState("");
  const [NetPrice, setNetPrice] = useState("");
  const [stockistOptions, setStockistOptions] = useState([]);
  const [isGSTSet, setIsGSTSet] = useState(false); // Track whether GST has been set for the current invoice
  const [totalGST, setTotalGST] = useState(0); // Store the total GST for the current invoice

  const [isPopupVisible,setPopupVisible] = useState(false);

 

  const [/*totalAmountBeforeTax */, setTotalAmountBeforeTax] = useState(0);
  const [/*totalDiscountAmount */, setTotalDiscountAmount] = useState(0);
  // const [/*totalDiscountPercentage */, setTotalDiscountPercentage] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [stockistValue, setStockistValue] = useState("");


  // const [isPopupVisible, setPopupVisible] = useState(false);

  const data = [
    {
      slno: 1,
      invoiceNumber: "INV001",
      product: "Product A",
      expiryDate: "2023-12-31",
      daysToExpire: 15,
    },
    {
      slno: 2,
      invoiceNumber: "INV002",
      product: "Product B",
      expiryDate: "2023-12-20",
      daysToExpire: 5,
    },
    // Add more data as needed
  ];
  const openPopup = () => {
    console.log("Opening popup");
    setPopupVisible(true);
  };


  const handleGSTChange = (e) => {
    const newGST = parseFloat(e.target.value);

    // Calculate CGST and SGST based on GST value
    const newCGST = newGST / 2;
    const newSGST = newGST / 2;

    // Store the total GST value for this invoice
    setTotalGST(newGST);
    setIsGSTSet(true); // Flag that GST has been set for this invoice

    // Update state with new values
    setGst(newGST);
    setCGst(newCGST);
    setSGst(newSGST);
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const calculateNetPrice = () => {
    // Calculate Net Price based on the formula
  
    const noOfStrips = parseFloat(strips);
    const gstPercentage = parseFloat(Gst);
    const pricePerStrip = parseFloat(price);
    const discountPercentage = parseFloat(Discount) || 0; // Get the discount percentage

    if (
      !isNaN(noOfStrips) &&
      !isNaN(gstPercentage) &&
      !isNaN(pricePerStrip)
    ) {
      const totalPriceBeforeDiscount =
      pricePerStrip* noOfStrips +
      pricePerStrip * noOfStrips * (gstPercentage / 100) ;

      // Calculate the discount amount
      const discountAmount =
        (totalPriceBeforeDiscount * discountPercentage) / 100;

      // Calculate Net Price by deducting the discount amount
      const netPrice = totalPriceBeforeDiscount - discountAmount;

      setNetPrice(netPrice.toFixed(2)); // Round to 2 decimal places and set in state

      // Calculate the quantity
      const quantity = pricePerStrip* noOfStrips + parseFloat(Freestrips);
      setQuantity(quantity);
    }
  };

  useEffect(() => {
    // Calculate Net Price whenever any of the dependent values change
    calculateNetPrice();
    calculateTotalPriceBeforeTax();
  }, [Unit, strips, Gst, price, Freestrips, Discount]);

  const calculateInTax = (rowData) => {
    // Get the necessary values from the rowData
    const netPrice = parseFloat(rowData.NetPrice);
    const gstPercentage = parseFloat(rowData.Gst);

    if (!isNaN(netPrice) && !isNaN(gstPercentage)) {
      // Calculate In Tax(Rs) based on the formula
      const inTaxRs = (netPrice * gstPercentage) / 100;
      return inTaxRs.toFixed(2); // Round to 2 decimal places
    }

    return "0.00"; // Default value if values are invalid
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100px", 
    }),
  };

  const handleActionButton = (action) => {
    if (action === "add") {
      // Create a new medicine object with the current state values
      const newMedicine = {
        MedId: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        Medicine,
        Manufacturer,
        Category,
        Batch,
         BatchExpiry: selectedDate ? `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getFullYear()).slice(-2)}` : "", // Fetch month and year as MM-YY
        Unit,
        strips,
        Freestrips,
        Gst,
        price,
        MRP,
        Discount,
        Total,
        HSNcode,
        RackNo,
        BookNo,
        NetPrice,
        Quantity,
      };

      // Add the new medicine object to the tableData state
      setTableData((prevTableData) => [...prevTableData, newMedicine]);

      // Clear the input fields by resetting the state
      clearInputFields();

      // Calculate the total discount amount for the entire table
      const totalDiscountAmount = tableData.reduce(
        (acc, medicine) => acc + (parseFloat(medicine.Discount) || 0),
        parseFloat(newMedicine.Discount) || 0
      );

      // Update the state with the new total discount amount
      setTotalDiscountAmount(totalDiscountAmount);


      // Log the unique ID of the newly added medicine
      console.log(
        "Unique ID of the newly added medicine:",
        newMedicine.customId
      );
    } else if (action === "clear") {
      // Clear the input fields by resetting the state
      clearInputFields();
    }
  };

  const calculateTotalDiscount = () => {
    const totalDiscount = tableData.reduce(
      (acc, row) => acc + (parseFloat(row.Discount) || 0),
      0
    );
    return totalDiscount.toFixed(2);
  };

  const clearInputFields = () => {
    setMedicine("");
    setManufacturer("");
    setCategory("");
    setBatch("");
    setBatchExpiry("");
    setUnit("");
    setstrips("");
    setFreestrips("");
    setGst("");
    setCGst("");
    setSGst("");
    setPrice("");
    setMRP("");
    setDiscount("");
    setTotal("");
    setHSNcode("");
    setRackNo("");
    setBookNo("");
    setNetPrice("");
    setQuantity("");
  };

  const handleDelete = (customId) => {
    // Update the tableData state by removing the medicine with the specified customId
    setTableData((prevTableData) =>
      prevTableData.filter((medicine) => medicine.customId !== customId)
    );

    window.alert("Medicine deleted successfully");
  };

  const handleSaveInvoice = async () => {
    try {
      // Create an array of medicines using the tableData state
      const medicines = tableData.map((row) => ({
        MedId: row.MedId,
        Medicine: row.Medicine,
        Manufacturer: row.Manufacturer,
        Category: row.Category,
        Batch: row.Batch,
        BatchExpiry: row.BatchExpiry,
        Unit: row.Unit,
        strips: row.strips,
        Freestrips: row.Freestrips,
        Gst: row.Gst,
        price: row.price,
        MRP: row.MRP,
        Discount: row.Discount,
        Total: row.Total,
        HSNcode: row.HSNcode,
        RackNo: row.RackNo,
        BookNo: row.BookNo,
        NetPrice: row.NetPrice,
        Quantity:
          parseFloat(row.Unit) * parseFloat(row.strips) +
          parseFloat(row.Freestrips),
      }));

      // Calculate the invoice details from the table data
      const calculatedAmounts = calculateAmounts();
      const newInvoice = {
        invoiceNumber,
        stockName,
        date,
        supplieddate,
        medicines, // Assign the array of medicines
        Manufacturer,
        Category,
        Total: calculatedAmounts.total,   
        Discount,
        GST: calculatedAmounts.gst,
        CGST: calculatedAmounts.cgst,
        SGST: calculatedAmounts.sgst,
        GrossAmount: calculatedAmounts.grossAmount,
        RoundOff: calculatedAmounts.roundoff,
        StocksReturned: calculatedAmounts.stocksReturned,
        PurchaseAmount: calculatedAmounts.purchaseAmount,
      };

      // Send a POST request to save the invoice details to the server
      const response = await axios.post(
        "http://localhost:5000/api/addInvoice",
        newInvoice
      );
  
      console.log(response.data);
      window.alert("Invoice added successfully");
      window.location.reload(); // Reloading the page might not be the best user experience, consider other UI updates instead
    } catch (error) {
      console.error(error);
      // Handle error if the request fails
    }
    
  };

  const calculateTotalPriceBeforeTax = () => {
    const totalPriceBeforeTax = tableData.reduce(
      (acc, row) => acc + (parseFloat(row.Total) || 0),
      0
    );
    return totalPriceBeforeTax.toFixed(2); 
  };

  useEffect(() => {
    calculateTotalPriceBeforeTax(); 
    const totalPriceBeforeTax = calculateTotalPriceBeforeTax();
    setTotalAmountBeforeTax(totalPriceBeforeTax); // Update the state
  }, [tableData] [calculateTotalPriceBeforeTax]);

  // Update the Total calculation to consider the discount
  const calculateAmounts = () => {
    // Calculate the total amount before tax and total discount amount
    let totalAmountBeforeTax = 0;
    let totalDiscountAmount = 0;

    tableData.forEach((row) => {
      const netPrice = parseFloat(row.NetPrice) || 0;
      const discountPercentage = parseFloat(row.Discount) || 0;
      const discountAmount = (netPrice * discountPercentage) / 100;

      totalAmountBeforeTax += netPrice;
      totalDiscountAmount += discountAmount;
    });

    const total = totalAmountBeforeTax - totalDiscountAmount; // Exclude discount
    const gst = isGSTSet
      ? totalGST
      : tableData.reduce((acc, row) => acc + (parseFloat(row.Gst) || 0), 0);
    const cgst = isGSTSet
      ? totalGST / 2
      : tableData.reduce((acc, row) => acc + (parseFloat(row.Gst) / 2 || 0), 0);
    const sgst = isGSTSet
      ? totalGST / 2
      : tableData.reduce((acc, row) => acc + (parseFloat(row.Gst) / 2 || 0), 0);

    const grossAmount = totalAmountBeforeTax + gst;

    const purchaseAmount = Math.floor(grossAmount * 100) / 100; // Round down to 2 decimal places
    const roundoff = (grossAmount - purchaseAmount).toFixed(2); // Round to 2 decimal places

    return {
      total: total.toFixed(2),
      discount: totalDiscountAmount.toFixed(2),
      totalAmountBeforeTax: totalAmountBeforeTax.toFixed(2),
      gst: gst.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grossAmount: grossAmount.toFixed(2),
      purchaseAmount: purchaseAmount.toFixed(2),
      roundoff: parseFloat(roundoff).toFixed(2),
    };
  };


  const amounts = calculateAmounts();
  const totalDiscount = calculateTotalDiscount();
  


  const [stockists, setStockists] = useState([]);
  const [newStockistData, setNewStockistData] = useState({
    name: "",
    gstno: "",
    email: "",
  });
  const [showPopup, setShowPopup] = useState(false);
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


  return (
    <>
      <PharmacyNav />
      <div className="container-txj" style={{fontFamily:"Inria Serif"}}>
        <div className="main-container-tjx1">
        <h3> <Link to="/PharmacyHome" style={{color:"#9b8bf4"}}> 
            <FaArrowCircleLeft />
          </Link> &nbsp;Add invoice</h3>
          <hr/>
          <div className="input-row">
            <div className="input-container">
              
                <label htmlFor="stockName">Stockist Name</label>
                <div className="stockist-merge-plus">
                <Select
                options={stockistOptions}
                value={stockistOptions.find((option) => option.value === stockistValue)}
                onChange={(selectedOption) => setStockistValue(selectedOption.value)}
                styles={customStyles}
              />
              {/* <button className="plus"   onClick={togglePopup}>+</button>  */}
            </div>
            </div>
            <div className="input-container">
              <label htmlFor="date"> Invoice Date</label>
              <input
                type="date"
                id="date1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="invoiceNumber">Invoice Number</label>
              <input 
                type="text"
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="date"> Supplied Date</label>
              <input
                type="date"
                id="date2"
                value={supplieddate}
                onChange={(e) => setSupplieddate(e.target.value)}
              />
            </div>

            
            <div className="BatchExpiryContainer">
              <button className="BatchExpiryButton" onClick={openPopup}>
                About To Expire
              </button>
              {isPopupVisible && (
                <div className="BatchExpiryPage">
                  <button
                    className="close-button"
                    onClick={() => setPopupVisible(false)}
                  >
                    X
                  </button>
                  <hr />
                  
                  <div className="popupv-content-batchexpiry">
                    <div className="popup-container-batch">
                      <div className="TableContainerBatchExpiry">
                        <table className="DataTableBatchExpiry">
                          <thead>
                            <tr>
                              <th className="TableHeaderBatchExpiry">Sl. No</th>
                              <th className="TableHeaderBatchExpiry">
                                Invoice Number
                              </th>
                              <th className="TableHeaderBatchExpiry">
                               StockName
                              </th>
                              <th className="TableHeaderBatchExpiry">
                                Expiry Date
                              </th>
                              <th className="TableHeaderBatchExpiry">
                                Days About to Expire
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr key={item.slno}>
                                <td className="TableCellBatchExpiry">
                                  {item.slno}
                                </td>
                                <td className="TableCellBatchExpiry">
                                  {item.invoiceNumber}
                                </td>
                                <td className="TableCellBatchExpiry">
                                  {item.stockName}
                                </td>
                                <td className="TableCellBatchExpiry">
                                  {item.expiryDate}
                                </td>
                                <td className="TableCellBatchExpiry">
                                  {item.daysToExpire}
                                </td>
                              </tr>
                            ))}
                            {/* {data.map((item) => ( */}
                              <tr >
                                <td className="TableCellBatchExpiry">
                                  
                                </td>
                                <td className="TableCellBatchExpiry">
                                 
                                </td>
                                <td className="TableCellBatchExpiry">
                                 
                                </td>
                                <td className="TableCellBatchExpiry">
                                 
                                </td>
                                <td className="TableCellBatchExpiry">
                                 
                                </td>
                              </tr>
                            
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>



            </div>
          </div>
        </div>
     

      {showPopup && (
            <div className="popupf">
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




      <div className="second-container-txj"style={{fontFamily:"Inria Serif"}} >
        <div className="input-boxes">
        <div className="input-row-1">
          <div className="input-container-1">
            <label htmlFor="Medicine">Product</label>
            <input
              type="text"
              id="Medicine"
              value={Medicine}
              onChange={(e) => setMedicine(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Manufacturer">Manufacturer</label>
            <input
              type="text"
              id="Manufacturer"
              value={Manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Category">Category</label>
            <input
              type="text"
              id="Category"
              value={Category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Batch">Batch </label>
            <input
              type="Batch"
              id="Batch"
              value={Batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
          <label htmlFor="BatchExpiry">Batch Expiry</label>
 <DatePicker
          id="BatchExpiry"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MM-yy"
          showMonthYearPicker
          placeholderText="MM-YY"
        />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Unit">Packing</label>
            <input
              type="number"
              id="Unit"
              value={Unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="strips">No of Strips</label>
            <input
              type="number"
              id="strips"
              value={strips}
              onChange={(e) => setstrips(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Freestrips">Free strips</label>
            <input
              type="number"
              id="Freestrips"
              value={Freestrips}
              onChange={(e) => setFreestrips(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="Gst">GST Total%</label>
            <input
              type="number"
              id="Gst"
              value={Gst}
              onChange={handleGSTChange}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="price">Price/Strip</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="input-container-1">
            <label htmlFor="MRP">MRP/Strip</label>
            <input
              type="number"
              id="MRP"
              value={MRP}
              onChange={(e) => setMRP(e.target.value)}
            />
          </div>
          &nbsp;
          <div className="input-container-1">
            <label htmlFor="DiscountInput">Discount</label>
            <input
              type="number"
              id="percentageInput"
              value={Discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>

        <div className="input-row-3">
          <div className="input-container-2">
            <label htmlFor="HSNCode">HSN Code</label>
            <input className="hsn-input"
              type="text"
              id="HSNcode"
              value={HSNcode}
              onChange={(e) => setHSNcode(e.target.value)}
            />
          </div>
          &nbsp;&nbsp;
          {/* <div className="input-container-2">
            <label htmlFor="RackNo">Rack No</label>
            <input className="rack-input"
              type="text"
              id="RackNo"
              value={RackNo}
              onChange={(e) => setRackNo(e.target.value)}
            />
          </div> */}
          &nbsp;&nbsp;
          {/* <div className="input-container-2">
            <label htmlFor="BookNo">Book No</label>
            <input className="book-input"
              type="text"
              id="BookNo"
              value={BookNo}
              onChange={(e) => setBookNo(e.target.value)}
            />
          </div> */}
          &nbsp;&nbsp;
          <div className="input-container-2">
            <label htmlFor="NetPrice">Net Price</label>
            <input className="netp-input"
              type="text"
              id="NetPrice"
              value={NetPrice}
              onChange={(e) => setNetPrice(e.target.value)}
            />
          </div>
          &nbsp;&nbsp;
          <div className="input-container-2">
            {" "}
            <button
              className="button-nhy"
              onClick={() => handleActionButton("add")}
            >
              Add{" "}
            </button>{" "}
          </div>{" "}
          &nbsp; &nbsp; &nbsp;
          <div className="input-container-2">
            {" "}
            <button
              className="button-nhy1"
              onClick={() => handleActionButton("clear")}
            >
              clear
            </button>{" "}
          </div>
        </div>
        </div>
        <div className="container-table-tnx" >
          <table className="invoice-table">
            <thead >
              <tr>
                <th>Product</th>
                <th>Manufacturer</th>
                <th>Category</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>GST%</th>
                <th>SGST%</th>
                <th>CGST%</th>
                <th>Packing</th>
                <th>No of Strips</th>
                <th>Price/Strip</th>
                <th>MRP/Strip</th>
                <th>Discount</th>
                <th>In Tax(Rs)</th>
                <th>Total price</th>
                <th>Quantity</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row._id}>
                  <td>{row.Medicine}</td>
                  <td>{row.Manufacturer}</td>
                  <td>{row.Category}</td>
                  <td>{row.Batch}</td>
                  <td>{row.BatchExpiry}</td>
                  <td>{row.Gst}</td>
                  <td>{(row.Gst / 2).toFixed(2)}</td>
                  <td>{(row.Gst / 2).toFixed(2)}</td>
                  <td>{row.Unit}</td>
                  <td>{row.strips}</td>
                  <td>{row.price}</td>
                  <td>{row.MRP}</td>
                  <td>{row.Discount}</td>
                  <td>{calculateInTax(row)}</td>
                  <td>{row.NetPrice}</td>
                  <td>{row.Quantity}</td>
                  <td>
                    <button
                      style={{ color: "red" }}
                      onClick={() => handleDelete(row.customId)} // Pass the customId to the handleDelete function
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="end-page-tnx">
          <div className="Remarks-page-tnx">
            {/* <h5 className="heading-remarks-tnx">Remarks</h5>
        <input type="text" className='box'/> */}
          </div>
        </div>
        <table className="Amount-table-table">
          <tbody>
            <tr>
              <td>Total</td>
              <td>{amounts.total}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>{totalDiscount}%</td>
            </tr>

            <tr>
              <td>Total Disc Amount</td>
              <td>{amounts.discount}</td>
            </tr>
            <tr>
              <td>Total Tax(GST)</td>
              <td>{amounts.gst}</td>
            </tr>
            <tr>
              <td>CGST</td>
              <td>{amounts.cgst}</td>
            </tr>
            <tr>
              <td>SGST</td>
              <td>{amounts.sgst}</td>
            </tr>
            <tr>
              <td>Gross Amount</td>
              <td>{amounts.grossAmount}</td>
            </tr>
            <tr>
              <td>Round Off</td>
              <td>{amounts.roundoff}</td>
            </tr>
            {/* <tr>
      <td>Stocks Returned</td>
      <td>{amounts.stocksReturned}</td>
    </tr> */}
            <tr>
              <td>Purchase Amount</td>
              <td>{amounts.grossAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="save-tnx">
        <button className="save-tnx1" onClick={handleSaveInvoice} style={{backgroundColor:"#9b8bf4",fontFamily:"Inria Serif"}}>
          Save Invoice
        </button>
      </div>
    </>
  );
};

export default InvoiceStock;