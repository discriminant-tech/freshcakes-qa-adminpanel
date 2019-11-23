import React from 'react'
import Child from './child'


export default class Parent extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            single_value:""
        }
        this.printmsg=this.printmsg.bind(this)
    }

printSecondMsg()
{
    console.log("patil");
    
}

    printmsg(callfrom)
    {
        console.log("sohan");
        this.printSecondMsg()
        if(callfrom==="child")
        {
        console.log("latur");
        this.setState({single_value:"done"})
        }
    }

    render()
    {
        return(
            <div>
                Parent Comp 
                <Child logmsg={this.printmsg}/>
                {this.state.single_value}
                </div>
        )

    }
}