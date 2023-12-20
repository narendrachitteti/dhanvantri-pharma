import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import PharmacyNav from "./PharmacyNav";
import "./PharmacyBilling.css";
const PatientBill = () => {
  const [quantity, setQuantity] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [HSNCode, setHSNCode] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [gst, setGst] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('');
  const [batches, setBatches] = useState([]);
  const [subtotalWithGST, setSubtotalWithGST] = useState(0);
  const [subtotalWithoutGST, setSubtotalWithoutGST] = useState(0);
  const [mobilenumber, setmobilenumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([
    {
      _id: 1,
      product: "",
      quantity: "",
      amount: "",
      manufactureDate: "",
      batch: "",
      expiryDate: "",
      gst: "",
      totalWithGST: "",
      totalWithoutGST: "",
    },
  ]);
  const handleQuantityChange = (e, index) => {
    const { value } = e.target;

    const updatedItems = items.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          quantity: value,
        };
      }
      return item;
    });

    setItems(updatedItems);
    setQuantity(value);
  };

  // Function to add a new row/item to the list
  const handleAddRow = () => {
    const newItem = {
      _id: items.length + 1,
      product: "",
      quantity: "",
      amount: "",
      manufactureDate: "",
      batch: "",
      expiryDate: "",
      gst: "",
      totalWithGST: 0,
      totalWithoutGST: 0,
    };
    // Updating the state by adding the new item to the existing items array
    setItems([...items, newItem]);
  };

  // Function to delete a row/item from the list based on itemId
  const handleDeleteRow = (itemId) => {
    // Filtering out the item with the given itemId
    const updatedItems = items.filter((item) => item._id !== itemId);
    // Updating the state with the filtered items array
    setItems(updatedItems);
  };

  useEffect(() => {
    const calculateTotals = () => {
      let totalWithoutGST = 0;
      let totalWithGST = 0;

      items.forEach((item) => {
        const quantityValue = parseFloat(item.quantity) || 0;
        const priceValue = parseFloat(item.price) || 0;
        const gstValue = parseFloat(item.gst) || 0;

        const itemTotalWithoutGST = quantityValue * priceValue;
        const itemTotalWithGST =
          itemTotalWithoutGST + itemTotalWithoutGST * (gstValue / 100);

        totalWithoutGST += itemTotalWithoutGST;
        totalWithGST += itemTotalWithGST;
      });

      setSubtotalWithoutGST(totalWithoutGST.toFixed(2));
      setSubtotalWithGST(totalWithGST.toFixed(2));
    };

    calculateTotals();
  }, [items]);

 

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/batchNumbers');
        setBatches(response.data.batchNumbers);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchMedicineNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/medicines');
        setMedicines(response.data.medicines);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicineNames();
  }, []);

  const handleProductSelect = async (medicineName, index) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicineDetails/${medicineName}`);
      const medicineDetails = response.data;
  
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        product: medicineName,
        price: medicineDetails.price || '',
        manufacturer: medicineDetails.Manufacturer || '',
        gst: medicineDetails.Gst || '',
      };
      setItems(updatedItems);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    }
  };
  
  const handleBatchSelect = async (batchNumber, index) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/batchDetails/${batchNumber}`);
      const fullExpiryDate = response.data.BatchExpiry;
  
      // Extract month and last two digits of the year
      const dateObject = new Date(fullExpiryDate);
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObject.getFullYear().toString().slice(-2);
  
      // Form the desired format
      const formattedExpiry = `${month}/${year}`;
  
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        batch: batchNumber,
        batchExpiry: formattedExpiry,
      };
      setItems(updatedItems);
    } catch (error) {
      console.error('Error fetching batch details:', error);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/patient-bill', {
        patientName,
        mobilenumber,
        date,
        items,
        subtotalWithGST,
        subtotalWithoutGST,
      });

      console.log('PatientBill submitted successfully:', response.data);

      // Reset the form or add other logic as needed
      setPatientName('');
      setmobilenumber('');
      setDate('');
      setItems([
        {
          _id: 1,
          product: '',
          quantity: '',
          amount: '',
          manufactureDate: '',
          batch: '',
          expiryDate: '',
          gst: '',
          totalWithGST: 0,
          totalWithoutGST: 0,
        },
      ]);

      // You can add additional logic here, such as redirecting the user.
    } catch (error) {
      console.error('Error submitting PatientBill:', error);
      console.error('Server response:', error.response.data); // Log server response details
    }
  };
  
  
  const handlePrint = () => {
    const imagePath = 'PharmacyLogo.jpg';
    const imageUrl = `${process.env.PUBLIC_URL}/${imagePath}`;
  
    // Create an image element and set its source
    const img = new Image();
    img.src = imageUrl;
  
    // Wait for the image to load before continuing with print
    img.onload = function () {
    // Generate HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <!-- Include any necessary stylesheets or styling here -->
          <style>
          body {
            font-family: 'Arial', sans-serif;
          }
          .billing-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .billing-table th, .billing-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .print-container {
            max-height: 100%;
            overflow-y: auto;
            padding: 20px;
            border-radius: 5px;
           
            background: #fff;
           
            position: relative;
          }
          .print-title {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          .main-heading{
              width:70%;
              text-align: center;
            }
            .flex-change34{
              display:flex;
              justify-content: space-between;
              border: 2px solid black;
           }
           .image45{
            width:30%;
           }
           
          .dl-info {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }
          .contact-info {
              display: flex;
              flex-direction: column;
              margin-bottom: 20px;
              margin-right: 0px;

            }
            .flex-column {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
           
          .dl-text, .contact-text {
            margin-right: 20px;
          }
          .print-details2{
              display: flex;
              flex-direction: column;
          }
        </style>
        </head>
        <body>
        <div class="print-container">
        <div class="flex-change34">
        <img class="image45" src="${imageUrl}">

        <div class='main-heading'>
        <h1>Dhanvantri Pharmacy </h1>
        <h3> # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,
        Hampinagara , Bengaluru-560104</h3>
        <h3>Mob:+91 9916351311</h3>
        </div>
        </div>
        <div class="borderbox"></div>
        <h3 class="print-title">Billing Details</h3>
        <div class="flex-column">
        <div class="dl-info">
          <span class="dl-text">DL:20 KA-B41-180306</span>
          <span class="dl-text">DL:20 KA-B41-180307</span>
        </div>
        <div class="contact-info">
          <span class="gst-text">GSTIN:29BFNPM5181H1ZX</span>
          <span class="phone-text">PHONE:+91 9886819877</span>
        </div>
      </div>
          <!-- Include your billing details in the HTML content -->
          <div>
            <p class="print-details">Patient Name: ${patientName}</p>
            <p class="print-details">Mobile number: ${mobilenumber}</p>
            <p class="print-details">Date: ${date}</p>
            <table class="billing-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Product Price</th>
                  <th>Manufacturer</th>
                  <th>Batch No</th>
                  <th>Expiry Date</th>
                  <th>GST (%)</th>
                </tr>
              </thead>
              <tbody>
              
                ${items
                  .map(
                    (item, index) => `
                      <tr>
                        <td>${item.product}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.manufacturer}</td>
                        <td>${item.batch}</td>
                        <td>${item.batchExpiry}</td>
                        <td>${item.gst}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
            <strong class="print-details2">Subtotal with GST: ${subtotalWithGST}</strong>
            <strong class="print-details2">Subtotal without GST: ${subtotalWithoutGST}</strong>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "height=600");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.print();

    printWindow.onafterprint = function () {
        printWindow.close();
    };
};}



  
 

  return (
    <>
    <PharmacyNav/>
   
      <div className="patientbill-page">
       
        <div className="gst-ph-header">
        <div className="gst-ph-head-dl">
          <span className="dl-1-text">DL:20 KA-B41-180306</span>
          <span className="dl-2-text">DL:20 KA-B41-180307</span>
        </div>
        <div className="gst-ph-head">
          <span className="gst-text">GSTIN:29BFNPM5181H1ZX</span>
          <span className="phone-text">PHONE:+91 9886819877</span>
        </div>
        </div>
        <h3 className="tax-title">TAX INVOICE</h3>

        <div className="title-row">
          <FaPlusCircle className="plus-icon" />
          <span className="pharma-title">Dhanvantri Pharmacy</span>
          <FaPlusCircle className="plus-icon" />
        </div>
        <div className="tax-title-header">
          <p className="paharma-head-para">
            #16, Ground Floor, 1st Main Road, 2nd stage, Vijayanagara club road,
            Vijayanagara, Bengaluru -560104.
          </p>
        </div>

        <div className="pharma-bill-details">
        <div>
          <label className="pharma-patientname-labels">Patient Name : </label>
          <input
            type="text"
            className="pharma-head-patientname-input"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
      </div>
      <div className="pharma-bill-details-2">
        <div>
          <label className="pharma-doctor-label">Mobile number : </label>
          <input
            type="text"
            className="pharma-head-mobilenumber-input"
            value={mobilenumber}
            onChange={(e) => setmobilenumber(e.target.value)}
          />
        </div>
        <div>
          <label className="pharma-date-label">Date : </label>
          <input
            type="date"
            className="pharma-bill-input-date-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
        <table className="pharma-bill-table23">
          <thead className="pharma-bill-tablehead">
            <tr >
              <th className="class567">S No.</th>
              <th className="class567">Product</th>
              <th>quantity</th>
              <th>Product Price</th>
              <th>Manufacturer name</th>
              <th>Batch No</th>
              <th>Expiry Date</th>
              <th>GST (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="pharma-bill-table-body">
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                <select
        value={item.product}
        onChange={(e) => {
          const selectedValue = e.target.value;
          handleProductSelect(selectedValue, index);
        }}
      >
        <option value=''>Select a product</option>
        {medicines.map((medicine, medIndex) => (
          <option key={medIndex} value={medicine}>
            {medicine}
          </option>
        ))}
      </select>
                </td>
                <td>
                <input
              type="number"
              className="pharma-bill-input-quantity"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(e, index)}
            />
                </td>
                <td>
                  <input
                    className='price-input'
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].price = e.target.value;
                      setItems(updatedItems);
                    }}
                  />
                </td>
                <td>
                  <input
                    className='manufacturer-input'
                    value={item.manufacturer}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].manufacturer = e.target.value;
                      setItems(updatedItems);
                    }}
                  />
                </td>
                <td>
                <select
        value={item.batch}
        onChange={(e) => {
          const selectedBatchValue = e.target.value;
          handleBatchSelect(selectedBatchValue, index);
        }}
      >
        <option value=''>Select a batch</option>
        {batches && batches.map((batch, batchIndex) => (
          <option key={batchIndex} value={batch}>
            {batch}
          </option>
        ))}
      </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={item.batchExpiry}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].batchExpiry = e.target.value;
                      setItems(updatedItems);
                    }}
                  />
                </td>
                <td>
                  <input
                    className='gst-input'
                    value={item.gst}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].gst = e.target.value;
                      setItems(updatedItems);
                    }}
                  />
                </td>
                <td className="add-del">
                  <button
                    onClick={() => handleDeleteRow(item._id)}
                    className="del-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <button onClick={handleAddRow} className="Add-btn">
          Add
        </button>
         <div className="pharma-subtotal">
        <p>Subtotal with GST: {subtotalWithGST}</p>
        <p>Subtotal without GST: {subtotalWithoutGST}</p>
      </div>
        
        <div className="pharma-sign">
          <label>Sign : </label>
          <input
            type="textarea"
            className="sign-area"
          />
        </div>

        <button onClick={handleSubmit}  className="pharma-bill-submit-btn del-btn">
          Submit
        </button>

        <button onClick={handlePrint} className="print-btn">
          Print
        </button>

      </div>
    </>
  );
};

export default PatientBill;