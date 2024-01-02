import React, { useState, useEffect } from 'react';
import ReactJsPagination from 'react-js-pagination';
import axios from 'axios';
import './Account.css';
import PharmacyNav from './PharmacyNav';

const AccountDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStockists, setFilteredStockists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [newAccountData, setNewAccountData] = useState({

    AccountID: '',
    name: '',
    AccountNumber: '',
    ifcscode: '',
    phoneNumber: '',
    // addedDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editMode, setEditMode] = useState(null);
  const [editAccountData, setEditAccountData] = useState({

    AccountID: '',
    name: '',
    AccountNumber: '',
    ifcscode: '',
    phoneNumber: '',
    // addedDate: '',
  });

  const handleAddAccount = async () => {
    try {
      // Check if all fields are filled
      if (!newAccountData.name ||
        !newAccountData.AccountNumber ||
        !newAccountData.ifcscode ||
        !newAccountData.phoneNumber) {
        alert('Please fill in all fields.');
        return;
      }

      // Send newAccountData to the backend
      const response = await axios.post('http://localhost:5000/api/submit-account', newAccountData);

      // Update the accounts state with the response data from the server
      setAccounts([...accounts, response.data]); // Assuming the response contains the added account data

      // Reset form fields
      setNewAccountData({
        AccountID: '',
        name: '',
        AccountNumber: '',
        ifcscode: '',
        phoneNumber: '',
      });

      // Close the popup after adding the account
      togglePopup();
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding account. Please try again.');
    }
  };
useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-accounts');
        setAccounts(response.data); // Assuming the response contains an array of accounts
      } catch (error) {
        console.error('Error fetching accounts:', error);
        // Handle the error, show a message, etc.
      }
    };

    fetchAccounts();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditAccount = async (AccountID) => {
    try {
      await axios.put(`http://localhost:5000/api/update-Account/${AccountID}`, editAccountData);
  
      const response = await axios.get('http://localhost:5000/api/get-accounts');
      const updatedAccounts = response.data;
  
      setAccounts(updatedAccounts); // Corrected from setStockists
  
      setEditMode(null);
      setEditAccountData({
        AccountID: '',
        name: '',
        AccountNumber: '',
        ifcscode: '',
        phoneNumber: '',
      });
    } catch (error) {
      console.error('Error editing account:', error);
      alert('Error editing account. Please try again.');
    }
  };
  

  const startEditing = (account) => {
    setEditMode(account._id);
    setEditAccountData({ ...account });
  };
  // const [searchQuery, setSearchQuery] = useState('');
  // const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    // Filter accounts based on searchQuery
    const filtered = accounts.filter((account) =>
      account.name && account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchQuery, accounts]);

  return (
    <div>
      <PharmacyNav />
      <div className="searchtopheader">
        <div className="search-bar001">
          <input
            className="search-input-stock001"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: 'Inria Serif' }}
          />
          {/* <i className="fa fa-search"></i> */}
        </div>
        <button
          className="add-stockists-button001"
          onClick={togglePopup}
          style={{ fontFamily: 'Inria Serif' }}
        >
          Add Account
        </button>
      </div>

      {showPopup && (
        <div className="popup001">
          <div className="popup-header001">
            Add Account
            <button className="close-button001" onClick={togglePopup}>
              X
            </button>
          </div>
          <hr />
          <div className="popup-content001">
            <form>
              <label className='nameclass-label001'>Name:</label>
              <input
                type="text"
                placeholder="Name"
                value={newAccountData.name}
                onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
              />
              <label className='nameclass-label001'>Account Number:</label>
              <input
                type="text"
                placeholder="account Number"
                value={newAccountData.AccountNumber}
                onChange={(e) =>
                  setNewAccountData({ ...newAccountData, AccountNumber: e.target.value })
                }
              />
              <label className='nameclass-label001'>ifccs code:</label>
              <input
                type="text"
                placeholder="ifcs code"
                value={newAccountData.ifcscode}
                onChange={(e) => setNewAccountData({ ...newAccountData, ifcscode: e.target.value })}
              />
              <label className='nameclass-label001'>PhoneNumber:</label>
              <input
                type="text"
                placeholder="PhoneNumber"
                value={newAccountData.phoneNumber}
                onChange={(e) =>
                  setNewAccountData({ ...newAccountData, phoneNumber: e.target.value })
                }
              />
              <button
                type="button"
                className="addclose-button001"
                onClick={handleAddAccount}
              >
                {'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div>
        <table className="stockists-table001">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Name</th>
              <th>Account Number</th>
              <th>Ifsc code</th>
              <th>phoneNumber</th>
              {/* <th>Added Date</th> */}
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
          {filteredAccounts.map((account) => (
              <tr key={account._id}>
                
                <td>
                  {editMode === account._id ? (
                    <input type="text" value={editAccountData.uniqueID} disabled />
                  ) : (
                    account.uniqueID
                  )}
                </td>
                <td>
                  {editMode === account._id ? (
                    <input
                      type="text"
                      value={editAccountData.name}
                      onChange={(e) => setEditAccountData({ ...editAccountData, name: e.target.value })}
                    />
                  ) : (
                    account.name
                  )}
                </td>
                <td>
                  {editMode === account._id ? (
                    <input
                      type="text"
                      value={editAccountData.AccountNumber}
                      onChange={(e) => setEditAccountData({ ...editAccountData, AccountNumber: e.target.value })}
                    />
                  ) : (
                    account.AccountNumber
                  )}
                </td>
                <td>
                  {editMode === account._id ? (
                    <input
                      type="text"
                      value={editAccountData.ifcscode}
                      onChange={(e) => setEditAccountData({ ...editAccountData, ifcscode: e.target.value })}
                    />
                  ) : (
                    account.ifcscode
                  )}
                </td>
                <td>
                  {editMode === account._id ? (
                    <input
                      type="text"
                      value={editAccountData.phoneNumber}
                      onChange={(e) => setEditAccountData({ ...editAccountData, phoneNumber: e.target.value })}
                    />
                  ) : (
                    account.phoneNumber
                  )}
                </td>
                <td>
                  {editMode === account._id ? (
                    <button className="save-button" onClick={() => handleEditAccount(account._id)}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-button" onClick={() => startEditing(account)}>
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
          totalItemsCount={filteredAccounts.length} // Change this from filteredStockists to filteredAccounts
          pageRangeDisplayed={3}
          onChange={(pageNumber) => setCurrentPage(pageNumber)} // Fix the onChange prop
        />
      </div>
      </div>
    </div>
  );
};

export default AccountDetails;
