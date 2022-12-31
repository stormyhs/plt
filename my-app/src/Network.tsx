import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'
import Block from './data-display/Block'

class Network extends React.Component<{}, {ip_logins: any}>{
	constructor(props: any){
		super(props)
		this.state = {ip_logins: []}
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
				title='DDoSers'
				subtitle='69'
				/>
				<Block
				title='Miners'
				subtitle='42'
				/>
			</div>

			<div style={{marginLeft: '10vw'}}>
				<h2>Cracked logins</h2>
				
				{this.state.ip_logins != undefined ?
                Object.keys(this.state.ip_logins).map((login) => (
					<Block
					title={this.state.ip_logins[login].ip}
					subtitle={this.state.ip_logins[login].ip_password}
					canCopy={true}
					/>
				))
				:""}
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