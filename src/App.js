import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import HomePage from '../src/Pages/Home';
import LoginPage from '../src/Pages/login';
import SignupPage from '../src/Pages/signup';

import './App.css';

axios.defaults.withCredentials = true

function App() {
  const [user, setLoginUser] = useState({})

  if (user?.id) {
    window.localStorage.setItem("user", JSON.stringify(user));
  }
  const localuser = JSON.parse(window.localStorage.getItem('user'));

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={localuser?.id ? <HomePage /> : <LoginPage setLoginUser={setLoginUser} />} />
        <Route exact path='/login' element={<LoginPage setLoginUser={setLoginUser} />} />
        <Route exact path='/signup' element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
