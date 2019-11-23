import React from 'react'

let obj={"id":"1"}
export default class Parent extends React.Component{


outputmsg()
{
    this.props.logmsg("child")
}

    render()
    {
        return(
            <div>
                child Comp 
               <button onClick={()=>this.outputmsg()}>
                   child button
                   </button>
                </div>
        )

    }
}