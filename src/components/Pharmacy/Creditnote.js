import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './creditcard.css';
import PharmacyNav from "./PharmacyNav";

const Note = () => {
  

  const [formDatas, setFormDatas] = useState({
    CrNo: '',
    CrDate: '', // Format date as 'YYYY-MM-DD'
    customers: '',
    Amount: '',
    ManualNo: '',
    Narration: '',
  });

  const [formData, setFormData] = useState({
    DrNo: '',
    DrDate: '', // Format date as 'YYYY-MM-DD'
    customers: '',
    Amount: '',
    ManualNo: '',
    Narration: '',
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormDatas((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Assuming you have a server endpoint for handling debit note data
      await axios.post('http://localhost:5000/api/submitDebitNote', formData);
      console.log('Debit Note data submitted successfully');
      setFormData({
        DrNo: '',
        DrDate: '',
        customers: '',
        Amount: '',
        ManualNo: '',
        Narration: '',
      });
    } catch (error) {
      console.error('Error submitting debit note data:', error);
    }
  };

  const handleSubmits = async () => {
    try {
      // Assuming you have a server endpoint for handling credit note data
      await axios.post('http://localhost:5000/api/submitCreditNote', formDatas);
      console.log('Credit Note data submitted successfully');
      setFormDatas({
        CrNo: '',
        CrDate: '',
        customers: '',
        Amount: '',
        ManualNo: '',
        Narration: '',
      });
    } catch (error) {
      console.error('Error submitting credit note data:', error);
    }
  };

  const [selectedOption, setSelectedOption] = useState('option1');
  const [selectedHeading, setSelectedHeading] = useState('Credit Note');

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setSelectedHeading(value === 'option1' ? 'Credit Note' : 'Debit Note');
  };

  return (
    <>
      <PharmacyNav />
    <div>
       <h2 className='see'>{selectedHeading}</h2>
      <fieldset className='field'>
        <legend className='selected'>{selectedHeading}</legend>
     <div className='shyam'>
    <label>
      <input  type="radio"  value="option1"  checked={selectedOption === 'option1'}  onChange={handleRadioButtonChange}/>
      Credit Note
    </label>

    <label>
      <input type="radio"  value="option2" checked={selectedOption === 'option2'}  onChange={handleRadioButtonChange}/>
      Debit Note
    </label>
    </div>

    {selectedOption && (
      <div>
        {selectedOption === 'option1' && (
          
            <p><form className='hello'>
              <div className='rows1'>
              
                
                <div className='CrNo'>
            
            <label className='Head'>CrNo:</label>
            <input
          type="text"
          name="CrNo"
          value={formDatas.CrNo}
          onChange={handleChanges}
          
          className='numbers1'
        />
          </div>
          
            <div className='CrDate'>
            <label className='Head'>CrDate:</label>
            
            <input
    type="date"
    name="CrDate"
    value={formDatas.CrDate} 
    onChange={handleChanges}
    className='numberss0'
  />
            </div>
           
         
          
          
          <div className='customers'>
            <label className='Head'>customers:</label>
            
            <input
          type="text"
          name="customers"
          value={formDatas.customers}
          onChange={handleChanges}
          className='manual'
        />
            </div>

            
           <div className='Amount'>
            <label className='Head'>Amount:</label>
            
            <input
          type="text"
          name="Amount"
          value={formDatas.Amount}
          onChange={handleChanges}
          className='manual1'
        />
            </div>
            
         
          
          <div className='ManualNo'>
            <label className='Head'>ManualNo:</label>
            
            <input
          type="text"
          name="ManualNo"
          value={formDatas.ManualNo}
          onChange={handleChanges}
          className='manual'
        />
            </div>
            
          
         
          
          <div className='Narration'>
            <label className='Head'>Narration:</label>
            
            <textarea
          type="text"
          name="Narration"
          value={formDatas.Narration}
          onChange={handleChanges}
          className='textareas1'
        />
            </div>
            
          
          
          <div className='hhhh'><hr className='hr'></hr></div>
          <div>
            <div className='columm1'>
            <button type="button" className='P' onClick={handleSubmits}>
        Submit
      </button>
                <button className='Prints' type="button">Register</button>
          </div>
          </div>
         
          </div>
        </form></p>
          
        )}











        
        {selectedOption === 'option2' && (
          
            <p><form  className='prabha'>
            <div className='rows'>
              
               
          <div className='DrNo'>
            <label className='Head'>DrNo:</label>
            <input
          type="text"
          name="DrNo"
          value={formData.DrNo}
          onChange={handleChange}
          
          className='numberss'
        />
          </div>

          
          <div className='DrDate'>
            <label className='Head'>DrDate:</label>
            
            <input
  type="date"
  name="DrDate"
  value={formData.DrDate}
  onChange={handleChange}
  className='numberss2'
/>
            </div>
            
         
         
          
          <div className='customers'>
            <label className='Head'>customers:</label>
            
            <input
          type="text"
          name="customers"
          value={formData.customers}
          onChange={handleChange}
          className='numberss4'
        />
            
            </div>
            
          
          
          
          <div className='Amount'>
            <label className='Head'>Amount:</label>
            
            <input
          type="text"
          name="Amount"
          value={formData.Amount}
          onChange={handleChange}
          className='numberss3'
        />
            </div>
            
         

          
            <div className='ManualNo'>
            <label className='Head'>ManualNo:</label>
            
            <input
          type="text"
          name="ManualNo"
          value={formData.ManualNo}
          onChange={handleChange}
          className='numberss5'
        />
            </div>
           
          
          
         
            <div className='Narration'>
            <label className='Head'>Narration:</label>
            
            <textarea
          type="text"
          name="Narration"
          value={formData.Narration}
          onChange={handleChange}
          className='numberss6'
        />
            </div>
           
         
          
          <div className='heee'><hr className='hr'></hr></div>
          <div>
          <div className='columm'>
          <button type="button" className='P' onClick={handleSubmit}>
        Submit
      </button>
          
          
          <button className='Prints1' type="button">Register</button>
          </div>
          </div>

          </div>
        </form></p>
          
        )}
      </div>
    )}
    </fieldset>
  </div>
  </>
);
};

export default Note;