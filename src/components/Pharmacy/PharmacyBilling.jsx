import axios from "axios";
import React, { useEffect, useState } from "react";
import "./PatientBill.css";
import PharmacyNav from "./PharmacyNav";
import imageUrl from './Dp16.png';
// import image from './pharmalogo.png';
import { FaPlusCircle } from "react-icons/fa";
import { BASE_URL } from "../../Services/Helper";

const PharmacyBilling = () => {
  const [quantity, setQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  // const [filteredStockists, setFilteredStockists] = useState([]); 
  // const currentStockists = filteredStockists.slice(indexOfFirstItem, indexOfLastItem);
  const [manufacturer, setManufacturer] = useState('');
  const [Gst, setGst] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('');
  const [subtotalWithGST, setSubtotalWithGST] = useState(0);
  const [subtotalWithoutGST, setSubtotalWithoutGST] = useState(0);
  const [mobilenumber, setmobilenumber] = useState('');
  const [sign, setSign] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxableValues, setTaxableValues] = useState([]);
  const [hsnCode, setHsnCode] = useState('');
  const [batch, setBatch] = useState('');
  const [ptr, setPTR] = useState('');
  const [PerStrip, setPerStrip] = useState('');
  const [products, setProducts] = useState([]);
  const [signature, setsignature] = useState('');
  const [doctorName, setdoctorName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [items, setItems] = useState([
    {
      _id: 1,
      product: "",
      quantity: "",
      ptr: "",
      // taxCode: "",
      manufacturer: "",
      // category: "",
      // purchaseRate: "",
      batch: "",
      Gst: "",
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
          product:selectedProduct,
          ptr:ptr,
          
          Gst:Gst,
          manufacturer:manufacturer,
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
      // taxCode: "",
      manufacturer: "",
      // category: "",
      // purchaseRate: "",
      batch: "",
      Gst: "",
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
        const response = await axios.get(`${BASE_URL}/api/itemdec`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get("${BASE_URL}/api/getInvoices");
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };
  //   fetchProducts();
  // }, []);
  const handleProductChange = async (e, index) => {
    const selectedProductValue = e.target.value;
    try {
      const response = await axios.get(`${BASE_URL}/api/itemdec/details?productName=${selectedProductValue}`);
      const productDetails = response.data;
      setManufacturer(productDetails.manufacturer);
      setBatch(productDetails.batchno);
      setBatchExpiry(productDetails.batchExpiry);
      setPTR(productDetails.ptr);
      setPerStrip(productDetails.rate);
      setGst(productDetails.Gst);

      // Update the items array with the selected product details
      const updatedItems = items.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            product: selectedProductValue,
            ptr: productDetails.ptr,
            Gst: productDetails.Gst,
            manufacturer: productDetails.manufacturer,
            batch: productDetails.batchno,
            gst: productDetails.taxCode,
            // Gst: productDetails.taxCode || 0,
          };
        }
        return item;
      });
      setItems(updatedItems);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    setSelectedProduct(selectedProductValue);
  };

  // currentdate
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  });

  const handlePrintAndSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/patient-bill`, {
        patientName,
        doctorName,
        mobilenumber,
        invoiceNumber,
        ptr,
        date,
        items,
        subtotalWithGST,
        subtotalWithoutGST,
        sign
      });
      if (response && response.data) {
        console.log('PatientBill submitted successfully:', response.data);
        setInvoiceNumber((prevInvoiceNumber) => prevInvoiceNumber + 1);
        setPatientName('');
        setmobilenumber('');
        setdoctorName('');
        setTaxableValues('');
        setSelectedProduct('');
        setSign('');
        setDate('');
        setItems([
          {
            _id: 1,
            product: "",
            quantity: "",
            ptr: "",
            // taxCode: "",
            group: "",
            // category: "",
            // purchaseRate: "",
            manufacturer: "",
            batch: "",
            Gst: "",
          },
        ]);
      } else {
        console.error('Unexpected response format:', response);
      }

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
                .quantity{
                  width:20px;
                }
                .value{
                  margin-left:20px;
                }
                .goods-class1{
                  font-size:15px;
                }
                .fa-flag{
                  font-size:20px;
                }
              
              </style>

               <!-- <link rel="stylesheet" href="make.css">
               <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">-->
               <link rel="icon" type="image/png" href="icona.png" sizes="32x32" />
               <link rel="icon" type="image/png" href="iconb.png" sizes="32x32" />
               <link rel="icon" type="image/png" href="iconc.png" sizes="32x32" />
               <link rel="icon" type="image/png" href="icond.png" sizes="32x32" />
               <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16" />
               <meta name="viewport" content="width=device-width, initial-scale=1">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
              
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
              <img src="${imageUrl}" alt="Pharmacy Logo" style="width: 113px; height: 113px; margin-left: -150px; margin-top:38px;">
              </div>
              <div><svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" style="margin-top:70;" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg></div>
              <div class='main-heading'>
              <h1>TAX INVOICE</h1>
              <h1>ಧನ್ವಂತರಿ ಫಾರ್ಮಾ</h1>
              <h1>Dhanvantri Pharmacy </h1>
              <h3> # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,
              Hampinagara , Bengaluru-560104</h3>
              </div>
              <div><svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" style="margin-top:68;" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg></div>
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
                  <p>Invoice Number :INV00${invoiceNumber}</p>
                  <table class="billing-table">
                    <thead>
                      <tr>
                        <th className="quantity" rowspan="2">Qty</th> 
                        <th style="width: 143px;" rowspan="2">Product</th>
                        <th style="width: 50px;" rowspan="2">Product Price</th>
                        <th style="width: 50px;" rowspan="2">Mfr</th>
                        <th style="width: 63px;" rowspan="2">Batch No</th>
                        <th style="width: 50px;" rowspan="2">Taxable value</th>
                        <th style="width: 50px;" rowspan="2">GST (%)</th>
                        <th colspan="2" className="value">Value</th>
                        
                      </tr>
                      <tr>
                        <th style="width: 50px;">Without Gst</th>
                        <th>With Gst</th>
                      </tr>
                    </thead>                 
                    <tbody>
                      ${items
            .map(
              (item, index) => `
                            <tr>                        
                              <td>${item.quantity}</td>
                              <td>${item.product}</td>
                              <td>${item.ptr}</td>
                              <td>${item.manufacturer}</td>
                              <td>${item.batch}</td>
                              <td>${taxableValues[index] || ''}</td>
                              <td>${item.Gst}</td>
                              <td>${taxableValues[index] || ''}</td>
                              <td>${item.totalValue || ''}</td>   
                            </tr>
                          `
            )
            .join("")}
                    </tbody>
                  </table>
                  <h1 style='font-size:15px'>QP Signature: ${sign}</h1>
                  <div>
                  <h1 style='font-size:15px; margin-left:45%;'>Goods once sold cannot be taken back or exchanged</h1>
                  <h1 style='font-size:15px; margin-left:45%;'>Subjected to Bengalur-560104 Jurisdiction</h1>
                </div>
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
      <PharmacyNav />

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
          <FaPlusCircle className="icon-plus-main" />

          <div className='main-heading'>
          <h2 className="dhanvantri-heading">ಧನ್ವಂತರಿ ಫಾರ್ಮಾ</h2>
            <h2 className="dhanvantri-heading">Dhanvantri Pharma</h2>
            <h6 className="dhanvantri-heading-address"> # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,</h6>
            <h6 className="dhanvantri-heading-address">Hampinagara , Bengaluru-560104</h6>
          </div>
          <FaPlusCircle className="icon-plus-main-second" />
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
        <div  className="doctor-invoice-merge">
          <div>
          <label className="pharma-patientname-labels">Doctor Name : </label>
          <input
            type="text"
            className="pharma-doctor-input"
            value={doctorName}
            onChange={(e) => setdoctorName(e.target.value)}
          />
          </div>
          <div className="invoice-invoicenumber-merge">
          <h1 className="invoice-number-text">Invoice Number: </h1>
          {/* <p  className="input-invoice-data" >INV00{invoiceNumber}</p> */}
          <p className="input-invoice-data">{`INV${invoiceNumber.toString().padStart(3, '0')}`}</p>

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
              <th className="product-price-table">Mfr</th>
              <th className="product-price-table">Batch No</th>
              <th className="product-price-table">Taxable Value</th>
              <th className="product-price-table">GST (%)</th>
              <th className="merge-tabe">
                <th colspan="2" className="table-value">Value</th>
                <tr className="table-bill-row">
                  <th className="with-gst"colSpan={2}>without Gst</th>
                  <th className="with-gst"colSpan={2}>with Gst</th>
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
                    className="select-p1"
                    id={`productSelect_${index}`}  
                    value={item.selectedProduct}
                    onChange={(e) => handleProductChange(e, index)} 
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
                    value={item.ptr}
                  />
                </td>
                <td>
                  <input
                    className="pharma-bill-quantity"
                    type="text"
                    id="Manufacturer"
                    value={item.manufacturer}
                  />
                </td>
                <td>
                  <input
                    className="pharma-bill-quantity"
                    type="Batch"
                    id="Batch"
                    value={item.batch}
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
                    value={item.Gst}
                  />
                </td>
                <td>
                  <input
                    className='value-input'
                    type="text"
                    id="Gst"
                    value={taxableValues[index] || ''}
                  // value={Gst}
                  />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    className='value-input'
                    type="text"
                    disabled
                    id="Gst"
                    value={item.totalValue || ''}
                  
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
            <div>
              <h5>For Dhanvantri Pharma</h5><br/>
              <h6>QP Signature: </h6>
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
            <h1 className="goods-class">Subjected to Bengalur-560104 Jurisdiction</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyBilling;