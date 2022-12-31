import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"



class Switch extends React.Component<{name:String ,content:String,status: boolean, oncheck: Function}> {

    render(){
    return(
    
    <mui.Card style= {{border:"white solid 1px"}}>   
    <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
    
    <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        
        <mui.Typography variant="h6" gutterBottom>{this.props.name}</mui.Typography>
        <mui.Switch
            
            onChange={this.props.oncheck.bind(this)}
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


/* this class is bugged, do not expect it to work properly. */
class SelectSetting extends React.Component<{name:String ,content:String,options: any,selected_value:any,label: string, oncheck: Function}>{

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
            
                <mui.Select value={this.props.selected_value} label={this.props.label} onChange={this.props.oncheck.bind(this)}>
                {
                this.props.options != null && this.props.options.length !== 0
                ?
                (<>
                    {this.props.options.map((option: any, key:any) =>{
                        return  <div style={{marginLeft:'20px'}}><MySelect option={option} key={key}/></div>
                    })}
                </>)
                :
                ""
                }
                </mui.Select>
            </mui.FormControl>
        
        </mui.ListItem>
        
            <mui.Typography style={{marginTop:"8px",marginLeft:"8px"}} variant="body1" gutterBottom>{this.props.content}</mui.Typography>

    
    </mui.List>
    </mui.Card>     
    
    )
    }
}
class MySelect extends React.Component<{option:string}> {
    render(){
        return(
            <mui.MenuItem>{this.props.option}</mui.MenuItem>
        )
    }
}


class CheckSetting extends React.Component<{name:String ,content:String,labels_checked: any,oncheck: Function}>{

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
                        return  <div style={{marginLeft:'20px'}}><Check label={label_check[0]} checked={label_check[1]} oncheck={this.props.oncheck}/></div>
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
class Check extends React.Component<{label:string,checked:boolean,oncheck:Function}> {
    render(){
        return(
            <mui.FormControlLabel control={<mui.Checkbox />} label={this.props.label} onChange={this.props.oncheck.bind(this)}/>
        )
    }
}


class Radioetting extends React.Component<{name:String ,content:String,labels_checked:any, oncheck: Function}>{

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
                        return  <div style={{marginLeft:'20px'}}><Radio label={label_check[0]} checked={label_check[1]} oncheck={this.props.oncheck}/></div>
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
class Radio extends React.Component<{label:string,checked:boolean,oncheck:Function}> {
    render(){
        return(
            <mui.FormControlLabel control={<mui.Radio />} label={this.props.label} onChange={this.props.oncheck.bind(this)}/>
        )
    }
}



class Settings extends React.Component{
    
    handleChangeBool() {
        console.log("hhelo")
    }        
    handleChangeSelect(element:any, new_element:any) {
        console.log("hhelo2")
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

        <mui.Card variant="outlined" style= {{marginLeft:"16px",marginTop:"12px",border:"white solid 1px", width:"40vw",overflowY:'auto',maxHeight:'85vh'}}>      
        
        <Switch name='Dark mode' content='description example number 1' status={true} oncheck={this.handleChangeBool.bind(this)}/>
        <Switch name='Femboy mode' content=':)' status={true} oncheck={this.handleChangeBool.bind(this)}/>
        <SelectSetting name='Femboy mode' content=':)' options= {['test1','test2','test3']} selected_value={'test1'} label='testing of test'oncheck={this.handleChangeSelect.bind(this)}/>
        <CheckSetting oncheck={this.handleChangeSelect.bind(this)} name='Checking deez settings' content='smthsmthsmth' labels_checked={[['label1 is true',true],['label2 is false',false],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true],['labels are scalable easely',true]]}/>
        <Radioetting oncheck={this.handleChangeSelect.bind(this)} name='Radioing deez settings' content='htmshtsmhtsm' labels_checked={[['option one is selected',true],['option two isnt',false],['ayo this sheet is scalable',false],['ayo this sheet is scalable',false],['ayo this sheet is scalable',false],['ayo this sheet is scalable',false],['ayo this sheet is scalable',false],['ayo this sheet is scalable',false]]}/>
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