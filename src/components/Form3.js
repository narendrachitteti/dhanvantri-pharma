import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form3.css'; // Import the CSS file
import PharmacyNav from './Pharmacy/PharmacyNav';

const Form3 = () => {
  const [taxes, setTaxes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [newTax, setNewTax] = useState({
    taxcode: '',
    Group: '',
    Schedule: '',
  });

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/taxes');
      setTaxes(response.data);
    } catch (error) {
      console.error('Error fetching taxes:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/taxes/${id}`);
      // After deleting, fetch the updated list of taxes
      fetchTaxes();
    } catch (error) {
      console.error('Error deleting tax:', error.message);
    }
  };

  const handleEdit = (tax) => {
    // Set the selected tax and open the edit modal
    setSelectedTax(tax);
    setShowEditForm(true);
  };

  const handleAddTax = async () => {
    try {
      await axios.post('http://localhost:5000/api/taxes', newTax);
      // After adding, fetch the updated list of taxes
      fetchTaxes();
      // Close the form
      setShowAddForm(false);
      // Reset the form fields
      setNewTax({
        taxcode: '',
        Group: '',
        Schedule: '',
      });
    } catch (error) {
      console.error('Error adding tax:', error.message);
    }
  };

  const handleEditTax = async () => {
    try {
      await axios.put(`http://localhost:5000/api/taxes/${selectedTax._id}`, selectedTax);
      // After editing, fetch the updated list of taxes
      fetchTaxes();
      // Close the form
      setShowEditForm(false);
      // Reset the selected tax
      setSelectedTax(null);
    } catch (error) {
      console.error('Error editing tax:', error.message);
    }
  };

  return (
    <>
    <PharmacyNav/>
    <div className='Form3-vik'>
      <h2 className='company-list'>Tax List</h2>
      <button onClick={() => setShowAddForm(true)}>Add Tax</button>

      {/* Modal for adding a new tax */}
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddForm(false)}>
              &times;
            </span>
            <h3>Add Tax</h3>
            <form>
              <label>Tax Code:</label>
              <input
                type="text"
                value={newTax.taxcode}
                onChange={(e) => setNewTax({ ...newTax, taxcode: e.target.value })}
              />
              <label>Group:</label>
              <input
                type="text"
                value={newTax.Group}
                onChange={(e) => setNewTax({ ...newTax, Group: e.target.value })}
              />
              <label>Schedule:</label>
              <input
                type="text"
                value={newTax.Schedule}
                onChange={(e) => setNewTax({ ...newTax, Schedule: e.target.value })}
              />
              <button type="button" onClick={handleAddTax}>
                Add
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing a tax */}
      {showEditForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditForm(false)}>
              &times;
            </span>
            <h3>Edit Tax</h3>
            <form>
              <label>Tax Code:</label>
              <input
                type="text"
                value={selectedTax.taxcode}
                onChange={(e) => setSelectedTax({ ...selectedTax, taxcode: e.target.value })}
              />
              <label>Group:</label>
              <input
                type="text"
                value={selectedTax.Group}
                onChange={(e) => setSelectedTax({ ...selectedTax, Group: e.target.value })}
              />
              <label>Schedule:</label>
              <input
                type="text"
                value={selectedTax.Schedule}
                onChange={(e) => setSelectedTax({ ...selectedTax, Schedule: e.target.value })}
              />
              <button type="button" onClick={handleEditTax}>
                Save
              </button>
              <button type="button" onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Tax Code</th>
            <th>Group</th>
            <th>Schedule</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {taxes.map((tax) => (
            <tr key={tax._id}>
              <td>{tax.taxcode}</td>
              <td>{tax.Group}</td>
              <td>{tax.Schedule}</td>
              <td style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleDelete(tax._id)}>Delete</button>
                <div> </div>
                <button onClick={() => handleEdit(tax)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Form3;
