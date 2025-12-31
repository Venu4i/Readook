import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom";
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
import Stats from './pages/Stats.jsx'
import Profile from './pages/Profile.jsx'
import BookDetails from './components/ViewDetails/bookDetails.jsx'
import Favourites from './components/Profile/favourites.jsx'
import Orders from './components/Profile/orders.jsx'
import Settings from './components/Profile/settings.jsx'
import AllOrders from './components/Profile/AllOrders.jsx';
import AddBooks from './components/Profile/AddBook.jsx';
import AddedBooks from './components/Profile/AddedBooks.jsx';
import EditBook from './components/Profile/EditBook.jsx';
import ManageSellers from './components/Profile/ManageSellers.jsx';


const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  
  useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const role = localStorage.getItem('role');

        if (token && id && role) {
          // Pass the token as a payload so Redux state.accessToken is set!
          dispatch(authActions.login({ accessToken: token })); 
          dispatch(authActions.changeRole(role));
        }
  }, [dispatch]);
  
  return (
    <>
      <Navbar />
        <Routes location={location} key={location.pathname}> 
            <Route exact path = "/" element = { <Home /> }  />
            <Route path = "/books" element = { <Books /> }  />
            <Route path = "/login" element = { <Login /> }  />
            <Route path = "/signup" element = { <SignUp /> }  />
            <Route path = "/cart" element = { <Cart /> }  />
            <Route path = "/admin-stats" element = { <Stats /> }  />
            <Route path='editBook/:id' element={<EditBook />} />
            <Route path = "/profile" element = { <Profile /> }>
                {role === "user" ? <Route index element= { <Favourites />} /> : <Route index element= { <AllOrders/>} />}
                {role === "user" ? <Route path = "/profile/orders" element= { <Orders />} /> : <Route path = "/profile/addBooks" element= { <AddBooks />} />}
                {role === "user" ? <Route path = "/profile/settings" element= { <Settings/>} /> : <Route path = "/profile/addedBooks" element= { <AddedBooks />} />}
                {role === "admin" && <Route path="manage-sellers" element={<ManageSellers />} />}

            </Route>

            <Route path = "/get-book-details/:id" element = { <BookDetails   key={location.pathname} /> } />
        </Routes>
      <Footer />
    </>
  )
}

export default App
