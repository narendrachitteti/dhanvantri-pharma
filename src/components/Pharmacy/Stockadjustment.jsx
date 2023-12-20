// import React, { useState, useEffect } from 'react';
// import './Stockadjustment.css';
// import PharmacyNav from './PharmacyNav';
// import { Link } from "react-router-dom";
// import { FaArrowCircleLeft } from "react-icons/fa";

// function Stockadjustment() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [stockAdjustments, setStockAdjustments] = useState([]);


//   useEffect(() => {
//     fetchStockAdjustments();
//   }, []);

//   const fetchStockAdjustments = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/stockadjustment');
//       const data = await response.json();
//       setStockAdjustments(data);
//     } catch (error) {
//       console.error('Failed to fetch stock adjustment data:', error);
//     }
//   };
//   const handleFilter = () => {
//     fetchStockAdjustments();
//   };

//   return (
//     <><PharmacyNav/>
//     <div className="page-containerv">
//       <div className="content-containerv">
//         <div className="Bleft-side">
//           <h1> <Link to="/PharmacyHome"> 
//           <FaArrowCircleLeft />
//         </Link> &nbsp;Stock Adjustment Report</h1>
//           {/* Add the rest of your content here */}
//         </div>
//       </div>
//       <div className="search-add-container">
//         {/* Search Input */}
//         <div className='searchtopheader'>
//           <div className="search-bar">
//           <input
//   type="text"
//   placeholder="Search"
//   value={searchQuery}
//   onChange={(e) => setSearchQuery(e.target.value)}
// />
//             {/* You can replace this with your preferred search icon */}
//             <i className="fa fa-search"></i>
//           </div>

//           {/* Add StockistsButton */}
          
//         </div>
//         {/* Table */}
//         <table className="stockists-table">
//           <thead>
//             <tr>
//               <th>Medicine Name</th>
//               <th>Person Name</th>
//               <th>Before Stocks</th>
//               <th>After Stocks</th>
//               <th>Stock Difference</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Map over the stock adjustment data */}
//             {stockAdjustments
//               .filter((stockAdjustment) =>
//                 Object.values(stockAdjustment)
//                   .join(' ')
//                   .toLowerCase()
//                   .includes(searchQuery.toLowerCase())
//               ).map(stockAdjustment => (
//               <tr key={stockAdjustment._id}>
//                 <td>{stockAdjustment.madicinename}</td>
//                 <td>{stockAdjustment.personname}</td>
//                 <td>{stockAdjustment.beforestocks}</td>
//                 <td>{stockAdjustment.afterstocks}</td>
//                 <td>{stockAdjustment.stockdifference}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </>
//   );
// }

// export default Stockadjustment;