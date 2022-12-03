import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"
import Funcs from './Funcs'
import { Link } from "react-router-dom";

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

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
      await Funcs.request('/api/storage', payload);
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

class File extends React.Component<{filename: string, content: string, size: any, version?: any, buttons?: any}, {open: boolean, name: string}>{
  constructor(props: any){
    super(props)
    this.state = {name: props.filename, open: false}
    this.rename = this.rename.bind(this)
  }

  async delete(){
    console.log("Delete on " + this.props.filename);
    let r = await Funcs.request('/api/storage', {type: 'remove_file', file: this.props.filename, username: localStorage.getItem("username")})
    console.log(r)
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
      if(this.state.name !== "cracker.exe" && this.state.name !== "hasher.exe"){
        buttons.push(<mui.Button size="small" color="primary">Run</mui.Button>)
      }
    }

    if(this.state.name === "cracker.exe" || this.state.name === "hasher.exe"){
      buttons.push(<mui.Button size="small" color="primary">Upgrade</mui.Button>)
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
                {this.state.name}
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

          </mui.CardActions>
        </mui.Card>
        </>
    )
    }
}

class Storage extends React.Component<{}, {files: any}>{
  constructor(props: any){
    super(props)
    this.state = {files: []}
  }

  async componentDidMount(){
    let r = await Funcs.request('/api/storage', {type: "get_files", username: localStorage.getItem("username")})
    this.setState({files: r})
  }

	render(){
	return(
		<div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />

        <div style={{display: "grid", alignContent: "flex-start", gridTemplateColumns: "auto auto auto auto auto"}}>
	        {
	        this.state.files != null && this.state.files.length !== 0
	        ?
	        (<>
	            {this.state.files.map((file: any) =>{
	                return  <><File filename={file.filename} content={file.content} size={file.size} version={file.version}/></>
	            })}
	        </>)
	        :
	        ""
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