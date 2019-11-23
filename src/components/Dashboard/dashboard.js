import React from 'react';
import PropTypes from "prop-types";

// @material-ui/core
import CategoryOutline from '@material-ui/icons/CategoryOutlined';
import BusinessOutline from '@material-ui/icons/BusinessOutlined';
import DeviceHubOutline from '@material-ui/icons/DeviceHubOutlined';
import PeopleOutline from '@material-ui/icons/PeopleOutlined'
import withStyles from "@material-ui/core/styles/withStyles";
import AccessTime from "@material-ui/icons/AccessTime";
import ArrowForwardRounded from "@material-ui/icons/ArrowForwardRounded";


// core components
import GridItem from "../../customComp/Grid/GridItem";
import GridContainer from "../../customComp/Grid/GridContainer.jsx";
import Table from "../../customComp/Table/Table.jsx";
import Card from "../../customComp/Card/Card.jsx";
import CardHeader from "../../customComp/Card/CardHeader.jsx";
import CardIcon from "../../customComp/Card/CardIcon.jsx";
import CardBody from "../../customComp/Card/CardBody.jsx";
import CardFooter from "../../customComp/Card/CardFooter.jsx";

import CircularProgress from '@material-ui/core/CircularProgress';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";
import dashboardStyle from "./dashboardStyle";

// import { getTaskDashboard } from "../Queries/queries";
// import { execTransection } from '../commonfunctions/commonfunctions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            completed: 0,
            percentage: 66,
            displayComp: true,

            TOTAL_CATEGORIES:'',
            TOTAL_COMPANIES:'',
            TOTAL_DEPARTMENTS:'',
            TOTAL_EMPLOYEES:'',

            TASK_COMPLETE:'60',
            TASK_PENDING:'40',

        }
    }

    async  componentDidMount() {
        console.log('dashboard');
        console.log(this.props);
        await this.setState({ displayComp: true });
        this.props.toggleHeader();
        //this.populateDashboardData();
    }

