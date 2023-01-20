import React from 'react'
import * as mui from "@mui/material/"

import Funcs from '../Funcs'
import '../App.css'

import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

const Machine: React.FC<{updater: any, name: string, color?: string}> = (props) => {
	return (
		<div style={{marginTop: '20px'}}>
			<mui.ListItemButton
				onClick={() => {
					if(props.name == "localhost"){
						localStorage.removeItem("acting_as")
					} else{
						localStorage.setItem("acting_as", props.name )
					}
					props.updater(localStorage.getItem("acting_as"))
				}}
				style={{margin:0, padding:0, borderRadius: "20px", display: 'flex', flexDirection: "column", justifyContent: "center"}}
			>
				<DesktopWindowsOutlinedIcon sx={{fontSize: 42, color: props.color ? props.color : ""}}/>
				<h4 style={{margin:0, padding:0, userSelect: "none", maxWidth: "100%"}}>{props.name.length > 12 ? props.name.slice(0,9) + "..." : props.name}</h4>
			</mui.ListItemButton>
		</div>
	);
};

class Sidebar extends React.Component<{}, {ips: any, acting_as: string | null}>{
	constructor(props: any){
		super(props)
		this.state = {ips: [], acting_as: ""}
	}

	async componentDidMount(){
		this.setState({acting_as: localStorage.getItem("acting_as")})
		let payload = {type: "get_ip_logins", acting_as: "localhost"}
		let response = await Funcs.request('/v2/network', payload)
		let ips = []
		for(let entry in response.ip_logins){
			ips.push(response.ip_logins[entry].ip)
		}

		this.setState({ips: ips})
	}

	updateActingAs(new_acting_as: string | null){
		this.setState({acting_as: new_acting_as})
	}

  	render(){
	return(
		<div style={{width: "100px"}}>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={10} style={{width: '100%', height: "100vh"}}>
		<mui.List style={{marginLeft: "0"}}>
    	
		<div style={{display: "grid", gridTemplateColumns: "auto"}}>
			<Machine
				updater={this.updateActingAs.bind(this)}
				name={"localhost"}
				color={this.state.acting_as == "localhost" || this.state.acting_as == null
				? "cyan" : ""}
			/>

			{this.state.ips.map((ip: string)=>{
				return <Machine
						updater={this.updateActingAs.bind(this)}
						name={ip}
						color={this.state.acting_as == ip || (this.state.acting_as == null && ip == "localhost")
						? "cyan" : ""}
						/>
			})}
		</div>
		
        </mui.List>
		</mui.Paper>
		</mui.ThemeProvider>
	    </div>
	)
	}
}

export default Sidebar;