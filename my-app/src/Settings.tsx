import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'



class Switch extends React.Component<{status: boolean, changed: Function}> {

    render(){
    return(
        <>
        <mui.Switch
            /*checked={this.props.status}*/
            onChange={this.props.changed.bind(this)}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
        />
        </>
    )
    }
}

class Setting extends  React.Component<{name:String ,content:String, changed: Function, status:boolean}>{

    render(){
    return(
    
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex"}}>
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
        <Switch status={this.props.status} changed={this.props.changed.bind(this)}/>
        
    </mui.ListItem>
    
        <mui.Typography style={{marginTop:"-12px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>

    </mui.Card> 
    )
    }
}

class Settings extends React.Component{
    
    handleChange() {
        console.log("hhelo")
    }        
    
    pushed = true

    render(){
    return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />

        <div>
        <mui.Card variant="outlined" style= {{marginLeft:"64px",marginTop:"12px",border:"white solid 1px", width:"35vw"}}>      
        
        <Setting name={"Dark mode"} content={"things become either black or white asdasdasdsad"} changed={this.handleChange.bind(this)} status={this.pushed}/>
        <Setting name={"Sidebar left/right"} content={"gugugaga"} changed={this.handleChange.bind(this)} status={this.pushed}/>
        <Setting name={"Femboy mode"} content={":)"} changed={this.handleChange.bind(this)} status={this.pushed}/>


        </mui.Card> 

        </div>





        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
    )
    }
}

export default Settings