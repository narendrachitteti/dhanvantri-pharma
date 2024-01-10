import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './PharmacyNav.css';
import img from './Dp16.png';
import { BASE_URL } from "../../Services/Helper";



const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};


const PharmacyNav = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [userid, setUserID] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [matchingStaff, setMatchingStaff] = useState(null);
  const colorFilter = `
  <filter id="white-out">
  <feColorMatrix type="matrix" values="
    1 0 0 0 1 0
    0 1 0 0 1 0
    0 0 1 0 1 0
    0 0 0 1 0 0
  " />
</filter>
  `;


  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogOut = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("hasPageReloaded");
  };

  // 
  const renderProfileIcon = () => {
    if (matchingStaff) {
      const nameParts = matchingStaff.name.split(" ");
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      } else {
        return (
          nameParts[0].charAt(0).toUpperCase() +
          nameParts[1].charAt(0).toUpperCase()
        );
      }
    } else {
      return <CgProfile />;
    }
  };
  return (
    <>
      <div className="navbar-doctor1" >
        <div className="left-1">
          <div className="nav-item">
            <Link to="/pharmabilling" style={{textDecoration:'none', color:'white',fontWeight:'bolder',fontSize:'2rem'}} >
             
            <img  src={img}alt='logo'  style={{ width: '50px', height: '50px',marginTop:'-25px'}} filter={colorFilter} />
            </Link>
          </div>
          <div className="nav-item">
            <div className="dropdown">
            <Link to="/pharmabilling"> <h6  style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}> Billing</h6></Link>
              {/* <div className="dropdown-content">
                <Link to="/pharmabilling">Bill</Link>
                <Link to="/BillingDashboard">Dashboard</Link>
              </div> */}
            </div>
          </div>
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}> Inventory</h6>
              <div className="dropdown-content">
                {/* <Link to="/Inventory">Inventory Stock</Link> */}
                <Link to="/MedicineList">Product</Link>
                <Link to="/Pharmacystock">Stocks</Link>
              </div>
            </div>
          </div>
  
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Item Description</h6>
              <div className="dropdown-content">
                <Link to="/ItemDescription">Item Description</Link>
                <Link to="/Stockist">Stockists</Link>
                <Link to="/invoicestock">Invoices</Link>
                {/* <Link to="/Form3">Tax Code</Link>
                <Link to="/Form4">HSN Code</Link> */}
              </div>
            </div>
          </div>
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}> Purchase Order</h6>
              <div className="dropdown-content">
                <Link to="/CreateOrder">Create Order</Link>
                <Link to="/OrderList">Order list</Link>
                <Link to="/Drugmaster">Drug Master</Link>
                <Link to="/Creditnote">Credit/Debit Note</Link>
                

              </div>
            </div>
           
          </div>
          <div className="nav-item">
          <div className="dropdown">

          <h6  style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Patient Details</h6>
           
  <div className="dropdown-content">
           <Link to='/invoice'> Invoice Details  </Link>
           <Link to='/MedicineDataComponent'> Product Details  </Link>
           <Link to='/Account'> Account Details</Link>

            </div>
           
            </div>
          </div>
          <div

            onMouseEnter={toggleProfileDropdown}
            onMouseLeave={toggleProfileDropdown}
          >
            <div className="right-doc">
              <div className="drop-icon">
                <div
                  className="profile-icon-container"
                  onClick={toggleProfileDropdown}
                >
                  <span className="icon-profile-rounded-icon">
                    {renderProfileIcon()}
                  </span>
                </div>
              </div>

              {showProfileDropdown && (
  <div className="profile-dropdown-logout">
    {matchingStaff && (
      <div className="dropdown-item-logout">
        <div className="user-id">
          User ID: {capitalizeFirstLetter(matchingStaff.userid)}
        </div>
        {/* <div className="user-id">
          Department: {capitalizeFirstLetter(matchingStaff.specialization)}
        </div> */}
      </div>
    )}

    <div className="linkedin">
      <Link to="/" onClick={handleLogOut} className="profile-link">
        Sign Out
      </Link>
    </div>
  </div>
)}
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default PharmacyNav;