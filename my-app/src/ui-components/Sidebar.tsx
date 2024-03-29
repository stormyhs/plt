import React from 'react'
import { Link } from "react-router-dom";
import * as mui from "@mui/material/"

import '../App.css'

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SettingsIcon from '@mui/icons-material/Settings';


class Sidebar extends React.Component{
  render(){
	return(
		<div style={{width: "150px"}}>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={4} style={{width: '100%', height: "100vh"}}>
		<mui.List style={{marginLeft: "0"}}>

      <Link to='/system'>
    	<mui.MenuItem style={{marginTop: "20px"}}>
          <mui.ListItemIcon>
          	<DesktopWindowsOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>System</mui.ListItemText>
      </mui.MenuItem>
      </Link>

      <Link to='/storage'>
    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<FolderOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Storage</mui.ListItemText>
        </mui.MenuItem>
      </Link>

      <Link to='/editor'>
      <mui.MenuItem>
          <mui.ListItemIcon>
            <EditOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Editor</mui.ListItemText>
        </mui.MenuItem>
      </Link>

      <Link to='/network'>
    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<LanOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Network</mui.ListItemText>
        </mui.MenuItem>
      </Link>

      <Link to='/internet'>
    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<CloudOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Internet</mui.ListItemText>
        </mui.MenuItem>
      </Link>

      <Link to='/logs'>
    	<mui.MenuItem>
          <mui.ListItemIcon>
          	<NoteAltOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Logs</mui.ListItemText>
        </mui.MenuItem>
      </Link>

    <mui.Divider/>
    <mui.ListItemText style={{marginLeft: "5px", cursor: "default"}}>Your account</mui.ListItemText>

    <Link to='/profile'>
		<mui.MenuItem>        
          <mui.ListItemIcon>
          	<AccountCircleOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>{localStorage.getItem("username")}</mui.ListItemText>
		</mui.MenuItem>
    </Link>
		

    {/* <Link to='/help'>
		<mui.MenuItem>        
          <mui.ListItemIcon>
          	<HelpOutlineOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Help</mui.ListItemText>
		</mui.MenuItem>
    </Link> */}

    <Link to='/settings'>
    <mui.MenuItem>        
          <mui.ListItemIcon>
            <SettingsIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Settings</mui.ListItemText>
    </mui.MenuItem>
    </Link>

    <Link to='/logout'>
    <mui.MenuItem>        
          <mui.ListItemIcon>
            <LogoutOutlinedIcon/>
          </mui.ListItemIcon>
          <mui.ListItemText>Log Out</mui.ListItemText>
    </mui.MenuItem>
    </Link>

		</mui.List>
		</mui.Paper>
		</mui.ThemeProvider>
	    </div>
	)
	}
}

export default Sidebar;