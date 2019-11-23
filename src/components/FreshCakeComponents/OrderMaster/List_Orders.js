import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { execTransection, } from '../../commonfunctions/commonfunctions';
import EnhancedTableToolbar from '../../commonfunctions/enhancedTableToolbar';
import { ActionsColumn } from '../../commonfunctions/ActionsColumn'
import { searchOrders, UpdateOrderStatus, populateORDERS_DDL } from "../../Queries/queries";
import { execGql } from '../../apolloClient/apolloClient';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/EditTwoTone';
import { getolderDate, getUpcomingDate } from '../../commonfunctions/commonfunctions'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import SelectField from '../../commonfunctions/SelectField';
import Snackbar from '@material-ui/core/Snackbar';

import {
    RowDetailState,
    SearchState,
    IntegratedFiltering,
    PagingState,
    IntegratedPaging,
    SortingState,
    IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    Toolbar,
    TableHeaderRow,
    TableRowDetail,
    PagingPanel
} from '@devexpress/dx-react-grid-material-ui';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as moment from 'moment';
import List from '@material-ui/core/List';
import SubList_Orders from './SubList_Orders';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',

    },
    input: {
        display: 'flex',
        padding: 0,
    },
    button: {
        margin: theme.spacing.unit,
    },
    errorField: {
        margin: 10,
        marginTop: 0
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3,
        width: 400,
    },
    selectField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: theme.spacing.unit * 3,
       
        width: 400,
    },
    formSelectControl: {
        marginLeft: theme.spacing.unit * 2.5,
        marginRight: theme.spacing.unit,
        paddingTop: theme.spacing.unit ,
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,

    },
    formLabel: {

        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    }, formSelectLabel: {
        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    },
    pdfField: {

        maxWidth: 'max-content'
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
    },
    searchformroot: {
        ...theme.mixins.gutters(),
        // marginLeft: "5%",
        //  paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: "85%",
        // overflowX: 'auto',

    },
});



