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
        
			<mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
				<div style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
					<mui.Typography>{this.props.title}</mui.Typography>
				</div>
			</mui.Box>
        
		</mui.Box>
    )}
}

class Internet extends React.Component<{},
{ip:string, connected:boolean, website:string,userInput:string,invalidInput:boolean,
readme:string,downloader:boolean,clearButton:boolean}>{ // I HECKIN' LOVE TYPESCRIPT!!!
	constructor(props: any){
		super(props)
		this.state = {
			ip:"",
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
	
	async handleClick(){
		let userInput = (document.getElementById("connect") as HTMLInputElement).value
		let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})

		if(r.readme != null){
			this.setState({readme:r.readme.content})
			// console.log(r.readme.content)
		}

		if (r.type == "OK"){
			this.setState({connected: true})
			this.setState({invalidInput: false})
			this.setState({downloader: false})

			let userInput = (document.getElementById("connect") as HTMLInputElement).value
			let r = await Funcs.request('/api/ip', {type: "get_ip_data", username: localStorage.getItem("username"), ip:userInput,})		
			if (this.state.downloader !== true){
				this.setState({readme:r.readme.content})
			}

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

	async handleClear(){
		(document.getElementById("connect") as HTMLInputElement).value = "";
		this.setState({connected: false})
		this.setState({invalidInput: false})
		this.setState({downloader: false})
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
				<mui.TextField className='connectField' id="connect" label="" defaultValue=""/>
				<mui.Button className='clear' variant="outlined" color="primary" onClick={this.handleClear.bind(this)}>
					Clear
				</mui.Button>
				<mui.Button className='clear' id="connect" variant="outlined" color="success" onClick={this.handleClick.bind(this)}>
					Connect
				</mui.Button>
			</mui.Stack>

			<br/>

			{this.state.connected?
			<div>
				<mui.Typography variant="h4" gutterBottom>
					USER IP: {(document.getElementById("connect") as HTMLInputElement).value}
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
				<br/>
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