import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { execTransection } from '../../commonfunctions/commonfunctions';
import { execGql } from '../../apolloClient/apolloClient';
import { getAvailableGurujis, assignGurujis } from "../../Queries/queries";
import SearchIcon from '@material-ui/icons/Search';
import HowToReg from '@material-ui/icons/HowToReg';
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import EnhancedTableToolbar from '../../commonfunctions/enhancedTableToolbar';
import { ActionsColumn } from '../../commonfunctions/ActionsColumn'

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

import PersonIcon from '@material-ui/icons/Person';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

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


class SubList_Orders extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: "ORDER_ID", title: "Order ID " },
                { name: "ORDER_SUBID", title: "Order Sub-ID" },
                { name: "CATEGORY_ID", title: "Category ID" },
                { name: "CATEGORY_NAME", title: "Category Name" },
                { name: "SUBCATEGORY_ID", title: "Sub-Category ID" },
                { name: "SUBCATEGORY_NAME", title: "Sub-Category Name" },
              //  { name: "SUBCATEGORY_DESC", title: "Sub-Category Description" },
              //  { name: "SUBCATEGORY_RATE", title: "Sub-Category Rate" },
              //  { name: "SUBCATEGORY_QUANTITY", title: "Sub-Category Quantity" },
             //   { name: "SUBCATEGORY_IMAGE", title: "Sub-Category Image Url" },

             { name: "ITEM_QUANTITY", title: "Item Qty" },
             { name: "ITEM_UOM", title: "Item UOM" },
             { name: "ITEM_RATE", title: "Item Rate" },
             { name: "ITEM_UNITS", title: "Item Units" },
             { name: "ITEM_PRICE", title: "Item Price" },
            ], 
            tableColumnExtensions: [
                { columnName: "ORDER_ID",wordWrapEnabled: true,},
                { columnName: 'ORDER_SUBID', wordWrapEnabled: true, width:150},
                { columnName: "CATEGORY_ID", wordWrapEnabled: true,width:150 },
                { columnName: 'CATEGORY_NAME', wordWrapEnabled: true, },
                { columnName: 'SUBCATEGORY_ID', wordWrapEnabled: true,width:150 },
                { columnName: 'SUBCATEGORY_NAME', wordWrapEnabled: true, },
                { columnName: 'SUBCATEGORY_DESC', wordWrapEnabled: true, },
                { columnName: 'SUBCATEGORY_RATE', wordWrapEnabled: true, },
                { columnName: 'SUBCATEGORY_QUANTITY', wordWrapEnabled: true, },
                { columnName: 'SUBCATEGORY_IMAGE', wordWrapEnabled: true, },

            ],
            rows: [],
            single_row: {},
            openPopup: false,
            currentPage: 0,
            pageSize: 5,
            pageSizes: [5, 10, 15],
            sorting: [
                { columnName: 'SUBCATEGORY_NAME' },
                { columnName: 'CATEGORY_NAME' },
            ],
           
            showSearchFrom: 'none',
           
        };
      //  this.populateBookingList = this.props.populateBookingList.bind(this)
        this.doActions = this.doActions.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.changeSorting = sorting => this.setState({ sorting });
    }

    componentDidUpdate() {
        this.setState({ rows: this.props.orderDetails, })
    }

    /*---------- do Actions Delete,Edit ---------*/
    async doActions(lable, value) {

        if (lable == "Assign Guruji") {
            this.populateGurujiProfileList(value, this.state.BOOKING_ID, "Assign")

        }
    }


    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false })
    };


    //handle guruji popup
    toggleGurujiPopup() {
        this.setState({ openPopup: !this.state.openPopup, errorAssignGuruji: "", BookedGurujisList: [] })
    }


   
   
    //-----handle the changes on guruji profile popup checkbox selection
    handleCheckboxChange(event, guruji, bookingID, bookingSubID) {
        let BookedGurujiObj =
        {
            "GURUJI_ID": guruji.GURUJI_ID,
            "BOOKING_ID": bookingID,
            "BOOKING_SUBID": bookingSubID
        }

        if (event.target.checked) {
            this.state.BookedGurujisList.push(BookedGurujiObj)
            this.setState({ BookedGurujisList: this.state.BookedGurujisList, errorAssignGuruji: "" })
        }
        else
            this.setState({ BookedGurujisList: this.state.BookedGurujisList.filter(list => list.GURUJI_ID !== guruji.GURUJI_ID), errorAssignGuruji: "" })
    }

    render() {
        const { classes, theme } = this.props;
        const { rows, columns, pageSize, pageSizes, currentPage, sorting, tableColumnExtensions } = this.state;
        const actions = [
            //     {
            //     icon: <DeleteIcon />,
            //     lable: 'Delete'
            // },
            // {
            //     icon: <EditIcon />,
            //     lable: 'Edit'
            // },

            {
                icon: <HowToReg />,
                lable: 'Assign Guruji'
            },
        ];
        const actionsTableToolbar = [
            // {
            //     icon: <SearchIcon color='primary' fontSize="medium" />,
            //     pageurl: "",
            //     lable: 'Search',
            //     display: ""
            // },
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
        const RowDetail = ({ row }) => {
            let shippingAddress=JSON.parse(row.DELIVERY_ADDRESS)
            return (
                <div className="rowdetails">
                    <table className="rowdetails">
                        <tr>
                            <td>
                                <p><b>Delivery Address{' '}</b>:{' '}
                                &nbsp; <b> User ID :</b> {shippingAddress.USER_ID}<br />
                                    &emsp;&emsp;&emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<b>Address ID : </b>:{shippingAddress.ADDRESS_ID}<br />
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;<b>Customer Name : </b>:{shippingAddress.CUSTOMER_NAME}  <br />
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>Mobile No : </b>:{shippingAddress.MOBILE_NUMBER}<br />
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>House/Building  : </b>:{shippingAddress.HOUSE_BUILDING}<br />
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>Colony/Street  : </b>:{shippingAddress.COLONY_STREET}<br />
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>Landmark : </b>:{shippingAddress.LANDMARK}<br /> 
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>City : </b>:{shippingAddress.CITY}-{shippingAddress.PINCODE}<br />
                                    &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; <b>State : </b>:{shippingAddress.STATE}<br />
                                     </p>
                            </td>

                      
                        </tr>

                       
                    </table>
                </div>)
        }



        return (
            <div >
                <Paper style={{ margin: "10px" }}>

                    <EnhancedTableToolbar actions={actionsTableToolbar} onClick={this.doActions} pagetitle={"Order Details"}></EnhancedTableToolbar>
                    {/* //...............Table Grid.......... */}
                    <Grid rows={rows} columns={columns} >
                        <PagingState
                            currentPage={currentPage}
                            onCurrentPageChange={this.changeCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={this.changePageSize}
                        />
                        <SortingState
                            sorting={sorting}
                            onSortingChange={this.changeSorting}
                        />
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
                        <RowDetailState />
                        <TableRowDetail contentComponent={RowDetail} />
                        {/* <Toolbar /> */}
                        {/* <SearchPanel /> */}
                        {/* <ActionsColumn actions={actions} onClick={this.doActions} pageurl={"/formGurujiProfile"} /> */}

                    </Grid>
                </Paper>
                
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
}

List.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SubList_Orders);

