import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"
import { Link } from "react-router-dom";

import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

class Internet extends React.Component<{},{ip:string, connected:boolean, website:string,}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			connected:false,
			website:"",
		}
	}
	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		console.log(r)
		this.setState({ip:r.ip})
	  }
	async handleClick(e: any){
		this.setState({connected: true})
	  }

	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0}>
		
		<Topbar />
		<div style={{display: "flex"}}>
		<Sidebar />

		<div style={{marginLeft:"20px", marginTop:"20px"}}>
			<mui.Typography variant="h3" gutterBottom>
				IP: {this.state.ip}
            </mui.Typography>
		{/* Add a input field with a connect button */}
		<br/>
        	<mui.TextField id="outlined-search" label="Search field" type="search" />
		<br/>
		<br/>
		<mui.Button variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
  			Connect
		</mui.Button>
		<br/>
		{this.state.connected?
			<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px",}}>
				<mui.Stack direction="column" spacing={2}>
					<mui.Button variant="outlined" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  						Connect to machine
					</mui.Button>
					<mui.Button variant="outlined" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  						Crack password
					</mui.Button>
					<mui.Button variant="outlined" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  						Plant incriminating evidence
					</mui.Button>
				</mui.Stack>
			</div>
			:
			""
		}
		</div>
		{/* On the right add a list of popular websites (when clicked they get inputed into the search field)*/}
		<mui.List style={{marginLeft: "0"}}>
    			<mui.MenuItem>
         			<mui.ListItemIcon>
          			<DesktopWindowsOutlinedIcon/>
          			</mui.ListItemIcon>
          		<mui.ListItemText></mui.ListItemText>
      		</mui.MenuItem>
	  	</mui.List>
		

		{/* If you put in a URL of a website it will open that site in a new tab */}



		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Internet;