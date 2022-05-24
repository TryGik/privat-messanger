import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Registration from './pages/Registration';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/registration' element={<Registration />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
