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
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SettingsIcon from '@mui/icons-material/Settings';


class Sidebar extends React.Component{
  render(){
	return(
		<div style={{width: "100px"}}>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={10} style={{width: '100%', height: "100vh"}}>
		<mui.List style={{marginLeft: "0"}}>
    	
        <div className='machine' style={{marginTop: "30px"}}>
            <DesktopWindowsOutlinedIcon sx={{fontSize: 42}}/>
        </div>

        <div className='machine'>
            <DesktopWindowsOutlinedIcon sx={{fontSize: 42}}/>
        </div>

        </mui.List>
		</mui.Paper>
		</mui.ThemeProvider>
	    </div>
	)
	}
}

export default Sidebar;