import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"

class Internet extends React.Component<{},{ip:string}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
		}
	}
	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		console.log(r)
		this.setState({ip:r.ip})
	  }

	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0}>
		
		<Topbar />
		<div style={{display: "flex"}}>
		<Sidebar />

		<div style={{marginLeft:"20px"}}>
			<h1>IP: {this.state.ip}</h1>
		</div>

		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Internet;