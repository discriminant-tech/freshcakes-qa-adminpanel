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
            open:false,

            errorCATEGORY_ID: "",
            errorCATEGORY_NAME: "",
        };
    }

    async  componentDidMount() {
        if (this.props.location.state) {

            console.log(`props${this.props.history.location.state.row.CATEGORYID}`);

            await this.setState({
                displayForm: false,
                CATEGORY_ID: this.props.history.location.state.row.CATEGORYID
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
            CATEGORY_ID: result.data.searchCategories[0].CATEGORYID,
            CATEGORY_NAME: result.data.searchCategories[0].CATEGORYNAME,
        })

    }

    /*---------- set populate query variables  ---------*/
    setPopulateParameters() {
        var parameters = {
            CATEGORYID: this.state.CATEGORY_ID,
            CATEGORYNAME: this.state.CATEGORY_NAME
        }
        return parameters
    }

    // To Create and Update 
    async CRUDOperation() {
        var result = '', errorMessage = '', errors = [];
        let parameters = this.setCRUDParameters();
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
                        errorCATEGORY_NAME: errorMessage[key].errorCATEGORYNAME,
                    });
                }
            } catch (error) {
                try{
                    await this.setState({popmessage:errorMessage.split(":")[1],open:true});
                }catch(error)
                {
                    console.log(error);  
                }
            }
        }
        else {
            await this.setState({popmessage:'Save successfully!',open:true});
            //this.navigateToList()
        }

    };

    // set CRUD Parameters
    setCRUDParameters() {
        var parameters = {
            "transaction": this.state.TCODE == "CREATE" ? "CREATE" : "UPDATE",
            "categories": [{
                CATEGORYID: this.state.CATEGORY_ID,
                CATEGORYNAME: this.state.CATEGORY_NAME,
            }]
        }
        return parameters
    }


    /*-----------------------navigate To List--------------------*/
    navigateToList() {
        return this.props.history.push('/vidhiBookings')
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
                            {this.state.CATEGORY_ID ? "Edit Vidhi Bookings" : "Add Vidhi Bookings"}
                        </Typography>
                        <form className={classes.container} noValidate autoComplete="off">
                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category"
                                    className={classes.textField}
                                    value={this.state.CATEGORY_NAME}
                                    margin="normal"
                                    error={this.state.errorCATEGORY_NAME ? true : false}
                                    onChange={(e) => this.setState({ CATEGORY_NAME: e.target.value })}
                                />
                                <FormHelperText id="component-error-text">{this.state.errorCATEGORY_NAME ? this.state.errorCATEGORY_NAME : ''}</FormHelperText>
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