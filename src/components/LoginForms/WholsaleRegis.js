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
function  WholsaleRegis() {

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
    
    
    // style={{backgroundImage: 'url(https://img.freepik.com/free-photo/medicine-capsules-global-health-with-geometric-pattern-digital-remix_53876-126742.jpg?size=626&ext=jpg)'}}
      style={{backgroundImage: 'url(https://img.freepik.com/free-photo/some-pills-spray-pill-bottle-needles-light-cyan-background-top-view-space-text_176474-1747.jpg?size=626&ext=jpg&ga=GA1.1.1108439072.1703323631&semt=ais)'}}


    >
     <div>

      
     <h2 className="text-center mb-5">Create an account</h2>


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
<p className="mb-0">Already have an account? <a href="/WholesaleLogin" class=" fw-bold">Sign In</a></p>
</div>
     </div>
      
    </MDBContainer>
  );
}

export default WholsaleRegis;