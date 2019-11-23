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
import { searchSubCategories, SubCategoriesCRUD, populateSubCategoryFormDDL } from "../../Queries/queries";
import { execTransection } from '../../commonfunctions/commonfunctions';
import Snackbar from '@material-ui/core/Snackbar';
import SelectField from '../../commonfunctions/SelectField';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
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
    numberField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
    fullWidthField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 820,
    },
    errorField: {
        margin: 10,
        marginTop: 0
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

            DDL_CATEGORIES: [],
            DDL_UOM: [],
            open: false,

            CATEGORY_ID: "",
            SUBCATEGORY_ID: "",
            SUBCATEGORY_NAME: "",
            SUBCATEGORY_DESC: "",
            SUBCATEGORY_RATE: "",
            SUBCATEGORY_QUANTITY: "",
            SUBCATEGORY_UOM: "",
            SUBCATEGORY_IMAGE: "",
            DISPLAY_ORDER: "",

            errorCATEGORY_ID: "",
            errorSUBCATEGORY_ID: "",
            errorSUBCATEGORY_NAME: "",
            errorSUBCATEGORY_DESC: "",
            errorSUBCATEGORY_RATE: "",
            errorSUBCATEGORY_QUANTITY: "",
            errorSUBCATEGORY_UOM: "",
            errorSUBCATEGORY_IMAGE: "",
            errorDISPLAY_ORDER: "",

        };
    }

    async  componentDidMount() {
        this.populateDDL();
        if (this.props.location.state) {
            await this.setState({
                TCODE: 'UPDATE',
                displayForm: true,
                SUBCATEGORY_ID: this.props.history.location.state.row.SUBCATEGORY_ID,
            });
            this.populateFormData();
        }
    }


    /* ----populates DDL---------- */
    async populateDDL() {

        let result = await execTransection('query', populateSubCategoryFormDDL, this.setDropdownParams())
      
        console.log(result);
        this.setState({
            DDL_CATEGORIES: result.data.CATEGORIES.map(categories => ({
                value: categories.CODE,
                label: categories.DESC,
            })),
            DDL_UOM: result.data.UOM.map(uom => ({
                value: uom.CODE,
                label: uom.DESC,
            })),
        })
    }

    setDropdownParams() {
        var parameters = {}
        return parameters
    };

    // /*---------- Fetch Form Data ---------*/
    async populateFormData() {
        let result = await execTransection('query', searchSubCategories, this.setPopulateParameters())
        this.setState({
            TCODE: 'UPDATE',
            displayForm: true,
            CATEGORY_ID: result.data.result[0].CATEGORY_ID,
            SUBCATEGORY_ID: result.data.result[0].SUBCATEGORY_ID,
            SUBCATEGORY_NAME: result.data.result[0].SUBCATEGORY_NAME,
            SUBCATEGORY_DESC: result.data.result[0].SUBCATEGORY_DESC,
            SUBCATEGORY_RATE: result.data.result[0].SUBCATEGORY_RATE,
            SUBCATEGORY_QUANTITY: result.data.result[0].SUBCATEGORY_QUANTITY,
            SUBCATEGORY_UOM: result.data.result[0].SUBCATEGORY_UOM,
            SUBCATEGORY_IMAGE: result.data.result[0].SUBCATEGORY_IMAGE,
            DISPLAY_ORDER: result.data.result[0].DISPLAY_ORDER,

        })
    }

    // /*---------- set populate query variables  ---------*/
    setPopulateParameters() {
        var parameters = {
            SUBCATEGORY_ID: this.state.SUBCATEGORY_ID,

        }
        return parameters
    }

    // To Create and Update 
    async CRUDOperation() {
        var result = '', errorMessage = '', errors = [];
        let parameters = this.setCRUDParameters();
        try {
            result = await execGql('mutation', SubCategoriesCRUD, parameters)
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
                        errorCATEGORY_ID: errorMessage[key].errorCATEGORY_ID,
                        errorSUBCATEGORY_ID: errorMessage[key].errorSUBCATEGORY_ID,
                        errorSUBCATEGORY_NAME: errorMessage[key].errorSUBCATEGORY_NAME,
                        errorSUBCATEGORY_DESC: errorMessage[key].errorSUBCATEGORY_DESC,
                        errorSUBCATEGORY_RATE: errorMessage[key].errorSUBCATEGORY_RATE,
                        errorSUBCATEGORY_QUANTITY: errorMessage[key].errorSUBCATEGORY_QUANTITY,
                        errorSUBCATEGORY_UOM: errorMessage[key].errorSUBCATEGORY_UOM,
                        errorSUBCATEGORY_IMAGE: errorMessage[key].errorSUBCATEGORY_IMAGE,
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
            await this.setState({ popmessage: 'Sub-category Added Successfully!', open: true });
            //this.navigateToList()
        }

    };

    // set CRUD Parameters
    setCRUDParameters() {
        var parameters = {
            "transaction": this.state.TCODE,
            "SubCategories": [{
                "CATEGORY_ID": this.state.CATEGORY_ID,
                "SUBCATEGORY_ID": this.state.SUBCATEGORY_ID,
                "SUBCATEGORY_NAME": this.state.SUBCATEGORY_NAME,
                "SUBCATEGORY_DESC": this.state.SUBCATEGORY_DESC,
                "SUBCATEGORY_RATE": this.state.SUBCATEGORY_RATE,
                "SUBCATEGORY_QUANTITY": this.state.SUBCATEGORY_QUANTITY,
                "SUBCATEGORY_UOM": this.state.SUBCATEGORY_UOM,
                "SUBCATEGORY_IMAGE": this.state.SUBCATEGORY_IMAGE,
                "DISPLAY_ORDER": this.state.DISPLAY_ORDER,

            }]
        }
        return parameters
    }


    /*-----------------------navigate To List--------------------*/
    navigateToList() {
        return this.props.history.push('/SubCategories')
    };

    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
        this.navigateToList();
    };

    /*-----------------------handle Change React Select-------------------*/
    handleChange = name => value => {
        this.setState({
            [name]: (typeof value.value === 'undefined') ? '' : value.value,
        });
    };

    render() {
        const { classes } = this.props;
        if (this.state.displayForm) {
            return (
                <div>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3">
                            {this.state.SUBCATEGORY_ID ? "Edit Sub-Category" : "Add Sub-Category"}
                        </Typography>
                        <form className={classes.container} noValidate autoComplete="off">

                            <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                {this.state.CATEGORY_ID ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}> Category Name </FormLabel> : ""}
                                <SelectField
                                    className={classes.selectField}
                                    options={this.state.DDL_CATEGORIES}
                                    component={TextField}
                                    value={this.state.DDL_CATEGORIES.filter(data => data.value === this.state.CATEGORY_ID)}
                                    onChange={() => this.handleChange('CATEGORY_ID')}
                                    error={this.state.errorCATEGORY_ID ? true : false}
                                    placeholder="Category Name"
                                />
                                <FormHelperText id="component-error-text">{this.state.errorCATEGORY_ID ? this.state.errorCATEGORY_ID : ''}</FormHelperText>
                            </FormControl>


                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Sub-Category Name"
                                    className={classes.textField}
                                    value={this.state.SUBCATEGORY_NAME}
                                    margin="normal"
                                    error={this.state.errorSUBCATEGORY_NAME ? true : false}
                                    onChange={(e) => this.setState({ SUBCATEGORY_NAME: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorSUBCATEGORY_NAME ? this.state.errorSUBCATEGORY_NAME : ''}</FormHelperText>
                            </FormControl>

                            <Divider />

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Sub-Category Description"
                                    className={classes.numberField}
                                    value={this.state.SUBCATEGORY_DESC}
                                    margin="normal"
                                    error={this.state.errorSUBCATEGORY_DESC ? true : false}
                                    onChange={(e) => this.setState({ SUBCATEGORY_DESC: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorSUBCATEGORY_DESC ? this.state.errorSUBCATEGORY_DESC : ''}</FormHelperText>
                            </FormControl>



                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Sub-Category Rate"
                                    className={classes.numberField}
                                    value={this.state.SUBCATEGORY_RATE}
                                    margin="normal"
                                    type="number"
                                    error={this.state.errorSUBCATEGORY_RATE ? true : false}
                                    onChange={(e) => this.setState({ SUBCATEGORY_RATE: e.target.value < 0 ? 0 : e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorSUBCATEGORY_RATE ? this.state.errorSUBCATEGORY_RATE : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Sub-Category Quantity"
                                    className={classes.numberField}
                                    value={this.state.SUBCATEGORY_QUANTITY}
                                    margin="normal"
                                    type="number"
                                    error={this.state.errorSUBCATEGORY_QUANTITY ? true : false}
                                    onChange={(e) => this.setState({ SUBCATEGORY_QUANTITY: e.target.value < 0 ? 0 : e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorSUBCATEGORY_QUANTITY ? this.state.errorSUBCATEGORY_QUANTITY : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                {this.state.SUBCATEGORY_UOM ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}> Sub-Category UOM </FormLabel> : ""}
                                <SelectField
                                    className={classes.selectField}
                                    options={this.state.DDL_UOM}
                                    component={TextField}
                                    value={this.state.DDL_UOM.filter(data => data.value === this.state.SUBCATEGORY_UOM)}
                                    onChange={() => this.handleChange('SUBCATEGORY_UOM')}
                                    error={this.state.errorSUBCATEGORY_UOM ? true : false}
                                    placeholder="Sub-Category UOM"
                                />
                                <FormHelperText id="component-error-text">{this.state.errorSUBCATEGORY_UOM ? this.state.errorSUBCATEGORY_UOM : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Sub-Category Image Url"
                                    className={classes.numberField}
                                    value={this.state.SUBCATEGORY_IMAGE}
                                    margin="normal"
                                    error={this.state.errorSUBCATEGORY_IMAGE ? true : false}
                                    onChange={(e) => this.setState({ SUBCATEGORY_IMAGE: e.target.value })}
                                />
                                <FormHelperText className={classes.errorField} id="component-error-text">{this.state.errorSUBCATEGORY_IMAGE ? this.state.errorSUBCATEGORY_IMAGE : ''}</FormHelperText>
                            </FormControl>

                            <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Dispay Order"
                                    className={classes.numberField}
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