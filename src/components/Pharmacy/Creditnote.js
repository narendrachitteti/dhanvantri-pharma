// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import './creditcard.css';
// import PharmacyNav from './PharmacyNav';


// const Note = () => {
//   const [formDatas, setFormDatas] = useState({
//     crno: '',
//     crdt: '',
//     customers: '',
//     Amount: '',
//     ManualNo: '',
//     Narration: '',
//   });
//   const [formData, setFormData] = useState({
//     DrNo: '',
//     DrDt: '',
//     customers: '',
//     Amount: '',
//     ManualNo: '',
//     Narration: '',
//   });

//   const [names, setNames] = useState([]);
//   const [selectedName, setSelectedName] = useState('');
  


//   const handlePrintCredit= () => {
//     const dataToPrint = {
//       CrNo: formDatas.crno,
//       CrDt: formDatas.crdt,
//       Customer: formDatas.customers,
//       CreditedAmount: formDatas.Amount,
//       manualNo: formDatas.ManualNo,
//       narration: formDatas.Narration,
//     };
//     printData(dataToPrint);
//   };

//   const handlePrintdebit = () => {
//     const dataToPrintSecondForm = {
//       DrNo: formData.DrNo,
//       DrDt: formData.DrDt,
//       customers: formData.customers,
//       Amount: formData.Amount,
//       ManualNo: formData.ManualNo,
//       Narration: formData.Narration,
//     };
//     printData(dataToPrintSecondForm);
//   };

//   const printData = (dataToPrint) => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.open();
//     printWindow.document.write('<html><head><title>Print</title></head><body>');
//     printWindow.document.write('<h1>Printed Content</h1>');

//     Object.entries(dataToPrint).forEach(([key, value]) => {
//       printWindow.document.write(<p>${key}: ${value}</p>);
//     });

//     printWindow.document.write('</body></html>');
//     printWindow.document.close();
//     printWindow.print();
//     printWindow.close();
//   };

//   const [isEditing, setIsEditing] = useState(false);

//   const fetchDatas = async () => {
//     try {
//       const response = await axios.get('http://localhost:5002/api/getFormData');
//       const { data } = response;

//       if (data.length > 0) {
//         const fetchedFormData = {
//           crno: data[0].crno || '',
//           crdt: data[0].crdt || '',
//           customers: data[0].customers || '',
//         };
//         setFormDatas(fetchedFormData);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/api/getFormData');
//       const { data } = response;

//       if (data.length > 0) {
//         const fetchedFormData = {
//           DrNo: data[0].DrNo || '',
//           DrDt: data[0].DrDt || '',
//           customers: data[0].customers || '',
//         };
//         setFormData(fetchedFormData);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   useEffect(() => {
//     const fetchNames = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/names');
//         if (response.ok) {
//           const data = await response.json();
//           console.log('Fetched data:', data);
//           const extractedNames = data.names.flatMap((obj) =>
//             obj.names.map((nameObj) => nameObj.name)
//           ).filter((name) => typeof name === 'string');
//           console.log('Extracted names:', extractedNames);
//           if (extractedNames.length > 0) {
//             setNames(extractedNames);
//           } else {
//             console.error('No valid names extracted');
//           }
//         } else {
//           console.error('Failed to fetch names');
//         }
//       } catch (error) {
//         console.error('Error fetching names:', error);
//       }
//     };

//     fetchNames();
//   }, []);
//   useEffect(() => {
//     fetchDatas();
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChanges = (e) => {
//     const { name, value } = e.target;
//     setFormDatas({ ...formDatas, [name]: value });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleEdits = () => {
//     setIsEditing(true);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     fetchData(); 
//   };

//   const handleUpdates = async () => {
//     try {
//       await axios.put('http://localhost:5002/api/updateFormData', formDatas);
      
//       await axios.post('http://localhost:5002/api/submitFormData', formDatas);
      
//       setIsEditing(false);
//       setFormDatas({
//         Amount: '',
//         ManualNo: '',
//         Narration: '',
//       });
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };


//   const handleUpdate = async () => {
//     try {
//       await axios.put('http://localhost:5001/api/updateFormData', formData);
      
//       await axios.post('http://localhost:5001/api/submitFormData', formData);
      
//       setIsEditing(false);
//       setFormData({
//         Amount: '',
//         ManualNo: '',
//         Narration: '',
//       });
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post('http://localhost:5001/api/submitFormData', formData);
//       console.log('Form data submitted successfully');
//       setFormData({
//         Amount: '',
//         ManualNo: '',
//         Narration: '',
//       });
//     } catch (error) {
//       console.error('Error submitting form data:', error);
//     }

//   };

//   const handleSubmits = async () => {
//     try {
//       await axios.post('http://localhost:5002/api/submitFormData', formDatas);
//       console.log('Form data submitted successfully');
//       setFormDatas({
//         Amount: '',
//         ManualNo: '',
//         Narration: '',
//       });
//     } catch (error) {
//       console.error('Error submitting form data:', error);
//     }

//   };

//   const [selectedOption, setSelectedOption] = useState('option1');
//   const [selectedHeading, setSelectedHeading] = useState('Credit Note');
//   const handleRadioButtonChange = (event) => {
//     const value = event.target.value;
//     setSelectedOption(value);
//     setSelectedHeading(value === 'option1' ? 'Credit Note' : 'Debit Note');
//   };

//   return (
//     <>
//     <PharmacyNav/>
//     <div>
//        <h2>{selectedHeading}</h2>
//       <fieldset className='field'>
//         <legend>{selectedHeading}</legend>
     
//     <label>
//       <input  type="radio"  value="option1"  checked={selectedOption === 'option1'}  onChange={handleRadioButtonChange}/>
//       Credit Note
//     </label>

//     <label>
//       <input type="radio"  value="option2" checked={selectedOption === 'option2'}  onChange={handleRadioButtonChange}/>
//       Debit Note
//     </label>

//     {selectedOption && (
//       <div>
//         {selectedOption === 'option1' && (
//           <div>
//             <p><form >
//               <div className='rows'>
//               <div>
//                 <div className='rows'>
//                 <div className='DrNo'>
            
//             <label className='dates'>CrNo:</label>
//             <input
//           type="text"
//           name="crno"
//           value={formDatas.crno}
//           onChange={handleChanges}
//           disabled={!isEditing}
//           className='numberss'
//         />
//           </div>
//           <div className='DrDt'>
//             <div className='rows'>
//             <label className='Head'>CrDt:</label>
//             <div className='tel'>
//             <input
//           type="text"
//           name="crdt"
//           value={formDatas.crdt}
//           onChange={handleChanges}
//           disabled={!isEditing}
//           className='numberss'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className=''>customers:</label>
//             <div className='customers'>
//             {names.length > 0 && (
//         <Select
//           options={names.map((name) => ({ value: name, label: name }))}
//           value={{ value: selectedName, label: selectedName }}
//           onChange={(selectedOption) => setSelectedName(selectedOption.value)}
//           placeholder="Search or select a name"
//           isSearchable
//           className='ur' 
//         />
//       )}
//             </div>
//             </div>
//           </div>
//           <div className='rows'>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className='paid'>Amount:</label>
//             <div className='mode'>
//             <input
//           type="text"
//           name="Amount"
//           value={formDatas.Amount}
//           onChange={handleChanges}
//           className='manual'
//         />
//             </div>
//             </div>
//           </div>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className='paids'>ManualNo:</label>
//             <div className='Amount'>
//             <input
//           type="text"
//           name="ManualNo"
//           value={formDatas.ManualNo}
//           onChange={handleChanges}
//           className='manual'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className='Navigations'>
//           <div className='rows'>
//             <label className='paid'>Narration:</label>
//             <div className='words'>
//             <textarea
//           type="text"
//           name="Narration"
//           value={formDatas.Narration}
//           onChange={handleChanges}
//           className='textareas'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className=''><hr className='hr'></hr></div>
//           <div>
//             <div className='columm'>
//             <button type="button" className='Prints' onClick={handleSubmits}>
//         Submit
//       </button>
//           <button className='Prints' type="button" onClick={handlePrintCredit} >Print</button>
//           {isEditing ? (
//         <>
//           <button type="button"  className='Prints' onClick={handleUpdates}>
//             Update
//           </button>
          
//         </>
//       ) : (
//         <button type="button" className='Prints' onClick={handleEdits}>
//           Edit
//         </button>
       
//       )}
//           <button type="button" className='Prints' onClick={handleCancel}>
//       Cancel
//     </button>
//           <button className='Prints' type="button">Exit</button>
//           <button className='Prints' type="button">Register</button>
//           </div>
//           </div>
         
