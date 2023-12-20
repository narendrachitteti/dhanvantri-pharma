import './App.css';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import PharmacyNav from './components/Pharmacy/PharmacyNav';
import ItemDescription from './components/Pharmacy/ItemDescription';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PharmacyNav/>}/>
          <Route path='/ItemDescription' element={<ItemDescription/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
