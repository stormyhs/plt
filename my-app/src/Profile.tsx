import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'


import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';


class Profile extends React.Component<{}, {creation_date: string, ip: any}>{
	constructor(props: any){
	super(props)
	this.state = {creation_date: "Unknown", ip: "Unknown"}
	}

	async componentDidMount(){
		let payload = {type: "get_user_info"}
		let r = await Funcs.request('/v2/user', payload);
		this.setState({creation_date: r.creation_date ? r.creation_date : "Unknown", ip: r.ip})
	}
	
	render(){
	const user = localStorage.getItem("username")
	return(
	<div>
	<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
	<mui.Paper elevation={0}>


	<Topbar />
	<div style={{display: "flex"}}>
	<Sidebar />
	
	<div style = {{marginTop: '16px', marginLeft: '16px'}}>
	<div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
	<div>
	{/* TODO: let users change their pfp */}
	<mui.Avatar src="/favicon.ico" sx={{ bgcolor: 'transparent', color:'white'}} style={{width: "124px", height: "124px", border: "white solid 2px"}}>
		{user?.charAt(0).toUpperCase()}
	</mui.Avatar>
	</div>
	
	<div style={{marginTop:'26px', marginLeft:'8px'}}>
	<mui.Typography  variant="h2">{user}</mui.Typography>
	</div>    

	</div>

	<div style={{marginTop: '16px',maxWidth: '300px'}}>
	<mui.Card variant="outlined" style= {{border:"white solid 1px"}}>      
	<mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
	<mui.ListItem>
		<mui.ListItemAvatar>
		<mui.Avatar>
			<TodayOutlinedIcon />
		</mui.Avatar>
		</mui.ListItemAvatar>
		<mui.ListItemText primary="Account creation date" secondary={this.state.creation_date} />
	</mui.ListItem>
	<mui.ListItem>
		<mui.ListItemAvatar>
		<mui.Avatar>
			<MemoryOutlinedIcon />
		</mui.Avatar>
		</mui.ListItemAvatar>
		<mui.ListItemText primary="User IP" secondary={this.state.ip} />
	</mui.ListItem>
	</mui.List>
	</mui.Card> 
	</div>

	</div>
	</div>
	</mui.Paper>
	</mui.ThemeProvider>
	</div>
	)
	}
}

export default Profile;