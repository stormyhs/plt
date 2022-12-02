import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"

class Block extends React.Component<{label: string, title: string,}, {}>{
    render(){
    return(
        <mui.Box
            style={{
                marginBottom: "10px",
                userSelect: 'none'
            }}
            sx={{
            bgcolor: 'background.paper3',
            border: 1,
            borderColor: 'white',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            }}
        >
        <mui.Box sx={{ color: 'text.secondary' }}><mui.Typography>{this.props.label}</mui.Typography></mui.Box>
        <mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}><mui.Typography>{this.props.title}</mui.Typography></mui.Box>
        </mui.Box>
    )
    }

}

class Internet extends React.Component<{},{ip:string, connected:boolean, website:string,userInput:string,invalidInput:boolean,readme:string}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			userInput:"",
			website:"",
			readme:"",
			connected:false,
			invalidInput:false,
		}
	}
	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		this.setState({ip:r.ip})
	  }
	
	async handleClick(e: any){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value
		let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})
		this.setState({readme:r.readme.content})

		if (r.type == "OK"){
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
				<br/>
				<Block label="IP's readme file" title={this.state.readme}/>
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