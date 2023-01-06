import React from 'react'
import * as mui from "@mui/material/"

import Topbar from './Topbar'
import Sidebar from './ui-components/Sidebar'
import MachinesBar from './ui-components/MachinesBar'
import Funcs from './Funcs'
import Block from './data-display/Block'

import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';

function secsToTime(duration: number) //https://stackoverflow.com/a/11486026
{   
    // Hours, minutes and seconds
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

class Task extends React.Component<{label: string, title: string, ETA?: number}, {ETA?: any}>{
    constructor(props: any){
        super(props)
        this.state = {ETA: props.ETA}
    }

    async componentDidMount(){
        let time = Math.round((new Date()).getTime() / 1000)

        if(this.props.ETA == undefined){
            this.setState({ETA: ""})
            return
        }

        if(this.props.ETA <= time){
            this.setState({ETA: "ETA: Done"})
            return
        }

        let timeLeft = this.props.ETA - Math.round((new Date()).getTime() / 1000);
        this.setState({ETA: `ETA: ${secsToTime(timeLeft)}`})

        await this.counter()
    }

    async counter(){
        function sleep(ms: number){
          return new Promise(resolve => setTimeout(resolve, ms))
        }
        
        while(this.props.ETA != undefined && this.props.ETA > Math.round((new Date()).getTime() / 1000)){
            let timeLeft = this.props.ETA - Math.round((new Date()).getTime() / 1000);
            this.setState({ETA: `ETA: ${secsToTime(timeLeft)}`})
            await sleep(1000)
        }
        this.setState({ETA: "ETA: Done"})
    }

    render(){
    return(
        <Block
        primary={this.props.label}
        secondary={this.props.title}
        tertiary={this.state.ETA}
        />
    )}
}

class System extends React.Component<{}, {hardware: any, tasks: any}>{
    constructor(props: any){
        super(props)
        this.state = {hardware: {cpu: 0, disk: 0, maxCpu: 100, maxDisk: 100}, tasks: []}
        // some default hardware values have been defined,
        // so it doesnt show schizo values like NaN when it doesnt
        // have the actual hardware info
        // there's probably much better ways to do it, but this is ok for now.
    }

    async componentDidMount(){
        let payload = {type: "get_hardware"}
        let r = await Funcs.request('/v2/hardware', payload)
        this.setState({hardware: r})

        payload = {type: "get_tasks"}
        r = await Funcs.request('/v2/system', payload)
        this.setState({tasks: r.tasks})
    }

    activitiesToString(task: any){
        return task.activities.join(", ")
    }

    render(){
        return(
            <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            {/* <Topbar /> */}
            <div style={{display: "flex"}}>
            <MachinesBar />
            <Sidebar />

            <div style={{display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', marginLeft: "20px"}}>
                <div>
                <h2> Hardware Usage</h2>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <MemoryOutlinedIcon/>
                    <h2 style={{margin: "0", marginRight: "10px"}}>CPU</h2>
                    <mui.LinearProgress variant="determinate" value={(this.state.hardware.cpu / this.state.hardware.maxCpu) * 100} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`${Math.floor((this.state.hardware.cpu / this.state.hardware.maxCpu) * 100)}% (${this.state.hardware.cpu} / ${this.state.hardware.maxCpu})`}</mui.Typography>
                </mui.Box>
                <br/>
                <mui.Box style={{display: "flex", "alignItems": "center"}}>
                    <StorageOutlinedIcon/>
                    <h2 style={{margin: "0", marginRight: "10px"}}>HDD</h2>
                    <mui.LinearProgress variant="determinate" value={(this.state.hardware.disk / this.state.hardware.maxDisk) * 100} style={{width: "20vw"}} />
                    <mui.Typography variant="body2" color="text.secondary" style={{marginLeft: "10px"}}>{`${Math.floor((this.state.hardware.disk / this.state.hardware.maxDisk) * 100)}% (${this.state.hardware.disk} / ${this.state.hardware.maxDisk})`}</mui.Typography>
                </mui.Box>
                </div>

              <div style={{ marginLeft: '10vw' }}>
                <h2>Running Tasks</h2>
                {this.state.tasks.length == 0
                ?
                <mui.Skeleton variant="rounded">
                    <Block primary="yeet" secondary='yeet'/>
                </mui.Skeleton>
                :
                Object.keys(this.state.tasks).map((task) => (
                  <Task
                    key={this.state.tasks[task]}
                    label={this.state.tasks[task].origin}
                    title={this.activitiesToString(this.state.tasks[task])}
                    ETA={this.state.tasks[task].ETA}
                  />
                ))
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