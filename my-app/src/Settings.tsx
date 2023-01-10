import React from 'react'
import * as mui from "@mui/material/"

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import OurSwitch from './options/OurSwitch'
import OurCheckbox from './options/OurCheckbox'
import OurRadio from './options/OurRadio'
import OurDropdown from './options/OurDropdown'

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



class Settings extends React.Component{
    
    setValue:any

    handleChangeBool() {
        console.log("hhelo")
    }        
    handleChangeSelect = (event: mui.SelectChangeEvent) => {
        console.log("hhelo2")
    };        
    

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
        
        <OurSwitch title='Dark mode' subtitle='description example number 1' onCheck={this.handleChangeBool.bind(this)}/>
        <OurSwitch title='Femboy mode' subtitle=':)' onCheck={this.handleChangeBool.bind(this)}/>
        <SelectSetting name='Femboy mode' content=':)' options= {['test1','test2','test3']} selected_value={'test1'} label='testing of test'oncheck={this.handleChangeBool.bind(this)}/>
        <OurCheckbox onCheck={this.handleChangeBool.bind(this)} title='Checking deez settings' subtitle='smthsmthsmth' labels={['label1 is true','ez scalability','ez scalability','ez scalability','ez scalability','ez scalability','ez scalability','ez scalability','ez scalability']}/>
        <OurRadio onCheck={this.handleChangeBool.bind(this)} title='Radioing deez settings' subtitle='htmshtsmhtsm' labels_values={[['label 1','value 1'],['label 2','value 2'],['label 3','value 3'],['label 4','value 4'],['and so on','koumololo']]} />
        <OurDropdown onCheck={this.handleChangeSelect.bind(this)} title='Radioing deez settings' subtitle='htmshtsmhtsm' labels_values={[['label 1','value 1'],['label 2','value 2'],['label 3','value 3'],['label 4','value 4'],['and so on','koumololo']]} row={true} />
        <OurDropdown onCheck={this.handleChangeSelect.bind(this)} title='age' subtitle='htmshtsmhtsm' labels_values={[['ten',10],['twenty',20],['thirty',30],]} row={true} />
        <OurRadio onCheck={this.handleChangeBool.bind(this)} title='Radioing deez settings' subtitle='htmshtsmhtsm' labels_values={[['label 1','value 1'],['label 2','value 2'],['label 3','value 3'],['label 4','value 4'],['and so on','koumololo']]} row={true} />

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