import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import './Pharmapurchase.css'
import { IoCalendarNumber } from "react-icons/io5";
import Navbar from "./PharmacyNav";
import { BASE_URL } from "../../Services/Helper";

const Pharmapurchase = () => {
    const [medicines, setMedicines] = useState([]);
    const [activeSection, setActiveSection] = useState('');
    const handleSelectButtonClick = (section) => {
        setActiveSection(section);
    };

    const [selectedMedicine, setSelectedMedicine] = useState({ value: '', label: '' });
    const [selectedManufacturer, setSelectedManufacturer] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBatchNo, setSelectedBatchNo] = useState("");
    const [selectedExpdate, setSelectedExpDate] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [selectedFreeStrips, setSelectedFreeStrips] = useState("");
    const [selectedPriceperStrip, setSelectedPriceperStrip] = useState("");
    const [selectedMrpStrip, setSelectedMrpStrip] = useState("");
    const [selectedDiscount, setSelectedDiscount] = useState("");
    const [selectedGST, setSelectedGST] = useState("");
    const [selectedSGST, setSelectedSGST] = useState("");
    const [selectedPurchaseAmount, setSelectedPurchaseAmount] = useState("");
    const [editableQuantity, setEditableQuantity] = useState("");

    const [formData, setFormData] = useState({
        date: "",
        paymentType: "",
        purchaseType: "",
        invoiceNo: "",
        pbNo: "",
        receivedStatus: "",
        supplier: "",
        supBillNo: "",
        supBDate: "",
       
        supplierDetails: "",
    });

    const [supplierOptions, setSupplierOptions] = useState([]);
    const [supplierData, setSupplierData] = useState({
      name: '',
      address: '',
      area: '',
      town: '',
      pincode: '',
      state: '',
      phone: '',
      mobile: '',
      contact: '',
      email: '',
      transport: {
        trTown: '',
        dlNos: '',
      },
      lstNo: '',
      cstNo: '',
      tin: '',
      gstin: '',
      bank: '',
      openingBalance: '',
      closingBalance: '',
      creditDiscount: '',
      bankCommission: '',
      accountType: '',
      supplier: null,
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/allSuppliers`);
                const suppliers = response.data.map((supplier) => ({
                    value: supplier.id,
                    label: `${supplier.name} - ${supplier.id}`,
                }));
                setSupplierOptions(suppliers);

                if (suppliers.length > 0) {
                    setSupplierData({ ...supplierData, supplier: suppliers[0].value });
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);
           
    
      const handleSupplierChange = async (selectedOption) => {
        try {
          setSupplierData({ ...supplierData, supplier: selectedOption.value });
      
          const response = await axios.get(`${BASE_URL}/api/supplier/${selectedOption.value}`);
          const selectedSupplierDetails = response.data;
    
          setSupplierData((prevSupplierData) => ({
            ...prevSupplierData,
            name: selectedSupplierDetails.name || '',
            address: selectedSupplierDetails.address || '',
            area: selectedSupplierDetails.area || '',
            town: selectedSupplierDetails.town || '',
            pincode: selectedSupplierDetails.pincode || '',
            state: selectedSupplierDetails.state || '',
            phone: selectedSupplierDetails.phone || '',
            mobile: selectedSupplierDetails.mobile || '',
            contact: selectedSupplierDetails.contact || '',
            email: selectedSupplierDetails.email || '',
            transport: {
                trTown: selectedSupplierDetails.transport ? selectedSupplierDetails.transport.trTown || '' : '',
                dlNos: selectedSupplierDetails.transport ? selectedSupplierDetails.transport.dlNos || '' : '',
              },
            lstNo: selectedSupplierDetails.lstNo || '',
            cstNo: selectedSupplierDetails.cstNo || '',
            tin: selectedSupplierDetails.tin || '',
            gstin: selectedSupplierDetails.gstin || '',
            bank: selectedSupplierDetails.bank || '',
            openingBalance: selectedSupplierDetails.openingBalance || '',
            closingBalance: selectedSupplierDetails.closingBalance || '',
            creditDiscount: selectedSupplierDetails.creditDiscount || '',
            bankCommission: selectedSupplierDetails.bankCommission || '',
            accountType: selectedSupplierDetails.accountType || '',
          }));
        } catch (error) {
          console.error('Error fetching supplier details:', error);
        }
      };


      const [medicineOptions, setMedicineOptions] = useState([]);
      const [medicineDetails, setMedicineDetails] = useState({
        stockId: "",
        supCurBal: "",
        saveContinue: "",
        medicine: "",
        manufacturer: "",
        category: "",
        batchNo: "",
        expDate: "",
        quantity: "",
        freeStrips: "",
        pricePerStrip: "",
        mrpPerStrip: "",
        discountPercentage: "",
        gst: "",
        sgst: "",
        cgst: "",
        purchaseAmount: "",
      });

      useEffect(() => {
        const fetchMedicines = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/allmedicines`);
            console.log('Response:', response.data);
                if (response.data && Array.isArray(response.data)) {
              const allMedicines = response.data.map((medicine) => ({
                value: medicine.medicineid,
                label: `${medicine.medicineid} - ${medicine.medicine}`,
                details: medicine, 
              }));
              setMedicineOptions(allMedicines);
            if (allMedicines.length > 0) {
                setMedicineDetails({ ...allMedicines[0].details, medicineid: allMedicines[0].value });
            }
            } else {
              console.error("Medicines array not found or is not an array in the response data.");
            }
          } catch (error) {
            console.error('Error fetching medicines:', error);
          }
        };
      
        fetchMedicines();
      }, []);

    const fetchMedicineDetails = async (medicineId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/allmedicines/${medicineId}`);
            console.log('Response:', response.data);
            const details = response.data; 
            setMedicineDetails({ ...details, medicineDetails: details.medicine });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Handle 404 error, e.g., set default values
                setMedicineDetails({
                    stockId: "",
                    supCurBal: "",
                    saveContinue: "",
                    medicine: "",
                    manufacturer: "",
                    category: "",
                    batchNo: "",
                    expDate: "",
                    quantity: "",
                    freeStrips: "",
                    pricePerStrip: "",
                    mrpPerStrip: "",
                    discountPercentage: "",
                    gst: "",
                    sgst: "",
                    cgst: "",
                    purchaseAmount: "",
                });
            } else {
                console.error('Error fetching medicine details:', error);
            }
        }
    };

    const handleMedicineChange = async (selectedOption) => {
        try {
            // setSelectedMedicine(selectedOption);
            setSelectedMedicine({ value: selectedOption.value, label: selectedOption.label });
            if (selectedOption && selectedOption.value) {
                const response = await axios.get(`${BASE_URL}/api/allmedicines/${selectedOption.value}`);
                console.log('Response:', response.data);
                console.log("Selected Medicine Option:", selectedOption);
    
                const medicineDetails = response.data;
                fetchMedicineDetails(selectedOption.value);
                setMedicineDetails({
                    ...medicineDetails,
                    medicineid: selectedOption.value,
                    medicine: selectedOption.label,
                });
                setSelectedMedicine(selectedOption);
            } else {
                setMedicineDetails({
                    stockId: "",
                    supCurBal: "",
                    saveContinue: "",
                    medicine: "",
                    manufacturer: "",
                    category: "",
                    batchNo: "",
                    expDate: "",
                    quantity: "",
                    freeStrips: "",
                    pricePerStrip: "",
                    mrpPerStrip: "",
                    discountPercentage: "",
                    gst: "",
                    sgst: "",
                    cgst: "",
                    purchaseAmount: "",
                });
                setSelectedMedicine(null);
            }
        } catch (error) {
            console.error('Error fetching medicine details:', error.response ? error.response.data : error.message);
        }
    };
     
      const handleSubmit = async () => {
        try {
            const postData = {
                formData: formData,
                supplierData: supplierData,
                medicineDetails: medicineDetails,
            };
            const response = await axios.post(`${BASE_URL}/api/submitPurchaseDetails`, postData);
            console.log('Submit response:', response.data);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    const handleManufacturerChange = (e) => {
        setSelectedMedicine(e.target.value)
        setSelectedManufacturer(e.target.value);
        setSelectedCategory(e.target.value)
        setSelectedBatchNo(e.target.value);
        setSelectedExpDate(e.target.value)
        setSelectedQuantity(e.target.value)
        setSelectedFreeStrips(e.target.value)
        setSelectedPriceperStrip(e.target.value)
        setSelectedMrpStrip(e.target.value)
        setSelectedDiscount(e.target.value)
        setSelectedGST(e.target.value)
        setSelectedSGST(e.target.value)
        setSelectedPurchaseAmount(e.target.value)
        setEditableQuantity(e.target.value)
    };
//     const handleInputChange = (e) => {
//     setSelectedBatchNo(e.target.value);
    
// };
    
    return (
        <>
        <Navbar/>
<div className="all-detailsform-submission">  
        <div className="phamrapurchase-page">
            <div className="pharma-header-sec">
                <div className="pharma-lists">

                    <button onClick={() => handleSelectButtonClick('Supplier')}>Supplier</button>
                    <button onClick={() => handleSelectButtonClick('Transport')}>Disc Other Details</button>
                    <button>Transport Details</button>
                    <button>VAT Break-up</button>
                    <button onClick={() => handleSelectButtonClick('Supplier')}>Acc</button>
                    <button onClick={() => handleSelectButtonClick('Transport')}>Disc</button>
                </div>
                <div className="client-1-container-btn-1">
        
                </div>
                <div className="pharma-puchase-details-page-section">
                    <div className="pharmapurchase-details">
                        <div className="pharmap-1-row">
                            <label className="date-label">Date </label>
                            <input
                                type="date"
                                className="cal-inp"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            /><IoCalendarNumber className="calender-icon" />
                            <select
                                className="pharma-sel-1"
                                value={formData.paymentType}
                                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                            >
                                <option>Cr Credit</option>
                                <option>Cash</option>
                            </select>

                            <select className="pharma-sel-2" value={formData.purchaseType}
                                onChange={(e) => setFormData({ ...formData, purchaseType: e.target.value })}
                            >
                                <option>P Purchase</option>
                                <option>P Purchase</option>
                            </select>
                        </div>
                        <div className="pharmap-2-row">
                            <label className="date-label">Invoice No </label>
                            <input
                                type="text"
                                className="cal-inp-2-row"
                                value={formData.invoiceNo}
                                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                            />

                            <label className="pblabel">P.B No </label>
                            <input type="text" className="cal-inp-2-row"
                                value={formData.pbNo}
                                onChange={(e) => setFormData({ ...formData, pbNo: e.target.value })}
                            />
                            <select className="pharma-sel-2-row"
                                value={formData.receivedStatus}
                                onChange={(e) => setFormData({ ...formData, receivedStatus: e.target.value })}
                            >
                                <option>Recived</option>
                                <option>Received2</option>
                            </select>
                        </div>
                        <div className="pharma-3-row">
              <label className="supply-label">Supplier</label>&nbsp;
              <Select
                className="supply-inp"
                options={supplierOptions}
                value={supplierOptions.find((option) => option.value === supplierData.supplier)}
                onChange={handleSupplierChange}
                isSearchable
              />
            </div>
                        <div className="pharma-4-row">
                            <label className="sup-label">Sup Bill No</label>&nbsp;
                            <input type="text" className="sup-inp"
                                value={formData.supBillNo}
                                onChange={(e) => setFormData({ ...formData, supBillNo: e.target.value })} />

                            <label className="supb-date-label">Sup B Date</label>&nbsp;&nbsp;
                            <input type="date" className="supb-inp"
                                value={formData.supBDate} onChange={(e) => setFormData(
                                    { ...formData, supBDate: e.target.value }
                                )} />
                        </div>
                    </div>
                    <div className="pharma-1-table">
                        <table className="pharma-table-2" >
                            <tr>
                                <thead >
                                    <tr className="pharma-table-data">
                                        <th>Stock ID</th>
                                        <td><input type="text" value={medicineDetails.stockId || ""}
                                             /></td>
                                        <td><input type="text" /></td>
                                    </tr>
                                    <tr className="pharma-table-data">
                                        <th>Sup.Cur.Bal</th>
                                        <td><input type="text" value={medicineDetails.supCurBal}
                                           /></td>
                                        <td><input type="text" /></td>
                                    </tr>
                                    <tr className="pharma-table-data" >
                                        <th>Save&continue</th>
                                        <td><input type="text" value={medicineDetails.saveContinue}
                                            /></td>
                                        <td><input type="text" /></td>
                                    </tr>
                                </thead>
                            </tr>
                        </table>
                    </div>
                </div>
                <table className="pharma-purchase-table">
                    <thead className="pharma-table-header">
                        <tr>
                            <th>Medicine</th>
                            <th>Manufacturer</th>
                            <th>Category</th>
                            <th>Batch No</th>
                            <th>Exp date</th>
                            <th>Quantity</th>
                            <th>Free Strips</th>
                            <th>Price/Strip</th>
                            <th>MRP/Strip</th>

                            <th>Dis %</th>

                            <th>GST</th>
                            <th>SGST</th>
                            <th>CGST</th>

                            <th>Purchase Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="pharma-table-data">
                            <td>
                                <Select
                                    className="medicine-inp"
                                    options={medicineOptions}
                                    value={selectedMedicine}
                                    onChange={handleMedicineChange}
                                    isSearchable
                                />
                            </td>
                                <td>
                                <input
                                    type="text"
                                    value={selectedManufacturer || ''}
                                    onChange={(e) => handleManufacturerChange(e.target.value)}
                                />
                                    </td>
                                    <td>
                                        <input
                                        type="text"
                                        value={selectedCategory || ''}  // Use an empty string as a fallback
                                        onChange={(e) => handleManufacturerChange(e.target.value)}
                                        />
                                    </td>

                            <td><input type="text" 
                            value={selectedBatchNo}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                              /></td>

                            <td><input type="text" 
                            value={selectedExpdate}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                             />
                            </td>

                            <td>
                                <input type="text" 
                                value={selectedQuantity}
                                onChange={(e) => handleManufacturerChange(e.target.value)} 
                                 />
                            </td>

                            <td><input type="text" 
                            value={selectedFreeStrips}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                /></td>

                            <td><input type="text" 
                            value={selectedPriceperStrip}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                 /></td>

                            <td><input type="text" 
                            value={selectedMrpStrip}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                /></td>

                            <td><input type="text" 
                            value={selectedDiscount}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                               /></td>

                            <td><input type="text" 
                            value={selectedGST}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                 /></td>

                            <td><input type="text"
                            value={selectedSGST}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                 /></td>

                            <td><input type="text" 
                            value={selectedGST}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                /></td>

                            <td><input type="text" 
                            value={selectedPurchaseAmount}
                            onChange={(e) => handleManufacturerChange(e.target.value)}
                                 /></td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div className="main-container">
                <div className="text-area-container">
        <div className="text-areaclass">
            <div  className="text-labelinput">
            <label className="trc-labels-cvv" >Name:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="name"
            value={supplierData.name}
            onChange={(e) => setSupplierData({ ...supplierData, name: e.target.value })}
            />
            </div>
             <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Address:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="address"
            value={supplierData.address}
            onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Area:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="area"
            value={supplierData.area}
            onChange={(e) => setSupplierData({ ...supplierData, area: e.target.value })}
            />
            </div>
            
             <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Town:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="town"
            value={supplierData.town}
            onChange={(e) => setSupplierData({ ...supplierData, town: e.target.value })}
            /></div>
             <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Pincode:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="pincode"
            value={supplierData.pincode}
            onChange={(e) => setSupplierData({ ...supplierData, pincode: e.target.value })}
            /></div>
             <div  className="text-labelinput">
            <label  className="trc-labels-cvv">State:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="state"
            value={supplierData.state}
            onChange={(e) => setSupplierData({ ...supplierData, state: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Phone:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="phone"
            value={supplierData.phone}
            onChange={(e) => setSupplierData({ ...supplierData, phone: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Mobile:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="mobile"
            value={supplierData.mobile}
            onChange={(e) => setSupplierData({ ...supplierData, mobile: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Contact:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="contact"
            value={supplierData.contact}
            onChange={(e) => setSupplierData({ ...supplierData, contact: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Email:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="email"
            value={supplierData.email}
            onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Transport Town:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="trTown"
            value={supplierData.transport.trTown}
            onChange={(e) => setSupplierData({ ...supplierData, transport: { ...supplierData.transport, trTown: e.target.value } })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">DL Nos:</label>
            <input className="trc-inputs-cvv"
            type="text"
            name="dlNos"
            value={supplierData.transport.dlNos}
            onChange={(e) => setSupplierData({ ...supplierData, transport: { ...supplierData.transport, dlNos: e.target.value } })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">LST No:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="lstNo"
            value={supplierData.lstNo}
            onChange={(e) => setSupplierData({ ...supplierData, lstNo: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">CST No:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="cstNo"
            value={supplierData.cstNo}
            onChange={(e) => setSupplierData({ ...supplierData, cstNo: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">TIN:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="tin"
            value={supplierData.tin}
            onChange={(e) => setSupplierData({ ...supplierData, tin: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">GSTIN:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="gstin"
            value={supplierData.gstin}
            onChange={(e) => setSupplierData({ ...supplierData, gstin: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Bank:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="bank"
            value={supplierData.bank}
            onChange={(e) => setSupplierData({ ...supplierData, bank: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Opening Balance:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="openingBalance"
            value={supplierData.openingBalance}
            onChange={(e) => setSupplierData({ ...supplierData, openingBalance: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label  className="trc-labels-cvv">Closing Balance:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="closingBalance"
            value={supplierData.closingBalance}
            onChange={(e) => setSupplierData({ ...supplierData, closingBalance: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Credit Discount:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="creditDiscount"
            value={supplierData.creditDiscount}
            onChange={(e) => setSupplierData({ ...supplierData, creditDiscount: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Bank Commission:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="bankCommission"
            value={supplierData.bankCommission}
            onChange={(e) => setSupplierData({ ...supplierData, bankCommission: e.target.value })}
            />
            </div>
            <div  className="text-labelinput">
            <label className="trc-labels-cvv">Account Type:</label>
            <input  className="trc-inputs-cvv"
            type="text"
            name="accountType"
            value={supplierData.accountType}
            onChange={(e) => setSupplierData({ ...supplierData, accountType: e.target.value })}
            />
            </div>
            
        </div>
                </div>
                </div>
            <div>
              
            </div>

        </div>
        <button onClick={handleSubmit}>Submit</button>

        </div>
        </>

    )
}
export default Pharmapurchase