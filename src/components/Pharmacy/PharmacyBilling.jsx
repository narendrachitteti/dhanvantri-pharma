import axios from "axios";
import React, { useEffect, useState } from "react";
import "./PatientBill.css";
import PharmacyNav from "./PharmacyNav";
import imageUrl from './PharmacyLogo.jpg';
// import image from './pharmalogo.png';
import { FaPlusCircle } from "react-icons/fa";

const PharmacyBilling = () => {
  const [quantity, setQuantity] = useState('');
  // const [medicines, setMedicines] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  // const [HSNCode, setHSNCode] = useState('');
  // const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [Gst, setGst] = useState('');
  // const [selectedBatch, setSelectedBatch] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('');
  // const [batches, setBatches] = useState([]);
  const [subtotalWithGST, setSubtotalWithGST] = useState(0);
  const [subtotalWithoutGST, setSubtotalWithoutGST] = useState(0);
  const [mobilenumber, setmobilenumber] = useState('');
  const [sign , setSign]=useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [taxableValues, setTaxableValues] = useState([]);
  // const [gstValue, setGstValue] = useState('');
const [hsnCode, setHsnCode] = useState('');
const [batch, setBatch] = useState('');
const [ptr, setPTR] = useState('');
const [PerStrip, setPerStrip] = useState('');
const [products, setProducts] = useState([]);
const [signature , setsignature] = useState('');
const [doctorName , setdoctorName] = useState("");
  const [items, setItems] = useState([   
    {
      _id: 1,
      product: "",
      quantity: "",
      ptr: "",
      taxCode: "",
      group: "",
      category: "",
      purchaseRate: "",
      batch: "",
      gst: "",
    },
  ]);
  
  const handleQuantityChange = (e, index) => {
    const { value } = e.target;
    const updatedItems = items.map((item, i) => {
      if (index === i) {
        const quantityValue = parseFloat(value) || 0;
        const priceValue = parseFloat(ptr) || 0;
        const taxableValue = (quantityValue * priceValue);
        const totalValue = taxableValue + (taxableValue * Gst / 100);
        setTaxableValues((prevValues) => {
          const updatedValues = [...prevValues];
          updatedValues[index] = taxableValue;
          return updatedValues;
        });
        return {
          ...item,
          quantity: value,
          totalValue: totalValue, // Update total value in the state
        };
      }
      return item;
    });
  
    setItems(updatedItems);
    setQuantity(value);
  };
  
  const handleAddRow = () => {
    const newItem = {
      _id: items.length + 1,
      product: "",
      quantity: "",
      ptr: "",
      taxCode: "",
      group: "",
      category: "",
      purchaseRate: "",
      batch: "",
      gst: "",
    };
    setItems([...items, newItem]);
  };

  const handleDeleteRow = (itemId) => {
    const updatedItems = items.filter((item) => item._id !== itemId);
    setItems(updatedItems);
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

  const handleProductChange = async (e) => {
    const selectedProductValue = e.target.value;
    try {
      const response = await axios.get(`http://localhost:5000/api/itemdec/details?productName=${selectedProductValue}`);
      const productDetails = response.data;
      setHsnCode(productDetails.hsnCode);
      setManufacturer(productDetails.manufacturer);
      setBatch(productDetails.batchno);
      setBatchExpiry(productDetails.batchExpiry);
      setPTR(productDetails.ptr);
      setPerStrip(productDetails.rate);
      setGst(productDetails.taxCode)
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    setSelectedProduct(selectedProductValue);
  };

// currentdate
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

const handlePrintAndSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/patient-bill', {
      patientName,
      doctorName,
      mobilenumber,
      ptr,
      date,
      items,
      subtotalWithGST,
      subtotalWithoutGST,
      sign
    });
    if (response && response.data) {
      console.log('PatientBill submitted successfully:', response.data);
      setPatientName('');
      setmobilenumber('');
      setdoctorName('');
      setSign('');
      setDate('');
      setItems([
        {
          _id: 1,
          product: "",
          quantity: "",
          ptr:"",
          taxCode: "",
          group: "",
          category: "",
          purchaseRate: "",
          batch: "",
          gst: "",
        },
      ]);
    } else {
      console.error('Unexpected response format:', response);
    }
    
    // import { FaPlusCircle } from "react-icons/fa";
    const imageUrl = process.env.PUBLIC_URL + '/PharmacyLogo.jpg';
    console.log('Image URL:', imageUrl);
    const img = new Image();
    img.src = imageUrl;
        img.onload = function () {
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
                  font-size:10px;
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
                width:240px;
                font-size:13px;
                margin-bottom: 20px;
              }
              .phone-gst-text {
                width:200px;
                font-size:15px;
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
            <div style="display:flex">
            <div class="dl-info">
              <span class="dl-text">DL:20 KA-B41-180306</span>
              <span class="dl-text">DL:20 KA-B41-180307</span>
            </div>
            <div style='display:flex'> 
            <div>
            <FaPlusCircle />
            <img src="${imageUrl}" alt="Pharmacy Logo" style="width: 113px; height: 113px; margin-left: -150px; margin-top:38px;">
            </div>
            <div class='main-heading'>
            <h1>TAX INVOICE</h1>
            <h1>ಧನ್ವಂತರಿ ಫಾರ್ಮಾ</h1>
            <h1>Dhanvantri Pharmacy </h1>
            <h3> # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,
            Hampinagara , Bengaluru-560104</h3>
            </div>

            <div >
            <h3 style="font-size:13px; margin-top:-1px;">GSTIN:29BFNPM5181H1ZX</h3>
            <h3 style="font-size:13px; margin-top:-10px; font-weight:light;">PHONE:+91 9886819877</h3>
            </div>
            </div>
            </div>
            </div>
            <div class="borderbox"></div>
            <h3 class="print-title">TAX INVOICE</h3>
            <div class="flex-column">
          </div>
              <!-- Include your billing details in the HTML content -->
              <div>
                <p class="print-details">Patient Name: ${patientName}</p>
                <p class="print-details">Doctor Name: ${doctorName}</p>
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
                <h1 style='font-size:15px'>Signature: ${sign}</h1>
              </div>
            </body>
          </html>
        `;
        const printWindow = window.open("", "", "height=600");
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        // Trigger the print operation
        printWindow.print();
        // Close the print window after printing
        printWindow.onafterprint = function () {
          printWindow.close();  
        };
      };
      img.onerror = function (error) {
        console.error('Error loading image for printing', error);
      };
  } catch (error) {
    console.error('Error submitting PatientBill:', error);
    console.error('Server response:', error.response ? error.response.data : 'No response data'); // Log server response details
  }
};

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

        <div className="flex-change34">
        <img className='image45' src={imageUrl} alt="Example" />
        <FaPlusCircle className="icon-plus-main"/>

        <div className='main-heading'>

        <h2 className="dhanvantri-heading">Dhanvantri Pharma</h2>
        <h5 className="dhanvantri-heading-address"> # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,</h5>
        <h5 className="dhanvantri-heading-hampinagar">Hampinagara , Bengaluru-560104</h5>
        </div>
        <FaPlusCircle className="icon-plus-main-second"/>
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
      <div>
          <label className="pharma-patientname-labels">Doctor Name : </label>
          <input
            type="text"
            className="pharma-doctor-input"
            value={doctorName}
            onChange={(e) => setdoctorName(e.target.value)}
          />
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
            disabled
            className="pharma-bill-input-date-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}  
          />
        </div>
      </div>
        <table className="pharma-bill-table23">
          <thead className="pharma-bill-tablehead">
             <tr >
              <th className="oty-table">Qty</th>
              <th className="product-product-table">Product</th>
              <th className="product-price-table">Product Price</th>
              <th className="product-price-table">Mfr name</th>
              <th className="product-price-table">Batch No</th>
              <th className="product-price-table">Taxable Value</th>
              <th className="product-price-table">GST (%)</th>
              <th className="merge-tabe">
              <th  colspan="2" className="table-value">Value</th>
              <tr className="table-bill-row">
                <th className="with-gst">without Gst</th>
                <th className="table-cell-177 table-header-177">with Gst</th>
              </tr>
              </th>
              <th className="product-action-table">Action</th>
            </tr>
           </thead> 
          <tbody className="pharma-bill-table-body">
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>
                <input
              type="number"
              className="pharma-bill-quantity"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(e, index)}
              min="0"
            />
                </td>
                <td>
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
                </td>
                <td>
                  <input
                    className="pharma-bill-quantity"
                    id="salesRateSelect"
                    value={ptr}
                  />
                </td>
                <td>
                <input
                className="pharma-bill-quantity"
                type="text"
                id="Manufacturer"
                value={manufacturer}
              />
                </td>
                <td>
                <input
                className="pharma-bill-quantity"
                type="Batch"
                id="Batch"
                value={batch}
              />
                </td>
                <td>
                   <input
                   className="pharma-bill-quantity"
                        type="text"
                        value={taxableValues[index] || ''}
                        readOnly
                      />
                </td>
                <td>
                  <input
                    className='gst-input'
                    type="number"
                    id="Gst"
                    value={Gst}
                  />
                </td>
                <td>
                  <input
                    className='value-input'   
                type="number"
                id="Gst"
                value={taxableValues[index] || ''}
                // value={Gst}
                  />
                  <input
                    className='value-input'   
                type="number"
                disabled
                id="Gst"
                value={item.totalValue || ''}
                // value={Gst}
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
        {/* <p>Total with GST: {subtotalWithGST}</p>
        <p>Total without GST: {subtotalWithoutGST}</p> */}
      </div>
      <div className="merge-sign-para">
        <div>
          <div className="pharma-sign">
            <label>Sign : </label>
            <input
              type="textarea"
              className="sign-area"
              value={sign}
              onChange={(e) => setSign(e.target.value)}
            />
          </div>
          <button onClick={handlePrintAndSubmit} className="print-btn">
            Print
          </button>
          </div>
          <div>
            <h1 className="goods-class">Goods once sold cannot be taken back or exchanged</h1>
            <h1 className="goods-class">Subjected to Bengular-560104 Jurisdiction</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyBilling;