import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'

import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';

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

class System extends React.Component<{}, {hardware: any, tasks: any}>{
    constructor(props: any){
        super(props)
        this.state = {hardware: {}, tasks: []}
    }

    async componentDidMount(){
        let payload = {
            username: localStorage.getItem("username"),
            type: "get_hardware"
        }
        let r = await Funcs.request('/api/hardware', payload)
        this.setState({hardware: {cpu: r.cpu, maxCpu: r.maxCpu, disk: r.disk, maxDisk: r.maxDisk}})

        payload = {
            username: localStorage.getItem("username"),
            type: "get_tasks"
        }
        r = await Funcs.request('/api/system', payload)
        this.setState({tasks: r.tasks})
        console.log(r.cpu)
    }

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
                <h2> Hardware Usage</h2>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <MemoryOutlinedIcon/>
                    <mui.Typography variant="h5" color="text.primary" style={{marginRight: "10px"}}>{'CPU'}</mui.Typography>
                    <mui.LinearProgress variant="determinate" value={(this.state.hardware.cpu / this.state.hardware.maxCpu) * 100} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`${(this.state.hardware.cpu / this.state.hardware.maxCpu) * 100}% (${this.state.hardware.cpu} / ${this.state.hardware.maxCpu})`}</mui.Typography>
                </mui.Box>
                <br/>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <StorageOutlinedIcon/>
                    <mui.Typography variant="h5" color="text.primary" style={{marginRight: "10px"}}>{'HDD'}</mui.Typography>
                    <mui.LinearProgress variant="determinate" value={(this.state.hardware.disk / this.state.hardware.maxDisk) * 100} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`${(this.state.hardware.disk / this.state.hardware.maxDisk) * 100}% (${this.state.hardware.disk} / ${this.state.hardware.maxDisk})`}</mui.Typography>
                </mui.Box>
                </div>

                <div style={{marginLeft: "10vw"}}>
                    <h2>Running tasks</h2>
                    {this.state.tasks != undefined && this.state.tasks.length > 0?
                    this.state.tasks.map((task: any) =>{
                        return <Block label={task.origin} title={task.activity}/>
                    })
                    :
                    ""
                    }
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