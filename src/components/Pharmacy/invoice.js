import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './invoice.css';
import PharmacyNav from './PharmacyNav';

const Invoice = () => {
    const [invoices, setInvoices] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/patient-bill');
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

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
                        <p className="patient-name-sk143">MobileNumber: {invoice.mobilenumber}</p>
                        <p className="date-sk143">Date: {invoice.date}</p>

                        <table className="items-table-sk143">
                            <thead>
                                <tr>
                                    <th className="product-th-sk143">Product</th>
                                    <th className="quantity-th-sk143">Quantity</th>
                                    <th className="price-th-sk143">Price</th>
                                    <th className="manufacturer-th-sk143">Manufacturer</th>
                                    <th className="batch-no-th-sk143">Batch No</th>
                                    <th className="expiry-date-th-sk143">Expiry Date</th>
                                    <th className="gst-th-sk143">GST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, itemIndex) => (
                                    <tr key={itemIndex} className="item-row-sk143">
                                        <td className="product-td-sk143">{item.product}</td>
                                        <td className="quantity-td-sk143">{item.quantity}</td>
                                        <td className="price-td-sk143">&#8377; {item.price}</td>
                                        <td className="manufacturer-td-sk143">{item.manufacturer}</td>
                                        <td className="batch-no-td-sk143">{item.batch}</td>
                                        <td className="expiry-date-td-sk143">{item.batchExpiry}</td>
                                        <td className="gst-td-sk143">{item.gst}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="total-without-gst-sk143">
                            Total (without GST): &#8377; {invoices.reduce((total, item) => total + item.subtotalWithoutGST, 0).toFixed(2)}
                        </p>

                        <p className="total-with-gst-sk143">
                            Total (with GST): &#8377; {invoices.reduce((total, invoice) => total + invoice.subtotalWithGST, 0).toFixed(2)}
                        </p>


                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};


export default Invoice;