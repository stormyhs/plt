import React from 'react'
import * as mui from "@mui/material/"

import Sidebar from './ui-components/Sidebar'
import MachinesBar from './ui-components/MachinesBar'
import Block from './data-display/Block'

class Help extends React.Component{
	render(){
	return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <div style={{display: "flex"}}>
        <MachinesBar />
        <Sidebar />

        <div style={{marginLeft:"20px", marginTop:"20px"}}>
            <Block
            primary="About"
            secondary="A hacker themed browser game."
            />
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Help;