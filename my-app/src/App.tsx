import React from 'react'
import System from './System'
import {Login} from './Login'
import Storage from './Storage'
import Editor from './Editor'
import Network from './Network'
import Internet from './Internet'
import Logs from './Logs'
import Profile from './Profile'
import Help from './Help'

import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends React.Component{
    constructor(props: any){
        super(props)
    }

    render(){
        return(
            localStorage.getItem("username")
            ?
            <BrowserRouter>
              <Routes>
              <Route index element={<System />} />
              <Route path="home" element={<System />} /> {/*This one is after login*/}
              <Route path="system" element={<System />} /> {/*This one is the sidebar link*/}
              <Route path="storage" element={<Storage />} />
              <Route path="editor" element={<Editor />} />
              <Route path="network" element={<Network />} />
              <Route path="internet" element={<Internet />} />
              <Route path="logs" element={<Logs />} />
              <Route path="profile" element={<Profile />} />
              <Route path="help" element={<Help />} />
              </Routes>
            </BrowserRouter>
            // <Home/>
            :
            <Login/>
        )
    }
}

export default App;