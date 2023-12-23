{tableData.map((row, index) => {
  const stockistObject = stockistNames.find(stockist => stockist._id === selectedStockist);
  const stockistName = stockistObject ? stockistObject.name : '';

  return (
    <tr key={index}>
   <td>{row.Medicine}</td>
      <td>{stockistName}</td>
      <td>{row.unitstrips}</td>
    <td>{row.NoOfStrips}</td>
    <td>{row.orderedQuantity}</td>
      <td>
        <button
          className="edit-po-button"
          style={{ border: "1px solid white" }}
          onClick={() => openEditForm(row)}
        >
          <BiEdit size={25} />
        </button>
        <button
          className="delete-po-button"
          style={{ color: "red", border: "1px solid white" }}
          onClick={() => handleDeleteRow(index)}
        >
          <MdDelete size={25} />
        </button>
      </td>
    </tr>
  );
})}
