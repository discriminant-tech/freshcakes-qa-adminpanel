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
import { searchCategories, CategoriesCRUD } from "../../Queries/queries";
import { execTransection } from '../../commonfunctions/commonfunctions';
import Snackbar from '@material-ui/core/Snackbar';
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
        width: 400,
    },
    selectField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3,
        width: 400,
    },
    errorField: {
        margin: 10,
        marginTop: 0
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

class FormCategory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            TCODE: 'CREATE',
            displayForm: true,
            FROM_DATE: moment("20100101").format('YYYY-MM-DD'),
            TO_DATE: moment("20200202").format('YYYY-MM-DD'),
            CATEGORY_ID: "",
            CATEGORY_NAME: "",
            CATEGORY_DESC: "",
            CATEGORY_IMAGE: "",
            DISPLAY_ORDER: "",
            open: false,

            errorCATEGORY_ID: "",
            errorCATEGORY_NAME: "",
            errorCATEGORY_DESC: "",
            errorCATEGORY_IMAGE: "",
            errorDISPLAY_ORDER: "",

        };
    }

    async  componentDidMount() {
        if (this.props.location.state) {
            await this.setState({
                displayForm: true,
                CATEGORY_ID: this.props.history.location.state.row.CATEGORY_ID,
                TCODE: 'UPDATE',
            });
            this.populateFormData();
        }

    }

    /*---------- Fetch Form Data ---------*/
    async populateFormData() {
        let result = await execTransection('query', searchCategories, this.setPopulateParameters())
        this.setState({
            TCODE: 'UPDATE',
            displayForm: true,
            CATEGORY_NAME: result.data.result[0].CATEGORY_NAME,
            CATEGORY_DESC: result.data.result[0].CATEGORY_DESC,
            CATEGORY_IMAGE: result.data.result[0].CATEGORY_IMAGE,
            DISPLAY_ORDER: result.data.result[0].DISPLAY_ORDER,
        })

    }

    // /*---------- set populate query variables  ---------*/
    setPopulateParameters() {
        var parameters = {
            CATEGORY_ID: this.state.CATEGORY_ID,
            CATEGORY_NAME: "",
            CATEGORY_DESC: "",
        }
        return parameters
    }

    // To Create and Update 
    async CRUDOperation() {
        var result = '', errorMessage = '', errors = [];
        let parameters = this.setCRUDParameters();

        console.log("-------------");
        console.log(parameters);


        try {
            result = await execGql('mutation', CategoriesCRUD, parameters)
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
                        errorCATEGORY_NAME: errorMessage[key].errorCATEGORY_NAME,
                        errorCATEGORY_DESC: errorMessage[key].errorCATEGORY_DESC,
                        errorCATEGORY_IMAGE: errorMessage[key].errorCATEGORY_IMAGE,
                        errorDISPLAY_ORDER: errorMessage[key].errorDISPLAY_ORDER,
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
            await this.setState({ popmessage: 'Category Added Successfully!', open: true });
            //this.navigateToList()
        }

    };

    // set CRUD Parameters
    setCRUDParameters() {
        var parameters = {
            "transaction": this.state.TCODE,
            "Categories": [
                {
                    "CATEGORY_ID": this.state.CATEGORY_ID,
                    "CATEGORY_NAME": this.state.CATEGORY_NAME,
                    "CATEGORY_DESC": this.state.CATEGORY_DESC,
                    "CATEGORY_IMAGE": this.state.CATEGORY_IMAGE,
                    "DISPLAY_ORDER": this.state.DISPLAY_ORDER,
                }
            ]
        }
        return parameters
    }


    /*-----------------------navigate To List--------------------*/
    navigateToList() {
        return this.props.history.push('/Categories')
    };

    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
        this.navigateToList();
    };



    render() {
        const { classes } = this.props;
        if (this.state.displayForm) {
            return (
                <div>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3">
                            {this.state.CATEGORY_ID ? "Edit Category" : "Add Category"}
                        </Typography>
                        <form className={classes.container} noValidate autoComplete="off">
                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category Name"
                                    className={classes.textField}
                                    value={this.state.CATEGORY_NAME}
                                    margin="normal"
                                    error={this.state.errorCATEGORY_NAME ? true : false}
                                    onChange={(e) => this.setState({ CATEGORY_NAME: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorCATEGORY_NAME ? this.state.errorCATEGORY_NAME : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category Description"
                                    className={classes.textField}
                                    value={this.state.CATEGORY_DESC}
                                    margin="normal"
                                    error={this.state.errorCATEGORY_DESC ? true : false}
                                    onChange={(e) => this.setState({ CATEGORY_DESC: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorCATEGORY_DESC ? this.state.errorCATEGORY_DESC : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category Image Url"
                                    className={classes.textField}
                                    value={this.state.CATEGORY_IMAGE}
                                    margin="normal"
                                    error={this.state.errorCATEGORY_IMAGE ? true : false}
                                    onChange={(e) => this.setState({ CATEGORY_IMAGE: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorCATEGORY_IMAGE ? this.state.errorCATEGORY_IMAGE : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                            <TextField
                                    id="standard-with-placeholder"
                                    label="Dispay Order"
                                    className={classes.textField}
                                    value={this.state.DISPLAY_ORDER}
                                    margin="normal"
                                    type="number"
                                    error={this.state.errorDISPLAY_ORDER ? true : false}
                                    onChange={(e) => this.setState({ DISPLAY_ORDER: e.target.value < 0 ? 0 : e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorDISPLAY_ORDER ? this.state.errorDISPLAY_ORDER : ''}</FormHelperText>
                            </FormControl>

                        </form>
                        <Button variant="contained" size="large" color="primary" className={classes.button} onClick={() => this.CRUDOperation()} >
                            Save
                     </Button>
                        <Button variant="contained" size="large" className={classes.button} onClick={() => this.navigateToList()}>
                            Cancel
                     </Button>
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

FormCategory.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormCategory);