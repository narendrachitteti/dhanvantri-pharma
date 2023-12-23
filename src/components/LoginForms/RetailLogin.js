import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const RetailLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

// Update the handleLogin function
const handleLogin = async () => {
  try {
    // Validate email and password
    if (!email || !password) {
      setShowAlert(true);
      setAlertType('danger');
      setAlertMessage('Please provide both email and password.');
      return;
    }

    // Make a GET request to the backend login route
    const response = await fetch(`http://localhost:5000/api/user?email=${email}&password=${password}`);

    const data = await response.json();

    if (response.ok) {
      // If the login is successful, navigate to the pharmacynav route
      navigate('/pharmacynav');
    } else {
      // If the login fails, display an error message
      setShowAlert(true);
      setAlertType('danger');
      setAlertMessage(data.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};



  return (
    <div>
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100  Rloginrow">
          <MDBCol col="12" className="Rloginccol">
            <MDBCard
              id="logincon-vik"

              className="bg my-5 mx-auto Rlogincard"

              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100  Rlogincardbody"
              

              >
                <h2>Retailer Login</h2>
                <br />
                <p>Please enter your login and password!</p>

                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  label="Email address"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="Rlogininput"
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  label="Password"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="Rlogininput"
                />

                <p>
                  <a href="#!">Forgot password?</a>
                </p>
                <MDBBtn
                  outline
                  className="Rloginbutton"
                  size="lg"
                  onClick={handleLogin}
                >
                  Login
                </MDBBtn>
                <br />

                {showAlert && (
                  <MDBTypography
                    tag="div"
                    className={`alert alert-${alertType} mx-5 w-100`}
                  >
                    {alertMessage}
                    <MDBBtn
                      className="Rloginbuttonclose"
                      onClick={() => setShowAlert(false)}
                      size="sm"
                    >
                      Close
                    </MDBBtn>
                  </MDBTypography>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default RetailLogin;
