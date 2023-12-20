import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import PharmacyNav from './components/Pharmacy/PharmacyNav';
import ItemDescription from './components/Pharmacy/ItemDescription';
import InvoiceStock from './components/Pharmacy/InvoiceStock';
import PharmaLab from './components/Pharmacy/PharmaLab';
import PatientBill from './components/Pharmacy/Pharmabilling';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PharmacyNav/>}/>
          <Route path='/ItemDescription' element={<ItemDescription/>}/>
          <Route path='/invoicestock' element={<InvoiceStock/>}/>
          <Route path='/Drugmaster' element={<PharmaLab/>}/>
          <Route path='/Pharmabilling' element={<PatientBill/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