//           </div>
//         </form></p>
//           </div>
//         )}
//         {selectedOption === 'option2' && (
//           <div>
//             <p><form >
//             <div className='rows'>
//               <div>
//                 <div className='rows'>
//           <div className='DrNo'>
//             <label className='changees'>DrNo:</label>
//             <input
//           type="text"
//           name="DrNo"
//           value={formData.DrNo}
//           onChange={handleChange}
//           disabled={!isEditing}
//           className='numberss'
//         />
//           </div>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className='Head'>DrDt:</label>
//             <div className='tel'>
//             <input
//           type="text"
//           name="DrDt"
//           value={formData.DrDt}
//           onChange={handleChange}
//           disabled={!isEditing}
//           className='numberss'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className=''>customers:</label>
//             <div className='customers'>
//             {names.length > 0 && (
//         <Select
//           options={names.map((name) => ({ value: name, label: name }))}
//           value={{ value: selectedName, label: selectedName }}
//           onChange={(selectedOption) => setSelectedName(selectedOption.value)}
//           placeholder="Search or select a name"
//           isSearchable
//           className='ur' 
//         />
//       )}
//             </div>
//             </div>
//           </div>
//           <div className='rows'>
//           <div className='DrDt'>
//           <div className='rows'>
//             <label className='paid'>Amount:</label>
//             <div className='mode'>
//             <input
//           type="text"
//           name="Amount"
//           value={formData.Amount}
//           onChange={handleChange}
//           className='numberss'
//         />
//             </div>
//             </div>
//           </div>
//           <div className='DrDt'>
//             <div className='rows'>
//             <label className='paids'>ManualNo:</label>
//             <div className='Amount'>
//             <input
//           type="text"
//           name="ManualNo"
//           value={formData.ManualNo}
//           onChange={handleChange}
//           className='numberss'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className='note'>
//             <div className='rows'>
//             <label className='paid'>Narration:</label>
//             <div className='words'>
//             <textarea
//           type="text"
//           name="Narration"
//           value={formData.Narration}
//           onChange={handleChange}
//           className='textareas'
//         />
//             </div>
//             </div>
//           </div>
//           </div>
//           <div className=''><hr className='hr'></hr></div>
//           <div>
//           <div className='columm'>
//           <button type="button" className='Prints' onClick={handleSubmit}>
//         Submit
//       </button>
//           <button className='Prints' type="button" onClick={handlePrintdebit} >Print</button>
//           {isEditing ? (
//         <>
//           <button type="button" className='Prints' onClick={handleUpdate}>
//             Update
//           </button>
          
//         </>
//       ) : (
//         <button type="button"className='Prints' onClick={handleEdit}>
//           Edit
//         </button>
       
//       )}
//           <button type="button" className='Prints' onClick={handleCancel}>
//       Cancel
//     </button>
//           <button className='Prints' type="button">Exit</button>
//           <button className='Prints' type="button">Register</button>
//           </div>
//           </div>

//           </div>
//         </form></p>
//           </div>
//         )}
//       </div>
//     )}
//     </fieldset>
//   </div>
//   </>
// );
// };

// export default Note;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './creditcard.css';


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
      await axios.post('http://localhost:5001/api/submitDebitNote', formData);
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
      await axios.post('http://localhost:5001/api/submitCreditNote', formDatas);
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
    <div>
       <h2>{selectedHeading}</h2>
      <fieldset className='field'>
        <legend>{selectedHeading}</legend>
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
            
            <label className='dates'>CrNo:</label>
            <input
          type="text"
          name="CrNo"
          value={formDatas.CrNo}
          onChange={handleChanges}
          
          className='numbers1'
        />
          </div>
          
            <div className='CrDate'>
            <label className='dates1'>CrDate:</label>
            
            <input
    type="date"
    name="CrDate"
    value={formDatas.CrDate} 
    onChange={handleChanges}
    className='numberss'
  />
            </div>
           
         
          
          
          <div className='customers'>
            <label className='dates2'>customers:</label>
            
            <input
          type="text"
          name="customers"
          value={formDatas.customers}
          onChange={handleChanges}
          className='manual'
        />
            </div>

            
           <div className='Amount'>
            <label className='dates3'>Amount:</label>
            
            <input
          type="text"
          name="Amount"
          value={formDatas.Amount}
          onChange={handleChanges}
          className='manual1'
        />
            </div>
            
         
          
          <div className='ManualNo'>
            <label className='dates4'>ManualNo:</label>
            
            <input
          type="text"
          name="ManualNo"
          value={formDatas.ManualNo}
          onChange={handleChanges}
          className='manual'
        />
            </div>
            
          
         
          
          <div className='Narration'>
            <label className='dates5'>Narration:</label>
            
            <textarea
          type="text"
          name="Narration"
          value={formDatas.Narration}
          onChange={handleChanges}
          className='textareas'
        />
            </div>
            
          
          
          <div className='hhhh'><hr className='hr'></hr></div>
          <div>
            <div className='columm'>
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
            <label className='Head1'>DrDate:</label>
            
            <input
  type="date"
  name="DrDate"
  value={formData.DrDate}
  onChange={handleChange}
  className='numberss'
/>
            </div>
            
         
         
          
          <div className='customers'>
            <label className='Head2'>customers:</label>
            
            <input
          type="text"
          name="customers"
          value={formData.customers}
          onChange={handleChange}
          className='numberss'
        />
            
            </div>
            
          
          
          
          <div className='Amount'>
            <label className='Head3'>Amount:</label>
            
            <input
          type="text"
          name="Amount"
          value={formData.Amount}
          onChange={handleChange}
          className='numberss'
        />
            </div>
            
         

          
            <div className='ManualNo'>
            <label className='Head4'>ManualNo:</label>
            
            <input
          type="text"
          name="ManualNo"
          value={formData.ManualNo}
          onChange={handleChange}
          className='numberss'
        />
            </div>
           
          
          
         
            <div className='Narration'>
            <label className='Head5'>Narration:</label>
            
            <textarea
          type="text"
          name="Narration"
          value={formData.Narration}
          onChange={handleChange}
          className='textareas'
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
);
};

export default Note;
