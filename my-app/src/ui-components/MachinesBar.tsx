import React from 'react'
import * as mui from "@mui/material/"

import '../App.css'

import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

const Machine: React.FC<{name: string, selected?: boolean}> = (props) => {
	return (
		<div style={{marginTop: '20px'}}>
			<mui.ListItemButton>
				<div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "center"}}>
					<DesktopWindowsOutlinedIcon style={{textAlign: "center"}} sx={{ fontSize: 42, textAlign: "center", color: props.selected ? "cyan" : ""}}/>
					<h5 style={{margin:0, padding:0}}>{props.name.length > 10 ? props.name.slice(0,7) + "..." : props.name}</h5>
				</div>
			</mui.ListItemButton>
		</div>
	);
};

class Sidebar extends React.Component{
  render(){
	return(
		<div style={{width: "100px"}}>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={10} style={{width: '100%', height: "100vh"}}>
		<mui.List style={{marginLeft: "0"}}>
    	
		<div style={{display: "grid", gridTemplateColumns: "auto"}}>
			<Machine name="localhost" selected={true}/>
			<Machine name="22.39.222.22"/>
			<Machine name="131.31.11.1"/>
			<Machine name="131.31.11.1"/>
			<Machine name="131.31.11.1"/>
			<Machine name="131.31.11.1"/>
			<Machine name="131.31.11.1"/>
		</div>
		
        </mui.List>
		</mui.Paper>
		</mui.ThemeProvider>
	    </div>
	)
	}
}

export default Sidebar;