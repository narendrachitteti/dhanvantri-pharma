import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PayGst.css';
// import { Link } from 'react-router-dom';

const PayGst = () => {
  const [account, setAccount] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [accountData, setAccountData] = useState({});
  const [stockists, setStockists] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/save-gst-data', { account, gstNo });
      setAccount('');
      setGstNo('');
      alert('Data saved successfully!');
    } catch (error) {
      alert('Error saving data. Please try again.');
      console.error(error);
    }
  };

  const fetchStockistData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-stockist-data/${account}`);
      if (response.data && response.data.length > 0) {
        const stockist = response.data[0]; // Assuming one stockist per account, modify logic if needed
        setAccountData(stockist); // Update account data
        setGstNo(stockist.gstNumber); // Set GST number in state
      } else {
        setAccountData({}); // Reset account data if no stockist found
        setGstNo(''); // If no stockist found, set the field empty
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // Fetch stockists from the backend
    axios.get('http://localhost:5000/api/stockists')
      .then(response => {
        setStockists(response.data);
      })
      .catch(error => {
        console.error('Error fetching stockists:', error);
      });
  }, []);
  const handleAccountChange = (e) => {
    const selectedAccount = e.target.value;
    setAccount(selectedAccount);

    // Find the selected stockist and set GST number
    const selectedStockist = stockists.find(
      (stockist) => stockist.name === selectedAccount
    );
    if (selectedStockist) {
      setAccountData(selectedStockist); // Update account data
      setGstNo(selectedStockist.gstNumber); // Set GST number in state
    } else {
      setAccountData({}); // Reset account data if no stockist found
      setGstNo(''); // If no stockist found, set the field empty
    }
  };
  return (
    <div className='paygst-page'>
      <div className='paygst-first-row'>
        <label>Account</label>&nbsp;&nbsp;
        <select
  className='paygst-sel'
  value={account}
  onChange={handleAccountChange}
>
  {stockists.map(stockist => (
    <option key={stockist._id} value={stockist.name}>
      {`${stockist.name} - ${stockist.gstNumber} - ${stockist.email}`}
    </option>
  ))}
</select>
        </div>
        <div className='paygst-sec-row'>
          <label>GST No</label>&nbsp;&nbsp;
          <input  type='text'
          className='paygst-inp'
          value={gstNo}
          onChange={(e) => setGstNo(e.target.value)}/>
        </div>
        <div className='paygst-update-link'>
          <button className='paygst-update-btn'  onClick={handleFormSubmit}>Update</button>
          <a href='https://services.gst.gov.in/services/searchtp' className='get-gst-link-para'>Click here to Verify Valid Gst Number</a>
        </div>
        <div className='patgst-last-sec'>
          <h4 className='gstin-heading'>GSTIN PATTERN</h4>
          <div>
            <span className='paygst-pan'>Permanent Account Number (PAN)</span>
          </div>
          <div className='gstin-pattern'>
          
            <span className='twotwo'>22</span>
            <span className='line'>|</span>
            <span className='pan-no'>AAAA0000A</span>
            <span className='line'>|</span>
            <span className='one'>1</span>
            <span className='line'>|</span>
            <span className='z'>Z</span>
            <span className='line'>|</span>
            <span className='five'>5</span>
          </div>
          <div className='explanation'>
          <span>Where :</span><br></br>
          <span>22 : State code</span><br></br>
          <span> 1 : Entity No of the same PAN holder in a state</span><br></br>
          <span>Z : Aplhabet 'Z' By default</span><br></br>
          <span> 5 : Check Sum Digit </span>
          </div>
        </div>
      </div>
    )
  }

  export default PayGst