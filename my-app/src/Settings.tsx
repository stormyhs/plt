import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'



class Switch extends React.Component<{name:String ,content:String,status: boolean, changed: Function}> {

    render(){
    return(
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
        <mui.Switch
            /*checked={this.props.status}*/
            onChange={this.props.changed.bind(this)}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
            
        />
        
    </mui.ListItem>
    
        <mui.Typography style={{marginTop:"-12px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>

    </mui.Card> 

    )
    }
}


class Select extends React.Component<{name:String ,content:String,options: any,selected_value:any,label: string, changed: Function}>{

    render(){
    return(
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
        <mui.FormControl style={{width:'50%'}}>
            <mui.InputLabel>
            {this.props.label}
            </mui.InputLabel>
        
            <mui.Select value ={this.props.selected_value} label={this.props.label} onChange={this.props.changed.bind(this)}>
                <mui.MenuItem value={this.props.options[0]}>{this.props.options[0]}</mui.MenuItem>
                <mui.MenuItem value={this.props.options[1]}>{this.props.options[1]}</mui.MenuItem>
                <mui.MenuItem value={this.props.options[2]}>{this.props.options[2]}</mui.MenuItem>
            </mui.Select>
        </mui.FormControl>
    
    </mui.ListItem>
    
        <mui.Typography style={{marginTop:"-12px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>

    </mui.Card>     
    
    )
    }
}


class Check_setting extends React.Component<{name:String ,content:String,labels_checked: any}>{

    render(){
    return(
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
    
    </mui.ListItem>
    <mui.ListItem style={{display: "flex"}}>
        <mui.FormGroup style={{display: "grid", gridTemplateColumns:"auto auto",alignContent: "flex-start"}}>
        
        {
	        this.props.labels_checked != null && this.props.labels_checked.length !== 0
	        ?
	        (<>
	            {this.props.labels_checked.map((label_check: any) =>{
	                return  <div style={{marginLeft:'20px'}}><Check label={label_check[0]} checked={label_check[1]}/></div>
	            })}
	        </>)
	        :
	        ""
	    }

        </mui.FormGroup>
    </mui.ListItem>
        
        <mui.Typography style={{marginTop:"8px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>

    </mui.Card>     
    
    )
    }
}
class Check extends React.Component<{label:string,checked:boolean}> {
    render(){
        return(
            <mui.FormControlLabel control={<mui.Checkbox />} checked={this.props.checked} label={this.props.label}/>
        )
    }
}

class Radio_group extends React.Component<{name:String ,content:String,options: any,selected_option:any,labels: string, changed: Function}>{

    render(){
    return(
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
        <mui.FormControl style={{width:'50%'}}>
        <mui.RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
        <mui.FormControlLabel value="female" control={<mui.Radio />} label="Female" />
        <mui.FormControlLabel value="male" control={<mui.Radio />} label="Male" />
        <mui.FormControlLabel value="other" control={<mui.Radio />} label="Other" />
        </mui.RadioGroup>
        </mui.FormControl>
    
    </mui.ListItem>
    
        <mui.Typography style={{marginTop:"-12px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>

    </mui.Card>     
    
    )
    }
}


class Settings extends React.Component{
    
    handleChangeSwitch() {
        console.log("hhelo")
    }        
    handleChangeSelect(element:any, new_element:any) {
        console.log("hhelo")
        element = new_element
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

        <mui.Card variant="outlined" style= {{marginLeft:"64px",marginTop:"12px",border:"white solid 1px", width:"40vw",overflowY:'auto',maxHeight:'75vh'}}>      
        
        <Switch name='Dark mode' content='description example number 1' status={true} changed={this.handleChangeSwitch.bind(this)}/>
        <Switch name='Femboy mode' content=':)' status={true} changed={this.handleChangeSwitch.bind(this)}/>
        <Select name='Femboy mode' content=':)' options= {['test1','test2','test3']} selected_value={'test1'} label='testing of test'changed={this.handleChangeSelect.bind(this)}/>
        <Check_setting name='Checking deez settings' content='smthsmthsmth' labels_checked={[['label1 is true',true],['label2 is false',false],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true]]}/>

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