import axios from "axios";
import React, { useEffect, useState } from "react";
import "./PatientBill.css";
import PharmacyNav from "./PharmacyNav";
import imageUrl from "./Dp16.png";
// import image from './pharmalogo.png';
import { FaPlusCircle } from "react-icons/fa";
import { BASE_URL } from "../../Services/Helper";

const PharmacyBilling = () => {
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  // const [filteredStockists, setFilteredStockists] = useState([]);
  // const currentStockists = filteredStockists.slice(indexOfFirstItem, indexOfLastItem);
  const [manufacturer, setManufacturer] = useState("");
  const [Gst, setGst] = useState("");
  const [batchExpiry, setBatchExpiry] = useState("");
  const [subtotalWithGST, setSubtotalWithGST] = useState(0);
  const [subtotalWithoutGST, setSubtotalWithoutGST] = useState(0);
  const [mobilenumber, setmobilenumber] = useState("");
  const [sign, setSign] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [taxableValues, setTaxableValues] = useState([]);
  const [hsnCode, setHsnCode] = useState("");
  const [batch, setBatch] = useState("");
  const [ptr, setPTR] = useState("");
  const [PerStrip, setPerStrip] = useState("");
  const [products, setProducts] = useState([]);
  const [signature, setsignature] = useState("");
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
        const taxableValue = quantityValue * priceValue;
        const totalValue = taxableValue + (taxableValue * Gst) / 100;
        setTaxableValues((prevValues) => {
          const updatedValues = [...prevValues];
          updatedValues[index] = taxableValue;
          return updatedValues;
        });
        return {
          ...item,
          product: selectedProduct,
          ptr: ptr,

          Gst: Gst,
          manufacturer: manufacturer,
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
        console.error("Error fetching products:", error);
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
      const response = await axios.get(
        `${BASE_URL}/api/itemdec/details?productName=${selectedProductValue}`
      );
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
      console.error("Error fetching product details:", error);
    }
    setSelectedProduct(selectedProductValue);
  };

  // currentdate
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
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
        sign,
      });
      if (response && response.data) {
        console.log("PatientBill submitted successfully:", response.data);
        setInvoiceNumber((prevInvoiceNumber) => prevInvoiceNumber + 1);
        setPatientName("");
        setmobilenumber("");
        setdoctorName("");
        setTaxableValues("");
        setSelectedProduct("");
        setSign("");
        setDate("");
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
        console.error("Unexpected response format:", response);
      }

      const imageUrl = process.env.PUBLIC_URL + "/PharmacyLogo.jpg";
      console.log("Image URL:", imageUrl);
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
                  border-collapse: collapse;
                }
                .billing-table th, .billing-table td {
                  border: 1px solid #ddd;
                  padding: 12px;
                  text-align: left;
                }
                .print-container {
                  max-height: 100%;
                  overflow-y: auto;
                  border-radius: 5px;
                  background: #fff;   
                  position: relative;
                }
                .print-title {
                  font-size: 24px;
                  text-align: left;
                }
                .main-heading{
                    font-size:15px;
                    width:70%;
                    text-align: center;
                  }
                  .main-heading h3 {
                    font-weight:bolder;
                  }
                  .main-sub{
                    font-size:10px;
                    justify-content: left;
                  }
                  .flex-change34{
                    display:flex;
                    justify-content: left;
                    border-bottom: 2px solid black;
                 }
                 
                 
                .dl-info {
                  width:240px;
                  font-size:13px;
                }
                .phone-gst-text {
                  width:200px;
                  font-size:15px;
                }
                .contact-info {
                    display: flex;
                    flex-direction: column;
                    margin-right: 0px;
      
                  }
                  .flex-column {
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
                .flex-column {
                  display: flex;
                  flex-direction: column;
                }
                .flex-container {
                  display: flex;
                  justify-content: space-between;
                }
                
                .flex-column {
                  display: flex;
                  flex-direction: column;
                }
                
                .left-column {
                  margin-right: 20px; 
                }
                
                .right-column {
                  margin-left: 20px; 
                }
                
              
              </style>

               
               
              </head>
              <body>
              <div class="print-container">
              <div class="flex-change34">
              <div style="display:flex">
              <div >
                
              </div>
              <div style='display:flex'> 
              
              <div class='main-heading'>
              <h3>TAX INVOICE</h3>
              <h3>ಧನ್ವಂತ್ರಿ ಫಾರ್ಮಾ</h3>
              <h3>Dhanvantri Pharma </h3>
              <h3 class='main-sub'> # 16,1st Main Road,<br/>
              <p class='main-sub'>Vijayanagara 2nd Stage</p><p class='main-sub'>Vijayanagara Club Road</p>,
              Hampinagara , Bengaluru-560104</h3>
              </div>
              <div><svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" style="margin-top:68;" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg></div>
              <div >
              <h3 style="font-size:13px; margin-top:-1px;">GSTIN:29BFNPM5181H1ZX</h3>
              <h3 style="font-size:13px; margin-top:-10px; font-weight:light;">PHONE:+91 9916351311</h3>
              <h3 style="font-size:13px;margin-top:-5px;">DL:20 KA-B41-180306</h3>
                <h3 style="font-size:13px;margin-top:-15px;">DL:20 KA-B41-180307</h2>
              </div>
              </div>
              </div>
              </div>
              <div class="borderbox"></div>
              <div class="flex-column">
            </div>
                <!-- Include your billing details in the HTML content -->
                <div>
                <div class="flex-container">
  <div class="flex-column left-column">
    <p class="print-details">Patient Name: ${patientName}</p>
    <p class="print-details">Doctor Name: ${doctorName}</p>
  </div>
  <div class="flex-column right-column">
  <p>Invoice Number :INV00${invoiceNumber}</p>
  <p class="print-details">Date: ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(date))}</p>
  </div>
