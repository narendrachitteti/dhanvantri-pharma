import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTypography,
} from 'mdb-react-ui-kit';
import './Loginvi.css';

const RetailLogin = () => {
  const [emailOrUserId, setEmailOrUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(''); // 'success', 'danger', 'warning'
  const [alertMessage, setAlertMessage] = useState('');

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password validation: at least 6 characters, one special character, and one digit
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    // Validate email and password before making the request
    if (!validateEmail(emailOrUserId)) {
      setAlertMessage('Invalid email format');
      setAlertType('danger');
      setShowAlert(true);
      return;
    }

    if (!validatePassword(password)) {
      setAlertMessage('Invalid password format');
      setAlertType('danger');
      setShowAlert(true);
      return;
    }

    try {
      // Make a GET request to the server endpoint for validation
      const response = await fetch(`http://localhost:5000/api/getAllLogins/validateLogin?emailOrUserId=${emailOrUserId}&password=${password}`);
      const data = await response.json();

      if (data.success) {
        // Validation successful, redirect or perform other actions
        setAlertMessage('Login successful');
        setAlertType('success');
        setShowAlert(true);
        // Additional actions or redirection can be added here
      } else {
        // Handle validation failure, show error message in the alert
        setAlertMessage('Invalid credentials');
        setAlertType('danger');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error validating login:', error);
      // Show a generic error message in the alert
      setAlertMessage('An error occurred while validating login');
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard id='logincon-vik' className='bg  my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <h2>Retailer Login</h2><br />
                <p>Please enter your login and password!</p>

                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  label='Email address or User Id'
                  type='email'
                  size="lg"
                  value={emailOrUserId}
                  onChange={(e) => setEmailOrUserId(e.target.value)}
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  label='Password'
                  type='password'
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <p><a href="#!">Forgot password?</a></p>
                <MDBBtn outline className='mx-2 px-5' size='lg' onClick={handleLogin}>
                  Login
                </MDBBtn>
                <br />

                {showAlert && (
                  <MDBTypography tag='div' className={`alert alert-${alertType} mx-5 w-100`}>
                    {alertMessage}
                    <MDBBtn className='float-end' onClick={() => setShowAlert(false)} size='sm'>
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
