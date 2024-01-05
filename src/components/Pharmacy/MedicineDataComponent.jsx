import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './medicinedatacomponent.css'
import PharmacyNav from './PharmacyNav';

const MedicineDataComponent = () => {
  const [medicineData, setMedicineData] = useState([]);
  const [items, setItems] = useState([]);
  const [aggregatedItems, setAggregatedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');


  useEffect(() => {
    const fetchItemsByDate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items-by-date?date=${selectedDate}`);
        setItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items by date:', error);
        // Handle error state or display an error message
      }
    };

    fetchItemsByDate();
  }, [selectedDate]);


  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItemsForToday = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items-for-today');
        setFilteredItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items for today:', error);
        // Handle error state or display an error message
      }
    };

    fetchItemsForToday();
  }, []);


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items'); // Replace '/api/items' with your actual backend endpoint
        setItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items:', error);
        // Handle error state or display an error message
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchMedicineData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getMedicine');
        const data = response.data.medicines;

        // Aggregate medicines to sum up strips and free strips for each unique medicine
        const aggregatedData = {};
        data.forEach((medicine) => {
          const medicineName = medicine.Medicine;
          if (aggregatedData[medicineName]) {
            aggregatedData[medicineName].strips += parseInt(medicine.strips) || 0;
            aggregatedData[medicineName].freeStrips += parseInt(medicine.Freestrips) || 0;
          } else {
            aggregatedData[medicineName] = {
              Medicine: medicineName,
              strips: parseInt(medicine.strips) || 0,
              freeStrips: parseInt(medicine.Freestrips) || 0,
            };
          }
        });

        const aggregatedArray = Object.values(aggregatedData);

        setMedicineData(aggregatedArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMedicineData();
  }, []);

  const calculateTotalStrips = (strips, freeStrips) => {
    const stripsValue = parseInt(strips) || 0;
    const freeStripsValue = parseInt(freeStrips) || 0;
    return stripsValue + freeStripsValue;
  };



  useEffect(() => {
    const aggregateQuantities = () => {
      const aggregated = {};
      items.forEach((itemGroup) => {
        itemGroup.items.forEach((item) => {
          if (aggregated[item.product]) {
            aggregated[item.product].quantity += parseInt(item.quantity) || 0; // Parse as integer and add
          } else {
            aggregated[item.product] = {
              quantity: parseInt(item.quantity) || 0, // Parse as integer
              medicineStrips: 0,
            };
          }
        });
      });
      setAggregatedItems(aggregated);
    };

    aggregateQuantities();
  }, [items]);


  const calculateRemainingStrips = (totalStrips, quantity) => {
    const total = parseInt(totalStrips) || 0;
    const used = parseInt(quantity) || 0;
    const remaining = total - used;
    return remaining >= 0 ? remaining : 'N/A';
  };



  const fetchItemsByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/items-by-date?date=${selectedDate}`);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items by date:', error);
      // Handle error state or display an error message
    }
  };

  // Function to fetch items for today
  const fetchItemsForToday = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items-for-today');
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items for today:', error);
      // Handle error state or display an error message
    }
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Fetch items when date changes
  useEffect(() => {
    if (selectedDate !== '') {
      fetchItemsByDate();
    }
  }, [selectedDate]);


  useEffect(() => {
    fetchItemsForToday();
  }, []);

  return (
    <>
      <PharmacyNav />

      <div className='mdc-total' >

        <div className='mdc-date' >
          <label className='date-text'>Date:
            <input type="date" className="date-input" value={selectedDate} onChange={handleDateChange} />
          </label>
        </div>
        <table className='mdc-table'>
          <thead className='mdc-thead' >
            <tr className='mdc-trow'>
              <th className='mdc-thhss'>Medicine / Product</th>
              <th className='mdc-thhss'>Total Strips</th>
              <th className='mdc-thh'>Billed</th>
              <th className='mdc-thhss'>Remaining Strips</th>
            </tr>
          </thead>
          <tbody className='mdc-tbody'>
            {medicineData.map((medicine, index) => (
              <tr className='mdc-trow' key={index}>
                <td className='mdc-tddh'>
                  {medicine.Medicine}
                </td>
                <td className='mdc-tddhs'>
                  {calculateTotalStrips(medicine.strips, medicine.freeStrips)}

                </td>
                <td className='mdc-tdd'>
                  {
                    aggregatedItems[medicine.Medicine]
                      ? aggregatedItems[medicine.Medicine].quantity
                      : 'N/A'
                  }

                </td>
                <td className="mdc-tddhs">
                  {calculateRemainingStrips(
                    calculateTotalStrips(medicine.strips, medicine.freeStrips),
                    aggregatedItems[medicine.Medicine] ? aggregatedItems[medicine.Medicine].quantity : 0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </>
  );
};

export default MedicineDataComponent;