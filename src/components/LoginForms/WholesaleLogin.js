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

}

from 'mdb-react-ui-kit';
import './Loginvi.css';
import { BASE_URL } from "../../Services/Helper";

function WholesaleLogin() {
  
  const [userid, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

// Update the handleLogin function
// Update the handleLogin function
const handleLogin = async () => {
  try {
    // Validate userid and password
    if (!userid || !password) {
      setShowAlert(true);
      setAlertType('danger');
      setAlertMessage('Please provide both userid and password.');
      return;
    }

    // Make a GET request to the backend login route
    const response = await fetch(`${BASE_URL}/api/user?userid=${userid}&password=${password}`);

    const data = await response.json();

    // Inside the if (response.ok) block in handleLogin function
      if (response.ok) {
        // Save user details in local storage
        localStorage.setItem("staffid", data.staffid);
        // Navigate to the pharmacynav route
        navigate('/pharmabilling');
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


<MDBContainer fluid  
className='d-flex align-items-center justify-content-center bg-image-vik'
style={{backgroundImage: 'url(https://img.freepik.com/free-photo/some-pills-spray-pill-bottle-needles-light-cyan-background-top-view-space-text_176474-1747.jpg?size=626&ext=jpg&ga=GA1.1.1108439072.1703323631&semt=ais)'}}

// style={{backgroundImage: 'url(https://img.freepik.com/free-photo/medicines-medical-supplies-placed-blue_1150-19136.jpg?size=626&ext=jpg&ga=GA1.1.1108439072.1703323631&semt=ais)'}}




 >

<MDBRow  className='d-flex justify-content-center align-items-center h-100'>
  <MDBCol col='12'>

    <MDBCard id='whlogincon-vik' 
    
    
    className='bg  my-5 mx-auto' 
    
    
    style={{borderRadius: '1rem', maxWidth: '400px'}}>
    <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2>Wholesaler Login</h2>
                <br />
                <p>Please enter your Id and password!</p>

                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  label="User Id"
                  type="text"
                  size="lg"
                  value={userid}
                  onChange={(e) => setUserID(e.target.value)}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  label="Password"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* <p>
                  <a href="#!">Forgot password?</a>
                </p> */}
                <MDBBtn
                  outline
                  className="mx-2 px-5"
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
                      className="float-end"
                      onClick={() => setShowAlert(false)}
                      size="sm"
                    >
                      Close
                    </MDBBtn>
                  </MDBTypography>
                )}

                
          <p className="mb-0">Don't have an account? <a href="/WholesaleRegis" class=" fw-bold">Sign Up</a></p>
              </MDBCardBody>
    </MDBCard>

  </MDBCol>
</MDBRow>

</MDBContainer>


    </div>
  )
}

export default WholesaleLogin