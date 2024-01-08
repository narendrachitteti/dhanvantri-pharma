import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './invoice.css';
import PharmacyNav from './PharmacyNav';
import { BsPrinter } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../../Services/Helper";

const Invoice = () => {
    const [invoices, setInvoices] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingInvoice, setEditingInvoice] = useState(null);
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/patient-bill`);
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    const handlePrint = (invoice) => {
        const printContent = `
            <html>
                <head>
                    <title>${invoice.patientName} Invoice</title>
                    <!-- Include any additional styles for printing if needed -->
                </head>
                <body>
                    <h1>Patient Information</h1>
                    <p>Patient Name: ${invoice.patientName}</p>
                    <p>Mobile Number: ${invoice.mobilenumber}</p>
                    <p>Date: ${invoice.date}</p>
                    
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Manufacturer</th>
                                <th>Batch No</th>
                                <th>Expiry Date</th>
                                <th>GST</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.product}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>${item.manufacturer}</td>
                                    <td>${item.batch}</td>
                                    <td>${item.batchExpiry}</td>
                                    <td>${item.gst}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <script type="text/javascript">
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
    };
    const [editedData, setEditedData] = useState({
        patientName: '',
        DoctorName: '',
        mobilenumber: '',
        date: '',
        product: '',
        quantity: '',
        price: '',
        manufacturer: '',
        batch: '',
        batchExpiry: '',
        gst: '',


        // Add other fields as needed
    });
    const handleEdit = (invoice) => {
        setEditingInvoice(invoice);
        // Set initial values for the form fields
        setEditedData({
            patientName: invoice.patientName,
            DoctorName: invoice.DoctorName,
            mobilenumber: invoice.mobilenumber,
            date: invoice.date,
            product: invoice.items[0].product,
            quantity: invoice.items[0].quantity,
            price: invoice.items[0].price,
            manufacturer: invoice.items[0].manufacturer,
            batch: invoice.items[0].batch,
            batchExpiry: invoice.items[0].batchExpiry,
            gst: invoice.items[0].gst,
        });
    };

    const handleSave = async () => {
        try {
            // Assuming you have an API endpoint for updating patient data
            await axios.put(`${BASE_URL}/api/update-patient/${editingInvoice._id}`, {
                patientName: editedData.patientName,
                mobilenumber: editedData.mobilenumber,
                date: editedData.date,
                items: [
                    {
                        product: editedData.product,
                        quantity: editedData.quantity,
                        price: editedData.price,
                        manufacturer: editedData.manufacturer,
                        batch: editedData.batch,
                        batchExpiry: editedData.batchExpiry,
                        gst: editedData.gst,
                    },
                ],
            });

            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) =>
                    invoice._id === editingInvoice._id ? { ...invoice, ...editedData } : invoice
                )
            );

            setEditingInvoice(null);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const filteredInvoices = invoices
        ? invoices.filter(
            (invoice) =>
                invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.mobilenumber.includes(searchTerm)
        )
        : [];

    return (
        <>
            <PharmacyNav />

            <div className="invoice-container-sk143">
                <h1 className="invoice-heading-sk143">Invoices Details</h1>

                {/* Search Input */}
                <div className="search-container">
                    <label className='labelsk143'>Search :  </label>
                    <input
                        type="text"
                        placeholder="Search by name or mobile number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-sk143"
                    />
                </div>
                <ul className="invoice-list-sk143">
                    {invoices &&
                        filteredInvoices.map((invoice, index) => (
                            <li key={index} className="invoice-item-sk143">
                                <h2 className="patient-info-heading-sk143">Patient Information</h2>
                                <p className="patient-name-sk143">Patient Name: {invoice.patientName}</p>
                                <p className="patient-name-sk143">Doctor Name: {invoice.doctorName}</p>
                                <p className="patient-name-sk143">MobileNumber: {invoice.mobilenumber}</p>
                                <p className="date-sk143">Date: {invoice.date}</p>

                                <table className="items-table-sk143">
                                    <thead className='items-table-123'>
                                        <tr>
                                            <th className="product-th-sk143">Product</th>
                                            <th className="quantity-th-sk143">Quantity</th>
                                            <th className="price-th-sk143">Price</th>
                                            <th className="manufacturer-th-sk143">Manufacturer</th>
                                            <th className="batch-no-th-sk143">Batch No</th>
                                            {/* <th className="expiry-date-th-sk143">Expiry Date</th> */}
                                            <th className="gst-th-sk143">GST</th>
                                            <th className="gst-th-sk143">Print</th>
                                            <th className="gst-th-sk143">Action</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, itemIndex) => (
                                            <tr key={itemIndex} className="item-row-sk143">
                                                <td className="product-td-sk143">{item.product}</td>
                                                <td className="quantity-td-sk143">{item.quantity}</td>
                                                <td className="price-td-sk143">&#8377; {item.ptr}</td>
                                                <td className="manufacturer-td-sk143">{item.manufacturer}</td>
                                                <td className="batch-no-td-sk143">{item.batch}</td>
                                                {/* <td className="expiry-date-td-sk143">{item.batchExpiry}</td> */}
                                                <td className="gst-td-sk143">{item.Gst}%</td>
                                                <td className="gst-td-sk143" onClick={() => handlePrint(invoice)}>{item.print}<BsPrinter /></td>
                                                {/* <td className="gst-td-sk143" onClick={handlePrint}>{item.print}<BsPrinter /></td> */}
                                                <td className="gst-td-sk143">
                                                    {editingInvoice === invoice ? (
                                                        <>
                                                            {/* Editable form */}
                                                            <div>
                                                                <label>Patient Name:</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.patientName}
                                                                    onChange={(e) => setEditedData({ ...editedData, patientName: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Doctor Name:</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.doctorName}
                                                                    onChange={(e) => setEditedData({ ...editedData, doctorName: e.target.value })}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label>Mobile Number:</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.mobilenumber}
                                                                    onChange={(e) => setEditedData({ ...editedData, mobilenumber: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Date:</label>
                                                                <input
                                                                    type="date"
                                                                    value={editedData.date}
                                                                    onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Product:</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.product}
                                                                    onChange={(e) => setEditedData({ ...editedData, product: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>quantity:</label>
                                                                <input
                                                                    type="number"
                                                                    value={editedData.quantity}
                                                                    onChange={(e) => setEditedData({ ...editedData, quantity: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Price</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.ptr}
                                                                    onChange={(e) => setEditedData({ ...editedData, ptr: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>manufacturer:</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.manufacturer}
                                                                    onChange={(e) => setEditedData({ ...editedData, manufacturer: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Batch</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.batch}
                                                                    onChange={(e) => setEditedData({ ...editedData, batch: e.target.value })}
                                                                />
                                                            </div>
                                                            {/* <div>
                                                                <label>Batch Expiry</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.batchExpiry}
                                                                    onChange={(e) => setEditedData({ ...editedData, batchExpiry: e.target.value })}
                                                                />
                                                            </div> */}
                                                            <div>
                                                                <label>Gst</label>
                                                                <input
                                                                    type="text"
                                                                    value={editedData.Gst}
                                                                    onChange={(e) => setEditedData({ ...editedData, Gst: e.target.value })}
                                                                />
                                                            </div>
                                                            <button onClick={handleSave}>Update</button>
                                                        </>
                                                    ) : (

                                                        <span onClick={() => handleEdit(invoice)}>{item.edit}<FaEdit /></span>

                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* <p className="total-without-gst-sk143">
                                    Total (without GST): &#8377; {invoices.reduce((total, item) => total + item.subtotalWithoutGST, 0).toFixed(2)}
                                </p> */}

                                {/* <p className="total-with-gst-sk143">
                                    Total (with GST): &#8377; {invoices.reduce((total, invoice) => total + invoice.subtotalWithGST, 0).toFixed(2)}
                                </p> */}


                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
};


export default Invoice;