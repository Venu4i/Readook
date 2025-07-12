import React, { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth.js'

import Books from './pages/Books.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'
import BookDetails from './components/ViewDetails/bookDetails.jsx'
import Favourites from './components/Profile/favourites.jsx'
import Orders from './components/Profile/Orders.jsx'
import Settings from './components/Profile/settings.jsx'


const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if(
      localStorage.getItem('token') && 
      localStorage.getItem('id') && 
      localStorage.getItem('role')
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem('role')));
    }
  }, [])
  return (
    <>
      <Navbar />
        <Routes>
            <Route exact path = "/" element = { <Home /> }  />
            <Route path = "/books" element = { <Books /> }  />
            <Route path = "/login" element = { <Login /> }  />
            <Route path = "/signup" element = { <SignUp /> }  />
            <Route path = "/cart" element = { <Cart /> }  />
            <Route path = "/profile" element = { <Profile /> }>
                <Route index element= { <Favourites />} />
                <Route path = "/profile/orders" element= { <Orders />} />
                <Route path = "/profile/settings" element= { <Settings/>} />
            </Route>

            <Route path = "/get-book-details/:id" element = { <BookDetails />} />
        </Routes>
      <Footer />
    </>
  )
}

export default App
