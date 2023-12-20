import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import './PharmacyNav.css';
const logstaffid = localStorage.getItem("staffid");


const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const PharmacyNav = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [, setStaffList] = useState([]);
  const [matchingStaff, setMatchingStaff] = useState(null);

 

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/GetAllStaff");
      if (Array.isArray(response.data.data)) {
        setStaffList(response.data.data);
        const foundStaff = response.data.data.find(
          (staff) => staff.staffid === logstaffid
        );
        if (foundStaff) {
          setMatchingStaff(foundStaff); 
        }
      } else {
        console.error("Invalid data received from the server:", response.data);
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogOut = () => {
    localStorage.removeItem("staffid");
    localStorage.removeItem("hasPageReloaded");
   
  };

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
            <Link to="/PharmacyHome" style={{textDecoration:'none', color:'white',fontWeight:'bolder',fontSize:'2rem'}} >
             
            DP
            </Link>
          </div>
          <div className="nav-item">
            <div className="dropdown">
           <h6  style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Select Billing</h6>
              <div className="dropdown-content">
                <Link to="/pharmabilling">Pharma Billing</Link>
                <Link to="/BillingDashboard">Billing Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Select Inventory</h6>
              <div className="dropdown-content">
                <Link to="/Inventory">Inventory Stock</Link>
                <Link to="/MedicineList">Medicine List</Link>
                <Link to="/Pharmacystock">Inventory</Link>
              </div>
            </div>
          </div>
  
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Item Description</h6>
              <div className="dropdown-content">
                <Link to="/ItemDescription">Item Description</Link>
                <Link to="/Stockists">Stockists</Link>
                <Link to="/StockistInvoice">Stockists Invoices</Link>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <div className="dropdown">
              <h6 style={{textDecoration:'none', color:'white',fontWeight:'bolder'}}>Select Purchase Order</h6>
              <div className="dropdown-content">
                <Link to="/CreateOrder">Create Order</Link>
                <Link to="/OrderList">Order list</Link>
                <Link to="/Drugmaster">Drug Master</Link>
                
                

              </div>
            </div>
          </div>
          
              
        </div>
        <div className="add-pbill-dropdown">
          <Link to="/PharmacyBilling" className="add-pbill-icon-link">
            {/* <BiReceipt className="add-pbill-icon" style={{ marginRight:"25px"}}  /> */}
          </Link>
        </div>
        <div
          
          onMouseEnter={toggleProfileDropdown}
          onMouseLeave={toggleProfileDropdown}
        >
          <div className="right-doc">
            <div
              className="profile-icon-container"
              onClick={toggleProfileDropdown}
            >
              <span className="icon-profile rounded-icon">
                {renderProfileIcon()}
              </span>
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown-logout">
                {matchingStaff && (
                  <div className="dropdown-item-logout">
                    <div className="user-id">
                      Name:{capitalizeFirstLetter(matchingStaff.name)}
                    </div>
                    <div className="user-id">
                      Staff ID: {matchingStaff.staffid}
                    </div>
                    <div className="user-id">
                      Department:{" "}
                      {capitalizeFirstLetter(matchingStaff.specialization)}
                    </div>
                  </div>
                )}

                <Link to="/" onClick={handleLogOut} className="profile-link">
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyNav;