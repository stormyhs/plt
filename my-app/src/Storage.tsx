import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"
import Funcs from './Funcs'
import { Link } from "react-router-dom";


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

class File extends React.Component<{filename: string, content: string}, {open: boolean, name: string}>{
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

  render(){
    return(
        <>
        <mui.Card id={this.props.filename} style={{width: "17vw", marginLeft: "10px", marginTop: "10px"}}>
          <Link id={"link-" + this.props.filename} to={"/editor?filename=" + this.state.name}>
          <mui.CardActionArea>
            <mui.CardContent>
              <mui.Typography id={"title-" + this.state.name} gutterBottom variant="h5" component="div">
                {this.state.name}
              </mui.Typography>
              <mui.Typography variant="body2" color="text.secondary">
                {/*{this.props.content}*/}
                {"2 MB - RUNNING"}
              </mui.Typography>
            </mui.CardContent>
          </mui.CardActionArea>
          </Link>
          <mui.CardActions>
          {this.state.name.split(".")[this.state.name.split(".").length - 1] === "ls"
          ?
            <mui.Button size="small" color="primary">
              Compile
            </mui.Button>
          :
          ""}
          {this.state.name.split(".")[this.state.name.split(".").length - 1] === "exe"
          ?
            <mui.Button size="small" color="primary">
              Run
            </mui.Button>
          :
          ""}
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

            <mui.Button size="small" color="primary"
            onClick={this.delete.bind(this)}>
              Delete
            </mui.Button>
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
	                return  <><File filename={file.filename} content={file.content}/></>
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