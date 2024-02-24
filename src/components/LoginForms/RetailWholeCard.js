import React from "react";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
import "./Loginvi.css";

const RetailWholecard = () => {
  return (
      <div className="Card1-con-vik"   style={{backgroundImage: 'url(https://raw.githubusercontent.com/narendrachitteti/dhanvantri-pharma/master/src/components/Pharmacy/pharma1.jpeg)'}}
      >
     
       <div className="Card1-con-vik-123">
         
       <Link to="/RetailLogin" class="card-vik">
          <h2 className="retail"> Retail</h2>
        </Link>
       
        <Link to="/WholesaleLogin" class="card-vik">
          <h2 className="retail"> Wholesale </h2>
        </Link>
    
      
       </div>
    
    </div>
  );
};

export default RetailWholecard;
