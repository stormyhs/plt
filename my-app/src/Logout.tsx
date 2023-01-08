import React from 'react'
import Funcs from './Funcs'

class Logout extends React.Component{
	async componentDidMount(){
		await Funcs.request('/api/logout', {})
		localStorage.removeItem("username")
		localStorage.removeItem("token")
		localStorage.removeItem("foreignip")
		window.location.assign("/")
	}

	render(){
	return(
		<h1>Logging out...</h1>
	)
	}
}

export default Logout;