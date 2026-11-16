import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom"
import Layout from "./common/Layout"

// כתובת ישנה של דף מתנה (/Customer/GiftDetails/:id) – מעבירה לכתובת החדשה
const OldGiftDetailsRedirect = () => {
  const { id } = useParams()
  return <Navigate to={`/gift/${id}`} replace />
}

import './App.css'
import LoginAdmin from './Admin/LoginAdmin'
import ProfilSupplier from './Supplier/ProfilSupplier'
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
import { FeedbackProvider } from './common/Feedback'
import GiftDetails from './Customer/GiftDetails'
import SupplierInquiries from './Supplier/SupplierInquiries'
import MaintenanceManager from './Admin/MaintenanceManager'
import AuthPage from './common/AuthPage';
import GiftsCatalog from './Customer/GiftsCatalog';
import { UserProvider } from './context/UserContext';
import LandingPage from './LandingPage'
import AdminInquiries from './Admin/AdminInquiries'

function App() {

  return (
    <>
      <GiftProvider>
        <UserProvider>
        <FeedbackProvider>
          <Router>
            <Routes>
              {/* דפים שיש להם עיצוב מלא משלהם – בלי ההדר של ה-Layout */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/LandingPage" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin-entry-details" element={<LoginAdmin />} />

              {/* כתובות ישנות – מעבירות לכתובות הציבוריות החדשות (כדי שקישורים ישנים ימשיכו לעבוד) */}
              <Route path="/Customer/Gifts" element={<Navigate to="/gifts" replace />} />
              <Route path="/Customer/Questionnaire" element={<Navigate to="/questionnaire" replace />} />
              <Route path="/Customer/GiftDetails/:id" element={<OldGiftDetailsRedirect />} />
              <Route path="/PresentingGifts" element={<Navigate to="/results" replace />} />

              {/* כל הדפים הפנימיים – עם ההדר */}
              <Route element={<Layout />}>
                {/* פתוח לכולם, גם לאורח – ההתחברות נדרשת רק ברגע של פעולה אישית */}
                <Route path="/gifts" element={<GiftsCatalog />} />
                <Route path="/gift/:id" element={<GiftDetails />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/results" element={<PresentingGifts />} />

                {/* מנהל */}
                <Route path="/Admin/ProfilAdmin" element={<ProfilAdmin />} />
                <Route path="/Admin/AdminDetails" element={<AdminDetails />} />
                <Route path="/Admin/AllGifts" element={<AllGifts />} />
                <Route path="/Admin/AllCustomers" element={<AllCustomers />} />
                <Route path="/Admin/AllSuppliers" element={<AllSuppliers />} />
                <Route path="/Admin/AddAdmin" element={<AddAdmin />} />
                <Route path="/Admin/MaintenanceManager" element={<MaintenanceManager />} />
                <Route path="/Admin/Inquiries" element={<AdminInquiries />} />

                {/* ספק */}
                <Route path="/Supplier/ProfilSupplier" element={<ProfilSupplier />} />
                <Route path="/Supplier/SupplierDetails" element={<SupplierDetails />} />
                <Route path="/AddGift" element={<AddGift />} />
                <Route path="/Supplier/GiftItem" element={<GiftItem />} />
                <Route path="/Supplier/GiftsList" element={<GiftsList />} />
                <Route path="/Supplier/Inquiries" element={<SupplierInquiries />} />

                {/* לקוח */}
                <Route path="/Customer/ProfilCustomer" element={<ProfileCustomer />} />
                <Route path="/Customer/CusromerDetails" element={<CusromerDetails />} />
                <Route path="/Customer/Favorites" element={<Favorites />} />
                <Route path="/Giftinspirations" element={<Giftinspirations />} />
              </Route>
            </Routes>
          </Router>
        </FeedbackProvider>
        </UserProvider>
      </GiftProvider>
    </>
  )
}

export default App