import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Books from './pages/Books.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <>
    <Router>
      <Navbar />
        <Routes>
            <Route exact path = "/" element = { <Home /> }  />
            <Route path = "/books" element = { <Books /> }  />
            <Route path = "/login" element = { <Login /> }  />
            <Route path = "/signup" element = { <SignUp /> }  />
            <Route path = "/cart" element = { <Cart /> }  />
            <Route path = "/profile" element = { <Profile /> }  />
        </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
