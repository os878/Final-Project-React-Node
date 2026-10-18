import {Outlet} from "react-router-dom"
import Navigate from "./Navigate"
// import "./Layout.css"
const Layout=()=>{


    return <>
        <div className="layout-container">
            <div className="layout-body">
                <aside className="sidebar">
                    <Navigate />
                </aside>
                
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
            
            {/* <footer className="layout-footer">footer</footer> */}
        </div>
    </>
}

export default Layout