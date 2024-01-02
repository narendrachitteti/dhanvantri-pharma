import React, { useState, useEffect } from 'react';
import ReactJsPagination from 'react-js-pagination';
import axios from 'axios';
import './Stockist.css';
import PharmacyNav from './PharmacyNav';

const Stockist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStockists, setFilteredStockists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stockists, setStockists] = useState([]);
  const [newStockistData, setNewStockistData] = useState({
    uniqueID: '',
    name: '',
    gstNumber: '',
    email: '',
    phoneNumber: '',
    addedDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editMode, setEditMode] = useState(null);
  const [editStockistData, setEditStockistData] = useState({
    uniqueID: '',
    name: '',
    gstNumber: '',
    email: '',
    phoneNumber: '',
    addedDate: '',
  });

  const fetchStockists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-stockists');
      const fetchedStockists = response.data;
      setStockists(fetchedStockists);
    } catch (error) {
      console.error('Error fetching stockists:', error);
    }
  };
   
  useEffect(() => {
    fetchStockists();
  }, []);

  useEffect(() => {
    const filterStockists = () => {
      const filtered = stockists.filter(
        (stockist) =>
          stockist.name &&
          stockist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStockists(filtered);
    };

    filterStockists();
  }, [searchQuery, stockists]);

  const handleAddStockist = async () => {
    try {
      if (
        !newStockistData.name ||
        !newStockistData.gstNumber ||
        !newStockistData.email ||
        !newStockistData.phoneNumber ||
        !newStockistData.addedDate
      ) {
        alert('Please fill in all fields.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/submit-stockist', { postData: newStockistData });

      fetchStockists();

      const updatedResponse = await axios.get('http://localhost:5000/api/get-stockists');
      const updatedStockists = updatedResponse.data;
  
      setStockists(updatedStockists);

      setNewStockistData({
        uniqueID: '',
        name: '',
        gstNumber: '',
        email: '',
        phoneNumber: '',
        addedDate: '',
      });

      togglePopup();
      console.log('Server Response:', response);
    } catch (error) {
      console.error('Error adding stockist:', error);
      alert('Error adding stockist. Please try again.');
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditStockist = async (stockistId) => {
    try {
      await axios.put(`http://localhost:5000/api/update-stockist/${stockistId}`, editStockistData);

      const response = await axios.get('http://localhost:5000/api/get-stockists');
      const updatedStockists = response.data;
  
      setStockists(updatedStockists);

      setEditMode(null);
      setEditStockistData({
        uniqueID: '',
        name: '',
        gstNumber: '',
        email: '',
        phoneNumber: '',
        addedDate: '',
      });
    } catch (error) {
      console.error('Error editing stockist:', error);
      alert('Error editing stockist. Please try again.');
    }
  };

  const startEditing = (stockist) => {
    setEditMode(stockist._id);
    setEditStockistData({ ...stockist });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStockists = filteredStockists.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <PharmacyNav />
      <div className="searchtopheader">
        <div className="search-bar">
          <input
            className="search-input-stock"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: 'Inria Serif' }}
          />
          {/* <i className="fa fa-search"></i> */}
        </div>
        <button
          className="add-stockists-button"
          onClick={togglePopup}
          style={{ fontFamily: 'Inria Serif' }}
        >
          Add Stockists
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-header">
            Add Stockists
            <button className="close-button" onClick={togglePopup}>
              X
            </button>
          </div>
          <hr />
          <div className="popup-content">
            <form>
              <label className='nameclass-label'>Name:</label>
              <input
                type="text"
                placeholder="Name"
                value={newStockistData.name}
                onChange={(e) => setNewStockistData({ ...newStockistData, name: e.target.value })}
              />
              <label className='nameclass-label'>GST Number:</label>
              <input
                type="text"
                placeholder="GST Number"
                value={newStockistData.gstNumber}
                onChange={(e) =>
                  setNewStockistData({ ...newStockistData, gstNumber: e.target.value })
                }
              />
              <label className='nameclass-label'>Email:</label>
              <input
                type="text"
                placeholder="Email"
                value={newStockistData.email}
                onChange={(e) => setNewStockistData({ ...newStockistData, email: e.target.value })}
              />
              <label className='nameclass-label'>PhoneNumber:</label>
              <input
                type="text"
                placeholder="PhoneNumber"
                value={newStockistData.phoneNumber}
                onChange={(e) =>
                  setNewStockistData({ ...newStockistData, phoneNumber: e.target.value })
                }
              />
              <label className='nameclass-label'>Added Date:</label>
              <input
                type="date"
                placeholder="Added Date"
                value={newStockistData.addedDate}
                onChange={(e) =>
                  setNewStockistData({ ...newStockistData, addedDate: e.target.value })
                }
              />
              <button
                type="button"
                className="addclose-button"
                onClick={handleAddStockist}
              >
                {'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div>
        <table className="stockists-table">
          <thead>
            <tr>
              <th>Stock ID</th>
              <th>Name</th>
              <th>GST Number</th>
              <th>Email</th>
              <th>phoneNumber</th>
              <th>Added Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentStockists.map((stockist) => (
              <tr key={stockist._id}>
                <td>
                  {editMode === stockist._id ? (
                    <input type="text" value={editStockistData.uniqueID} disabled />
                  ) : (
                    stockist.uniqueID
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <input
                      type="text"
                      value={editStockistData.name}
                      onChange={(e) => setEditStockistData({ ...editStockistData, name: e.target.value })}
                    />
                  ) : (
                    stockist.name
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <input
                      type="text"
                      value={editStockistData.gstNumber}
                      onChange={(e) => setEditStockistData({ ...editStockistData, gstNumber: e.target.value })}
                    />
                  ) : (
                    stockist.gstNumber
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <input
                      type="text"
                      value={editStockistData.email}
                      onChange={(e) => setEditStockistData({ ...editStockistData, email: e.target.value })}
                    />
                  ) : (
                    stockist.email
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <input
                      type="text"
                      value={editStockistData.phoneNumber}
                      onChange={(e) => setEditStockistData({ ...editStockistData, phoneNumber: e.target.value })}
                    />
                  ) : (
                    stockist.phoneNumber
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <input
                      type="date"
                      value={editStockistData.addedDate}
                      onChange={(e) => setEditStockistData({ ...editStockistData, addedDate: e.target.value })}
                    />
                  ) : (
                    formatDate(stockist.addedDate)
                  )}
                </td>
                <td>
                  {editMode === stockist._id ? (
                    <button className="save-button" onClick={() => handleEditStockist(stockist._id)}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-button" onClick={() => startEditing(stockist)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='ReactJsPagination'>
          <ReactJsPagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredStockists.length}
            pageRangeDisplayed={3}
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Stockist;
