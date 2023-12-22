import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import './WhlosaleRegis.css'
function  WholesaleRegis() {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add client-side validations
    if (!formData.username || !formData.email || !formData.password) {
      alert('Please provide all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
    
        setFormData({ username: '', email: '', password: '' });
        navigate('/WholesaleRegis');
        alert(data.message);
        window.location.href='/WholesaleLogin'

      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
 
};



  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'
    
    
    // style={{backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)'}}


    >
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{maxWidth: '600px'}}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>


          <form  onSubmit={handleSubmit} className='wholsaleregis'>
          <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Register</button>

          </form>

            <br/>
          <div>
          <p className="mb-0">Already have an account? <a href="/WholesaleLogin" class=" fw-bold">Sign Up</a></p>
        </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default WholesaleRegis;