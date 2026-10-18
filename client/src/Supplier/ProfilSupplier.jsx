import { NavLink } from "react-router-dom"

const Supplier=()=>{
    return (
        <>
         <nav className="sidebar-navigation">
            <NavLink to="/SupplierDetails">Supplier Details</NavLink>
            {/* <NavLink to="/users">My Gifts</NavLink>//GiftsList */}
         </nav>

    
        </>
    )
}
export default Supplier