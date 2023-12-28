//this code for the Drug Master
import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import LabServiceForm from "./PharmaForm";
import PharmacyNav from "./PharmacyNav";
import "./PharmaLab.css";
import { AiOutlineSearch } from "react-icons/ai";
import ReactJsPagination from "react-js-pagination";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';

const PharmaLab = () => {

  //   console.log("hi" + BASE_URL)
  const [labServices, setLabServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 3; // Number of items to display per page
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchLabServices();
  }, []);

  const fetchLabServices = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/Drug-composition'
      );
      setLabServices(response.data);
    } catch (error) {
      console.error("Error fetching lab services:", error);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setAddPopupOpen(true);
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (selectedService) {
        await axios.put(
          `http://localhost:5000/api/Drug-composition/${selectedService._id}`,
          formData
        );


      } else {
        await axios.post('http://localhost:5000/api/Drug-composition/', formData);
      }
      fetchLabServices();
      setSelectedService(null);
      setAddPopupOpen(false);
    } catch (error) {
      console.error("Error adding/updating lab service:", error);
    }
  };

  const handleSearchTextChange = (newValue) => {
    setSearchText(newValue);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = labServices.filter((item) => {
    return (
      (item.DrugCompoId && item.DrugCompoId.toString().includes(searchText)) ||
      (item.testName &&
        item.testName.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.testPrice && item.testPrice.toString().includes(searchText)) ||
      (item.serviceTax && item.serviceTax.toString().includes(searchText)) ||
      (item.testCode && item.testCode.toString().includes(searchText)) ||
      (item.selectedVendor &&
        item.selectedVendor.toLowerCase().includes(searchText.toLowerCase()))
    );
  });
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  const handleCancel = () => {
    setSelectedService(null);
    setAddPopupOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Drug-composition/${id}`);
      fetchLabServices();
    } catch (error) {
      console.error("Error deleting lab service:", error);
    }
  };

  return (
    <>
      <PharmacyNav />

      <div className="lab-service-table-container_5">
        <h2 className="lab-ser-headding-arun5">Drug Master</h2><br></br>
        <h4 className="lab-ser-subheadding-arun5">Drug Composition Management</h4>
        <div className="search-add_5">
          <div className="search-bar_5">
            <div className="search-input_5">
              <AiOutlineSearch className="search-icon_5" />
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => handleSearchTextChange(e.target.value)}
                className="input-field_1"
              />
            </div>
          </div>

          <button className="add-button_5" onClick={handleAdd}>
            Add New Composition
          </button>
        </div>
        <table className="lab-service-table_5">
          <thead style={{ backgroundColor: '#3d50ae' }}>
            <tr>
              <th> Product Composition</th>
              <th>Product Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((service) => (
              <tr key={service._id} >
                <td>{service.DrugCompoId}</td>
                <td>{service.testName}</td>

                <td>
                  <div className="asd_dsfet005">
                    <button
                      className="edit-button_5"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <div>
                      <button
                        className="delete-button_5"
                        onClick={() => handleDelete(service._id)}
                      >
                        Delete
                      </button>
                    </div>
                    {confirmed && (
                      <div className="confirmation-dialog">
                        <p>Are you sure you want to delete this item?</p>
                        <button className="cancel" onClick={() => setConfirmed(false)}>Cancel</button>
                        <button className="confirm" onClick={() => handleDelete(service._id)}>Confirm</button>
                      </div>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <ReactJsPagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={labServices.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            prevPageText={<span className="custom-pagination-arrow"><KeyboardArrowLeft /></span>}
            nextPageText={<span className="custom-pagination-arrow"><KeyboardArrowRight /></span>}
            firstPageText={<span className="custom-pagination-arrow"><KeyboardDoubleArrowLeft /></span>}
            lastPageText={<span className="custom-pagination-arrow"><KeyboardDoubleArrowRight /></span>}
          />
        </div>
        <Popup
          open={selectedService !== null || isAddPopupOpen}
          onClose={handleCancel}
          closeOnDocumentClick
        >
          <LabServiceForm
            selectedService={selectedService}
            onSubmit={handleAddOrUpdate}
            onCancel={handleCancel}
          />
        </Popup>
      </div>
    </>
  );
};

export default PharmaLab;