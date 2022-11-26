import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

class Internet extends React.Component{
	render(){
	return(
		<div>
		<Topbar/>
		<Sidebar/>
		</div>
	)
	}
}

export default Internet;