//     /*---------- Fetch Dashboard Data ---------*/
//    async populateDashboardData() {
//        let result = await execTransection('query', getTaskDashboard)
//        await this.setState({
//         TOTAL_CATEGORIES:result.data.result.CARDS.TOTAL_CATEGORIES,
//         TOTAL_COMPANIES:result.data.result.CARDS.TOTAL_COMPANIES,
//         TOTAL_DEPARTMENTS:result.data.result.CARDS.TOTAL_DEPARTMENTS,
//         TOTAL_EMPLOYEES:result.data.result.CARDS.TOTAL_EMPLOYEES,
//         TASK_STATS: result.data.result.GRIDS.TASK_STATS,
//         TOP_TASKS: result.data.result.GRIDS.TOP_TASKS,
//         displayComp: true
//        });
//        console.log(result);
//   }

    render() {
        const { classes } = this.props;
        if (this.state.displayComp) {
            return (
                <div className={classes.root}>


                    <GridContainer>
                        <GridItem xs={12} sm={6} md={6} style={{margin: "auto"}}>
                            <Card style={{margin: "auto"}}>
                                <CardHeader stats icon>
                                    <CardIcon color="primary">
                                        <CategoryOutline />
                                    </CardIcon>
                                    <p className={classes.cardCategory}> Dashboard </p>
                                    <h3 className={classes.cardTitle}>Coming Soon...!</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                        Stay Tuned
                                </div>
                                    <Link to={'#'}>   <ArrowForwardRounded /></Link>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>    

                 {/* <GridContainer>
                        <GridItem xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader color="primary" stats icon>
                                    <CardIcon color="primary">
                                        <CategoryOutline />
                                    </CardIcon>
                                    <p className={classes.cardCategory}>Total Category</p>
                                    <h3 className={classes.cardTitle}>{this.state.TOTAL_CATEGORIES}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                        See Category
                                </div>
                                    <Link to={'/category'}>   <ArrowForwardRounded /></Link>
                                </CardFooter>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader color="success" stats icon>
                                    <CardIcon color="success">
                                        <BusinessOutline />
                                    </CardIcon>
                                    <p className={classes.cardCategory}>Total Company</p>
                                    <h3 className={classes.cardTitle}>{this.state.TOTAL_COMPANIES}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                        See Company
                                </div>
                                    <Link to={'/company'}>   <ArrowForwardRounded /></Link>
                                </CardFooter>
                            </Card>
                        </GridItem>

                        <GridItem xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader color="info" stats icon>
                                    <CardIcon color="info">
                                       <DeviceHubOutline/>
                                    </CardIcon>
                                    <p className={classes.cardCategory}>Total Department</p>
                                    <h3 className={classes.cardTitle}>{this.state.TOTAL_DEPARTMENTS}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                    See Department
                                </div>
                                <Link to={'/department'}>   <ArrowForwardRounded /></Link>
                                </CardFooter>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3}>
                            <Card>
                                <CardHeader color="danger" stats icon>
                                    <CardIcon color="danger">
                                       <PeopleOutline/> 
                                    </CardIcon>
                                    <p className={classes.cardCategory}>Total Employee</p>
                                    <h3 className={classes.cardTitle}>{this.state.TOTAL_EMPLOYEES}</h3>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                    See Employee
                                </div>
                                <Link to={'/employee'}>   <ArrowForwardRounded /></Link>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>
                    

                    <GridContainer>
                        <GridItem xs={12} sm={6} md={3} style={{marginLeft:"40%"}}>
                            <Card>
                                <CardHeader>
                                    <div style={{ width: '100px', marginTop: "10%", float: 'left' }}>
                                        <CircularProgressbar
                                            percentage={this.state.TASK_COMPLETE}
                                            text={`${this.state.TASK_COMPLETE}/${this.state.TASK_PENDING}`}
                                            strokeWidth={12}
                                            styles={{
                                                path: {
                                                    transform: 'rotate(90deg)',
                                                    transformOrigin: 'center center',
                                                },
                                                text: {
                                                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                                    fontWeight: "20px"
                                                },

                                            }}
                                        />
                                    </div>

                                    <div style={{ marginTop: '25%', marginLeft: '50%', fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }}>
                                        <img style={{ height: 15, width: 15, marginRight: '10%' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAT3SURBVGhD3VpdjxRFFJ2IL/oifryo4IOJOz2zrMbwYEQN/gCNG6Py4oImqD+BoGB1D0R90E0QklUSnnSJDqJBDV3Va7IJJv4B1IToL2BXZDV+wDLqOTV3d7uqe2dnxp6ZhpPczEzdW/ee6vroW1VTKQp1NXdfEJo9NaWP1ZRJ8P2nQJlLgdJX24LvKKOuFpqjKNs9fkhvleqjBcmD2AEQ/AHk/u1HWBeyn77E7fBQbSQTePIn0YhreeT6kravWfTcNgkzOIyp+bvw9E6gEf9kiBQnLTTqePDW3J0StliA/CRkMSdwSvQCSHyGzzfqyjwXRMnOoGG2W8H3epQ8Tx1sT3fnS09K+P+PnWr+Zjg+mg20KkvopZkgih+tKHWTVNsYsK0qvQOEP6QPz2db2PNKT5OD1OoP29WXt8LhV5kA7SCXOdHvf2fuNjHvGxNvf307VrE34e+3vFhBqM9see+7W8S8N7ARcPBtvmPzaXA4vltMC0NVJfcg5qncmMqcIycx7Q7sSj6FjLPQ/FFV5iUxGxgClexFj/+Zja/PVJrNTWK2MdD6930ncLxYi8wjYjJwcM7hwf2Sw2NaTDojUPGzMHaXV2Uu8t0hJkPDmDr7oF29HC7gFsXPiEk++J6wTz5VkcNpmD3hg7EthxQnPtiO7xlUOOFUgNRD/bKoRwbMjVd8Xly2Re1C0g5nSGGufCLqkQPLczPNDdKqNeJxUa8BjTjpGS4NYontFw8c/ubenPfMrKjbkCzWTQBV8rqoSwMMMZXmiN/LzlaApNMG6J3LD6n5zaIuDcgJ/Jx0BvN6v6jt+PvRU86IqnQA1w/SXDHpz1uFHVaOAg1hAlhSjEXmMZ/vhDq7hUvuHlehF3rKYocNcANn740fT3G1OuYUYj8hVUoLcP48zZkpFQrtYcBaQ7DxEfvSAj1yMM0Zv2MmiD+nC7mLE/vSAg97V5oz28DWueMtip8Q+9KC22aHM+c1GnLFKWzMPSz2pQU5OpyV+fuGasgNMrS8yV5T8QtiX1rkTvbrcvnliUuKs11+8cU9s7oeX4ihPsLW7U4Xwmix9CmKMpdczubFCvN5pxDCE0CpVjogyX3c58tNl1VijDnXAkyVraKEwBzmEWuqIZLGE5mNFTYvZdxY2aPVUP+e5orf+0S9ctuklx0DrAyiLg3AK3I4+ltdAorZtBFkaXXslQDcPGV6Q5mPRb0GFG7DiuUdB+mmqEcO8Dmd5gZpjTeSmqhdYBk77hmjMcleUY8M9dC8luHV6VyBx5DMW7wKIz8yxUhxT+aVuciJLyb5QCVesXl3hHqBB8piMjQwJubFrw4XcKtG5mkx6QwYTzuVIcySh3m6sv61gnlXTLpAs7kJTyJz0cMuxqLwqlgNDIyBUfCXH5+cerroIezVmzLnfGfi8BSvycS0MHCJZdKaG7Ofq7cV8AIyt2foGGs6X5obTrouUFf6DviM6NOPQyGHvi9DV4GutHMmswCsyhLzH5to9pI1w7adACJ3Wuc218bkVVuvw6kT4HDSX5p9sZMTewV8HuROs6riJ1f+MMDvqL+LOsgXuRM5LbyVUvopCV8s2kPAZp+tTODipIVGzhQxZDcEb4oQcBZPrbA/1WAeLEM+WjftGCQka96HFeX7PHLdiT5PH6X575a9GgvjKZA6AnIGcoHzAHJFBHNCX8Ac0m2beKq4JbxS+Q/6aWxE8oRwQgAAAABJRU5ErkJggg==" />
                                        Complete
                               </div>
                                    <div style={{ marginLeft: '50%', fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }}>
                                        <img style={{ height: 15, width: 15, marginRight: '10%' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASjSURBVGhD3ZrLa1RJFMaD40Y3M+ps1En2YiLILMQXzh8wwwRRszE+QJ0/QXxF3A8NUSFGyGomom1Ugouom4BCyJNA1AHRvyAPNYqviUn8fZ2TWPd0m063t7uvfvBxb9c5dc5XXXWr61Z1VVwYHBysGRgYOAgvcn+P61P4HP5v1P1T2eAF7g/09/dXW/XKwsSfho+5ny2GVvcErLGw5QPJ60h8BX6UmJj4kbjt9FKtpSkdSPYzbCPhTCAgVhJ7Gl7u6+tbY2njBUnq4XiY1BMBY1w7uJ6Ce/h2dw0NDf0q6h7bXrPd4H4pseot/deju7t7OQEvhEkcJ2ELYrfOzs4us2p5IV8atw3BrRYjKzY29XxKGqxacSDISoLdDoMHfIntNNcfzb1ojIyMrCJOE3xlsT07e3p6Vph7YaCyGvHABcyQ8mtwrbnGBnp1HfGv+3wi+e5zXWmuS4MNp84wkEiwN1wPmVvJQJ4j5Hkb5jZ2ptPpH8wtP6hw3gUQx0mwxVxKDj1z5JxwGsSUuSwOAuxGcGR65fMorDOXsgEtm8ir2SvUMgP/NJfcwFG/E5FpkUpvYNl6wkO5pcFpGl30dwantrCCyLdy2MwVAzqOel00ptXMUWCog35IXTVzxYGetNM2Ta9sNPNnYNTaacERTuIc+xRbLIaHh9ejKfI7g752M8+BwhroF4AnzZwYoOms0zgVeRWg4KRzeMk38JOZEwNpQptfzpwwc+b5+M8ZW8yUOKDtktP6cN6gYRUaNFNtzRgTCL707V5vb2/vLzIcDAv5PFbIKrbckDZ0Rn7xeU4a1RC9Yy8Uwg6rk1ig+abTfF5DS5sBC4U4nTL/xAKNZ5zmLhU+CwvhXvNPLHiGG0LNaoN6xK8wd5p/YmGvzWFDxtQjH8JCnDabf2IhjaFm2vD++2kIN9/N0PIP+z7zTyy+9LB/c9MvOrXjEmruUqHfs/rmfhD53KzCA2EhHE/6EgXNz0PNDLX9enCqw0KRsm1WL3FA3w6vVy9dGSMt9McClzKGBAKt2mINtc4t4wU++BerySS+WGlrlYa8DrXy+biZF95JpkIH2GTmxADR55zG6KuugFO7c1KvzI29BEAvTzl6418zfwYtq8XgD3DSZq440KYzlbAR08xWG8wcBcbLobNVOGLmigENf3ld8Mv7CtqGpJLfa634lik6IjvzlI3qwTeX3MCxHke/4zhGN24yl7JBOcn9wmmZofwPc1kcVEiFlY0TBCjb7opyKafToIb8bS75ocMUKmUd9MC3JDhmbiWDcpDrncstFnbQI1BJR2867vLBxOskW2eusUFTLLE7XK4MTUthR2/z0AEklXP1jAJrTm/K+9AtAeRZTbxzFjMrFyz+MHQeNsxSJPG/MfPUrn2rFpqFrJpto22H6nLNeZprOVMFD6fFQEDNZpGpOQcn8LkJte+0j+tvDMHMHwbsvkE2eEu+Qb0s4jPK9XdLHy9sCLTCaZ84LlrsljiGbF7opIiEWpvF+aeaKWL+Q6/lXnaUEiTX35yOc30UCCqUDxUjaxVbKWiljJhGRDXDuwh8AvXMfBB1rzLu78hHvvFN4VVVnwDa/m6ZBWcjZQAAAABJRU5ErkJggg==" />
                                        Pending
                               </div>
                                </CardHeader>
                                <CardFooter stats>
                                    <div className={classes.stats}>
                                        <AccessTime />
                                        Task Complete Status
                              </div>
                                </CardFooter>
                            </Card>
                        </GridItem>

                    </GridContainer> */}
                     
                </div>
            );
        }
        else {
            return <div className='loadingComponent'> <CircularProgress className={classes.progress} color="primary" size={50} /></div>
        }
    }
}
Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);