</div>
                  <table class="billing-table">
                    <thead>
                      <tr>
                        <th className="quantity" rowspan="2">Qty</th> 
                        <th style="width: 143px;" rowspan="2">Product</th>
                        
                        <th style="width: 50px;" rowspan="2">Mfr</th>
                        <th style="width: 63px;" rowspan="2">Batch No</th>
                        <th style="width: 50px;" rowspan="2">Taxable value</th>
                        <th style="width: 50px;" rowspan="2">GST (%)</th>
                        <th colspan="2">Value</th>
                        
                      </tr>
                      <tr>
                        <th>Rupees</th>
                        <th>Paise</th>
                      </tr>
                    </thead>                 
                    <tbody>
                      ${items
                        .map(
                          (item, index) => `
                            <tr>                        
                              <td>${item.quantity}</td>
                              <td>${item.product}</td>
                              <td>${item.manufacturer}</td>
                              <td>${item.batch}</td>
                              <td>${taxableValues[index] || ""}</td>
                              <td>${item.Gst}</td>
                              <td>${taxableValues[index] || ""}</td>
                              <td>${item.totalValue || ""}</td>   
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                  <h6 style='font-size:10px'>For Dhanvantri Pharma</h6>
                  <h6 style='font-size:10px'>QP Signature: ${sign}</h6>
                  <div>
                  <h6 style='font-size:10px;'>Goods once sold cannot be taken back or exchanged</h6>
                  <h6 style='font-size:10px;'>Subjected to Bengalur-560104 Jurisdiction</h6>
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
        console.error("Error loading image for printing", error);
      };
    } catch (error) {
      console.error("Error submitting PatientBill:", error);
      console.error(
        "Server response:",
        error.response ? error.response.data : "No response data"
      ); // Log server response details
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
            <span className="phone-text">PHONE:+91 9916351311</span>
          </div>
        </div>
        <h3 className="tax-title">TAX INVOICE</h3>

        <div className="flex-change34">
          <img className="image45" src={imageUrl} alt="Example" />
          <FaPlusCircle className="icon-plus-main" />

          <div className="main-heading">
            <h2 className="dhanvantri-heading">ಧನ್ವಂತ್ರಿ ಫಾರ್ಮಾ</h2>
            <h2 className="dhanvantri-heading">Dhanvantri Pharma</h2>
            <h6 className="dhanvantri-heading-address">
              {" "}
              # 16,1st Main Road,Vijayanagara 2nd Stage ,Vijayanagara Club Road,
            </h6>
            <h6 className="dhanvantri-heading-address">
              Hampinagara , Bengaluru-560104
            </h6>
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
        <div className="doctor-invoice-merge">
          <div>
            <label className="pharma-patientname-labels">Doctor Name : </label>
            {/* <input
              type="text"
              className="pharma-doctor-input"
              value={doctorName}
              onChange={(e) => setdoctorName(e.target.value)}
            /> */}
            <select>
              <option value="">select a doctor</option>
              <option value="Dr.susheelama B">Dr.Susheelamma B</option>
              <option value="Dr.Chaya SM">Dr.Chaya S.M</option>
              <option value="Dr.Malichetan SM">Dr.Mali Chetan S.M</option>
              <option value="Dr.Padmashree Nagaraj">Dr.Padmashree Nagaraj</option>
            </select>
          </div>
          <div className="invoice-invoicenumber-merge">
            <h1 className="invoice-number-text">Invoice Number: </h1>
            {/* <p  className="input-invoice-data" >INV00{invoiceNumber}</p> */}
            <p className="input-invoice-data">{`INV${invoiceNumber
              .toString()
              .padStart(3, "0")}`}</p>
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
            <tr>
              <th className="oty-table">Qty</th>
              <th className="product-product-table">Product</th>
              {/* <th className="product-price-table">Product Price</th> */}
              <th className="product-price-table">Mfr</th>
              <th className="product-price-table">Batch No</th>
              <th className="product-price-table">Taxable Value</th>
              <th className="product-price-table">GST (%)</th>
              <th className="merge-tabe">
                <th colspan="2" className="table-value">
                  Value
                </th>
                <tr>
                  <th className="with-gst">Rupees</th>
                  <th className="with-gst">Paise</th>
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
                {/* <td>
                  <input
                    className="pharma-bill-quantity"
                    id="salesRateSelect"
                    value={item.ptr}
                  />
                </td> */}
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
                    value={taxableValues[index] || ""}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    className="gst-input"
                    type="number"
                    id="Gst"
                    value={item.Gst}
                  />
                </td>
                <td>
                  <input
                    className="value-input"
                    type="text"
                    id="Gst"
                    value={taxableValues[index] || ""}
                    // value={Gst}
                  />
                  &nbsp;&nbsp;
                  <input
                    className="value-input"
                    type="text"
                    disabled
                    id="Gst"
                    value={item.totalValue || ""}
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
              <h5>For Dhanvantri Pharma</h5>
              <br />
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
            <h1 className="goods-class">
              Goods once sold cannot be taken back or exchanged
            </h1>
            <h1 className="goods-class">
              Subjected to Bengalur-560104 Jurisdiction
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyBilling;
