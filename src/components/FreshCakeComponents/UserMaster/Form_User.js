import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment'
import { execGql } from '../../apolloClient/apolloClient';
import { searchCategories, UserProfileCRUD } from "../../Queries/queries";
import { execTransection } from '../../commonfunctions/commonfunctions';
import Snackbar from '@material-ui/core/Snackbar';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',

    },
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },titelText: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 800,
    },
    selectField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3,
        width: 400,
    },
    formSelectControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,

    },
    formSelectLabel: {
        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    },
    formLabel: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        position: "absolute",
        fontSize: "0.75rem",
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    root: {
        ...theme.mixins.gutters(),
        marginLeft: "5%",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: "85%",
        overflowX: 'auto',
    },
    formControl: {
        //margin: theme.spacing.unit,
    }
});

class FormUSER extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            TCODE: 'CREATE',
            displayForm: true,
            FROM_DATE: moment("20100101").format('YYYY-MM-DD'),
            TO_DATE: moment("20200202").format('YYYY-MM-DD'),
            FIRST_NAME: "",
            LAST_NAME: "",
            EMAIL: "",
            PASSWORD: "",
            MOBILE_NUMBER: "",
            PROFILE_PHOTO: "",
            open: false,

            errorFIRST_NAME: "",
            errorLAST_NAME: "",
            errorEMAIL: "",
            errorPASSWORD: "",
            errorMOBILE_NUMBER: "",
            errorPROFILE_PHOTO: "",
        };
    }

    async  componentDidMount() {

        if (this.props.data) {
            await this.setState({
                displayForm: true,
                USER_ID: this.props.data.USER_ID,
                FIRST_NAME: this.props.data.FIRST_NAME,
                LAST_NAME: this.props.data.LAST_NAME,
                EMAIL: this.props.data.EMAIL,
                MOBILE_NUMBER: this.props.data.MOBILE_NUMBER,
                TCODE: 'UPDATE',
            });
            //this.populateFormData();
        }

    }

    // /*---------- Fetch Form Data ---------*/
    // async populateFormData() {
    //     let result = await execTransection('query', searchCategories, this.setPopulateParameters())
    //     this.setState({
    //         TCODE: 'UPDATE',
    //         displayForm: true,
    //         CATEGORY_ID: result.data.searchCategories[0].CATEGORYID,
    //         CATEGORY_NAME: result.data.searchCategories[0].CATEGORYNAME,
    //     })

    // }

    // /*---------- set populate query variables  ---------*/
    // setPopulateParameters() {
    //     var parameters = {
    //         CATEGORYID: this.state.CATEGORY_ID,
    //         CATEGORYNAME: this.state.CATEGORY_NAME
    //     }
    //     return parameters
    // }

    // To Create and Update 
    async CRUDOperation() {
        var result = '', errorMessage = '', errors = [];
        let parameters = this.setCRUDParameters();
        try {
            result = await execGql('mutation', UserProfileCRUD, parameters)
        }
        catch (err) {
            errors = err.errorsGql;
            errorMessage = err.errorMessageGql;
        }

        if (!result) {
            console.log(errors);
            console.log(errorMessage);
            try {
                errorMessage = JSON.parse(errorMessage);
                for (let key in errorMessage) {
                    // set Error state;
                    this.setState({
                        errorCATEGORY_NAME: errorMessage[key].errorCATEGORYNAME,
                    });
                }
            } catch (error) {
                try {
                    await this.setState({ popmessage: errorMessage.split(":")[1], open: true });
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            await this.setState({ popmessage: 'User Added Successfully!', open: true });
        }

    };

    // set CRUD Parameters
    setCRUDParameters() {
        var parameters = {
            USER_ID: this.state.USER_ID,
            FIRST_NAME: this.state.FIRST_NAME,
            LAST_NAME: this.state.LAST_NAME,
            EMAIL: this.state.EMAIL,
            MOBILE_NUMBER: this.state.MOBILE_NUMBER
        }
        return parameters
    }


    /*-----------------------navigate To List--------------------*/
    // navigateToList() {
    //     return this.props.history.push('/user')
    // };

    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
        // this.navigateToList();
    };



    render() {
        const { classes } = this.props;
        if (this.state.displayForm) {
            return (
                <div>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h6" component="h4" >
                            {/* {this.state.CATEGORY_ID ? "Edit User" : "Add User"} */}
                            Personal Information
                        </Typography>
                        <form className={classes.container} noValidate autoComplete="off">

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="First Name"
                                    className={classes.textField}
                                    value={this.state.FIRST_NAME}
                                    margin="normal"
                                    error={this.state.errorFIRST_NAME ? true : false}
                                    onChange={(e) => this.setState({ FIRST_NAME: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorFIRST_NAME ? this.state.errorFIRST_NAME : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Last Name"
                                    className={classes.textField}
                                    value={this.state.LAST_NAME}
                                    margin="normal"
                                    error={this.state.errorLAST_NAME ? true : false}
                                    onChange={(e) => this.setState({ LAST_NAME: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorLAST_NAME ? this.state.errorLAST_NAME : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Email"
                                    className={classes.textField}
                                    value={this.state.EMAIL}
                                    margin="normal"
                                    error={this.state.errorEMAIL ? true : false}
                                    onChange={(e) => this.setState({ EMAIL: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorEMAIL ? this.state.errorEMAIL : ''}</FormHelperText>
                            </FormControl>

                            {/* <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Password"
                                    className={classes.textField}
                                    value={this.state.PASSWORD}
                                    margin="normal"
                                    error={this.state.errorPASSWORD ? true : false}
                                    onChange={(e) => this.setState({ PASSWORD: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorPASSWORD ? this.state.errorPASSWORD : ''}</FormHelperText>
                            </FormControl> */}

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Mobile Number"
                                    className={classes.textField}
                                    value={this.state.MOBILE_NUMBER}
                                    margin="normal"
                                    type="number"
                                    error={this.state.errorCATEGORY_NAME ? true : false}
                                    onChange={(e) => this.setState({ MOBILE_NUMBER: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorMOBILE_NUMBER ? this.state.errorMOBILE_NUMBER : ''}</FormHelperText>
                            </FormControl>

                            {/* <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category"
                                    className={classes.textField}
                                    value={this.state.PROFILE_PHOTO}
                                    margin="normal"
                                    error={this.state.errorPROFILE_PHOTO ? true : false}
                                    onChange={(e) => this.setState({ PROFILE_PHOTO: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorPROFILE_PHOTO ? this.state.errorPROFILE_PHOTO : ''}</FormHelperText>
                            </FormControl> */}



                        {/* <Typography variant="h6" component="h4" className={classes.titelText} >
                  
                            Service Information
                        </Typography>

                            <FormGroup  className={classes.textField}>
                                <FormControlLabel
                                    control={<Checkbox  value="gilad" />}
                                    label="Gilad Gray"
                                />
                                <FormControlLabel
                                    control={<Checkbox   value="jason" />}
                                    label="Jason Killian"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox  value="antoine" />
                                    }
                                    label="Antoine Llorca"
                                />
                            </FormGroup> */}



                        </form>
                        <Button variant="contained" size="large" color="primary" className={classes.button} onClick={() => this.CRUDOperation()} >
                            Save
                     </Button>
                        {/* <Button variant="contained" size="large" className={classes.button} onClick={() => this.navigateToList()}>
                            Cancel
                     </Button> */}
                    </Paper>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}

                        open={this.state.open}
                        autoHideDuration={2000}
                        onClose={this.handleClose}
                        message={this.state.popmessage}
                    >
                    </Snackbar>
                </div>
            );
        }
        else {
            return <div className='loadingComponent'> <CircularProgress color="primary" className={classes.progress} size={50} /></div>
        }
    }
}

FormUSER.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormUSER);