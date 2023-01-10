import React from 'react'
import * as mui from "@mui/material/"

type DropdownType = {
    title: string,
    subtitle?: string | null,
    row?:boolean,
    labels_values: any[][] ,
    onCheck: Function,
}

/**
 * Sends a notification on the screen.
 * @param {string} title The radio card title.
 * @param {string} subtitle (opt) The radio card subtitle.
 * @param {boolean} row (opt) whether the radio card is in rows
 * @param {any[[]]} labels_values The labels and values of the different choices you want to have - [['label 1', number value 1],['label 2', 'value 2']]
 * @param {function} onCheck What onCheck will call.
 */


const OurDropdown: React.FC<DropdownType> = (props) => {

    const [currentValue, setValue] = React.useState('');

    const handleChange = (event: mui.SelectChangeEvent) => {
      setValue(event.target.value as string);
    };

    return(
    <div>
        <mui.Card style= {{border:"white solid 1px"}}>   
        <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
        
            <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
                <mui.Typography variant="h6" gutterBottom>{props.title}</mui.Typography>    
            </mui.ListItem>
        
            <mui.ListItem style={{display: "flex"}}>
            <mui.Box style={{width:'50%'}}>
            <mui.FormControl fullWidth>
            
            <mui.InputLabel>
            {props.title}
            </mui.InputLabel>
                
                <mui.Select value={currentValue} label={props.title} onChange={handleChange}>
                {
                    props.labels_values != null && props.labels_values.length !== 0
                    ?
                    (<>
                        {props.labels_values.map((label_value: any,index) =>{
                            return  <div><mui.MenuItem value={label_value[1]}>{label_value[0]}</mui.MenuItem></div>
                        })}
                    </>)
                    :
                    ""
                }
                </mui.Select>

            </mui.FormControl>
            </mui.Box>
            </mui.ListItem>

            <mui.Typography style={{marginTop:"8px",marginLeft:"8px"}} variant="body1" gutterBottom>{props.subtitle}</mui.Typography>

        
        </mui.List>
        </mui.Card>  
    </div>
    )
}

export default OurDropdown;