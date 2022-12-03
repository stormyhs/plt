import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"
import { display } from '@mui/system'

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
        <mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
			<mui.Typography>{this.props.title}</mui.Typography></mui.Box>
        </mui.Box>
    )
    }

}

class Internet extends React.Component<{},
{ip:string, connected:boolean, website:string,userInput:string,invalidInput:boolean,
readme:string,downloader:boolean,opponentIP:string,clearButton:boolean}>{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			opponentIP:"",
			userInput:"",
			website:"",
			readme:"",
			downloader:false,
			connected:false,
			invalidInput:false,
			clearButton:false
		}
	}
	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		this.setState({ip:r.ip})
	  }
	
	async handleClick(e: any){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value
		let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})

		this.setState({opponentIP:r.ip})
		console.log(r.ip)
		// for some reason does not return the other accounts IP and in the browser console returns "undefined" when logged
		// i changed something, and now it does not work at all for some reason, but im too tired to figure it out, good luck

		if (r.type == "OK"){
			this.setState({connected: true})
			this.setState({invalidInput: false})
			this.setState({downloader: false})
		} else if(userInput == "hackeracademy.com") {
			this.setState({connected: false})
			this.setState({invalidInput: false})
			this.setState({downloader: true})
		} else {
			this.setState({connected: false})
			this.setState({invalidInput: true})
			this.setState({downloader: false})
		}
	}
	async loadReadme(){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value
		let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})		
		if (this.state.downloader !== true){
			this.setState({readme:r.readme.content})
		}
	}
	async handleClear(){
		if (this.state.clearButton == false){
			this.setState({clearButton: true})
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
			<h4 style={{marginBottom:"0px", marginLeft:"10px"}}>URL / IP</h4>
			<mui.Stack direction="row" spacing={1}>
				<mui.TextField id="connect" label="" defaultValue=""/>
				<mui.Button variant="outlined" color="primary" onClick={this.handleClick.bind(this)}>
					Clear
				</mui.Button>
			</mui.Stack>
			<br/>
			<br/>
			<mui.Stack direction="row" spacing={2}>
				<mui.Button variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
					Connect
				</mui.Button>
				<mui.Button variant="outlined" color="success" onClick={this.loadReadme.bind(this)}>
					Load Readme
					{/* I have gotten through despair trying to figure out how to break the text
					in this readme file into new lines, hopefully it will be a brease for you to solve what i couldn't */}
				</mui.Button>
			</mui.Stack>
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
					USER IP: {this.state.opponentIP}
				</mui.Typography>
				<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px", display: 'inline-block'}}>
					<mui.Stack direction="column" spacing={2}>
						<mui.Button variant="outlined" size="small" color="error" 
						style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
							Connect to machine
						</mui.Button>
						<mui.Button variant="outlined" size="small" color="error" 
						style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
							Crack password
						</mui.Button>
						<mui.Button variant="outlined" size="small" color="error" 
						style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
							Plant incriminating evidence
						</mui.Button>
					</mui.Stack>
				</div>
				<br/>
				<div>
					<mui.Box>
						<Block label="IP's readme file" title={this.state.readme}/>
					</mui.Box>
				</div>
			</div>
			:
			""
			}
			{this.state.downloader?
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
					<mui.Button variant="outlined" size="large" color="error" 
					style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
						Hasher.exe
					</mui.Button>
					<mui.Button variant="outlined" size="large" color="error" 
					style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
						Cracker.exe
					</mui.Button>
					<mui.Button variant="outlined" size="large" color="error" 
					style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}>
						(Example Button)
					</mui.Button>
				</mui.Stack>
				</mui.Box>
			</div>
			:
			""
			}
		</div>
		<div style={{display: 'inlineFlex', marginLeft: 'auto', marginRight: "15vw"}}>
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