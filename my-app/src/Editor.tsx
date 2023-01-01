import React from 'react'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import Popup from './feedback/Popup'

const CssTextField = styled(mui.TextField)({
textAlign: "center",
'& label':{
    color: 'white'
},
'& label.Mui-focused': {
    color: 'white',
},
});

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

class Editor extends React.Component<{}, {filename: string, content: string, error: boolean, sendPopUp: boolean, popUpTitle: string, popUpSubtitle?: string | null}>{
    constructor(props: any){
        super(props)
        this.state = {filename: "filename.ls", content: "Le code here", error: false, sendPopUp: false, popUpTitle: "", popUpSubtitle: ""}
    }

	async sendPopUp(title: string, subtitle?: string){
		this.setState({sendPopUp: true, popUpTitle: title, popUpSubtitle: subtitle ? subtitle : null})
	}

    async componentDidMount(){
        if(window.location.href.split("?").length > 1){
            (document.getElementById("filename") as HTMLInputElement).setAttribute("disabled", "true");
            let params: any = window.location.href.split("?")[1]
            params = params.split("&")
            let filename = params[0].split("=")[1].replace("%20", " ")

            let r = await Funcs.request('/v2/storage', {type: "get_file", file: filename, username: localStorage.getItem("username")})
            this.setState({filename: r.filename, content: r.content});
            (document.getElementById("filename") as HTMLInputElement).value = r.filename;
            (document.getElementById("content") as HTMLTextAreaElement).value = r.content;
        }
    }

    async handleClick(e: any){
        let filename = (document.getElementById("filename") as HTMLInputElement).value;
        let content = (document.getElementById("content") as HTMLTextAreaElement).value;
        
        let payload = {type: "add_file", file: {filename: filename, content: content}, username: localStorage.getItem("username")}    
        let r = await Funcs.request('/v2/storage', payload)
        await this.sendPopUp(r.type, r.message)
    }

	render(){
	return(
        <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            {this.state.sendPopUp?
            <Popup
            title={this.state.popUpTitle}
            subtitle={this.state.popUpSubtitle}
            handleClose={() => this.setState({sendPopUp: false})}
            />
            :""}
            
            <Topbar />
                <div style={{display: "flex"}}>
                <Sidebar />

                <div style={{marginLeft: "20px", marginTop: "15px"}}>
                    <div style={{marginTop: "20px"}}>
                    <CssTextField
                        id="filename"
                        size="small"
                        variant="outlined"
                        label="File name"
                        defaultValue={this.state.filename}>
                    </CssTextField>
                    <SaveButton
                        style={{marginLeft: "10px"}}
                        variant={this.state.error ? "contained" : "outlined"}
                        color='error'
                        onClick={this.handleClick.bind(this)}>
                        Save
                    </SaveButton>
                    </div>
                    
                    <mui.TextField id="content" style={{marginTop: "20px", width: "50vw"}}
                      fullWidth
                      multiline
                      spellCheck="false"
                      label="Code"
                      rows={25}
                      defaultValue={this.state.content}
                    />
                </div>
                
            </div>
            </mui.Paper>
            </mui.ThemeProvider>
        </div>
	)
	}
}

export default Editor;