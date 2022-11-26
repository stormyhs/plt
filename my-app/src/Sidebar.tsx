import React from 'react'
import { Link } from "react-router-dom";
import * as mui from "@mui/material/"
import './App.css'

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';


class Sidebar extends React.Component{
	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0} style={{width: "125px", height: "100vh", borderRight: "white solid 1px"}}>
		<mui.List style={{marginLeft: "0"}}>
    	
    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<DesktopWindowsOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/system'><mui.ListItemText>System</mui.ListItemText></Link>
      </mui.MenuItem>

    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<FolderOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/storage'><mui.ListItemText>Storage</mui.ListItemText></Link>
        </mui.MenuItem>

    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<LanOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/network'><mui.ListItemText>Network</mui.ListItemText></Link>
        </mui.MenuItem>

    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<CloudOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/internet'><mui.ListItemText>Internet</mui.ListItemText></Link>
        </mui.MenuItem>

    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<NoteAltOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/logs'><mui.ListItemText>Logs</mui.ListItemText></Link>
        </mui.MenuItem>

        <mui.Divider/>

		<mui.MenuItem>        
          <mui.ListItemIcon>
          	<AccountCircleOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/profile'><mui.ListItemText>{localStorage.getItem("username")}</mui.ListItemText></Link>
		</mui.MenuItem>
		
		<mui.MenuItem>        
          <mui.ListItemIcon>
          	<HelpOutlineOutlinedIcon/>
          </mui.ListItemIcon>
          <Link to='/help'><mui.ListItemText>Help</mui.ListItemText></Link>
		</mui.MenuItem>

		</mui.List>
		</mui.Paper>
		</mui.ThemeProvider>
	    </div>
	)
	}
}

export default Sidebar;