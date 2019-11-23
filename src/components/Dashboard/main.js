import React, { Component } from 'react';
import PropTypes from 'prop-types';


// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import LocalShipping from '@material-ui/icons/LocalShipping';
import DirectionsCarOutlined from '@material-ui/icons/DirectionsCar';
import ArrowForwardRounded from "@material-ui/icons/ArrowForwardRounded";

// core component
import GridContainer from "../../customComp/Grid/GridContainer.jsx";
import GridItem from "../../customComp/Grid/GridItem";
import Card from "../../customComp/Card/Card.jsx";
import CardHeader from "../../customComp/Card/CardHeader.jsx";
import CardIcon from "../../customComp/Card/CardIcon.jsx";
import CardFooter from "../../customComp/Card/CardFooter.jsx";

import dashboardStyle from "./dashboardStyle";
import { Link } from "react-router-dom";

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.props.hideHeader();
    }

    render() {
        const { classes } = this.props;
        console.log(classes);

        return (
            <div className={classes.root}>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                                <CardIcon color="warning">
                                    <LocalShipping />
                                </CardIcon>
                                <p className={classes.cardCategory}>Lorry Management</p>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    Go to Lorry Management
                                    </div>
                                <Link to={'/lorrydashboard'}>   <ArrowForwardRounded /></Link>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="primary" stats icon>
                                <CardIcon color="primary">
                                    <DirectionsCarOutlined />
                                </CardIcon>
                                <p className={classes.cardCategory}>Fleet Management</p>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    Go to Fleet Management
                                </div>
                                <Link to={'/fleetdashboard'}>
                                    <ArrowForwardRounded />
                                </Link>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

MainPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(MainPage);