import React from 'react'
import { Link } from "react-router-dom";
import * as mui from "@mui/material/"

import Sidebar from './ui-components/Sidebar'
import MachinesBar from './ui-components/MachinesBar'
import Funcs from './Funcs'
import Popup from './feedback/Popup'

// TODO / Plans

// There should be pre-defined websites a player can go to
// One of them should be there to get you on your feet,
// others can be banks, hardware stores, etc etc.
// The data for these sites should probably not be stored
// here on the front-end.

// IP scans should provide more data, though this needs to
// be planned out further.

// IP resets should be available to the player, at a price / cooldown.

class Readme extends React.Component<{label: string, title: string,}, {}>{
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
			<mui.Box sx={{ color: 'text.secondary' }}>
				<mui.Typography>{this.props.label}</mui.Typography>
			</mui.Box>
			<mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
				<div style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
				<mui.Typography>{this.props.title}</mui.Typography>
				</div>
			</mui.Box>
		</mui.Box>
    )}
}

class Internet extends React.Component<{}, {ip: string, userInput: string, readme: string, currentPage: string, sendPopUp: boolean, popUpTitle: string, popUpSubtitle: string | null}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			userInput:"",
			readme:"",
			currentPage: "default",
			sendPopUp: false,
			popUpTitle: "",
			popUpSubtitle: ""
		}
	}

	async componentDidMount(){
		let r = await Funcs.request('/v2/ip', {type: "get_own_ip_data"})
		this.setState({ip:r.ip})
	}

	async download(e: any){
		if(e.target.id == "cracker"){
			let r1 = await Funcs.request('/v2/defaults', {type: "get_cracker"})
		}
		if(e.target.id == "hasher"){
			let r2 = await Funcs.request('/v2/defaults', {type: "get_hasher"})
		}
		console.log(e.target.id)
	}
	
	async onKeyDown(e: any){
		if(e.key == "Enter"){
			await this.handleClick()
		}
	}

	async handleClick(){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value

		if(userInput == "hackeracademy.com"){
			this.setState({currentPage: "downloader"})
			return
		}

		let r = await Funcs.request('/v2/ip', {type: "get_ip_data", scan_ip:userInput})
		if(r.type == "OK"){
			this.setState({currentPage: "scanned"})

			let userInput = (document.getElementById("connect") as HTMLInputElement).value
			let r = await Funcs.request('/v2/ip', {type: "get_ip_data", scan_ip:userInput})
			if(r.readme != null){
				this.setState({readme:r.readme.content})
			}

			r = await Funcs.request('/v2/network', {type: "get_ip_logins"});

			if(r.ip_logins[userInput] != undefined){
				(document.getElementById("password") as HTMLInputElement).value = r.ip_logins[userInput].ip_password
			}

		} else {
			this.setState({currentPage: "invalidInput"})
		}
	}

	async crackPassword(){
		let ip = (document.getElementById("connect") as HTMLInputElement).value
		let r = await Funcs.request('/v2/ip', {type: "crack_password", target: ip})
		await this.sendPopUp(r.type, r.message)
	}

	async login(){
		let password = (document.getElementById("password") as HTMLInputElement).value
		console.log(password)
	}

	async sendPopUp(title: string, subtitle?: string){
		this.setState({sendPopUp: true, popUpTitle: title, popUpSubtitle: subtitle ? subtitle : null})
	}

	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0}>
		
        <div style={{display: "flex"}}>
        <MachinesBar />
        <Sidebar />

		{this.state.sendPopUp?
		<Popup
		title={this.state.popUpTitle}
		subtitle={this.state.popUpSubtitle}
		handleClose={() => this.setState({sendPopUp: false})}
		/>
		:""}

		<div style={{marginLeft:"20px", marginTop:"20px"}}>
			<mui.Stack style={{marginTop: "10px"}} direction="row" spacing={1}>
				<mui.Typography variant="h5" gutterBottom>
					Your IP: {localStorage.getItem("foreignip") ? localStorage.getItem("foreignip") : this.state.ip}
				</mui.Typography>

				{localStorage.getItem("foreignip") ?
				<Link to="/system">
					<mui.Button onClick={() => localStorage.removeItem("foreignip")} variant="outlined" color="error">
					DISCONNECT
					</mui.Button>
				</Link>
				:
				<mui.Button variant="outlined" color="success">
					Reset IP
				</mui.Button>
				}
			</mui.Stack>

			<mui.Stack style={{marginTop: "25px"}} direction="row" spacing={1}>
				<mui.TextField id="connect" label="Scan IP" defaultValue="" size='small'/>
				<mui.Button id="connect" variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
					Scan
				</mui.Button>
			</mui.Stack>


			{localStorage.getItem("foreignip")?
			<div>
				<h3>Logged into {localStorage.getItem("foreignip")}</h3>
			</div>
			:
			""}

			{this.state.currentPage == "scanned"?
			<div>
				<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px", display: 'inline-block'}}>
					<mui.Stack style={{paddingLeft: "10px", paddingRight: "10px"}} direction="column" spacing={2}>
						<h3 style={{textAlign: "center", marginBottom: "0px"}}>{(document.getElementById("connect") as HTMLInputElement).value} is online.</h3>
						<div>
						<mui.TextField id="password" type="password" label="Password" defaultValue="" size='small'/>
						<mui.Button onClick={this.login.bind(this)} variant="outlined" color="success">
							Log in
						</mui.Button>
						</div>
						<mui.Button variant="outlined" size="small" color="error" 
						style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}
						onClick={this.crackPassword.bind(this)}>
							Crack Password
						</mui.Button>
					</mui.Stack>
				</div>

				{this.state.readme != "" ?
				<div style={{marginTop: "20px"}}>
					<mui.Box>
						<Readme label="README.txt" title={this.state.readme}/>
					</mui.Box>
				</div>
				:""
				}

			</div>
			:
			""
			}

			{this.state.currentPage == "invalidInput"?
			<div style={{marginTop: "10px"}}>
				<mui.Typography variant="h5" gutterBottom>
					Connection failed.
				</mui.Typography>				
			</div>
			:
			""
			}

			{this.state.currentPage == "downloader"?
			<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px",}}>
				<mui.Box sx={{ width: '100%', maxWidth: 800}}>
				<br/>
				<mui.Typography variant="h4" gutterBottom sx={{marginLeft:"10px", marginRight:"10px"}}>
					WELCOME TO HACKERACADEMY.COM
				</mui.Typography>
				<mui.Typography variant="h6" gutterBottom sx={{marginLeft:"10px"}}>
					Here are some tools for new hackers:
				</mui.Typography>
				<mui.Stack direction="row" spacing={1}>
					<mui.Button id='hasher' variant="outlined" size="large" color="error" 
					style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}
					onClick={this.download.bind(this)}>
						Hasher.exe
					</mui.Button>
					<mui.Button id='cracker' variant="outlined" size="large" color="error" 
					style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}
					onClick={this.download.bind(this)}>
						Cracker.exe
					</mui.Button>
				</mui.Stack>
				</mui.Box>
			</div>
			:
			""
			}
		</div>

		<div style={{display: 'inlineFlex', marginLeft: 'auto', marginRight: "2vw"}}>
			<h1>Common adresses</h1>
			<h2>127.0.0.1</h2>
			<h2>192.168.0.1</h2>
			<h2>localhost</h2>
			<h2>hackeracademy.com</h2>
		</div>

		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Internet;