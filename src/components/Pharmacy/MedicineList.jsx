// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./MedicineList.css";
// import { FiAlertTriangle } from "react-icons/fi";
// import { AiOutlineAlignRight, AiOutlineAlignLeft,  AiOutlineCheck, AiOutlineClose} from "react-icons/ai";
// import { BiSolidEditAlt } from "react-icons/bi";
// import PharmacyNav from "./PharmacyNav";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";
// import { FaArrowCircleLeft } from "react-icons/fa";
// import ReactJsPagination from "react-js-pagination";
// import { BASE_URL } from "../../Services/Helper";

// function MedicineList() {
//   const [medicines, setMedicines] = useState([]);
//   const [editedMedicine, setEditedMedicine] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 3;
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   // Function to fetch medicines from the backend
//   const fetchMedicines = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/getInvoices`);
//       setMedicines(response.data);
//     } catch (error) {
//       console.error("Error fetching medicines:", error);
//     }
//   };

//   // Call the fetchMedicines function when the component mounts
//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   // const handleEdit = (medicine) => {
//   //   setEditedMedicine({ ...medicine }); // Copy medicine data for editing
//   // };

//   const handleSave = async () => {
//     if (editedMedicine) {
//       // Ensure editedMedicine is not null before proceeding
//       const { MedId, Medicine, Manufacturer, Category, Quantity } = editedMedicine;
  
//       if (Medicine !== null && Manufacturer !== null && Category !== null) {
//         try {
//           await axios.put(
//             `${BASE_URL}/api/updateMedicineQuantity/${MedId}`,
//             { Quantity }
//           );
  
//           const updatedMedicines = medicines.map((medicine) =>
//             medicine.MedId === MedId ? editedMedicine : medicine
//           );
  
//           setMedicines(updatedMedicines);
//           setEditedMedicine(null);
//           toast.success("Data updated successfully", {
//             autoClose: 2000,
//           });
  
//           fetchMedicines();
//         } catch (error) {
//           console.error("Error updating medicine:", error);
//           toast.error("Error updating medicine");
//         }
//       } else {
//         toast.error("Please fill out all required fields.");
//       }
//     } else {
//       console.error("No edited medicine to save.");
//     }
//   };
  

