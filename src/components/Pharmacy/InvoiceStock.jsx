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
  const [stockName /* setStockName */] = useState("");
  const [date, setDate] = useState("");
  const [Medicine, setMedicine] = useState("");
  const [Capsules , setCapsules] = useState("");
  const [capsulePrice , setcapsulePrice] = useState("");


  const [schedule, setschedule] = useState("");

//   const [Unit, setUnit] = useState("");
  const [strips, setstrips] = useState("");
  const [Freestrips, setFreestrips] = useState("");
  const [Gst, setGst] = useState("");
  const [supplieddate, setSupplieddate] = useState("");
  const [, /*CGst */ setCGst] = useState("");
  const [, /*SGst */ setSGst] = useState("");
  const [price, setPrice] = useState("");
  const [MRP, setMRP] = useState("");

  const [Discount, setDiscount] = useState("");
  const [Total, setTotal] = useState("");
 
//   const [RackNo, setRackNo] = useState("");
//   const [BookNo, setBookNo] = useState("");
//   const [NetPrice, setNetPrice] = useState("");
  const [stockistOptions, setStockistOptions] = useState([]);
  const [isGSTSet, setIsGSTSet] = useState(false); // Track whether GST has been set for the current invoice
  const [totalGST, setTotalGST] = useState(0); // Store the total GST for the current invoice
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedSalesRate, setSelectedSalesRate] = useState('');
  const [productOptions, setProductOptions] = useState([]);
//   const [unitPerBoxOptions, setUnitPerBoxOptions] = useState([]);

  const [/*totalAmountBeforeTax */, setTotalAmountBeforeTax] = useState(0);
  const [/*totalDiscountAmount */, setTotalDiscountAmount] = useState(0);
  // const [Quantity, setQuantity] = useState(0);
  const [stockistValue, setStockistValue] = useState("");
  const totalAmount = tableData.reduce((acc, row) => acc + row.Total, 0); 


  // const [isPopupVisible, setPopupVisible] = useState(false);

  const openPopup = () => {
    console.log("Opening popup");
    setPopupVisible(true);
  };




  // Handling product and unit per box changes




  const handleDateChange = (date) => {
    setSelectedDate(date);
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
  
    setschedule("");
    // setUnit("");
    setstrips("");
    setFreestrips("");
    setGst("");
    setCGst("");
    setSGst("");
    setPrice("");
    setptr("");
    setMRP("");
    setDiscount("");
    setTotal("");
    setHsnCode("");
    setCapsules("");
    setcapsulePrice("");
    // setRackNo("");
    // setBookNo("");
    // setNetPrice("");
    // setQuantity("");
  };

  const handleSaveInvoice = async () => {
    try {
      // Create an array of medicines using the tableData state
      const medicines = tableData.map((row) => ({
        MedId: row.MedId,
        Medicine: row.Medicine,
        manufacturer: row.manufacturer,
        schedule: row.schedule,
        batchno: row.batchno,
        expiryDate: row.expiryDate,
        // Unit: row.Unit,
        capsulePrice :row.capsulePrice,
        Capsules:row.Capsules,
        strips: row.strips,
        Freestrips: row.Freestrips,
        Gst: row.Gst,
        ptr:row.ptr,
        price: row.ptr,
        MRP: row.MRP,
        Discount: row.Discount,
        totalDiscount :row.totalDiscount,
        totalAmount: row.totalAmount,
        HSNcode: row.HSNcode,
        // RackNo: row.RackNo,
        // BookNo: row.BookNo,
        // NetPrice: row.NetPrice,
        // Quantity:
        //   parseFloat(row.Unit) * parseFloat(row.strips) +
        //   parseFloat(row.Freestrips),
      }));

      // Calculate the invoice details from the table data
      const calculatedAmounts = calculateAmounts();
      const newInvoice = {
        invoiceNumber,
        stockName:selectedStockist,
        date,
        supplieddate,
        medicines, // Assign the array of medicines
        manufacturer,
        schedule,
        Total: calculateTotalAmounts(),
        Discount: totalDiscount, 
        DiscountAmount: calculateTotalDiscounts() ,
        GST: calculatedAmounts.gst,
        CGST: calculatedAmounts.cgst,
        SGST: calculatedAmounts.sgst,
        GrossAmount: calculateGrossAmount(),
        // RoundOff: calculatedAmounts.roundoff,
        // StocksReturned: calculatedAmounts.stocksReturned,
        PurchaseAmount: calculateTotalAmounts(),
      }; // Send a POST request to save the invoice details to the server
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

  const calculateTotalDiscounts = () => {
    const totalDiscount = tableData.reduce(
      (acc, row) => acc + (parseFloat(row.DiscountAmount) || 0),
      0
    );
    return totalDiscount.toFixed(2);
  };
  

  const calculateAmounts = () => {
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
    const purchaseAmount = Math.floor(grossAmount * 100) / 100; 
    return {
      total: total.toFixed(2),
      discount: totalDiscountAmount.toFixed(2),
      totalAmountBeforeTax: totalAmountBeforeTax.toFixed(2),
      gst: gst.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grossAmount: grossAmount.toFixed(2),
      purchaseAmount: purchaseAmount.toFixed(2),
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


  const [selectedUnitPerBox, setSelectedUnitPerBox] = useState('');
  const [selectedPurchaseRate, setSelectedPurchaseRate] = useState('');


  const handleSalesRateChange = (e) => {
    setSelectedSalesRate(e.target.value);
    // Perform actions based on the selected sales rate here
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState({ hsn: '' });

  const handleSelectChange = (fieldName, selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: selectedOption.value,
    }));
  };
 

  const [stockistNames, setStockistNames] = useState([]);

  const [selectedStockist, setSelectedStockist] = useState("");



  useEffect(() => {
    const fetchStockistNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/get-stockist-names"
        );
        setStockistNames(response.data);
      } catch (error) {
        console.error("Error fetching stockist names:", error);
      }
    };
    fetchStockistNames();
  }, []);

  const handleSelectChangea = (e) => {
    setSelectedStockist(e.target.value);
  };





