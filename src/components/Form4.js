import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form3.css'; // Import your CSS file

const Form4 = () => {
  const [documents, setDocuments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({
    Company: '',
    HmsCode: '',
  });

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/newmodels');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/newmodels/${id}`);
      // After deleting, fetch the updated list of documents
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error.message);
    }
  };

  const handleEdit = (document) => {
    // Set the selected document and open the edit modal
    setSelectedDocument(document);
    setShowEditForm(true);
  };

  const handleAddDocument = async () => {
    try {
      await axios.post('http://localhost:5000/api/newmodels', newDocument);
      // After adding, fetch the updated list of documents
      fetchDocuments();
      // Close the form
      setShowAddForm(false);
      // Reset the form fields
      setNewDocument({
        Company: '',
        HmsCode: '',
      });
    } catch (error) {
      console.error('Error adding document:', error.message);
    }
  };

  const handleEditDocument = async () => {
    try {
      await axios.put(`http://localhost:5000/api/newmodels/${selectedDocument._id}`, selectedDocument);
      // After editing, fetch the updated list of documents
      fetchDocuments();
      // Close the form
      setShowEditForm(false);
      // Reset the selected document
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error editing document:', error.message);
    }
  };

  return (
    <div className='Form3-vik'>
      <h2>Document List</h2>
      <button onClick={() => setShowAddForm(true)}>Add Document</button>

      {/* Modal for adding a new document */}
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddForm(false)}>
              &times;
            </span>
            <h3>Add Document</h3>
            <form>
              <label>Company:</label>
              <input
                type="text"
                value={newDocument.Company}
                onChange={(e) => setNewDocument({ ...newDocument, Company: e.target.value })}
              />
              <label>HSNCode:</label>
              <input
                type="text"
                value={newDocument.HmsCode}
                onChange={(e) => setNewDocument({ ...newDocument, HmsCode: e.target.value })}
              />
              <button type="button" onClick={handleAddDocument}>
                Add
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing a document */}
      {showEditForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditForm(false)}>
              &times;
            </span>
            <h3>Edit Document</h3>
            <form>
              <label>Company:</label>
              <input
                type="text"
                value={selectedDocument.Company}
                onChange={(e) => setSelectedDocument({ ...selectedDocument, Company: e.target.value })}
              />
              <label>HSNCode:</label>
              <input
                type="text"
                value={selectedDocument.HmsCode}
                onChange={(e) => setSelectedDocument({ ...selectedDocument, HmsCode: e.target.value })}
              />
              <button type="button" onClick={handleEditDocument}>
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
            <th>Company</th>
            <th>HSNCode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document._id}>
              <td>{document.Company}</td>
              <td>{document.HmsCode}</td>
              <td style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleDelete(document._id)}>Delete</button>
                <div> </div>
                <button onClick={() => handleEdit(document)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form4;
