import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./common/Layout"

import './App.css'
import LoginAdmin from './Admin/LoginAdmin'
import ProfilSupplier from "./Supplier/ProfilSupplier"
import AddGift from './Supplier/AddGift'
import GiftItem from './Supplier/GiftItem'
import GiftsList from './Supplier/GiftsList';
import SupplierDetails from './Supplier/SupplierDetails'
import ProfileCustomer from './Customer/ProfilCustomer'
import CusromerDetails from './Customer/CusromerDetails'
import Questionnaire from './Customer/Questionnaire'
import ProfilAdmin from './Admin/ProfilAdmin'
import AdminDetails from './Admin/AdminDetails'
import AllGifts from './Admin/AllGifts'
import Favorites from './Customer/Favorites';
import AllCustomers from './Admin/AllCustomers'
import AllSuppliers from './Admin/AllSuppliers'
import AddAdmin from './Admin/AddAdmin'
import Giftinspirations from './Customer/Giftinspirations';
import PresentingGifts from './Customer/PresentingGifts';
import { GiftProvider } from './context/GiftContext'
import GiftDetails from './Customer/GiftDetails'
import SupplierInquiries from './Supplier/SupplierInquiries'
import MaintenanceManager from './Admin/MaintenanceManager'
import AuthPage from './common/AuthPage';

import LandingPage from './LandingPage'
function App() {

  return (
    <>
      <GiftProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="/LandingPage" element={<LandingPage />} />
              <Route path="/admin-entry-details" element={<LoginAdmin />} />
              <Route path="/Admin/ProfilAdmin" element={<ProfilAdmin />} />
              <Route path="/Admin/AdminDetails" element={<AdminDetails />} />
              <Route path="/Admin/AllGifts" element={<AllGifts />} />
              <Route path="/Admin/AllCustomers" element={<AllCustomers />} />
              <Route path="/Admin/AllSuppliers" element={<AllSuppliers />} />
              <Route path="/Admin/AddAdmin" element={<AddAdmin />} />
              <Route path="/Admin/MaintenanceManager" element={<MaintenanceManager />} />


              <Route path="/login" element={<AuthPage />} />
              <Route path="/Supplier/ProfilSupplier" element={<ProfilSupplier />} />
              <Route path="/Supplier/SupplierDetails" element={<SupplierDetails />} />
              <Route path="/AddGift" element={<AddGift />} />
              <Route path="/Supplier/GiftItem" element={<GiftItem />} />
              <Route path="/Supplier/GiftsList" element={<GiftsList />} />
              <Route path="/Customer/ProfilCustomer" element={<ProfileCustomer />} />
              <Route path="/Customer/CusromerDetails" element={<CusromerDetails />} />
              <Route path="/Customer/Questionnaire" element={<Questionnaire />} />
              <Route path="/PresentingGifts" element={<PresentingGifts />} />
              <Route path="/Customer/Favorites" element={<Favorites />} />
              <Route path="/Giftinspirations" element={<Giftinspirations />} />
              <Route path="/Customer/GiftDetails/:id" element={<GiftDetails />} />
              <Route path="/Supplier/Inquiries" element={<SupplierInquiries />} />
            </Route>
          </Routes>
        </Router>
      </GiftProvider>
    </>
  )
}

export default App
