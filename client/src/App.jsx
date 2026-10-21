import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./common/Layout"

import './App.css'
import HomePage from './HomePage'
import ProfilSupplier from "./Supplier/ProfilSupplier"
import Login from './Supplier/Login'


function App() {

  return (
    <>
       <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/Supplier/Profil" element={<ProfilSupplier />} />
            <Route path="/Supplier/Login" element={<Login />} />
            {/* <Route path="/article" element={<ArticlesList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/user" element={<UsersList />} />
            <Route path="/albums" element={<AlbumsList />} />
            <Route path="/tasks/add" element={<AddTask />} />
            <Route path="/article/add" element={<AddArticle />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/albums/add" element={<AddAlbum />} /> */}

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
