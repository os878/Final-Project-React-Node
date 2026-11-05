import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./common/Layout"

import './App.css'
import HomePage from './HomePage'
import LoginAdmin from './Admin/LoginAdmin'
import ProfilSupplier from "./Supplier/ProfilSupplier"
import Login from './Supplier/Login'
import AddGift from './Supplier/AddGift'
import GiftItem from './Supplier/GiftItem'
import GiftsList from './Supplier/GiftsList'; 
import SupplierDetails from './Supplier/SupplierDetails'
import ProfileCustomer from './Customer/ProfilCustomer'
import CusromerDetails  from './Customer/CusromerDetails'
import LoginCustomer from './Customer/LoginCustomer'
import Questionnaire from './Customer/Questionnaire'
import ProfilAdmin from './Admin/ProfilAdmin'
import AdminDetails from './Admin/AdminDetails'
import AllGifts from './Admin/AllGifts'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/admin-entry-details" element={<LoginAdmin />} />
            <Route path="/Admin/ProfilAdmin" element={<ProfilAdmin />} />
            <Route path="/Admin/AdminDetails" element={<AdminDetails />} />
            <Route path="/Admin/AllGifts" element={<AllGifts />} />

            <Route path="/Supplier/ProfilSupplier" element={<ProfilSupplier />} />
            <Route path="/Supplier/Login" element={<Login />} />
            <Route path="/Supplier/SupplierDetails" element={<SupplierDetails />} />
            <Route path="/AddGift" element={<AddGift />} />
            <Route path="/GiftItem" element={<GiftItem />} />
            <Route path="/GiftsList" element={<GiftsList />} />
            <Route path="/Customer/ProfilCustomer" element={<ProfileCustomer />} />
            <Route path="/Customer/CusromerDetails" element={<CusromerDetails />} />
            <Route path="/Customer/LoginCustomer" element={<LoginCustomer />} />
            <Route path="/Customer/Questionnaire" element={<Questionnaire />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
