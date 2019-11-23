import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Comman Component
import SignIn from "../signIn/signin";
//import MainPage from '../Dashboard/main';
import { createBrowserHistory } from "history";

// Components
import Header from "../Header/Header";
import Dashboard from "../Dashboard/dashboard";

import List_Categories from "../FreshCakeComponents/CategoriesMaster/List_Categories";
import Form_Categories from "../FreshCakeComponents/CategoriesMaster/Form_Categories";

import List_SubCategories from "../FreshCakeComponents/SubCategoriesMaster/List_SubCategories";
import Form_SubCategories from "../FreshCakeComponents/SubCategoriesMaster/Form_SubCategories";

import List_Address from "../FreshCakeComponents/AddressMaster/List_Address";

import List_Orders from "../FreshCakeComponents/OrderMaster/List_Orders";

import List_Banners from "../FreshCakeComponents/BannersMaster/List_Banners";
import Form_Banners from "../FreshCakeComponents/BannersMaster/Form_Banners";

import List_Prices from "../FreshCakeComponents/SubCategoriesMaster/List_Prices";

import List_User from "../FreshCakeComponents/UserMaster/List_User";
import Form_User from "../FreshCakeComponents/UserMaster/Form_User";

import List_OrderMaterial from "../FreshCakeComponents/OrderMaterial/List_OrderMaterial";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: false
    };
  }

  componentWillMount() {
    //console.log('componentWillMount---------------');
    // console.log(this.props.location);

    // console.log('componentWillMount---------------');

    if (sessionStorage.getItem("token")) {
      this.toggleHeader();
    }
  }

  toggleHeader() {
    this.setState({
      showHeader: true
    });
  }

  hideHeader() {
    this.setState({
      showHeader: false
    });
  }

  render() {
    const DashboardWithProps = () => (
      <Dashboard toggleHeader={this.toggleHeader.bind(this)} />
    );
    return (
      <Router history={createBrowserHistory()}>
        <div>
          {this.state.showHeader ? (
            <Header history={createBrowserHistory()} />
          ) : null}
          <Route exact path="/" component={SignIn} />
          <Route path="/Dashboard" render={DashboardWithProps} />
          {/* Kissan farm app Routes */}
          <Route path="/Addresses" component={List_Address} />
          <Route path="/Categories" component={List_Categories} />
          <Route path="/formCategories" component={Form_Categories} />
          <Route path="/SubCategories" component={List_SubCategories} />
          <Route path="/formSubCategories" component={Form_SubCategories} />
          <Route path="/Prices" component={List_Prices} />
          <Route path="/Orders" component={List_Orders} />
          <Route path="/Banners" component={List_Banners} />
          <Route path="/formBanners" component={Form_Banners} />
          <Route path="/Users" component={List_User} />
          <Route path="/formUser" component={Form_User} />
          <Route path="/OrderMaterial" component={List_OrderMaterial} />
        </div>
      </Router>
    );
  }
}
