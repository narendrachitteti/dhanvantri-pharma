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
      style={{backgroundImage: 'url(https://t3.ftcdn.net/jpg/04/58/20/28/360_F_458202839_NYIas4yn9Ic40flVfPo2tWZo9Fztkf1s.jpg)'}}
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
