import React from 'react'
import Funcs from './Funcs'
import './App.css'

class Topbar extends React.Component{
	async test(){
		let r = await Funcs.request(`/api/test`, {})
		console.log(r)
	}
	
	render(){
	return(
		<div style={{margin: "0"}} className='topbar'>
		<h1 style={{margin: "0"}}>{localStorage.getItem("username")}@localhost</h1>
		<h1 onClick={this.test.bind(this)} style={{textAlign: "center", margin: "0"}}></h1>
		<h1 style={{textAlign: "right", margin: "0",}}>pre-alpha build</h1>
		</div>
	)
	}
}

export default Topbar;