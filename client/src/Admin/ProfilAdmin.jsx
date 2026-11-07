import { NavLink } from "react-router-dom"

const ProfilAdmin=()=>{
    return (
        <>
         <nav className="sidebar-navigation">
            <NavLink to="/Admin/AdminDetails">Admin Details</NavLink>
            <NavLink to="/Admin/AllCustomers">ניהול לקוחות</NavLink>
            <NavLink to="/Admin/AllSuppliers">ניהול ספקים</NavLink>
            <NavLink to="/Admin/AllGifts">ניהול מוצרים</NavLink>
            <NavLink to="/Admin/AddAdmin">הוספת מנהל</NavLink>
         </nav>

    
        </>
    )
}
export default ProfilAdmin