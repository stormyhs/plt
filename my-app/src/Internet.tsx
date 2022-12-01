import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"

class Internet extends React.Component<{},{ip:string, connected:boolean, website:string,userInput:string,invalidInput:boolean,}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			userInput:"",
			website:"",
			connected:false,
			invalidInput:false,
		}
	}
	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		console.log(r)
		this.setState({ip:r.ip})
	  }
	async handleClick(e: any){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value
		console.log(userInput)

		if (this.state.ip == userInput){
			this.setState({connected: true})
			this.setState({invalidInput: false})
		} else {
			this.setState({invalidInput: true})
			this.setState({connected: false})
		}
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
			<h4 style={{marginBottom:"0px", marginLeft:"10px"}}>URL / IP</h4>
        	<mui.TextField id="connect" label="" defaultValue=""/>
		<br/>
		<br/>
		<mui.Button variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
  			Connect
		</mui.Button>
		<br/>
		<br/>
		{this.state.invalidInput?
			<div>
				<mui.Typography variant="h5" gutterBottom>
					Invalid URL / IP address
            	</mui.Typography>				
			</div>
			:
			""
		}
		{this.state.connected?
			<div>
				<mui.Typography variant="h4" gutterBottom>
					IP: {this.state.ip}
            	</mui.Typography>
				<mui.Typography variant="h6" gutterBottom>
					IPv6: fe80::5dcd::fb22::d9888%12
					<br/>
					DMZ: 10.112.42.15
					<br/>
					DNS: 8.8.8.8
					<br/>
					ALT DNS: 1.1.1.8.1
					<br/>
					WAN: 100.23.10.15
					<br/>
					Social Security No.: 6979191519182016
					<br/>
					Location: N:43.7462 W:12.4893
            	</mui.Typography>
				<br/>
				<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px",}}>
					<mui.Stack direction="column" spacing={2}>
						<mui.Button variant="outlined" size="small" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  							Connect to machine
						</mui.Button>
						<mui.Button variant="outlined" size="small" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  							Crack password
						</mui.Button>
						<mui.Button variant="outlined" size="small" color="error" style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
  							Plant incriminating evidence
						</mui.Button>
					</mui.Stack>
				</div>
			</div>
			:
			""
		}
		</div>
		{/* On the right add a list of popular websites (when clicked they get inputed into the search field)*/}
		<div style={{display: 'inlineFlex', marginLeft: 'auto', marginRight: "15vw", userSelect: 'none'}}>
			<h1>Common adresses</h1>
			<h2>127.0.0.1</h2>
			<h2>192.168.0.1</h2>
			<h2>localhost</h2>
			<h2>some npc shit</h2>
			<h2>thughunter.com</h2>
	  	</div>

		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Internet;

// TO DO:

// the user will be able to give an ip of himself or an user, any ip will be albe to respond ,either the ip does not exist
// or it will open up a view with those red buttons or the contents of a readme.txt file if it exists