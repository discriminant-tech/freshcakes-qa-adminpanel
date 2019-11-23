import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from '../Home/home';

import SignIn from '../signIn/signin'


export default class Routes extends React.Component {

    render() {
        console.log(sessionStorage.getItem('token'));

        return (

            <Router history='' >
                <div>



                    <Route exact path="/" component={SignIn} />

                    <Route path="/dashboard" component={Home} />



                </div>
            </Router>


        )
    }
}