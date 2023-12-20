import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import Popup from 'reactjs-popup';
// import './Itemdes.css';

const companyData = ["Company1", "Company2", "Company3"];
const categoriesData = ["Category A", "Category B", "Category C"];
const groupsData = ["Group 1", "Group 2", "Group 3"];
const schedulesData = ["Schedule 1", "Schedule 2", "Schedule 3"];
const drugCompositionData = ["drug1", "drug2", "drug3"];
const taxCodeData = ["tax1", "tax2", "tax3"];
const hsnData = ["3004", "3003", "2002"];

const ItemDescription = () => {
    const [dataList, setDataList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    // const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPopupOpen, setPopupOpen] = useState(false);



    const [selectedProduct, setSelectedProduct] = useState('');

    const openPopup = (product) => {
      setSelectedProduct(product);
      document.body.classList.add('popup-openclose'); // Add CSS class to body
    };
  
    const closePopup = () => {
      setSelectedProduct('');
      document.body.classList.remove('popup-openclose'); // Remove CSS class from body
    };

    const handlePrint = (item) => {
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print</title>');
          printWindow.document.write('<style>');
          printWindow.document.write(`
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
      
            .dali-pd-pop-1strow {
              display: flex;
              margin-bottom: 10px;
            }
      
            .dali-pd-pop-1strow label {
              flex: 1;
              font-weight: bold;
              margin-right: 10px;
            }
      
            .dali-pd-pop-1strow input {
              flex: 2;
              border: none;
              border-bottom: 1px solid #ccc;
              padding: 5px;
              width: 100%;
              box-sizing: border-box;
            }
            .footer {
                position: absolute;
                bottom: 0;
                right: 0;
                padding: 10px;
              }
          `);
          printWindow.document.write('</style></head><body>');
          printWindow.document.write('<div class="print-layout">');
      
          // Copy your existing content to the print layout
          document.querySelectorAll('.dali-pd-pop-1strow').forEach(row => {
            printWindow.document.write('<div class="dali-pd-pop-1strow">');
            row.querySelectorAll('label, input').forEach(element => {
              printWindow.document.write(element.outerHTML);
            });
            printWindow.document.write('</div>');
          });
           // Include the current date and time in the footer
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString();
            printWindow.document.write(<div class="footer">Printed on: ${formattedDate}</div>);
          printWindow.document.write('</div></body></html>');
          printWindow.document.close();
          printWindow.print();
        } else {
          console.error('Failed to open print window.');
        }
      };
      
      
      

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/get-all-data");
            if (response.ok) {
                const data = await response.json();
                // Filter the data based on the search term
                const filteredData = data.filter(
                    (item) =>
                        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.mrp.toString().includes(searchTerm.toLowerCase())
                );
                setDataList(filteredData); // Update the state with filtered data
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditItemDes = (id) => {
        console.log("Selected Item ID:", id);
        setSelectedItemId(id);
        // setEditPopupVisible(true);
    };

    const handleDelete = (id) => {
        setSelectedItemId(id);
        setDeletePopupVisible(true);
    };

    const handleFieldChange = (field, value) => {
        setDataList((prevDataList) =>
            prevDataList.map((item) =>
                item._id === selectedItemId ? { ...item, [field]: value } : item
            )
        );
    };

    const handleEditItemDesSubmit = async (editedData) => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/edit-item/${selectedItemId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedData),
                }
            );

            if (response.ok) {
                const { updatedItem } = await response.json();
                setDataList((prevDataList) =>
                    prevDataList.map((item) =>
                        item._id === selectedItemId ? updatedItem : item
                    )
                );
            } else {
                console.error("Failed to update item");
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            // Delete the item on the server
            const response = await fetch(
                `http://localhost:5001/api/delete-item/${selectedItemId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                const { deletedItem } = await response.json();
                // Update the UI by removing the deleted item
                setDataList((prevDataList) =>
                    prevDataList.filter((item) => item._id !== deletedItem._id)
                );
                setDeletePopupVisible(false);
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    return (
      
        <div>
            <body  className="popup-openclose">
            <div className="dali-total">
                <div className="dali-div-search">
                    <input
                        className="dali-search-in"
                        type="text"
                        placeholder="Search by Product"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="dali-ser-icon" onClick={fetchData}><  LuSearch className='dali-icon' /></button>
                </div>
                <h1> Data List</h1>
                <table className="dali-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Company</th>
                            <th>MRP</th>
                            <th>Tax Code</th>
                            <th>HSN Code</th>
                            <th>Narration</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="dali-table-body">
                        {dataList.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <Popup
                                        trigger={<u>{item.product}</u>}
                                        position="right"
                                        modal
                                        open={isPopupOpen}
                                        onClose={closePopup}
                                    >
                                        {close => (
                                            <div  className="dali-product-deti-popup">
                                               <div  className="dali-pd-pop-tdiv">
                                                <span  className="dali-pd-pop-span">Details</span>
                                                    <div className="dali-pd-pop-table">
                                                        <div className="dali-pd-pop-div">
                                                          <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label >Product</label>
                                                            <input value={item.product}  readOnly></input>
                                                            </div>
                                                            <div  className="dali-pd-pop-rowr">
                                                             <label>Company</label>
                                                            <input value={item.company} readOnly></input>
                                                            </div>
                                                            </div>  

                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>Tax Code</label>
                                                            <input value={item.taxCode} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Category</label>
                                                            <input value={item.category} readOnly></input>
                                                            </div>
                                                            </div> 


                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>Group</label>
                                                            <input value={item.group} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Schedule</label>
                                                            <input value={item.schedule} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>Purchase Rate</label>
                                                            <input value={item.purchaseRate} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Sales Rate</label>
                                                            <input value={item.schedule} readOnly></input>
                                                            </div>
                                                            </div> 


                                                            <span  className="dali-pd-pop-span-1"> Packing </span>
                                                            <div className="dali-pd-pop-1strow">
                                                            
                                                            <div>
                                                             <label>Unit</label>
                                                            <input value={item.unit} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Box</label>
                                                            <input value={item.box} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <div className="dali-pd-pop-1strow">
                                                            
                                                            <div>
                                                             <label>Unit/Box</label>
                                                            <input value={item.unitPerBox} readOnly></input>
                                                            </div>
                                                            </div> 


                                                            <span  className="dali-pd-pop-span-1"> Lot </span>
                                                            <div className="dali-pd-pop-1strow">
                                                            
                                                            <div>
                                                             <label>Lot Qty</label>
                                                            <input value={item.lotQty} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Lot Rate</label>
                                                            <input value={item.lotrate} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <span  className="dali-pd-pop-span-1"> Other Rates </span>
                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>M.R.P.</label>
                                                            <input value={item.mrp} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>To Reltr (Occ)</label>
                                                            <input value={item.reltr} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>Salesman</label>
                                                            <input value={item.salesman} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>HSN Code</label>
                                                            <input value={item.hsn} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Narration</label>
                                                            <input value={item.narration} readOnly></input>
                                                            </div>
                                                            </div> 

                                                            <div className="dali-pd-pop-1strow">
                                                            <div>
                                                             <label>Drug Composition</label>
                                                            <input value={item.drugComposition} readOnly></input>
                                                            </div>
                                                            <div   className="dali-pd-pop-rowr">
                                                             <label>Distr. Rate</label>
                                                            <input value={item.distrrate} readOnly></input>
                                                            </div>
                                                            </div> 



                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dali-pd-pop-btns">
                                                <button onClick={() => handlePrint(item)}>Print</button>
                                                <button className="dali-pd-pop-cancel" onClick={close}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </td>

                                <td>{item.company}</td>
                                <td>{item.mrp}</td>
                                <td>{item.taxCode}</td>
                                <td>{item.hsn}</td>
                                <td>{item.narration}</td>
                                <td>
                                    <Popup trigger=
                                        {<button className="dali-edit-btn" > <FiEdit onClick={() => handleEditItemDes(item._id)} className='dali-edit-icon' /> </button>}
                                        modal nested>
                                        {
                                            close => (
                                                <div className='dali-modal-edit'>
                                                    <div className="dali-edit-popup">
                                                        <div>
                                                            <span className="dali-edit-span">Edit Item</span>
                                                            <div></div>
                                                            <label>
                                                                Product:
                                                                <input
                                                                    className="dali-product-in"
                                                                    type="text"
                                                                    value={
                                                                        dataList.find((item) => item._id === selectedItemId)?.product || ""
                                                                    }
                                                                    onChange={(e) => handleFieldChange("product", e.target.value)}


                                                                />
                                                            </label>
                                                            <div className="dali-pop-1strow">
                                                                <label>
                                                                    Company:
                                                                </label>
                                                                <Select
                                                                    className="dali-com-sele"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.company || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.company || "",
                                                                    }}
                                                                    options={companyData.map((company) => ({
                                                                        label: company,
                                                                        value: company,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("company", selectedOption.value)
                                                                    }
                                                                />

                                                                <label className="dali-rows">
                                                                    Tax Code:
                                                                </label>
                                                                <Select
                                                                    className="dali-textc-selec"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.taxCode || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.taxCode || "",
                                                                    }}
                                                                    options={taxCodeData.map((taxCode) => ({
                                                                        label: taxCode,
                                                                        value: taxCode,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("taxCode", selectedOption.value)
                                                                    }
                                                                />
                                                            </div>
                                                            {/* ---------------------------------------- */}
                                                            <div className="dali-pop-2ndrow">
                                                                <label>Category :</label>
                                                                <Select
                                                                    className="dali-cat-sele"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.category || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.category || "",
                                                                    }}
                                                                    options={categoriesData.map((category) => ({
                                                                        label: category,
                                                                        value: category,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("category", selectedOption.value)
                                                                    }
                                                                />

                                                                <label className="dali-rows" >Group :</label>
                                                                <Select
                                                                    className="dali-grp-sele"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.group || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.group || "",
                                                                    }}
                                                                    options={groupsData.map((group) => ({
                                                                        label: group,
                                                                        value: group,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("group", selectedOption.value)
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="dali-pop-3rdrow">
                                                                <label>Shedule :</label>
                                                                <Select
                                                                    className="dali-she-sele"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.schedule || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.schedule || "",
                                                                    }}
                                                                    options={schedulesData.map((schedule) => ({
                                                                        label: schedule,
                                                                        value: schedule,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("schedule", selectedOption.value)
                                                                    }
                                                                />
                                                            </div>

                                                            {/* --------------------------------------------------- */}
                                                            <div className="dali-pur-sale-rate">
                                                                <label> Purchase
                                                                    <div>
                                                                        <label>Rate :</label>
                                                                        <input
                                                                            className="dali-prate-in"
                                                                            type="number"
                                                                            value={
                                                                                dataList.find((item) => item._id === selectedItemId)?.purchaseRate || ""
                                                                            }
                                                                            onChange={(e) => handleFieldChange("purchaseRate", e.target.value)}></input>
                                                                    </div>
                                                                </label>

                                                                <label className="dali-sales-r"> Sales
                                                                    <div>
                                                                        <label>Rate :</label>
                                                                        <input
                                                                            className="dali-prate-in"
                                                                            type="number"
                                                                            value={
                                                                                dataList.find((item) => item._id === selectedItemId)?.salesRate || ""
                                                                            }
                                                                            onChange={(e) => handleFieldChange("salesRate", e.target.value)}></input>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            <div className="dali-pack-div">
                                                                <label className="dali-row-labels"> Packing </label>
                                                                <div className="dali-pack">
                                                                    <label>Unit :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.unit || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("unit", e.target.value)}></input>

                                                                    <label>Box :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.box || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("box", e.target.value)}></input>

                                                                    <label>Unit/Box :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.unitPerBox || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("unitPerBox", e.target.value)}></input>
                                                                </div>
                                                            </div>
                                                            <div className="dali-lot-div">

                                                                <label className="dali-row-labels"> Lot </label>
                                                                <div className="dali-pack">
                                                                    <label>Lot Qty :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.lotQty || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("lotQty", e.target.value)}></input>

                                                                    <label>Lot Rate :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.lotrate || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("lotrate", e.target.value)}></input>
                                                                </div>
                                                            </div>
                                                            <div className="dali-other-div">
                                                                <label className="dali-row-labels"> Other Rates </label>
                                                                <div className="dali-pack">
                                                                    <label>M.R.P.:</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.mrp || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("mrp", e.target.value)}></input>

                                                                    <label>To Reltr (Occ) :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.reltr || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("reltr", e.target.value)}></input>

                                                                    <label>Salesman :</label>
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.salesman || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("salesman", e.target.value)}></input>
                                                                </div>
                                                            </div>

                                                            <div className="dali-pop-4throw">
                                                                <label>HSN Code :</label>
                                                                <Select
                                                                    className="dali-dc-sele"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.hsn || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.hsn || "",
                                                                    }}
                                                                    options={hsnData.map((hsn) => ({
                                                                        label: hsn,
                                                                        value: hsn,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("hsn", selectedOption.value)
                                                                    }
                                                                />

                                                                <label className="dali-rows-drug" >Drug Composition :</label>
                                                                <Select
                                                                    className="dali-dc-sele-drug"
                                                                    value={{
                                                                        label:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.drugComposition || "",
                                                                        value:
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                                ?.drugComposition || "",
                                                                    }}
                                                                    options={drugCompositionData.map((drugComposition) => ({
                                                                        label: drugComposition,
                                                                        value: drugComposition,
                                                                    }))}
                                                                    onChange={(selectedOption) =>
                                                                        handleFieldChange("drugComposition", selectedOption.value)
                                                                    }
                                                                />

                                                                <label>
                                                                    Distr Rate:
                                                                    <input
                                                                        className="dali-pack-in"
                                                                        type="text"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.distrrate || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("distrrate", e.target.value)}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="dali-narr-div">
                                                                <label>
                                                                    Narration:
                                                                    <input
                                                                        className="dali-narr-in"
                                                                        type="text"
                                                                        value={
                                                                            dataList.find((item) => item._id === selectedItemId)?.narration || ""
                                                                        }
                                                                        onChange={(e) => handleFieldChange("narration", e.target.value)}
                                                                    />
                                                                </label>
                                                            </div>
                                                            {/* Add more fields as needed */}
                                                            <div className="dali-btn-div">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditItemDesSubmit(
                                                                            dataList.find((item) => item._id === selectedItemId)
                                                                        ) && close()
                                                                    }
                                                                >
                                                                    Save
                                                                </button>

                                                                <button className="dali-pop-can" onClick={() => close()}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div>
                                <button onClick=
                                    {() => close()}>
                                        Close modal
                                </button>
                            </div> */}
                                                </div>
                                            )
                                        }
                                    </Popup>

                                    <Popup trigger=
                                        {<button className="dali-delete-btn" onClick={() => handleDelete(item._id)}>< RiDeleteBin6Line className='dali-delete-icon' /></button>}
                                        modal nested>
                                        {
                                            close => (
                                                <div className='dali-modal-delete'>
                                                    <div className="delete-popup">
                                                        <center>
                                                            <h2 className="dali-pop-head">Delete Item</h2>
                                                            <p>Are you sure you want to delete this item?</p>
                                                            <button className="dali-pop-btnns" onClick={handleDeleteSubmit  || close()} >Yes</button>
                                                            <button className="dali-pop-btnns" onClick={() => setDeletePopupVisible(false) || close()}>No</button>
                                                        </center>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </Popup>

                                    {/* <button onClick={() => handleEditItemDes(item._id)}>Edit</button> */}
                                    {/* <button onClick={() => handleDelete(item._id)}>Delete</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </body>
        </div>
    );
};

export default ItemDescription;
