import React, { useState } from 'react';
import Gst from './Gst';
import './GstUtilities.css';
import Item_HSN_codes from './Item-HSN-codes';
import PayGst from './PayGst';
import Navbar from './PharmacyNav';


const GstUtilities = () => {
    const [activeSection, setActiveSection] = useState('GST_Page');

    const handleSelectButtonClick = (section) => {
        setActiveSection(section);
      };
      
  return (
    <>
    <Navbar/>
    <div>
      

    <div className="Gst-list-btns">
                <button onClick={() => handleSelectButtonClick('GST_Page')}>GST</button>
                <button onClick={() => handleSelectButtonClick('Pay_GST')}>Pay GST Number</button>
                <button onClick={() => handleSelectButtonClick('HSN_Code')}>Items HSN Code</button>
                <button onClick={() => handleSelectButtonClick('GST_Reg')}>GST Registration</button>
                </div>

                <div className="client-1-container-btn-13">
                {activeSection === 'GST_Page' && <Gst />}
                {activeSection === 'Pay_GST' && <PayGst />}
                {activeSection === 'HSN_Code' && <Item_HSN_codes />}
                {activeSection === 'GST_Reg' && <PayGst />} 
         
              </div>
    </div>
    </>
  )
}

export default GstUtilities