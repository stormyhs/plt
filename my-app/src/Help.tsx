import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"

class Block extends React.Component<{label: string, title: string, width: string, height: string}, {}>{
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
            borderColor: 'white',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth:this.props.width,
            minHeight:this.props.height
            }}
        >
        <mui.Box sx={{ color: 'text.secondary' }}>{this.props.label}</mui.Box>
        <mui.Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>{this.props.title}</mui.Box>
        </mui.Box>
    )
    }

}

class Help extends React.Component{
	render(){
	return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />

        <div style={{marginLeft:"20px", marginTop:"20px"}}>
            <mui.Box sx={{ width: '100%', maxWidth: 500 }}>
                <mui.Typography variant="h4" gutterBottom>
                    About
                </mui.Typography>
                <mui.Typography variant="h5" gutterBottom>
                    <Block label="" title="A hacker themed browser game." width="800" height="800"/>
                </mui.Typography>
            </mui.Box>
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Help;