import React from 'react'
import * as mui from "@mui/material/"

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import Block from './data-display/Block'

class Network extends React.Component<{}, {ip_logins: any}>{
	constructor(props: any){
		super(props)
		this.state = {ip_logins: undefined}
	}

	async componentDidMount(){
		let payload = {type: "get_ip_logins"}
		let r = await Funcs.request('/v2/network', payload)
		this.setState({ip_logins: r.ip_logins})
	}

	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0}>
		<Topbar />
		<div style={{display: "flex"}}>
		<Sidebar />

		<div style={{display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', marginLeft: "20px"}}>
			<div>
				<h2> Your Botnet </h2>
				<Block
				primary='DDoSers'
				secondary='69'
				/>
				<Block
				primary='Miners'
				secondary='42'
				/>
			</div>

			<div style={{marginLeft: '10vw'}}>
				<h2>Cracked logins</h2>
				
				{this.state.ip_logins != undefined ?
                Object.keys(this.state.ip_logins).map((login) => (
					<Block
					primary={this.state.ip_logins[login].ip}
					secondary={this.state.ip_logins[login].ip_password}
					canCopy={true}
					/>
				))
				:
				<mui.Skeleton variant="rounded">
					<Block primary='yeet' secondary='yeet'/>
				</mui.Skeleton>
				}
			</div>
		</div>

		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Network;