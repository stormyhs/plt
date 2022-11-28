import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"

class Internet extends React.Component{
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

export default Internet;