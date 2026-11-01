import { NavLink } from "react-router-dom"

const Supplier=()=>{
    return (
        <>
         <nav className="sidebar-navigation">
            <NavLink to="/Supplier/SupplierDetails">Supplier Details</NavLink>
            <NavLink to="/Supplier/GiftsList">My Gifts</NavLink>//GiftsList
         </nav>

    
        </>
    )
}
export default Supplier