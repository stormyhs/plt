import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

class Network extends React.Component{
	render(){
	return(
		<div>
		<Topbar/>
		<Sidebar/>
		</div>
	)
	}
}

export default Network;