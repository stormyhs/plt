import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"

class Help extends React.Component{
	render(){
	return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />

        <div style={{marginLeft:"20px"}}>
            <h1>About</h1>
            <h2>Project Leet</h2>
            <h2>A hacker themed browser game.</h2>
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Help;