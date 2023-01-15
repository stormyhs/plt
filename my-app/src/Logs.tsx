import React from 'react'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"

import Sidebar from './ui-components/Sidebar'
import MachinesBar from './ui-components/MachinesBar'
import Funcs from './Funcs'
import Snackbar from './feedback/Snackbar'

let SaveButton = styled(mui.Button)({
    color: "white",
    borderColor: "white",
    '&:active':{
        borderColor: "cyan"
    },
    '&:hover':{
        borderColor: "cyan"
    }
})

class Logs extends React.Component<{}, {notif: string, sendNotif: boolean}>{
    constructor(props: any){
        super(props)
        this.state = {notif: "", sendNotif: false}
    }

    async componentDidMount(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement);
        let payload = {type: "get_logs", username: localStorage.getItem("username")}
        let r = await Funcs.request('/v2/logs', payload)
        logs.value = r
    }

	async sendSnackbar(title: string){
		this.setState({sendNotif: true, notif: title})
	}

    async saveLogs(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement).value;
        let payload = {type: "set_logs", logs: logs, username: localStorage.getItem("username")}
        let r = await Funcs.request('/v2/logs', payload)
        if(r.type == "OK"){
            await this.sendSnackbar("Logs saved.")
        } else{
            await this.sendSnackbar(`ERROR: ${r.message}`)
        }
    }

    async clearLogs(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement);

        let payload = {type: "clear_logs", username: localStorage.getItem("username")}
        let r = await Funcs.request('/v2/logs', payload)

        if(r.type == "OK"){
            logs.value = ""
            await this.sendSnackbar("Logs cleared.")
        } else{
            await this.sendSnackbar(`ERROR: ${r.message}`)
        }
    }

	render(){
	return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        {this.state.sendNotif?
        <Snackbar
        message={this.state.notif}
        handleClose={() => this.setState({sendNotif: false})}
        />
        :""}

        <div style={{display: "flex"}}>
        <MachinesBar />
        <Sidebar />

        <div style={{marginLeft: "10px", marginTop: "15px"}}>
            <SaveButton variant="outlined" onClick={this.saveLogs.bind(this)}>Save</SaveButton>
            <SaveButton style={{marginLeft: "10px"}} variant="outlined" onClick={this.clearLogs.bind(this)}>Clear</SaveButton>
            <br/>
            <mui.TextField id="logs" style={{marginTop: "20px", width: "80vw"}}
              spellCheck="false"
              fullWidth
              label="System Logs"
              multiline
              rows={25}
              defaultValue="*"
            />
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Logs;