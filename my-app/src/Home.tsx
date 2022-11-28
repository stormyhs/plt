import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'

class Home extends React.Component<{}, {files: []}>{


    render(){
        return(
            <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            <Topbar />
            <div style={{display: "flex"}}>
            <Sidebar />



            </div>
            </mui.Paper>
            </mui.ThemeProvider>
            </div>
        )
    }
}

export default Home;