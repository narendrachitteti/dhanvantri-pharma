const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/patient-bill', {
        patientName,
        mobilenumber,
        date,
        items,
        subtotalWithGST,
        subtotalWithoutGST,
      });
  
      // Check if response is defined and has a 'data' property
      if (response && response.data) {
        console.log('PatientBill submitted successfully:', response.data);
  
        // Reset the form or add other logic as needed
        setPatientName('');
        setmobilenumber('');
        setDate('');
        setItems([
          {
            _id: 1,
            product: '',
            quantity: '',
            amount: '',
            manufactureDate: '',
            batch: '',
            expiryDate: '',
            gst: '',
            totalWithGST: 0,
            totalWithoutGST: 0,
          },
        ]);
  
        // You can add additional logic here, such as redirecting the user.
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error submitting PatientBill:', error);
      console.error('Server response:', error.response ? error.response.data : 'No response data'); // Log server response details
    }
  };
  