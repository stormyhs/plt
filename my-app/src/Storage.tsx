import React from 'react'
import { Link } from "react-router-dom";
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"

import Sidebar from './ui-components/Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Snackbar from './feedback/Snackbar';

const CssTextField = styled(mui.TextField)({
textAlign: "center",
'& label':{
    color: 'white'
},
'& label.Mui-focused': {
    color: 'white',
},
});

function RenameDialog(props: any) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleKey = async (e: any) => {
    if(e.key === "Enter"){
      let newName = (document.getElementById("filename") as HTMLInputElement).value;
      let payload = {
        username: localStorage.getItem("username"),
        type: "rename_file",
        old: props.old,
        new: newName
      }
      await Funcs.request('/v2/storage', payload);
      props.rename(newName)
    }
  }

  return (
    <mui.Dialog onClose={handleClose} open={open}>
      <div style={{marginLeft: "30px", marginRight: "30px", marginBottom: "30px"}}>
      <mui.DialogTitle>Rename {props.old}</mui.DialogTitle>
      <CssTextField
      autoFocus
      id="filename"
      variant="outlined"
      label="New filename"
      defaultValue={props.old}
      onKeyDown={e => handleKey(e)}
      ></CssTextField>
      </div>
    </mui.Dialog>
  );
}

class File extends React.Component<{filename: string, content: string, size: any, version?: any, taskHandler: any, fileStatus: any}, {open: boolean, name: string}>{
  constructor(props: any){
    super(props)
    this.state = {name: props.filename, open: false}
    this.rename = this.rename.bind(this)
  }

  async delete(){
    let r = await Funcs.request('/v2/storage', {type: 'remove_file', file: this.state.name})
    if(r.type === "OK"){
      (document.getElementById(this.props.filename) as HTMLElement).remove();
    }
  }

  handleClickOpen(){
    this.setState({open: true})
  }

  handleClose(){
    this.setState({open: false})
  }

  rename(newName: string){
    this.setState({name: newName})
    console.log(`set name to ${newName}`)
  }

  getButtons(){
    let buttons = []
    let extention = this.state.name.split(".")[this.state.name.split(".").length - 1]

    if(extention === "ls"){
      buttons.push(<mui.Button size="small" color="primary">Compile</mui.Button>)
    }
    if(extention === "exe"){
      let status = this.props.fileStatus(this.state.name)

      if(this.state.name == "hasher.exe"){
        if(status.running){
          buttons.push(<mui.Button onClick={async (e) => await this.props.taskHandler(this.state.name, "stop")} size="small" color="primary">Running</mui.Button>)
        } else{
          buttons.push(<mui.Button onClick={async (e) => await this.props.taskHandler(this.state.name, "start")} size="small" color="primary">Run</mui.Button>)
        }
      }

      if(this.state.name == "cracker.exe"){
        if(status.running){
          buttons.push(<mui.Button onClick={async (e) => await this.props.taskHandler(this.state.name, "stop")} size="small" color="primary">Running</mui.Button>)
        }
      }

      if(status.upgrading){
        buttons.push(<mui.Button onClick={async (e) => await this.props.taskHandler(this.state.name, "stop_upgrade")} size="small" color="primary">Upgrading</mui.Button>)
      } else{
        buttons.push(<mui.Button onClick={async (e) => await this.props.taskHandler(this.state.name, "upgrade")} size="small" color="primary">Upgrade</mui.Button>)
      }
    }

    buttons.push(<mui.Button size="small" color="primary"onClick={this.delete.bind(this)}>Delete</mui.Button>)
    return buttons
  }

  render(){
    return(
        <>
        <mui.Card id={this.props.filename} style={{width: "17vw", marginLeft: "10px", marginTop: "10px"}}>
          <Link id={"link-" + this.props.filename} to={"/editor?filename=" + this.state.name}>
          <mui.CardActionArea>
            <mui.CardContent>
              <div style={{display: "flex", alignItems: "center"}}>
              
              {this.props.filename.split(".")[this.props.filename.split(".").length-1] == "txt"?
              <TextSnippetOutlinedIcon/>
              :""
              }
              
              {this.props.filename.split(".")[this.props.filename.split(".").length-1] == "ls"?
              <CodeOutlinedIcon/>
              :""
              }
              
              {this.props.filename.split(".")[this.props.filename.split(".").length-1] == "exe"?
              <SettingsOutlinedIcon/>
              :""
              }

              <mui.Typography gutterBottom variant="h5" component="div">
                {this.state.name.length <= 12?
                this.state.name
                :
                `${this.state.name.slice(0, 12) + "..."}`
                }
              </mui.Typography>
              </div>
              <mui.Typography variant="body2" color="text.secondary">
                {this.props.version?
                `${this.props.size} MB - V${this.props.version}`
                :
                `${this.props.size} MB - ${this.props.content.slice(0, 12) + "..."}`
                }
                
              </mui.Typography>
            </mui.CardContent>
          </mui.CardActionArea>
          </Link>
          <mui.CardActions>

          {this.getButtons().map((button: any) =>{
            return button
          })}

          {this.state.name !== "cracker.exe" && this.state.name !== "hasher.exe"?
          <>
            <mui.Button size="small" color="primary"
            onClick={this.handleClickOpen.bind(this)}
            >
              Rename
            </mui.Button>
            <RenameDialog
            open={this.state.open}
            onClose={this.handleClose.bind(this)}
            old={this.state.name}
            rename={this.rename}
            />
          </>
          :
          ""
          }


          </mui.CardActions>
        </mui.Card>
        </>
    )
  }
}