//   const handleSearchInputChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); 
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const filteredMedicines = medicines.filter(
//     (invoice) =>
//       invoice &&
//       invoice.medicines &&
//       Array.isArray(invoice.medicines) &&
//       invoice.medicines.some(
//         (nestedMedicine) =>
//           nestedMedicine &&
//           nestedMedicine.Medicine &&
//           nestedMedicine.Medicine.toLowerCase().includes(
//             searchQuery.toLowerCase()
//           )
//       )
//   );

//   // const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;

//   // Function to open the popup for editing
//   const openPopup = (medicine) => {
//     setEditedMedicine({ ...medicine });
//     setIsPopupOpen(true);
//   };

//   // Function to close the popup
//   const closePopup = () => {
//     setIsPopupOpen(false);
//   };

//   return (
//     <>
//       <PharmacyNav />
//       <div className="main-cont-PO-11">
//         <p className="Listheading-PO-11">
//           <h1 style={{fontFamily:'roboto'}}>
//             <Link to="/PharmacyHome"  style={{ color: "#9b8bf4" }}>
//               <FaArrowCircleLeft className="med-list-arrow" />
//             </Link>{" "}
//           <span >List Medicines</span>
//           </h1>
//         </p>

//         <div className="">
//           <input
//             type="text"
//             placeholder="Search Medicines"
//             style={{width:'300px',padding:'.5rem',margin:'.3rem'}}
//             value={searchQuery}
//             onChange={handleSearchInputChange}
//           />
//         </div>

//         <div className="contain-PO-11">
//           <div className="json-data">
//             <table className="medicine-table-PO-11">
//               <thead>
//                 <tr>
//                   <th>
//                     MEDID 
//                   </th>
//                   <th>
//                     Medname 
//                   </th>
//                   <th>
//                     Mfr 
//                   </th>
//                   <th>
//                     Shedule 
//                   </th>
//                   {/* <th>Stock Alert</th>
//                   <th>Edit</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredMedicines.slice(startIndex, endIndex).map((invoice) =>
//                   invoice.medicines
//                     .filter(
//                       (nestedMedicine) =>
//                         nestedMedicine &&
//                         nestedMedicine.Medicine &&
//                         nestedMedicine.Medicine.toLowerCase().includes(
//                           searchQuery.toLowerCase()
//                         )
//                     )
//                     .map((nestedMedicine, nestedIndex) => (
//                       <tr key={nestedIndex}>
//                         <td>{nestedMedicine.MedId}</td>
//                         <td>{nestedMedicine.Medicine}</td>
//                         <td>{nestedMedicine.manufacturer}</td>
//                         <td>{nestedMedicine.schedule}</td>
//                         {/* /* <td>
//                           {parseInt(nestedMedicine.Quantity) < 50 ? (
//                             <button className="stock-alert-button red">
//                               <FiAlertTriangle />
//                             </button>
//                           ) : (
//                             <button className="stock-alert-button green">
//                               <FiAlertTriangle />
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             className="stock-edit-button"
//                             onClick={() => openPopup(nestedMedicine)} // Open the popup for editing
//                           >
//                             <BiSolidEditAlt />
//                           </button>
//                         </td>*/}
//                       </tr> 
//                     ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <ToastContainer />
//         <ReactJsPagination
//           activePage={currentPage}
//           itemsCountPerPage={itemsPerPage}
//           totalItemsCount={filteredMedicines.length}
//           pageRangeDisplayed={5}
//           onChange={handlePageChange}
//         />
//       </div>
//       {isPopupOpen && editedMedicine && ( // Display the popup when isPopupOpen is true and editedMedicine is not null
//   <div className="popup-ml">
//     <div className="popup-content-ml">
//       <span className="close" onClick={closePopup}>
//         &times;
//       </span>
//       <h2>Edit Medicine</h2>
//       <div className="input-group">
//         <label htmlFor="editedMedname">Medname:</label>
//         <input
//           type="text"
//           id="editedMedname"
//           value={editedMedicine.Medicine}
//           onChange={(e) =>
//             setEditedMedicine({
//               ...editedMedicine,
//               Medicine: e.target.value,
//             })
//           }
//         />
//       </div>
//       <div className="input-group">
//         <label htmlFor="manufacturer">Manufacturer:</label>
//         <input
//           type="text"
//           id="manufacturer"
//           value={editedMedicine.Manufacturer}
//           onChange={(e) =>
//             setEditedMedicine({
//               ...editedMedicine,
//               Manufacturer: e.target.value,
//             })
//           }
//         />
//       </div>
//       <div className="input-group">
//         <label htmlFor="editedcategory">Category:</label>
//         <input
//           type="text"
//           id="editedcategory"
//           value={editedMedicine.Category}
//           onChange={(e) =>
//             setEditedMedicine({
//               ...editedMedicine,
//               Category: e.target.value,
//             })
//           }
//         />
//       </div>
//       <div className="input-group">
//         <label htmlFor="editedstock">Stock:</label>
//         <input
//           type="number"
//           id="editedstock"
//           value={editedMedicine.Quantity}
//           onChange={(e) =>
//             setEditedMedicine({
//               ...editedMedicine,
//               Quantity: e.target.value,
//             })
//           }
//         />
//       </div>
//       <div className="popup-ml-button">
//         <button
//           className="popup-ml-save"
//           onClick={handleSave}
//         >
//           <AiOutlineCheck />
//         </button>
//         <button
//           className="popup-ml-cancel"
//           onClick={closePopup}
//         >
//          <AiOutlineClose />
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </>
//   );
// }

// export default MedicineList;
import React, { useState, useEffect } from "react";
import "./ItemEditPage.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import PharmacyNav from "./PharmacyNav";
import { BASE_URL } from "../../Services/Helper";

const MedicineList = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/itemdec`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (itemId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/itemdec/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Item deleted successfully:", itemId);
        const updatedData = data.filter((item) => item._id !== itemId);
        setData(updatedData);
      } else {
        const result = await response.json();
        console.error("Error deleting item:", result.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/itemdec/${selectedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedItem),
        }
      );

      if (response.ok) {
        const updatedItemData = await response.json();
        const updatedData = data.map((item) =>
          item._id === updatedItemData._id ? updatedItemData : item
        );
        setData(updatedData);
      } else {
        console.error("Error updating item:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <PharmacyNav />
      <div className="container-vikeditpage">
        <Link to="/ItemDescription" style={{ color: "#9b8bf4" }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaArrowCircleLeft />Back
          </h2>
        </Link>
        <h1>Medicine list</h1>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>GST %</th>
              <th>Manufacturer</th>
              <th>Batch No</th>
              <th>Schedule</th>
              <th>PTR</th>
              <th>Rate</th>
              <th>Per Strip</th>
              <th>HSN Code</th>
              <th>Narration</th>
              <th>Drug Composition</th>
              <th>Expiry Date</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.product}</td>
                <td>{item.Gst}</td>
                <td>{item.manufacturer}</td>
                <td>{item.batchno}</td>
                <td>{item.schedule}</td>
                <td>{item.ptr}</td>
                <td>{item.rate}</td>
                <td>{item.perStrip}</td>
                <td>{item.hsnCode}</td>
                <td>{item.narration}</td>
                <td>{item.drugComposition}</td>
                <td>{item.expiryDate}</td>
                {/* <td style={{ display: 'flex', gap: '.2rem' }}>
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                  <button onClick={() => handleDeleteClick(item._id)} style={{ backgroundColor: 'red' }}>Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay-itemeditvik">
            <div className="modal-itemeditvik">
              <h3>Edit Item</h3>
              <form>
                <label>
                  Product:
                  <input
                    type="text"
                    value={selectedItem.product}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        product: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  GST %:
                  <input
                    type="text"
                    value={selectedItem.Gst}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        Gst: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Manufacturer:
                  <input
                    type="text"
                    value={selectedItem.manufacturer}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        manufacturer: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Batch No:
                  <input
                    type="text"
                    value={selectedItem.batchno}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        batchno: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Schedule:
                  <select
                    className="itemeditselectsech"
                    name="schedule"
                    value={selectedItem.schedule}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        schedule: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Schedule</option>
                    <option value="C">C</option>
                    <option value="C1">C1</option>
                    <option value="X">X</option>
                    <option value="X1">X1</option>
                  </select>
                </label>

                <label>
                  PTR:
                  <input
                    type="number"
                    value={selectedItem.ptr}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        ptr: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Rate:
                  <input
                    type="number"
                    value={selectedItem.rate}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        rate: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Per Strip:
                  <input
                    type="number"
                    value={selectedItem.perStrip}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        perStrip: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  HSN Code:
                  <input
                    type="text"
                    value={selectedItem.hsnCode}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        hsnCode: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Narration:
                  <input
                    type="text"
                    value={selectedItem.narration}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        narration: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Drug Composition:
                  <input
                    type="text"
                    value={selectedItem.drugComposition}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        drugComposition: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Expiry Date:
                  <input
                    type="date"
                    value={selectedItem.expiryDate}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </label>

              </form>

              <div className="item-editform-button">
                <button type="button" onClick={handleSaveClick}>
                  Save
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicineList;
