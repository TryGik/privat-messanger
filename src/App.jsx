import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import AuthProvider from './context/auth';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import { HOME_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from './utils/consts';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path={HOME_ROUTE} element={<Home />} />
            <Route exact path={PROFILE_ROUTE} element={<Profile />} />
          </Route>
          <Route exact path={REGISTER_ROUTE} element={<Registration />} />
          <Route exact path={LOGIN_ROUTE} element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
