import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import PharmacyNav from './components/Pharmacy/PharmacyNav';
import ItemDescription from './components/Pharmacy/ItemDescription';
import InvoiceStock from './components/Pharmacy/InvoiceStock';
import PharmaLab from './components/Pharmacy/PharmaLab';
import PatientBill from './components/Pharmacy/PharmacyBilling';
import MedicineList from './components/Pharmacy/MedicineList';
import BillingDashboard from "./components/Pharmacy/BillingDashboard";
import Stockadjustment from "./components/Pharmacy/Stockadjustment";
import Stockists from "./components/Pharmacy/Stockists";
import Billingreports from "./components/Pharmacy/Billingreports";
import CreateOrder from "./components/Pharmacy/CreateOrder";
import Inventory from "./components/Pharmacy/Inventory";
import OrderList from "./components/Pharmacy/OrderList";
import Pharmacystock from "./components/Pharmacy/Pharmacystock";
import Dbdetails from "./components/Pharmacy/Dbdetails";
import Pharmapurchase from "./components/Pharmacy/Pharmapurchase.jsx";
import SalesReceipt from "./components/Pharmacy/SalesReceipt.jsx";
import StockistInvoice from './components/Pharmacy/StockistInvoice.jsx';
import Form3 from './components/Form3'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PharmacyNav/>}/>
          <Route path='/ItemDescription' element={<ItemDescription/>}/>
          <Route path='/invoicestock' element={<InvoiceStock/>}/>
          <Route path='/Drugmaster' element={<PharmaLab/>}/>
          <Route path='/pharmabilling' element={<PatientBill/>}/>
          <Route path="/InvoiceStock" element={<InvoiceStock />} />
          <Route path="/MedicineList" element={<MedicineList/>}/>
          <Route path="/BillingDashboard" element={<BillingDashboard />} />
          <Route path="/Stockadjustment" element={<Stockadjustment />} />
          <Route path="/Stockists" element={<Stockists />} />
          <Route path="/Billingreports" element={<Billingreports />} />
          <Route path="/Pharmacystock" element={<Pharmacystock />} />
          <Route path="/CreateOrder" element={<CreateOrder />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route path="/StockistInvoice" element={<StockistInvoice/>}/>
          <Route path="/OrderList" element={<OrderList />} />
          <Route path="/PatientBill" element={<PatientBill />} />
          <Route path="/Dbdetails" element={<Dbdetails />} />
          <Route path="/PharmacyPurchase" element={<Pharmapurchase/>}/>
          <Route path="/SalesReceipt" element={<SalesReceipt/>}/>
          <Route path="/PharmaLab" element={<PharmaLab/>}/>
          <Route path="/Form3" element={<Form3/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
