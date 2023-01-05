import React from 'react'
import * as mui from "@mui/material/"

type RadioType = {
    title: string,
    subtitle?: string | null,
    row?:boolean,
    labels_values: string[][] ,
    onCheck: Function,
}

/**
 * Sends a notification on the screen.
 * @param {string} title The radio card title.
 * @param {string} subtitle (opt) The radio card subtitle.
 * @param {boolean} row (opt) whether the radio card is in rows
 * @param {string[[]]} labels_values The labels and values of the different choices you want to have - [[label 1, value 1],[label 2, value 2]]
 * @param {function} onCheck What onCheck will call.
 */



const OurRadio: React.FC<RadioType> = (props) => {

    return(
    <div>
        <mui.Card style= {{border:"white solid 1px"}}>   
        <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
        
            <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
                <mui.Typography variant="h6" gutterBottom>{props.title}</mui.Typography>    
            </mui.ListItem>
        
            <mui.ListItem style={{display: "flex"}}>
                <mui.FormControl style={{display: "grid", gridTemplateColumns:"auto auto",alignContent: "flex-start"}}>
                <mui.RadioGroup row={props.row}>
                {
                    props.labels_values != null && props.labels_values.length !== 0
                    ?
                    (<>
                        {props.labels_values.map((label_value: any,index) =>{
                            return  <div style={{marginLeft:'20px'}}><mui.FormControlLabel control={<mui.Radio />} value={label_value[1]} label={label_value[0]} onChange={props.onCheck.bind(this)}/></div>
                        })}
                    </>)
                    :
                    ""
                }
                </mui.RadioGroup>
                </mui.FormControl>
            </mui.ListItem>

            <mui.Typography style={{marginTop:"8px",marginLeft:"8px"}} variant="body1" gutterBottom>{props.subtitle}</mui.Typography>

        
        </mui.List>
        </mui.Card>  
    </div>
    )
}

export default OurRadio;