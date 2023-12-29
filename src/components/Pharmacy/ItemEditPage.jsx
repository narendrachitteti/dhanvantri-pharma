import React, { useState, useEffect } from "react";
import "./ItemEditPage.css";

const ItemEditPage = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle the edit button click
  const handleEditClick = (item) => {
    // Set the selected item and open the modal
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Function to handle the delete button click
  const handleDeleteClick = async (itemId) => {
    alert("please Conform to delete")
    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Item deleted successfully:", itemId);
        // Refresh the data after a successful deletion
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

  // Function to handle the save button click in the modal
  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${selectedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItem),
      });

      const updatedItem = await response.json();

      if (response.ok) {
        console.log("Item updated successfully:", updatedItem);
        // Refresh the data after a successful update
        const updatedData = [...data];
        const index = updatedData.findIndex((item) => item._id === updatedItem._id);
        updatedData[index] = updatedItem;
        setData(updatedData);
      } else {
        console.error("Error updating item:", updatedItem.message);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }

    // Close the modal and clear the selected item
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container-vikeditpage">
      <h2>Edit Page</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Company</th>
            <th>Tax Code</th>
            <th>Manufacturer</th>
            <th>Batch No</th>
            <th>Schedule</th>
            <th>PTR</th>
            <th>Rate</th>
            <th>Per Strip</th>
            <th>HSN Code</th>
            <th>Narration</th>
            <th>Drug Composition</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.product}</td>
              <td>{item.company}</td>
              <td>{item.taxCode}</td>
              <td>{item.manufacturer}</td>
              <td>{item.batchno}</td>
              <td>{item.schedule}</td>
              <td>{item.ptr}</td>
              <td>{item.rate}</td>
              <td>{item.perStrip}</td>
              <td>{item.hsnCode}</td>
              <td>{item.narration}</td>
              <td>{item.drugComposition}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleDeleteClick(item._id)}   style={{marginLeft:'.3rem',backgroundColor:'red'}}>Delete</button>
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
                Company:
                <input
                  type="text"
                  value={selectedItem.company}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      company: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Tax Code:
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
                <input
                  type="text"
                  value={selectedItem.schedule}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      schedule: e.target.value,
                    })
                  }
                />
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemEditPage;