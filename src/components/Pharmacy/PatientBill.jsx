import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { BASE_URL } from "../../services/Helpers";
import "./PatientBill.css";
import Navbar from "./PharmacyNav";
const PatientBill = () => {
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
      totalWithGST: 0,
      totalWithoutGST: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    medicineName: "",
  });
  const [patientDataDoc, setPatientDataDoc] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [medicineData, setMedicineData] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/allMedicines`)
      .then((response) => {
        if (Array.isArray(response.data.medicines)) {
          const allMedicines = response.data.medicines.map((invoice) => {
            if (Array.isArray(invoice.medicines)) {
              return invoice.medicines.map((medicine) => medicine.Medicine);
            } else {
              return [];
            }
          });
          const flattenedMedicines = [].concat(...allMedicines);
          setMedicines(flattenedMedicines);
        } else {
          console.error("Medicines array not found in the response data.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleInputChangeSearch = (event) => {
    setPatientId(event.target.value.toUpperCase());
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/combined-data/${patientId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("Fetched Data:", data);

      // Add these console logs
      console.log("Patient ID:", patientId);
      console.log("formData.doctorName:", formData.doctorName); // Add this line
      console.log("formData.doctorName:", selectedDoctor); // Add this line

      setPatientDataDoc(data);
      if (data && data.items && data.items.length > 0) {
        const selectedDoctorName = data.items[0].selectdoctorname;
        console.log("Selected Doctor Name:", selectedDoctorName);

        // Update both selectedDoctor and formData.doctorName
        setSelectedDoctor(selectedDoctorName);
        setFormData((prevFormData) => ({ ...prevFormData, doctorName: selectedDoctorName }));
      } else {
        console.log("No items found in data.items");
      }
    } catch (error) {
      setError("Error fetching data");
    }
  };


  useEffect(() => {
    console.log(patientDataDoc);
  }, [patientDataDoc]);

  useEffect(() => {
    if (formData.patientName) {
      axios
        .get(`${BASE_URL}/v1/combined-data/${formData.patientName}`)
        .then((response) => setPatientData(response.data))
        .catch((error) =>
          console.error("Error fetching patient data:", error.message)
        );
    }
  }, [formData.patientName]);

  useEffect(() => {
    // Fetch doctor data when doctorName changes
    if (formData.doctorName) {
      axios
        .get(`${BASE_URL}/api/doctors/${formData.doctorName}`)
        .then((response) => {
          setDoctorData(response.data);
          console.log("Doctor Name:", response.data.doctorName);
        })
        .catch((error) =>
          console.error("Error fetching doctor data:", error.message)
        );
    }
  }, [formData.doctorName]);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(""); // State for the selected invoice number

const fetchInvoiceNumbers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/invoiceNumbers");
    const invoiceNumbersData = response.data; // Assuming the response is an array of invoice numbers
    setInvoiceNumbers(invoiceNumbersData);
  } catch (error) {
    console.error("Error fetching invoice numbers:", error);
  }
};

// Fetch invoice numbers on component mount
useEffect(() => {
  fetchInvoiceNumbers();
}, []);

  // Fetch invoice numbers on component mount
  useEffect(() => {
    fetchInvoiceNumbers();
  }, []);
  

  useEffect(() => {
    // Fetch medicine data when medicineName changes
    if (formData.medicineName) {
      axios
        .get(`${BASE_URL}/api/medicines/${formData.medicineName}`)
        .then((response) => {
          const updatedItems = [...items];
          const firstItem = updatedItems[0];
          if (firstItem) {
            const medicineData = response.data;
            firstItem.product = medicineData.productName;
            firstItem.amount = medicineData.productPrice;
            firstItem.manufactureDate = medicineData.manufactureDate;
          }
          setItems(updatedItems);
        })
        .catch((error) =>
          console.error("Error fetching medicine data:", error.message)
        );
    }
  }, [formData.medicineName]);

  const [patientName, setPatientName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [pharmaSign, setPharmaSign] = useState("");

  const [subtotalWithGST, setSubtotalWithGST] = useState("");
  const [subtotalWithoutGST, setSubtotalWithoutGST] = useState("");

  useEffect(() => {
    updateSubtotals();
  }, [items]);

  const handleInputChange = (event, itemId, field) => {
    const { value } = event.target;
    const updatedItems = items.map((item) => {
      if (item._id === itemId) {
        return {
          ...item,
          [field]:
            field === "manufactureDate" || field === "expiryDate"
              ? value
              : value || "",
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const updateSubtotals = () => {
    let totalWithGST = 0;
    let totalWithoutGST = 0;

    items.forEach((item) => {
      if (item.quantity !== "" && item.amount !== "" && item.gst !== "") {
        const amount = parseFloat(item.quantity) * parseFloat(item.amount);
        const amountWithGST = amount * (1 + parseFloat(item.gst) / 100);
        totalWithGST += amountWithGST;
        totalWithoutGST += amount;
      }
    });

    setSubtotalWithGST(totalWithGST.toFixed(2));
    setSubtotalWithoutGST(totalWithoutGST.toFixed(2));
  };

  const handleInpChange = (event, itemId, field) => {
    const { value } = event.target;
    const updatedItems = items.map((item) => {
      if (item._id === itemId) {
        const updatedItem = { ...item, [field]: value || "" };
        if (field === "quantity" || field === "amount" || field === "gst") {
          const parsedQuantity = parseFloat(updatedItem.quantity) || 0;
          const parsedAmount = parseFloat(updatedItem.amount) || 0;
          const parsedGST = parseFloat(updatedItem.gst) || 0;

          const calculatedAmount = parsedQuantity * parsedAmount;
          updatedItem.totalWithGST = calculatedAmount * (1 + parsedGST / 100);
          updatedItem.totalWithoutGST = calculatedAmount;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

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
    setItems([...items, newItem]);
  };

  const handleDeleteRow = (itemId) => {
    const updatedItems = items.filter((item) => item._id !== itemId);
    setItems(updatedItems);
  };

  
  const handleSubmit = async () => {
    try {
      console.log("Patient ID:", patientId);
      console.log("Doctor Name:", formData.doctorName);
  
      console.log("Data to be sent to the backend:", {
        patientName,
        invoiceNo,
        selectedDoctor,
        date,
        pharmaSign,
        items,
        subtotalWithGST,
        subtotalWithoutGST,
      });
  
     
      console.log("Selected Doctor Name:", selectedDoctor);
  
      const response = await axios.post(`${BASE_URL}/api/v1/bill-data`, {
        patientName,
        invoiceNo,
        selectedDoctor,
        date,
        pharmaSign,
        items,
        subtotalWithGST,
        subtotalWithoutGST,
      });
  
      console.log("Response:", response.data);
  
      setPatientName("");
      setInvoiceNo("");
      setDoctorName("");
      setDate("");
      setPharmaSign("");
      setItems([
        {
          _id: 1,
          product: "",
          quantity: "",
          amount: "",
          manufactureDate: "",
          batch: "",
          expiryDate: "",
          gst: "",
          totalWithGST: 0,
          totalWithoutGST: 0,
        },
      ]);
      setSubtotalWithGST("");
      setSubtotalWithoutGST("");
    } catch (error) {
      console.error('Axios Error:', error);
    }
  };
  



  return (
    <>
      <Navbar />
      <div className="patientbill-page">
        <div className="patendId">
          <label className="PatientId-Label"  >
            Patient ID:
            <input  className="PatientId-input"
              type="text"
              value={patientId}
              onChange={handleInputChangeSearch}
            />
          </label>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
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
          <span className="pharma-title">Matrical Pharma</span>
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
              value={patientDataDoc ? patientDataDoc.name || "" : ""}
              readOnly
              className="pharma-head-patientname-input"
            />
          </div>
          <div className="input-container">
    <label htmlFor="invoiceNumber"> Invoice Number</label>
   
    <select
    type="text"
  id="invoiceNumber"
  value={selectedInvoiceNumber}
  onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
>
  <option value="">Invoice Number</option>
  {invoiceNumbers.map((invoice) => (
    <option key={invoice.id} value={invoice.invoiceNumber}>
      {invoice.invoiceNumber}
    </option>
  ))}
</select>
  </div>
        </div>
        <div className="pharma-bill-details-2">
          <div>
            <label className="pharma-doctor-label">Doctor Name : </label>
            <input
              type="text"
              value={
                patientDataDoc
                  ? patientDataDoc.items[0].selectdoctorname || ""
                  : ""
              }
              className="pharma-head-doctorname-input"
              readOnly
            />
          </div>
          <div>
            <label className="pharma-date-label">Date : </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="pharma-bill-input-date-2"
            />
          </div>
        </div>
        <table className="pharma-bill-table23">
          <thead className="pharma-bill-tablehead">
            <tr >
              <th className="class567">S No.</th>
              <th className="class567">Product</th>
              <th>Quantity</th>
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
                  <input
                    type="text"
                    list={`medicineList${item.id}`}
                    value={item.medicineInput}
                    onChange={(e) =>
                      handleInputChange(e, item.id, "medicineInput")
                    }
                    className="pharma-head-medicinename-input"
                  />
                  <datalist id={`medicineList${item.id}`}>
                    {medicines &&
                      medicines.length > 0 &&
                      medicines.map((medicine, i) => (
                        <option key={i} value={medicine} />
                      ))}
                  </datalist>
                </td>
                
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "quantity")
                    }
                    className="pharma-bill-input-quantity"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "amount")
                    }
                    className="pharma-bill-input-amount"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.manufactureDate}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "manufactureDate")
                    }
                    className="pharma-bill-input-date-mfg"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.batch}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "batch")
                    }
                    className="pharma-bill-input-batch"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={item.expiryDate}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "expiryDate")
                    }
                    className="pharma-bill-input-date-exp"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.gst}
                    onChange={(event) =>
                      handleInpChange(event, item._id, "gst")
                    }
                    className="pharma-bill-input-gst"
                  />
                </td>
                {/* <td>{item.totalWithGST.toFixed(2)}</td>
                <td>{item.totalWithoutGST.toFixed(2)}</td> */}
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
            value={pharmaSign}
            onChange={(event) => setPharmaSign(event.target.value)}
            className="sign-area"
          />
        </div>

        <button onClick={handleSubmit} className="pharma-bill-submit-btn del-btn">
          Submit
        </button>
      </div>
    </>
  );
};

export default PatientBill;