import { NavLink } from "react-router-dom"

const ProfileCustomer=()=>{
    return (
        <>
         <nav className="sidebar-navigation">
            <NavLink to="/Customer/CusromerDetails">Cusromer Details</NavLink>
            {/* <NavLink to="/Customer/GiftsList">My Gifts</NavLink> */}
         </nav>

    
        </>
    )
}
export default ProfileCustomer