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
      <div className="Card1-con-vik">
      <MDBContainer fluid 
      className='d-flex align-items-center justify-content-center bg-image-vik'
      style={{backgroundImage: 'url(https://img.freepik.com/free-photo/medicines-medical-supplies-placed-blue_1150-19139.jpg?size=626&ext=jpg&ga=GA1.1.1108439072.1703323631&semt=sph)'}}
      >
        
        <Link to="/RetailLogin" class="card-vik">
          <h2> Retail</h2>
        </Link>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <Link to="/WholesaleLogin" class="card-vik">
          <h2> Wholesale </h2>
        </Link>
    
      
      </MDBContainer>
    </div>
  );
};

export default RetailWholecard;
