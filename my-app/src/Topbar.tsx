import React from 'react'
import './App.css'
import * as mui from "@mui/material/"

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

class Topbar extends React.Component{
	render(){
	return(
		<div style={{margin: "0"}} className='topbar'>
		<h1 style={{margin: "0"}}>{localStorage.getItem("username")}@localhost</h1>
		<h1 style={{textAlign: "center", margin: "0"}}></h1>
		<h1 style={{textAlign: "right", margin: "0"}}>NIGGA HOST 2.0</h1>
		</div>
	)
	}
}

export default Topbar;