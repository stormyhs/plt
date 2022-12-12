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

class Internet extends React.Component<{},
{ip:string, scanned:boolean,userInput:string,invalidInput:boolean,
readme:string,downloader:boolean,login:boolean}>
{
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
			userInput:"",
			readme:"",
			downloader:false,
			scanned:false,
			invalidInput:false,
			login:false
		}
	}

	async componentDidMount(){
		let r = await Funcs.request('/api/user', {type: "get_user_info", username: localStorage.getItem("username")})
		this.setState({ip:r.ip})
	}

	async download(e: any){
		if(e.target.id == "cracker"){
			let r1 = await Funcs.request('/api/defaults', {type: "get_cracker", username: localStorage.getItem("username")})
		}
		if(e.target.id == "hasher"){
			let r2 = await Funcs.request('/api/defaults', {type: "get_hasher", username: localStorage.getItem("username")})
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
		let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})

		if (r.type == "OK"){
			this.setState({scanned: true})
			this.setState({invalidInput: false})
			this.setState({downloader: false})

			let userInput = (document.getElementById("connect") as HTMLInputElement).value
			let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})
			if (this.state.downloader !== true){
				if(r.readme == null){
					this.setState({readme:""})
				} else{
					this.setState({readme:r.readme.content})
				}
			}

		} else if(userInput == "hackeracademy.com") {
			this.setState({scanned: false})
			this.setState({invalidInput: false})
			this.setState({downloader: true})
		} else {
			this.setState({scanned: false})
			this.setState({invalidInput: true})
			this.setState({downloader: false})
		}
	}

	async crackPassword(){
		this.setState({scanned: false})
		this.setState({invalidInput: false})
		this.setState({downloader: false})	
		this.setState({login: true})	
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
			<mui.Stack style={{marginTop: "10px"}} direction="row" spacing={1}>
				<mui.Typography variant="h5" gutterBottom>
					Your IP: {this.state.ip}
				</mui.Typography>
				<mui.Button variant="outlined" color="success">
					Reset IP
				</mui.Button>
			</mui.Stack>

			<mui.Stack style={{marginTop: "25px"}} direction="row" spacing={1}>
				<mui.TextField id="connect" label="Scan IP" defaultValue="" size='small'/>
				<mui.Button id="connect" variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
					Scan
				</mui.Button>
			</mui.Stack>


			{this.state.login?
			<div style={{resize: "both", overflow: "auto"}}>
				<h3>some shit in here</h3>
				<iframe style={{height: "70vh", width: "70vw"}}src={`http://localhost:3000`}></iframe>
			</div>
			:
			""}

			{this.state.scanned?
			<div>
				<div style={{borderStyle:"solid", borderWidth:"1px", marginTop:"20px", display: 'inline-block'}}>
					<mui.Stack style={{paddingLeft: "10px", paddingRight: "10px"}} direction="column" spacing={2}>
						<h3 style={{textAlign: "center", marginBottom: "0px"}}>{(document.getElementById("connect") as HTMLInputElement).value} is online.</h3>
						<div>
						<mui.TextField type="password" label="Password" defaultValue="" size='small'/>
						<mui.Button variant="outlined" color="success"
							// style={{marginRight:"10px", marginTop:"10px", marginBottom:"10px", marginLeft:"10px"}}
							>
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
				<div style={{marginTop: "20px"}}>
					<mui.Box>
						<Block label="README.txt" title={this.state.readme}/>
					</mui.Box>
				</div>
			</div>
			:
			""
			}

			{this.state.invalidInput?
			<div style={{marginTop: "10px"}}>
				<mui.Typography variant="h5" gutterBottom>
					Connection failed.
				</mui.Typography>				
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