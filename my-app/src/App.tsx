import React from 'react'
import { Login } from './Login'
import Home from './Home'

class App extends React.Component{
    constructor(props: any){
        super(props)
    }

    render(){
        return(
            localStorage.getItem("username")
            ?
            <Home/>
            :
            <Login/>
        )
    }
}

export default App;