import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
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

class System extends React.Component<{}, {files: []}>{
    render(){
        return(
            <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            <Topbar />
            <div style={{display: "flex"}}>
            <Sidebar />

            <div style={{display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', marginLeft: "20px"}}>
                <div>
                <h1> System </h1>
                <h2> Hardware Usage</h2>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <mui.Typography variant="h5" color="text.primary" style={{marginRight: "10px"}}>{'CPU'}</mui.Typography>
                    <mui.LinearProgress variant="determinate" value={30} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`30%`}</mui.Typography>
                </mui.Box>
                <br/>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <mui.Typography variant="h5" color="text.primary" style={{marginRight: "10px"}}>{'HDD'}</mui.Typography>
                    <mui.LinearProgress variant="determinate" value={75} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`75%`}</mui.Typography>
                </mui.Box>
                <br/><br/>
                </div>

                <div style={{marginLeft: "10vw"}}>
                    <h2>Status</h2>
                    <mui.Alert severity='success' variant='filled'>All systems operational</mui.Alert>
                </div>

                <div>
                <h2> Your Botnet </h2>

                <Block label="DDoSers" title="94 Bots"/>
                <Block label="Miners" title="69 Miners"/>
                <Block label="Slaves" title="420 Slaves"/>
                </div>
            </div>

            </div>
            </mui.Paper>
            </mui.ThemeProvider>
            </div>
        )
    }
}

export default System;