
//const { render } = ReactDOM;
import React from 'react';
export default class Parent extends React.Component {
    render() {
        return (
            <div>
                <Child ref={instance => { this.child = instance; }} />
                <button onClick={() => { this.child.getAlert(); }}>Click</button>
            </div>
        );
    }
}

class Child extends React.Component {
    getAlert() {
        alert('clicked');
    }

    render() {
        return (
            <h1>Hello</h1>
        );
    }
}


// render(
//     <Parent />,
//     //  document.getElementById('app')
// );