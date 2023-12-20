
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Item-HSN-codes.css';

const Item_HSN_codes = () => {
  
  const [medicines, setMedicines] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
const [medicineHSNCode, setMedicineHSNCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hsnCode, setHSNCode] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxCodes, setTaxCodes] = useState('');
  const [hsnCodes, setHSNCodes] = useState('');
  const [hsnCodeupdate, sethsnCodeupdate] = useState('');

  // useEffect(() => {
  //   const fetchHSNCode = async () => {
  //     try {
  //       if (selectedProduct) {
  //         const response = await axios.get(`http://localhost:5000/api/medicine-hsncode/${selectedProduct}`);
  //         setHSNCode(response.data.hsnCode); // Assuming response contains the HSN code
  //       }
  //     } catch (error) {
  //       console.error('Error fetching HSN code:', error);
  //     }
  //   };
  
  //   fetchHSNCode();
  // }, [selectedProduct]);


  const handleClick = async () => {
    try {
      console.log({ product: selectedProduct, hsnCode, taxCode , hsnCodes,taxCodes, hsnCodeupdate,});
      const itemresponse = await axios.post('http://localhost:5000/api/update-hsn', {
        product: selectedProduct,
        hsnCode,
        taxCode,
        hsnCodes,
        taxCodes,
        hsnCodeupdate,
      });
      console.log(itemresponse);
      alert('Update successful.');
    } catch (error) {
      console.error(error);
      alert('Update failed. Please try again.');
    }
  };

  const handleClickupdate = async () => {
    try {
      console.log({ hsnCodeupdate });
      const response = await axios.put('http://localhost:5000/api/update-all-hsn', {
        hsnCodeupdate,
      });
      console.log(response.data);
      alert('Hsn code update successful.');
    } catch (error) {
      console.error(error);
      alert('Hsn code update failed. Please try again.');
    }
  };

  useEffect(() => {
    const fetchMedicineNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/medicines'); // Adjust the URL if needed
        setMedicines(response.data.medicines);
        setHSNCode(response.data.hsnCodes);
        // Assuming the response contains an array of medicine names and HSN codes
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
  
    fetchMedicineNames();
  }, []);


  const handleMedicineSelect = async (selectedMedicine) => {
  setSelectedMedicine(selectedMedicine);

  try {
    const response = await axios.get(`http://localhost:5000/api/medicines/${selectedMedicine}/hsn`);
    const medicineHSN = response.data.HSNcode; 
    setMedicineHSNCode(medicineHSN);
    
  } catch (error) {
    console.error('Error fetching HSN code:', error);
  }
};

  useEffect(() => {
    const fetchOldTaxCodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getOldTaxCodes');
        // Handle the response and update state accordingly
      } catch (error) {
        console.error('Error fetching oldTaxCodes:', error);
        // Handle error cases
      }
    };
  
    fetchOldTaxCodes();
  }, []);
  
  

  return (
    <div>
      <div className='hsnc-total'>
        <div className='hsnc-contents'>
          <fieldset className='hsnc-pwise-set'>
            <legend className='legend-product-wise'>Product Wise</legend>
            <div className='hsnc-pwise-items'>
              <label>Product:</label>
              <select
  className='hsnc-pwise-select'
  value={selectedMedicine}
  onChange={(e) => handleMedicineSelect(e.target.value)}
>
  <option value=''>Select a product</option>
  {medicines.map((medicine, index) => (
    <option key={index} value={medicine}>
      {medicine}
    </option>
  ))}
</select>

              <div className='hsnc-pwise-hsn'>
                <label>
                  HSN Code:
                  <input
      className='hsnc-tc-selec'
      value={medicineHSNCode}
      readOnly // To prevent editing the HSN code
    />
                </label>
                <button className='hsnc-pwise-btn' onClick={handleClick}>
                  Update
                </button>
              </div>
              <div className='hsnc-tc'>
                <label className='labeltaxcode'>
                  Tax code:
                  </label>
                  <select
                    className='hsnc-pwise-select'
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                  >
                    <option>EX Excempted</option>
                    <option>G12 Gst 12% on Trp</option>
                    <option>G18 Gst 18% on Trp</option>
                    <option>G28 Gst 28% on Trp</option>
                    <option>G5 Gst 5% on Trp</option>
                    <option>H12 Gst 12% on Trp and FREE</option>
                    <option>H18 Gst 18% on Trp and FREE</option>
                  </select>
               
              </div>
            </div>
          </fieldset>

          <div className='hsnc-2nd-content'>
            <fieldset className='hsnc-pwise-set'>
              <legend className='legend-product-wise'>Tax Code Wise</legend>
              <div className='hsnc-pwise-hsn'>
                <label>
                  HSN Code:
                  <input
                    className='hsnc-pwise-hsn-in'
                    value={hsnCodes}
                    onChange={(e) => setHSNCodes(e.target.value)}
                  ></input>
                </label>
                <button className='hsnc-pwise-btn' onClick={handleClick}>
                  Update
                </button>
              </div>
              <div className='hsnc-tc'>
                <label className='labeltaxcode'>
                  Tax code:
                  
                  <select
                    className='hsnc-tc-selec'
                    value={taxCodes}
                    onChange={(e) => setTaxCodes(e.target.value)}
                  >
                    <option>EX Excempted</option>
                    <option>G12 Gst 12% on Trp</option>
                    <option>G18 Gst 18% on Trp</option>
                    <option>G28 Gst 28% on Trp</option>
                    <option>G5 Gst 5% on Trp</option>
                    <option>H12 Gst 12% on Trp and FREE</option>
                    <option>H18 Gst 18% on Trp and FREE</option>
                  </select>
                </label>
              </div>
            </fieldset>
          </div>

          <div className='hsnc-2nd-content'>
            <fieldset className='hsnc-pwise-set'>
              <legend className='legend-product-wise'>* Update All Items *</legend>
              <center>
                <span className='hsnc-up-span'>
                  * ONE HSN CODE FOR ALL PRODUCTS *
                </span>
              </center>
              <div className='hsnc-pwise-hsn'>
                <label>
                  HSN Code:
                  <input
                    className='hsnc-pwise-hsn-in'
                    value={hsnCodeupdate}
                    onChange={(e) => sethsnCodeupdate(e.target.value)}
                  ></input>
                </label>
                <button className='hsnc-pwise-btn' onClick={handleClickupdate}>
                  Update
                </button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item_HSN_codes;