class Orders extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: "ORDER_ID", title: "Order ID" },
                { name: "USER_ID", title: "User ID" },
                { name: "USER_NAME", title: "User Name" },
                { name: "MOBILE_NUMBER", title: "Mobile No. " },
                { name: "ORDER_DATE_FRMT", title: "Order Date" },
                { name: "TOTAL_AMOUNT", title: "Total Amount" },
                { name: "DISCOUNT", title: "Discount" },
                { name: "NET_AMOUNT", title: "Net Amount" },
              //  { name: "PAID_AMOUNT", title: "Paid Amount" },
             //   { name: "BALANCE_AMOUNT", title: "Balance Amount" },
             //   { name: "MODE_OF_PAYMENT", title: "Mode of Payment" },
                { name: "ORDER_STATUS", title: "Order Status" },
                { name: "ORDER_STATUS_DESC", title: "Order Status Description" },
            //    { name: "STATUS_DATE", title: "Status Date" },
            //    { name: "STATUS_TIME", title: "Status Time" },


            ],
            tableColumnExtensions: [
                { columnName: "ORDER_ID", wordWrapEnabled: true,  },
                { columnName: 'USER_ID', wordWrapEnabled: true , },
                { columnName: 'USER_NAME', wordWrapEnabled: true,   },
                { columnName: 'MOBILE_NUMBER', wordWrapEnabled: true,   },
                { columnName: 'ORDER_DATE_FRMT', wordWrapEnabled: true,  },
                { columnName: 'TOTAL_AMOUNT', wordWrapEnabled: true,   },
                { columnName: 'DISCOUNT', wordWrapEnabled: true,  },
                { columnName: 'NET_AMOUNT', wordWrapEnabled: true,   },
                { columnName: 'BALANCE_AMOUNT', wordWrapEnabled: true,   },
                { columnName: 'PAID_AMOUNT', wordWrapEnabled: true,   },
                { columnName: 'MODE_OF_PAYMENT', wordWrapEnabled: true,    },
                { columnName: 'ORDER_STATUS', wordWrapEnabled: true,  },
                { columnName: 'ORDER_STATUS_DESC', wordWrapEnabled: true, },
                { columnName: 'STATUS_DATE', wordWrapEnabled: true,  },
                { columnName: 'STATUS_TIME', wordWrapEnabled: true,   },

            ],
            rows: '',
            single_row: [],
            openPopup: false,
            currentPage: 0,
            pageSize: 5,
            pageSizes: [5, 10, 15],
            sorting: [
                { columnName: 'ORDER_ID' },
            ],
            showSearchFrom: 'none',

            ORDER_ID: "",
            USER_ID: "",
            USER_NAME: "",
            MOBILE_NUMBER: "",
            ORDER_STATUS: "",
            ORDER_FROM_DATE: getolderDate(3),
            ORDER_TO_DATE: getUpcomingDate(3),
            orderDetails:[],

            updateORDER_ID:"",
            updateORDER_STATUS: "",
            errorUpdateORDER_STATUS: "",

            searchStatusDDL: [],

            DDL_USERS: [],

        };
        this.populateSubList = this.populateSubList.bind(this);
        this.doActions = this.doActions.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.changeSorting = sorting => this.setState({ sorting });
    }

    //........on PageLoad.......
    componentDidMount() {
        this.populateDDL()
        this.populateList()
    }

    /*---------- Populate List ---------*/
    async populateList() {
        console.log("--------------------------------------------------------")
        let result = await execTransection('query', searchOrders, this.setListParams())
        console.log(result)
        this.setState({ rows: result.data.result })
    }

    /*---------- set search query variables  ---------*/
    setListParams() {

        var parameters = {
            "ORDER_ID": this.state.ORDER_ID,
            "USER_ID": this.state.USER_ID,
            "USER_NAME": this.state.USER_NAME,
            "MOBILE_NUMBER": this.state.MOBILE_NUMBER,
            "ORDER_STATUS": this.state.ORDER_STATUS,
            "ORDER_FROM_DATE": this.state.ORDER_FROM_DATE.split('-').join(''),
            "ORDER_TO_DATE": this.state.ORDER_TO_DATE.split('-').join(''),
        }

        return parameters
    }


    /* ----populates DDL---------- */
    async populateDDL() {
        let result = await execTransection('query', populateORDERS_DDL, this.setDropdownParams())
        console.log(result);
        this.setState({
            DDL_USERS: result.data.USERS.map(users => ({
                value: users.CODE,
                label: users.DESC,
            })),
            searchStatusDDL: result.data.ORDER_STATUS_TYPES.map(orderStatus => ({
                value: orderStatus.CODE,
                label: orderStatus.DESC,
            })),
        })
    }

    setDropdownParams() {
        var parameters = {}
        return parameters
    };


    /*---------- populate Sub List (SUBVIDHI LIST)  ---------*/
    async populateSubList() {
        let listData = await this.populateList()
        let sublistData = listData.filter(listdata => listdata.BOOKING_ID === this.state.BOOKING_ID)
        console.log(sublistData[0]);
        await this.setState({ single_row: sublistData[0].SUBVIDHI_DETAILS })
    }

    /*---------- do Actions Delete,Edit ---------*/
  async doActions(lable, value) {

        if (lable === "View Details")
            this.setState({ orderDetails: value.ORDER_DETAILS })
        else if (lable === "Search")
            this.toggleSearchForm()
        else if (lable === "Update Order Status")
         {
                this.toggleUpdateStutusPopup()
                await this.setState({
                    updateORDER_ID: value.ORDER_ID,
                })
            }
    }

    /*---------- Toggle Searc hForm ---------*/
    toggleSearchForm() {
        if (this.state.showSearchFrom === 'none') {
            this.setState({
                showSearchFrom: 'block'
            })
        } else if (this.state.showSearchFrom === 'block') {
            this.setState({
                showSearchFrom: 'none'
            })
        }
        //  this.clearSearchScreen()
    }

    /*---------- clear Search Screen ---------*/
    async clearSearchScreen() {
        await this.setState({
            ORDER_ID: "",
            USER_ID: "",
            USER_NAME: "",
            MOBILE_NUMBER: "",
            ORDER_STATUS: "",
            ORDER_FROM_DATE: getolderDate(3),
            ORDER_TO_DATE: getUpcomingDate(3),
        })
        this.populateList()
    }

    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false })
    };

    /*-----------------------populates the list on enter keypress  --------------------*/
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.populateList()
        }
    }
    /*-----------------------handle Change React Select-------------------*/
    handleChange = name => value => {
        this.setState({
            [name]: value.value,
        });

    }

      // To update Status
      async updateStatus() {
        var result = '', errorMessage = '', errors = [];
        let parameters = this.setUpdateStatusParameters();
        console.log(parameters);

        try {
            result = await execGql('mutation', UpdateOrderStatus, parameters)
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
                        errorUpdateORDER_STATUS: errorMessage[key].errorORDER_STATUS,
                        errorUpdateORDER_ID: errorMessage[key].errorORDER_ID,                   
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
            console.log(result);
            await this.setState({ popmessage: 'Status Updated Successfully!', open: true });
            this.populateList()
            this.toggleUpdateStutusPopup()
        }

    };

    // set UpdateStatus Parameters
    setUpdateStatusParameters() {
        var parameters = {
            "ORDER_ID": this.state.updateORDER_ID,
            "ORDER_STATUS": this.state.updateORDER_STATUS
        }
        return parameters
    }

    //handle UpdateStutus popup
    toggleUpdateStutusPopup() {
        this.setState({
            openPopup: !this.state.openPopup,
            updateORDER_ID:"",
            updateOrderStatus: "",
            errorUpdateORDER_STATUS:""
        })
    }

    render() {
        const { classes, theme } = this.props;
        const { rows, columns, pageSize, pageSizes, currentPage, sorting, tableColumnExtensions } = this.state;
        const actions = [
            //     {
            //     icon: <DeleteIcon style={{display:"none"}}/>,
            //     lable: 'Delete'
            // },
            {
                icon: <EditIcon />,
                lable: 'Update Order Status'
            },
            {
                icon: <RemoveRedEye />,
                lable: 'View Details'
            }

        ];
        const actionsTableToolbar = [
            {
                icon: <SearchIcon color='primary' fontSize="medium" />,
                pageurl: "",
                lable: 'Search',
                display: ""
            },
            // {
            //     icon: <PlusIcon color='secondary' fontSize="medium" />,
            //     pageurl: "/formGurujiProfile",
            //     lable: 'Add',
            //     display: '',
            // },
            // {
            //     icon: <Download fontSize="medium" margin-bottom="3px" />,
            //     pageurl: "",
            //     lable: 'ExportToExcel',
            //     display: ""
            // }
        ];
        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };
        


        if (rows) {
            return (
                <div >
                    <Paper style={{ margin: "10px" }}>
                        <EnhancedTableToolbar actions={actionsTableToolbar} onClick={this.doActions} pagetitle={"Orders"}></EnhancedTableToolbar>
                        {/* //.............Search From.............. */}
                        <div className={classes.searchformroot} style={{ display: this.state.showSearchFrom }}>
                            <form className={classes.container} noValidate autoComplete="off">

                                <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                    <TextField
                                        id="standard-with-placeholder"
                                        label="Order ID"
                                        className={classes.textField}
                                        value={this.state.ORDER_ID}
                                        margin="normal"
                                        //  error={this.state.errorCATEGORY_NAME ? true : false}
                                        onKeyPress={e => this.handleKeyPress(e)}
                                        onChange={(e) => this.setState({ ORDER_ID: e.target.value })}
                                    />
                                </FormControl>

                                <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                    {this.state.USER_ID ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}> Users  </FormLabel> : ""}
                                    <SelectField
                                        className={classes.selectField}
                                        options={this.state.DDL_USERS}
                                        component={TextField}
                                        value={this.state.DDL_USERS.filter(data => data.value === this.state.USER_ID)}
                                        onChange={() => this.handleChange('USER_ID')}
                                        onKeyPress={e => this.handleKeyPress(e)}
                                        // error={this.state.errorVIDHI_ID ? true : false}
                                        placeholder="Users"
                                    />
                                </FormControl>


                                <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                    <TextField
                                        id="date"
                                        label="From Date"
                                        type="date"
                                        value={this.state.ORDER_FROM_DATE}
                                        onKeyPress={e => this.handleKeyPress(e)}
                                        onChange={e => this.setState({ ORDER_FROM_DATE: e.target.value })}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                                    <TextField
                                        id="date"
                                        label="To Date"
                                        type="date"
                                        value={this.state.ORDER_TO_DATE}
                                        onKeyPress={e => this.handleKeyPress(e)}
                                        onChange={e => this.setState({ ORDER_TO_DATE: e.target.value })}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>

                                <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                    {this.state.ORDER_STATUS ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}>Order Status </FormLabel> : ""}
                                    <SelectField
                                        className={classes.selectField}
                                        options={this.state.searchStatusDDL}
                                        component={TextField}
                                        value={this.state.searchStatusDDL.filter(data => data.value === this.state.ORDER_STATUS)}
                                        onChange={() => this.handleChange('ORDER_STATUS')}
                                        onKeyPress={e => this.handleKeyPress(e)}
                                      //  error={this.state.errorVIDHI_ID ? true : false}
                                        placeholder="Order Status"
                                    />
                                </FormControl>

                            </form>


                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={() => this.populateList()} >
                                Search
                            </Button>
                            <Button variant="contained" size="large" className={classes.button} onClick={() => this.clearSearchScreen()}>
                                Clear
                            </Button>
                        </div>


                        {/* //...............Table Grid.......... */}
                        <Grid rows={rows} columns={columns} >
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={this.changeCurrentPage}
                                pageSize={pageSize}
                                onPageSizeChange={this.changePageSize}
                            />
                            {/* <SortingState
                                sorting={sorting}
                                onSortingChange={this.changeSorting}
                            /> */}
                            {/* <SearchState defaultValue="" /> */}
                            <SortingState />
                            <IntegratedSorting columnExtensions={sorting} />
                            <IntegratedPaging />
                            <IntegratedFiltering />
                            <Table columnExtensions={tableColumnExtensions} />
                            <TableHeaderRow showSortingControls />
                            <PagingPanel
                                pageSizes={pageSizes}
                            />
                            {/* <RowDetailState />
                            <TableRowDetail contentComponent={RowDetail} /> */}
                            {/* <Toolbar /> */}
                            {/* <SearchPanel /> */}
                            <ActionsColumn actions={actions} onClick={this.doActions} pageurl={"/formGurujiProfile"} />

                        </Grid>
                    </Paper>

                    <Paper>

                         <SubList_Orders orderDetails={this.state.orderDetails} /> 
                    </Paper>


                    <Dialog
                        open={this.state.openPopup}
                        onClose={this.handleClosePopup}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" 
                        
                    >
                        <DialogTitle id="alert-dialog-title">Update Order Status</DialogTitle>

                        <DialogContent>
                            <DialogContentText id="alert-dialog-description"style={{height:250}}>
                                <form className={classes.container} noValidate autoComplete="off" >
                                    <FormControl className={classes.formControl} error aria-describedby="component-error-text" style={{height:150}}>

                                        <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                            {this.state.updateORDER_STATUS ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}> Order Status </FormLabel> : ""}
                                            <SelectField
                                                className={classes.selectField}
                                                options={this.state.searchStatusDDL}
                                                component={TextField}
                                                value={this.state.searchStatusDDL.filter(data => data.value === this.state.updateORDER_STATUS)}
                                                onChange={() => this.handleChange('updateORDER_STATUS')}
                                                error={this.state.errorUpdateORDER_STATUS ? true : false}
                                                placeholder="Order Status"
                                            />
                                            <FormHelperText id="component-error-text">{this.state.errorUpdateORDER_STATUS ? this.state.errorUpdateORDER_STATUS : ''}</FormHelperText>
                                        </FormControl>
                                     
        
                                    </FormControl>



                                </form>
                            </DialogContentText>
                        </DialogContent>


                        <DialogActions>
                            <Button onClick={() => this.toggleUpdateStutusPopup()} color="primary">
                                Cancel
                    </Button>
                            <Button onClick={() => this.updateStatus()} color="primary" autoFocus>
                                OK
                    </Button>
                        </DialogActions>
                    </Dialog>
                    {/*.......Snackbar............  */}
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
            return <div className='loadingComponent'> <CircularProgress color="primary" size={50} /></div>
        }
    }
}

List.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Orders);