class Storage extends React.Component<{}, {files: any, tasks: any, message: string, sendSnackbar: boolean}>{
  constructor(props: any){
    super(props)
    this.state = {files: [], tasks: {}, message: "", sendSnackbar: false}
    this.taskHandler = this.taskHandler.bind(this)
    this.fileStatus = this.fileStatus.bind(this)
  }

  async componentDidMount(){
    let r = await Funcs.request('/v2/system', {type: "get_tasks"})
    this.setState({tasks: r.tasks})
    r = await Funcs.request('/v2/storage', {type: "get_files"})
    this.setState({files: r})
  }

  async taskHandler(name: string, type: string){
    if(type == "start"){
      let r = await Funcs.request('/v2/system',
        {type: 'start_task',
        origin: name,
        activity: "Running",
        username: localStorage.getItem("username")
        })
        
      if(r.type === "OK"){
        this.setState({tasks: r.tasks, sendSnackbar: true, message: "Task started."})
      } else{
        this.setState({sendSnackbar: true, message: `ERROR: ${r.message}`})
      }
    }

    if(type == "stop"){
      let payload = {
        type: 'stop_task',
        origin: name,
        activity: "Running",
      }
      if(payload.origin == "cracker.exe"){
        payload.activity = "ALL"
      }
      let r = await Funcs.request('/v2/system', payload)

      if(r.type === "OK"){
        this.setState({tasks: r.newTasks, sendSnackbar: true, message: "Task stopped."})
      } else{
        this.setState({sendSnackbar: true, message: `ERROR: ${r.message}`})
      }
    }

    if(type == "upgrade"){
      let r = await Funcs.request('/v2/system',
      {type: 'start_task',
      origin: name,
      activity: "Upgrading",
      username: localStorage.getItem("username")
      })

      if(r.type === "OK"){
        this.setState({tasks: r.tasks, sendSnackbar: true, message: `Upgrade started.`})
      } else{
        this.setState({sendSnackbar: true, message: `ERROR: ${r.message}`})
      }
    }

    if(type == "stop_upgrade"){
      let r = await Funcs.request('/v2/system',
      {type: 'stop_task',
      origin: name,
      activity: "Upgrading",
      username: localStorage.getItem("username")
      })

      if(r.type === "OK"){
        this.setState({tasks: r.newTasks, sendSnackbar: true, message: `Upgrade stopped.`})
      } else{
        this.setState({sendSnackbar: true, message: `ERROR: ${r.message}`})
      }
    }

  }

  fileStatus(name: string){
    let status = {
      running: false,
      upgrading: false
    }
    if(this.state.tasks == undefined){
      return status
    }
    
    if(this.state.tasks[name] != undefined){
      console.log(this.state.tasks[name])
      for(let activity in this.state.tasks[name].activities){
        activity = this.state.tasks[name].activities[activity]
        if(activity == "Running" || activity.startsWith("Cracking")){
          status.running = true
        }
        if(activity == "Upgrading"){
          status.upgrading = true
        }
      }
    }
    return status
  }

  handleClose(){
    this.setState({sendSnackbar: false})
  }

	render(){
	return(
		<div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />
        
        {this.state.sendSnackbar?
        <Snackbar
          message={this.state.message}
          handleClose={() => this.setState({sendSnackbar: false})}
        />
        :""}

        <div style={{display: "grid", alignContent: "flex-start", gridTemplateColumns: "auto auto auto auto auto"}}>
	        {
	        this.state.files.length !== 0
	        ?
	        (<>
	            {this.state.files.map((file: any) =>{
	                return <><File
                  filename={file.filename}
                  content={file.content}
                  size={file.size}
                  version={file.version}
                  taskHandler={this.taskHandler}
                  fileStatus={this.fileStatus}
                  /></>
	            })}
	        </>)
	        :
	        <mui.Skeleton style={{marginTop: "10px", marginLeft: "10px"}} variant="rounded">
            <><File
              filename="file.filename"
              content="file.content"
              size="file.size"
              version="file.version"
              taskHandler="this.taskHandler"
              fileStatus="this.fileStatus"
            /></>
          </mui.Skeleton>
	        }
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
		</div>
	)
	}
}

export default Storage;
