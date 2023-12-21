import React, { useState, useEffect } from 'react';
import './form.css';

const Form = () => {
  const [company, setCompany] = useState('');
  const [hsncode, sethsncode] = useState('');
//   const [input3, setInput3] = useState('');
  const [fetchedData, setFetchedData] = useState([]);

  const handleEdit = (index) => {
    // Implement edit logic here
    const editedData = fetchedData[index];
    setCompany(editedData.company);
    sethsncode(editedData.hsncode);
    // setInput3(editedData.input3);
  };
  const handleSave = async (index) => {
    try {
      const editedData = {
        company,
        hsncode,
      };

      const response = await fetch(`http://localhost:5000/api/formdata/${fetchedData[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        fetchData();
        console.log('Data updated successfully');
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const handleInput1Change = (event) => {
    setCompany(event.target.value);
  };

  const handleInput2Change = (event) => {
    sethsncode(event.target.value);
  };

//   const handleInput3Change = (event) => {
//     setInput3(event.target.value);
//   };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formordata = {
      company,
      hsncode,
    //   input3,
    };

    try {
      const response = await fetch('http://localhost:5000/api/formdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formordata),
      });

      if (response.ok) {
        fetchData();
        console.log('Data posted successfully');
      } else {
        console.error('Failed to post data');
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/formdata');

      if (response.ok) {
        const responseData = await response.json();
        setFetchedData(responseData);
        console.log('Data fetched successfully');
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='form-formsa'>
        <label>
          Company:
          <input type="text" value={company} onChange={handleInput1Change} />
        </label>

        <label>
          Hsn Code:
          <input type="text" value={hsncode} onChange={handleInput2Change} />
        </label>

        {/* <label>
          Input 3:
          <input type="text" value={input3} onChange={handleInput3Change} />
        </label> */}

        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Fetched Data:</h2>
        <table className='table-formsa'>
          <thead >
            <tr>
              <th>Company Name</th>
              <th>Hsn Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fetchedData.map((item, index) => (
              <tr key={index}>
                <td>{item.company}</td>
                <td>{item.hsncode}</td>
                {/* <td>{item.input3}</td> */}
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleSave(index)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Form;