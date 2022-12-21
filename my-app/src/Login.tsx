import React from 'react';
import Funcs from './Funcs'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"
import './App.css';

interface FuckOff{
    login: boolean;
    error: boolean;
    news: any;
    status: any;
}

export class Login extends React.Component<{}, FuckOff>{
    constructor(props: any){
        super(props)
        this.state = {login: true, error: false, news: [], status: []}
        this.getNews()
    }

    async getNews(){
        let r = await Funcs.request('/api/news', {})
        console.log(r)
        this.setState({news: r.news, status: r.status})
    }

    async handleClick(e: any){
        let payload = {
            username: (document.getElementById(`username`) as HTMLInputElement).value,
            password: (document.getElementById(`password`) as HTMLInputElement).value
        }
        let r = await Funcs.request(`/api/${this.state.login ? "login" : "register"}`, payload)
        console.log(r)
        if(r.type === "ERROR"){
            this.setState({error: true})
        } else{
            localStorage.setItem("username", r.username)
            window.location.assign("/home")
            this.setState({error: false})
        }
    }

    onKeyDown(e: any){
      if(e.key == "Enter"){
        if(e.target.id == "password"){
          (document.getElementById("send") as HTMLButtonElement).click()
        }
      }
    }

    changeMode(e: any){
        this.setState({login: !this.state.login})
    }

    render(){

    const CssTextField = styled(mui.TextField)({
    textAlign: "center",
    '& label':{
        color: 'white'
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'cyan',
        },
    },
    });

    let LoginButton = styled(mui.Button)({
        color: "white",
        borderColor: "white",
        '&:active':{
            borderColor: "cyan"
        },
        '&:hover':{
            borderColor: "cyan"
        }
    })

    return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <div style={{marginTop: "30vh", display: "flex", justifyContent: "center"}}>
                <mui.Paper elevation={3}>
                <mui.Box style={{padding: "25px"}}>
                    <h1 style={{display: "flex", justifyContent: "center"}}>{this.state.login ? "Log in" : "Sign up"}</h1>
                    
                    <CssTextField style={{display: "flex", justifyContent: "center"}} autoFocus={true} id="username" variant="outlined" label="Username" InputProps={{style: {color: "white"}}}></CssTextField>
                    <br/>
                    <CssTextField style={{display: "flex", justifyContent: "center"}} id="password" type='password' onKeyDown={this.onKeyDown.bind(this)} variant="outlined" label="Password" InputProps={{style: {color: "white"}}}></CssTextField>
                    
                    <div style={{display: "flex", justifyContent: "center"}}>
                    <LoginButton
                        style={{marginTop: "20px"}}
                        id="send"
                        variant={this.state.error ? "contained" : "outlined"}
                        color='error'
                        onClick={this.handleClick.bind(this)}>{this.state.login ? "Log in" : "Sign up"}
                    </LoginButton>
                    </div>
                    
                    <h3 id="switch-mode" className='clickable' style={{textAlign: "center"}} onClick={this.changeMode.bind(this)}>{this.state.login ? "Don't have an account?" : "Already have an account?"}</h3>
                </mui.Box>
                </mui.Paper>
            
                <div style={{marginLeft: "10vw"}}>
                <mui.Paper elevation={3}>
                <mui.Box style={{padding: "25px"}}>
                    <h1> News </h1>
                    {
                    this.state.news != null && this.state.news.length != 0
                    ?
                    (<div>
                        
                        {this.state.news.map((news: any) =>{
                            return <h2>{news}</h2>
                        })}
                    </div>)
                    :
                    <h2>No news.</h2>
                    }

                    {
                    this.state.status != null && this.state.status.length != 0
                    ?
                    (<div>
                        <h1> Status </h1>
                        {this.state.status.map((status: any) =>{
                            return <div><mui.Alert severity={status.severity} variant='filled'>{status.message}</mui.Alert><br/></div>
                        })}
                    </div>)
                    :
                    ""
                    }
                </mui.Box>
                </mui.Paper>
                </div>

            </div>
        </mui.ThemeProvider>
        </div>
    )
  }
}

