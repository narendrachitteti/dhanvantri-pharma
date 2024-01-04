import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MedicineList.css";
import { FiAlertTriangle } from "react-icons/fi";
import { AiOutlineAlignRight, AiOutlineAlignLeft, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BiSolidEditAlt } from "react-icons/bi";
import PharmacyNav from "./PharmacyNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import ReactJsPagination from "react-js-pagination";

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to fetch medicines from the backend
  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getInvoices");
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // Call the fetchMedicines function when the component mounts
  useEffect(() => {
    fetchMedicines();
  }, []);

  // const handleEdit = (medicine) => {
  //   setEditedMedicine({ ...medicine }); // Copy medicine data for editing
  // };

  const handleSave = async () => {
    if (editedMedicine) {
      // Ensure editedMedicine is not null before proceeding
      const { MedId, Medicine, Manufacturer, Category, Quantity } = editedMedicine;

      if (Medicine !== null && Manufacturer !== null && Category !== null) {
        try {
          await axios.put(
            `http://localhost:5000/api/updateMedicineQuantity/${MedId}`,
            { Quantity }
          );

          const updatedMedicines = medicines.map((medicine) =>
            medicine.MedId === MedId ? editedMedicine : medicine
          );

          setMedicines(updatedMedicines);
          setEditedMedicine(null);
          toast.success("Data updated successfully", {
            autoClose: 2000,
          });

          fetchMedicines();
        } catch (error) {
          console.error("Error updating medicine:", error);
          toast.error("Error updating medicine");
        }
      } else {
        toast.error("Please fill out all required fields.");
      }
    } else {
      console.error("No edited medicine to save.");
    }
  };


  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredMedicines = medicines.filter(
    (invoice) =>
      invoice &&
      invoice.medicines &&
      Array.isArray(invoice.medicines) &&
      invoice.medicines.some(
        (nestedMedicine) =>
          nestedMedicine &&
          nestedMedicine.Medicine &&
          nestedMedicine.Medicine.toLowerCase().includes(
            searchQuery.toLowerCase()
          )
      )
  );

  // const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Function to open the popup for editing
  const openPopup = (medicine) => {
    setEditedMedicine({ ...medicine });
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <PharmacyNav />
      <div className="main-cont-PO-11">
        <p className="Listheading-PO-11">
          <h1 style={{ fontFamily: 'roboto' }}>
            <Link to="/PharmacyHome" style={{ color: "#9b8bf4" }}>
              <FaArrowCircleLeft className="med-list-arrow" />
            </Link>{" "}
            <span >List Medicines</span>
          </h1>
        </p>

        <div className="">
          <input
            type="text"
            placeholder="Search Medicines"
            style={{ width: '300px', padding: '.5rem', margin: '.3rem' }}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

        <div className="contain-PO-11">
          <div className="json-data">
            <table className="medicine-table-PO-11">
              <thead>
                <tr>
                  <th>
                    MEDID <AiOutlineAlignRight />
                  </th>
                  <th>
                    Medname <AiOutlineAlignLeft />
                  </th>
                  <th>
                    Mfr <AiOutlineAlignLeft />
                  </th>
                  <th>
                    Category <AiOutlineAlignLeft />
                  </th>
                  <th>Stock Alert</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.slice(startIndex, endIndex).map((invoice) =>
                  invoice.medicines
                    .filter(
                      (nestedMedicine) =>
                        nestedMedicine &&
                        nestedMedicine.Medicine &&
                        nestedMedicine.Medicine.toLowerCase().includes(
                          searchQuery.toLowerCase()
                        )
                    )
                    .map((nestedMedicine, nestedIndex) => (
                      <tr key={nestedIndex}>
                        <td>{nestedMedicine.MedId}</td>
                        <td>{nestedMedicine.Medicine}</td>
                        <td>{nestedMedicine.Manufacturer}</td>
                        <td>{nestedMedicine.Category}</td>
                        <td>
                          {parseInt(nestedMedicine.Quantity) < 50 ? (
                            <button className="stock-alert-button red">
                              <FiAlertTriangle />
                            </button>
                          ) : (
                            <button className="stock-alert-button green">
                              <FiAlertTriangle />
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            className="stock-edit-button"
                            onClick={() => openPopup(nestedMedicine)} // Open the popup for editing
                          >
                            <BiSolidEditAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
        <ReactJsPagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredMedicines.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </div>
      {isPopupOpen && editedMedicine && ( // Display the popup when isPopupOpen is true and editedMedicine is not null
        <div className="popup-ml">
          <div className="popup-content-ml">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <h2>Edit Medicine</h2>
            <div className="input-group">
              <label htmlFor="editedMedname">Medname:</label>
              <input
                type="text"
                id="editedMedname"
                value={editedMedicine.Medicine}
                onChange={(e) =>
                  setEditedMedicine({
                    ...editedMedicine,
                    Medicine: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="manufacturer">Manufacturer:</label>
              <input
                type="text"
                id="manufacturer"
                value={editedMedicine.Manufacturer}
                onChange={(e) =>
                  setEditedMedicine({
                    ...editedMedicine,
                    Manufacturer: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="editedcategory">Category:</label>
              <input
                type="text"
                id="editedcategory"
                value={editedMedicine.Category}
                onChange={(e) =>
                  setEditedMedicine({
                    ...editedMedicine,
                    Category: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="editedstock">Stock:</label>
              <input
                type="number"
                id="editedstock"
                value={editedMedicine.Quantity}
                onChange={(e) =>
                  setEditedMedicine({
                    ...editedMedicine,
                    Quantity: e.target.value,
                  })
                }
              />
            </div>
            <div className="popup-ml-button">
              <button
                className="popup-ml-save"
                onClick={handleSave}
              >
                <AiOutlineCheck />
              </button>
              <button
                className="popup-ml-cancel"
                onClick={closePopup}
              >
                <AiOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default MedicineList;