import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gst.css';

const Gst = () => {
  const [formData, setFormData] = useState({
    gstNumber: '',
    date: '',
    oldTaxCode: '',
    newTaxCode: '',
    SelectedOption: '',
  });
  const [fetchedOldTaxCodes, setFetchedOldTaxCodes] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/getOldTaxCodes')
      .then((response) => {
        if (response.data && response.data.oldTaxCodes) {
          setFetchedOldTaxCodes(response.data.oldTaxCodes);
        }
      })
      .catch((error) => {
        console.error('Error fetching oldTaxCodes:', error);
        // Handle errors or display an error message
      });
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
  
    if (name === 'gstNumber') {
      // Fetch old tax code based on the selected GST number
      try {
        const response = await axios.get(`http://localhost:5000/api/getOldTaxCode/${value}`);
        const oldTaxCode = response.data.oldTaxCode;
  
        setFormData({
          ...formData,
          [name]: value,
          oldTaxCode: oldTaxCode || '', // Set oldTaxCode to the fetched value or an empty string
        });
      } catch (error) {
        console.error('Error fetching oldTaxCode:', error);
        // Handle errors or display an error message
      }
    } else if (name === 'newTaxCode') {
      const selectedOption = fetchedOldTaxCodes.find(option => option.value === value);
      if (selectedOption) {
        setFormData({
          ...formData,
          [name]: value,
          oldTaxCode: selectedOption.label,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          oldTaxCode: '', 
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      oldTaxCode: formData.newTaxCode, // Update oldTaxCode with the newTaxCode
    };
  
    try {
      // Check if GST number already exists
      const checkResponse = await axios.get(`http://localhost:5000/api/getOldTaxCode/${updatedFormData.gstNumber}`);
  
      if (checkResponse.data.oldTaxCode) {
        // GST number exists, update the GST data with the newTaxCode
        await axios.put('http://localhost:5000/api/updateGstData', updatedFormData);
        console.log('Data updated successfully!');
      } else {
        // GST number doesn't exist, create new data with the newTaxCode
        await axios.post('http://localhost:5000/api/saveGstData', updatedFormData);
        console.log('Data saved successfully!');
      }
  
      // Fetch the updated oldTaxCode
      const response = await axios.get(`http://localhost:5000/api/getOldTaxCode/${updatedFormData.gstNumber}`);
      const updatedOldTaxCode = response.data.oldTaxCode;
  
      // Handle success or display a success message
      console.log('Updated oldTaxCode:', updatedOldTaxCode);
  
      // Reset form data
      setFormData({
        gstNumber: '',
        date: '',
        oldTaxCode: '',
        newTaxCode: '',
        SelectedOption: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle errors or display an error message
    }
  };
  

  const [fetchedGSTNumbers, setFetchedGSTNumbers] = useState([]);
  useEffect(() => {
    const fetchGSTNumbers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/gstNumbers');
        setFetchedGSTNumbers(response.data.gstNumbers || []);
      } catch (error) {
        console.error('Error fetching GST numbers:', error.message);
        // Handle errors or display an error message
      }
    };

    fetchGSTNumbers();
  }, []);

    return (
        <div className='gst-page'>
           <form onSubmit={handleSubmit}>
           <div className='gst-first-line'>
          <label>Our Gst Number</label>&nbsp;&nbsp;
          <select
            className='gst-first-inp'
            name='gstNumber'
            onChange={handleInputChange}
            value={formData.gstNumber}
          >
            <option value=''>Select GST Number</option>
            {fetchedGSTNumbers.map((gstNumber) => (
              <option key={gstNumber} value={gstNumber}>
                {gstNumber}
              </option>
            ))}
          </select>
          <button className='enable-gst-btn' id='enable-btn'>
            Enable Gst
          </button>
        </div>
            <div className='gst-first-line'>
            <input type='date' className='gst-date-inp' 
             value={formData.date}
             name='date'
           
             onChange={handleInputChange}
             />
             </div>
            <div className='gst-third-btns'>
                <button className='gst-btn-13' id='create-gst-btn'>Create Gst Tax codes</button>
                <button id='dos-btn'>Create DOS <br></br>Invoice Formats</button>
                <button id='editbatch-btn'>Edit Batchwise<br></br> Rates</button>
                <button  id='newdos-btn' >New DOS Invoice<br></br> Formats</button>
            </div>
        
            <div className='gst-last-sec'>
              <div>
              <fieldset>
              <legend className='legendss'>Change Tax Code</legend>
              <div className='gst-lst-sec-sel'>
            <label>Old Tax Code</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         
            <input
  className='gst-sel'
  value={formData.oldTaxCode}
  onChange={handleInputChange}
  name='oldTaxCode'
>
 
</input>

          </div>
                <div className='gst-lst-sec-sel-2'>
                <label>New Gst Tax Code</label>&nbsp;&nbsp;
                <select className='gst-sel'
            value={formData.newTaxCode}
            onChange={handleInputChange}
            name='newTaxCode'>
                 <option value=''>select option</option>
                <option value='1246734R'>1246734r</option>
                <option value='1234466'>1234466</option>
                <option value='4%'>4%</option>
                <option value='6%'>6%</option>
                <option value='7%'>7%</option>
                </select>  
            </div>
                </fieldset>


            </div>
            <fieldset className='field-gst'>
            <legend className='legendss'>Change In</legend>
                <div className='gst-change-in'>
             <div className='gst-radio-btns'>
             <div className='rad-btn-1'>
             <input
  type='radio'
  value='Item only'
  checked={formData.SelectedOption === 'Item only'}
  onChange={(e) => setFormData({ ...formData, SelectedOption: e.target.value })}
/><lable className='itemonlys'>Item Only</lable>
             </div>
             <div className='rad-btn-2'>
             <input
  type='radio'
  value='Item & Stock Book'
  className='radioes'
  checked={formData.SelectedOption === 'Item & Stock Book'}
  onChange={(e) => setFormData({ ...formData, SelectedOption: e.target.value })}
/><lable>Item & Stock Book</lable>
             </div>
             </div>
                </div>
                </fieldset>
                </div>
                <div>
                  <button className='Change-btn'>change</button></div> 
                </form>
            </div> 
     
    )
}

export default Gst