// const [totalValue, setTotalValue] = useState(0);

const [selectedProduct, setSelectedProduct] = useState('');
const [hsnCode, setHsnCode] = useState('');
const [manufacturer, setManufacturer] = useState('');
const [batchno, setBatchno] = useState('');
const [expiryDate, setExpiryDate] = useState('');
const [ptr, setptr] = useState('');
const [PerStrip, setPerStrip] = useState('');
const [products, setProducts] = useState([]);

const handleProductChange = async (e) => {
  const selectedProductValue = e.target.value;

  // Fetch product details based on the selected product value
  try {
    const response = await axios.get(`http://localhost:5000/api/itemdec/details?productName=${selectedProductValue}`);
    const productDetails = response.data;

    // Update state variables with fetched details
    setHsnCode(productDetails.hsnCode);
    setschedule(productDetails.schedule);
    setManufacturer(productDetails.manufacturer);
    setBatchno(productDetails.batchno);
    setExpiryDate(productDetails.expiryDate);
    setptr(productDetails.ptr);
    setPerStrip(productDetails.rate);
    setGst(productDetails.Gst);

  } catch (error) {
    console.error('Error fetching product details:', error);
  }

  // Update the selectedProduct state variable
  setSelectedProduct(selectedProductValue);
};

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/itemdec');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  fetchProducts();
}, []);

// Assuming your other imports, state, and functions are defined here...

const handleActionButton = (action) => {
  if (action === 'add') {
    // Ensure input fields contain valid numeric values before calculations
    if (!strips || !ptr || !Discount || !Gst) {
      alert('Please fill in all required fields with valid numbers.');
      return;
    }
   
  
    // Calculation logic using discountAmount and calculatedTotalValue
  
    // Example usage

    // Calculate MRP based on strips, price per strip, and discount
    const calculatedMRP = strips * ptr * (1 - Discount / 100); // Apply discount percentage

    // Calculate the total value based on calculated MRP and GST
    const calculatedTotalValue = calculatedMRP * (1 + Gst / 100); // Apply GST percentage

    // Calculate the discount amount for this row based on MRP
    const discountAmount = strips * ptr - calculatedMRP;
    
    const calculatedgrossamount = discountAmount + calculatedTotalValue ; // Calculate discount amount

    // Create a new medicine object with the current state values including calculated total value and discount amount
    const newMedicine = {
      MedId: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      Medicine: selectedProduct,
      manufacturer,
      schedule: schedule,
      batchno,
      expiryDate: expiryDate,
      // Unit: Unit,
      Capsules,
      capsulePrice,
      strips,
      Freestrips,
      Gst,
      price,
      ptr,
      MRP: calculatedMRP.toFixed(2), // Use the calculated MRP here
      Discount,
      Total: calculatedTotalValue.toFixed(2), // Add the calculated total value
      HSNcode: hsnCode,
      // RackNo,
      // BookNo,
      // NetPrice,
      // Quantity,
      DiscountAmount: discountAmount.toFixed(2), // Add the calculated discount amount
      GrossValue: calculatedgrossamount.toFixed(2), 
    };

    // Add the new medicine object to the tableData state
    setTableData((prevTableData) => [...prevTableData, newMedicine]);

    // Clear the input fields by resetting the state
    clearInputFields();
  } else if (action === 'clear') {
    // Clear the input fields by resetting the state
    clearInputFields();
  }
};


