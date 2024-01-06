import React, { useState, useEffect } from "react";
import "./ItemEditPage.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import PharmacyNav from "./PharmacyNav";
import { BASE_URL } from "../../Services/Helper";

const ItemEditPage = () => {
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
            <FaArrowCircleLeft />Go Back
          </h2>
        </Link>
        <h1>Edit Page</h1>
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
              <th>Action</th>
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
                <td style={{ display: 'flex', gap: '.2rem' }}>
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                  <button onClick={() => handleDeleteClick(item._id)} style={{ backgroundColor: 'red' }}>Delete</button>
                </td>
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
                    value={selectedItem.taxCode}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        taxCode: e.target.value,
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

export default ItemEditPage;
