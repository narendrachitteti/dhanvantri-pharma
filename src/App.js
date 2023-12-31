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
import Note from './components/Pharmacy/Creditnote.js';
import RetailLogin from './components/LoginForms/RetailLogin.js';
import RetailWholecard from './components/LoginForms/RetailWholeCard.js';
import WholesaleLogin from './components/LoginForms/WholesaleLogin.js';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import PurchaseSalepopup from './components/Pages/PurchaseSalepopup.js';
import Stockist from './components/Pharmacy/Stockist'

import Invoice from './components/Pharmacy/invoice.js';
import WholsaleRegis from './components/LoginForms/WholsaleRegis.js';
import MedicineDataComponent from './components/Pharmacy/MedicineDataComponent.jsx';
import PageNotFound from './PageNotFound.js';
import PrivateRoute from './components/Pharmacy/PrivateRoute.js';
import ItemDescription1 from './components/Pharmacy/ItemDescription1.jsx';
import ItemEditPage from './components/Pharmacy/ItemEditPage.jsx';
import AccountDetails from './components/Pharmacy/AccountDetails.js';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<RetailWholecard/>}/>
        <Route path="*" element={<PageNotFound/>} />
        <Route path='/WholesaleRegis' element={<WholsaleRegis/>}/>
        {/* <Route element={<PrivateRoute/>}> */}

          <Route path='/PharmacyNav' element={<PharmacyNav/>}/>
          <Route path='/ItemDescription' element={<ItemDescription1/>}/>
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
          <Route path="/RetailLogin" element={<RetailLogin/>}/>
          <Route path="/WholesaleLogin" element={<WholesaleLogin/>}/>
          <Route path="/PurchaseSalepopup" element={<PurchaseSalepopup/>}/>
          <Route path="/Creditnote" element={<Note/>}/>
          <Route path='/Stockist' element={<Stockist/>}/>
          <Route path='/invoice' element={<Invoice/>}/>   
          <Route path='/MedicineDataComponent' element={<MedicineDataComponent/>}/> 
          <Route path="/itemedit" element={<ItemEditPage/>} />
          <Route path="/Account" element={<AccountDetails/>} />
          {/* </Route> */}
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;
