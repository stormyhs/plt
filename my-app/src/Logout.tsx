import React from 'react'
import Funcs from './Funcs'

class Logout extends React.Component{
	async componentDidMount(){
		localStorage.removeItem("username")
		console.log(await Funcs.request('/api/logout', {}))
		window.location.assign("/")
	}

	render(){
	return(
		<h1>Logging out...</h1>
	)
	}
}

export default Logout;