// Calculate MRP based on strips, price per strip, and discount
const calculateMRP = () => {
  const calculatedMRP = strips * ptr * (1 - Discount / 100); // Apply discount percentage
  return calculatedMRP.toFixed(2); // Return the calculated MRP with 2 decimal places
};

// Calculate total value based on MRP and GST
const calculateTotalValue = () => {
  const calculatedMRP = calculateMRP();
  const calculatedTotalValue = calculatedMRP * (1 + Gst / 100); // Apply GST percentage
  return calculatedTotalValue.toFixed(2); // Return the calculated total value with 2 decimal places
};

const handleDelete = (indexToDelete) => {
  // Update the tableData state by removing the row at the specified index
  setTableData((prevTableData) =>
    prevTableData.filter((_, index) => index !== indexToDelete)
  );
  window.alert("Row deleted successfully");
};


// const calculateTotalAmount = () => {
//   return tableData.reduce((acc, row) => acc + row.Total, 0);
// };

const calculateTotalAmounts = () => {
  const totalAmount = tableData.reduce(
    (acc, row) => acc + (parseFloat(row.Total) || 0),
    0
  );
  return totalAmount.toFixed(2);
};

const calculateGrossAmount = () => {
  const grossAmount = tableData.reduce(
    (acc, row) => acc + parseFloat(row.GrossValue || 0),
    0
  );
  return grossAmount.toFixed(2); 
};








  return (
    <>
      <PharmacyNav />
      <div className="container-txj" style={{ fontFamily: "Inria Serif" }}>
        <div className="main-container-tjx1">
          <h3>
            {" "}
            <Link to="/PharmacyHome" style={{ color: "#9b8bf4" }}>
              <FaArrowCircleLeft />
            </Link>{" "}
            &nbsp;Add invoice
          </h3>
          <hr />
          <div className="input-row">
            <div className="input-container">
              <label htmlFor="stockName">Stockist Name</label>
              <div className="stockist-merge-plus">
              
 <select
 
 value={selectedStockist} 
 onChange={handleSelectChangea}
 >
             
              {stockistNames.map((stockist, index) => (
                <option key={index} value={stockist.stockistName}>
                  {stockist.name}
                </option>
              ))}
            </select>


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
          </div>
        </div>
      </div>

      <div className="second-container-txj" style={{ fontFamily: "Inria Serif" }} >
        <div className="input-boxes">
          <div className="input-row-1">
            <div className="input-container-1">
              <label htmlFor="Medicine">Product</label>
              <select
                id="productSelect"
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
            &nbsp;
            &nbsp;


<div className="input-container-1">
  <label htmlFor="schedule">Category</label>
  <input
    type="schedule"
    id="schedule"
    value={schedule}
    onChange={(e) => setschedule(e.target.value)}
  />
</div>
            &nbsp;

            <div className="input-container-2">
        <label htmlFor="HSNCode">hsnCode</label>
        <input
          name="hsn"
          value={hsnCode}
        />
      </div>
            &nbsp;
            <div className="input-container-1">
              <label htmlFor="Manufacturer">manufacturer</label>
              <input
                type="text"
                id="Manufacturer"
                value={manufacturer}
              />
            </div>
            &nbsp;
            &nbsp;
            &nbsp;
            <div className="input-container-1">
              <label htmlFor="Batch">batchno </label>
              <input
                type="Batch"
                id="Batch"
                value={batchno}

              />
            </div>
            &nbsp;
            <div className="input-container-1">
              <label htmlFor="expiryDate">Batch Expiry</label>
              <input
                id="expiryDate"
                value={expiryDate}
              />
            </div>
            &nbsp; &nbsp;
            &nbsp;
            <div className="input-container-1">
              <label htmlFor="price">Price/perStrip</label>
              <input
                id="salesRateSelect"
                value={ptr}
              />
            </div>
          
            &nbsp;  
            
                  &nbsp;
            <div className="input-container-1">
              <label htmlFor="strips">No of Strips</label>
              <input
                type="strips"
                id="strips"
                value={strips}
                onChange={(e) => setstrips(e.target.value)}
              />
            </div>
            &nbsp;
          

            <div className="input-container-1">
              <label htmlFor="Capsules">Capsules/PerStrip</label>
              <input
                type="Capsules"
                id="Capsules"
                value={Capsules}
                onChange={(e) => setCapsules(e.target.value)}
              />
            </div>
            &nbsp; &nbsp;
            &nbsp;

            &nbsp; &nbsp;
            <div className="input-container-1">
              <label htmlFor="capsuleprice">Capsule/Price</label>
              <input
                type="capsulePrice"
                id="capsulePrice"
                value={capsulePrice}
                onChange={(e) => setcapsulePrice(e.target.value)}
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
            &nbsp;  

            <div className="input-container-1">
              <label htmlFor="MRP">MRP</label>
              <input
                id="purchaseRateSelect"
                value={calculateMRP()} // Calculate MRP dynamically
                readOnly // Make the input field read-only
              />
            </div>
            &nbsp;   

            
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
                type="Gst"
                id="Gst"
                value={Gst}
                
              />
            </div>
            &nbsp;
           
          
            &nbsp; &nbsp; &nbsp;
            <div className="input-container-2">
  <label> totalValue </label>
  <input
    type="text"
    value={calculateTotalValue()}
    readOnly
  />
</div>
            &nbsp;
          


          </div>

          <div className="input-row-3">
          
         
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
        <div className="container-table-tnx">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Mfr</th>
                <th>Batch No</th>
                {/* <th>Packing</th> */}
                <th>Expiry</th>
                {/* <th>Quantity</th> */}
                <th> ptr ..</th>
                <th>Discount</th>
                <th>MRP/Strip</th>
              
                <th>GST%</th>
                <th>SGST%</th>
                <th>CGST%</th>
                <th>Total Value </th>
                <th>Gross value</th>

             
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row , index) => (
                <tr key={row._id}>
                  <td>{row.Medicine}</td>
                  <td>{row.manufacturer}</td>
                  <td>{row.batchno}</td>
                  {/* <td>{row.Unit}</td> */}
                  <td>{row.expiryDate}</td>
                  {/* <td>{row.PerStrip}</td> */}
                  <td> {row.ptr}  </td>
                  <td>{row.Discount}</td>
                  <td>{row.MRP}</td>
                  
                  <td>{row.Gst}</td>
                  <td>{(row.Gst / 2).toFixed(2)}</td>
                  <td>{(row.Gst / 2).toFixed(2)}</td>
                  <td>{row.Total} </td>
                  <td>{row.GrossValue}</td>
                  {/* <td>{row.DiscountAmount}</td> */}

                  <td>
  <button
    style={{ color: "red" }}
    onClick={() => handleDelete(index)} // Pass the index to the handleDelete function
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
          </div>
        </div>
        <table className="Amount-table-table">
          <tbody>
            <tr>
              <td>Total</td>
              <td>{calculateTotalAmounts()}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>{totalDiscount}%</td>
            </tr>

            <tr>
              <td>Total Disc Amount</td>
              <td>{calculateTotalDiscounts()}</td>
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
              <td>{calculateGrossAmount()}</td>
            </tr>
            {/* <tr>
  <td>Round Off</td>
  <td>{roundOffValue}</td>
</tr> */}

          
            <tr>
              <td>Purchase Amount</td>
              <td>{calculateTotalAmounts()}</td>
            </tr>
            
          </tbody>
        </table>
      </div>
      <div className="save-tnx">
        <button
          className="save-tnx1"
          onClick={handleSaveInvoice}
          style={{ backgroundColor: "#9b8bf4", fontFamily: "Inria Serif" }}
        >
          Save Invoice
        </button>
      </div>
    </>
  );
};

export default InvoiceStock;


