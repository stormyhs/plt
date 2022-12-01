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

        <div style={{marginLeft:"20px", marginTop:"20px"}}>
            <mui.Box sx={{ width: '100%', maxWidth: 500 }}>
                <mui.Typography variant="h4" gutterBottom>
                    About
                </mui.Typography>
                <mui.Typography variant="h5" gutterBottom>
                    A hacker themed browser game.
                </mui.Typography>
            </mui.Box>
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Help;