import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form3.css'; // Import the CSS file

const Form3 = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    salary: 0,
  });

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      // After deleting, fetch the updated list of employees
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  const handleEdit = (employee) => {
    // Set the selected employee and open the edit modal
    setSelectedEmployee(employee);
    setShowEditForm(true);
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post('http://localhost:5000/api/employees', newEmployee);
      // After adding, fetch the updated list of employees
      fetchEmployees();
      // Close the form
      setShowAddForm(false);
      // Reset the form fields
      setNewEmployee({
        name: '',
        position: '',
        department: '',
        salary: 0,
      });
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  const handleEditEmployee = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${selectedEmployee._id}`, selectedEmployee);
      // After editing, fetch the updated list of employees
      fetchEmployees();
      // Close the form
      setShowEditForm(false);
      // Reset the selected employee
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error editing employee:', error.message);
    }
  };

  return (
    <div className='Form3-vik'>
      <h2>Employee List</h2>
      <button onClick={() => setShowAddForm(true)}>Add Employee</button>

      {/* Modal for adding a new employee */}
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddForm(false)}>
              &times;
            </span>
            <h3>Add Employee</h3>
            <form>
              <label>Name:</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
              <label>Position:</label>
              <input
                type="text"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
              <label>Department:</label>
              <input
                type="text"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              />
              <label>Salary:</label>
              <input
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              />
              <button type="button" onClick={handleAddEmployee}>
                Add
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing an employee */}
      {showEditForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditForm(false)}>
              &times;
            </span>
            <h3>Edit Employee</h3>
            <form>
              <label>Name:</label>
              <input
                type="text"
                value={selectedEmployee.name}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
              />
              <label>Position:</label>
              <input
                type="text"
                value={selectedEmployee.position}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
              />
              <label>Department:</label>
              <input
                type="text"
                value={selectedEmployee.department}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })}
              />
              <label>Salary:</label>
              <input
                type="number"
                value={selectedEmployee.salary}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, salary: e.target.value })}
              />
              <button type="button" onClick={handleEditEmployee}>
                Save
              </button>
              <button type="button" onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td style={{display:'flex',gap:'1rem'}}>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
                <div> </div>
                <button onClick={() => handleEdit(employee)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form3;