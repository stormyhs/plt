import * as mui from "@mui/material/"

/**
 * Wraps around text like a box.
 * @param {string} primary Primary text - Big and bright.
 * @param {string} secondary Secondary text - Small and dull.
 * @param {string} tertiary Tertiary text - As secondary. Defaults to `null`
 * @param {string} color Border color. Defaults to `white`.
 */
const Block = ({primary="Title", secondary="Subtitle", tertiary=null, color="cyan", canCopy=false}) => {
    const copy_text = () => {
        if(canCopy){
            navigator.clipboard.writeText(primary)
        }
    }

    return(
        <>
        <mui.Box
        onClick={copy_text}
        style={{
            marginBottom: "10px",
            userSelect: 'none'
        }}
        sx={{
        bgcolor: 'background.paper3',
        border: 1,
        borderColor: color,
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        }}
        >

            <mui.Box sx={{color: 'text.primary', fontSize: 34, fontWeight: 'medium'}}>{primary}</mui.Box>
            <mui.Box sx={{color: 'text.secondary'}}>{secondary}</mui.Box>
            
            {tertiary?
            <mui.Box sx={{color: 'text.secondary'}}>{tertiary}</mui.Box>
            :""
            }

        </mui.Box>
        </>
    )
}

export default Block;