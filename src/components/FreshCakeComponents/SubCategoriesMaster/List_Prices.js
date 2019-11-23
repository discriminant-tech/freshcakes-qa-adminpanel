import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { execTransection, exportToExcel, compareDate } from '../../commonfunctions/commonfunctions';
import EnhancedTableToolbar from '../../commonfunctions/enhancedTableToolbar';
import { ActionsColumn } from '../../commonfunctions/ActionsColumn'
import { searchSubCategories, updateSubCategoryPrices, searchSubCategoryPrices } from "../../Queries/queries";
import EditIcon from '@material-ui/icons/EditTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Download from '@material-ui/icons/CloudDownload';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Snackbar from '@material-ui/core/Snackbar';
import SelectField from '../../commonfunctions/SelectField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

import {
    RowDetailState,
    SearchState,
    IntegratedFiltering,
    PagingState,
    IntegratedPaging,
    SortingState,
    IntegratedSorting,
    EditingState
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    Toolbar,
    SearchPanel,
    TableHeaderRow,
    TableRowDetail,
    PagingPanel,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { ServerUrl } from '../../ServerURL/serverURL';
import { log } from 'util';


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
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,

    }, formSelectLabel: {
        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    }, formSelectControl: {
        marginLeft: theme.spacing.unit * 2.5,
        marginRight: theme.spacing.unit,
        paddingTop: theme.spacing.unit,
    },
    formLabel: {

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


class List extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: "SUBCATEGORY_ID", title: "Sub-Category ID" },
                { name: "PRICE_ID", title: "Price ID" },
                { name: "ITEM_QUANTITY", title: "Item Quantity" },
                { name: "ITEM_UOM", title: "Item UOM" },
                { name: "ITEM_RATE", title: "Item Rate" },
                { name: "DISPLAY_ORDER", title: "Display Order" },


                //{ name: "USAGECOUNT", title: "USAGECOUNT" },
                // { name: 'LR_NO', title: 'LR No' },  //name : database column name  
            ],
            tableColumnExtensions: [
                { columnName: "SUBCATEGORY_ID", wordWrapEnabled: true, },
                { columnName: 'PRICE_ID', wordWrapEnabled: true, },
                { columnName: "ITEM_QUANTITY", wordWrapEnabled: true, },
                { columnName: "ITEM_UOM", wordWrapEnabled: true, },
                { columnName: "ITEM_RATE", wordWrapEnabled: true, },
                { columnName: "DISPLAY_ORDER", wordWrapEnabled: true, },

            ],
            editingStateColumnExtensions: [
                { columnName: 'SUBCATEGORY_ID', editingEnabled: false },
                { columnName: 'PRICE_ID', editingEnabled: false },
            ],
            rows: [],
            single_row: {},
            openPopup: false,
            currentPage: 0,
            pageSize: 10,
            pageSizes: [5, 10, 15],
            sorting: [
                { columnName: 'SUBCATEGORY_NAME' },
            ],
            showSearchFrom: 'none',
            DDL_SUBCATEGORY: [],
            SUBCATEGORY_ID: ""

        };
        this.doActions = this.doActions.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.changeSorting = sorting => this.setState({ sorting });
    }

    //........on PageLoad.......
    async componentDidMount() {
        await this.populateSubCategoryDDL();
    }



    /*---------- Populate List ---------*/
    async populateSubCategoryDDL() {
        let result = await execTransection('query', searchSubCategories, this.setListParams())
        // this.setState({ rows: result.data.result })
        console.log(result);
        this.setState({
            DDL_SUBCATEGORY: result.data.result.map(subcategories => ({
                value: subcategories.SUBCATEGORY_ID,
                label: subcategories.SUBCATEGORY_NAME,
            })),
        })
    }

    /*---------- set search query variables  ---------*/
    setListParams() {
        var parameters = {
            CATEGORY_ID: "",
            SUBCATEGORY_ID: "",
            SUBCATEGORY_NAME: "",

        }

        return parameters
    }


    /*---------- Populate List ---------*/
    async populateList() {
        let result = await execTransection('query', searchSubCategoryPrices, this.setListParams())
        this.setState({ rows: result.data.result[0].SUBCATEGORY_PRICES })
        console.log(result);

    }

    /*---------- set search query variables  ---------*/
    setListParams() {
        var parameters = {
            CATEGORY_ID: "",
            SUBCATEGORY_ID: "%" + this.state.SUBCATEGORY_ID + "%",
            SUBCATEGORY_NAME: "",
        }
        return parameters
    }


    /*---------- do Actions Delete,Edit ---------*/
    doActions(lable, value) {
        if (lable === "Delete") {
            this.setState({ openPopup: true, single_row: value });
        }
        else if (lable == "ExportToExcel") {
            this.exportToExcel()
        } else if (lable === "Search") {
            this.toggleSearchForm()
        }
        else if (lable === "Price List") {
            this.toggleSearchForm()
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
            CATEGORY_ID: "",
            SUBCATEGORY_ID: "",
            SUBCATEGORY_NAME: "",
        })
        this.populateList()
    }

    handleClosePopup = () => {
        this.setState({ openPopup: false });
    };

    /*-----------------------handle Close Snackbars--------------------*/
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false })
    };

    /*---------- delete ---------*/
    async UpdateSubCategoryPrices(prices) {
        //   console.log(this.setUpdateSubCategoryPricesParams(prices));

        let result = await execTransection('mutation', updateSubCategoryPrices, this.setUpdateSubCategoryPricesParams(prices))

        this.populateList();
        if (result) {
            await this.setState({
                popmessage: "Prices Updated Successfully!", open: true
            });
        } else {
            this.handleClosePopup();
            await this.setState({
                popmessage: "Can not update Price", open: true
            });
        }

    }

    /*---------- set delete query variables  ---------*/
    setUpdateSubCategoryPricesParams(prices) {
        let pricesList = []
        prices.map(prices => {
            let pricesObj = {
                "SUBCATEGORY_ID": prices.SUBCATEGORY_ID,
                "PRICE_ID": prices.PRICE_ID,
                "ITEM_QUANTITY": prices.ITEM_QUANTITY,
                "ITEM_UOM": prices.ITEM_UOM,
                "DISPLAY_ORDER": prices.DISPLAY_ORDER,
                "ITEM_RATE": prices.ITEM_RATE
            }
            pricesList.push(pricesObj)
        })
        var parameters = {

            "SubCategoryPrices": pricesList
        }
        return parameters
    }

    /*-----------------------populates the list on enter keypress  --------------------*/
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.populateList()
        }
    }

    commitChanges = ({ added, changed, deleted, }) => {
        let changedRows;
        if (added) {
            console.log("addd");

            //   const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            //   changedRows = [
            //     ...rows,
            //     ...added.map((row, index) => ({
            //       id: startingAddedId + index,
            //       ...row,
            //     })),
            //   ];
        }
        if (changed) {
            console.log("changed")
            console.log(changed)


            changedRows = this.state.rows.map((row, index) => {
                for (let keys in changed) {
                    if (parseInt(keys) === index) {
                        for (let changedkeys in changed[keys]) {
                            for (let rowkeys in row) {
                                if (changedkeys === rowkeys) {
                                    row[rowkeys] = changed[keys][changedkeys]
                                }
                            }
                        }
                    }
                }
                return row
            }



                //   (changed[row.id] ? { ...row, ...changed[row.id] } : row)
            );
            console.log(changedRows);
            this.UpdateSubCategoryPrices(changedRows)
        }
        if (deleted) {
            //   const deletedSet = new Set(deleted);
            //   changedRows = rows.filter(row => !deletedSet.has(row.id));
        }
        //  setRows(changedRows);
    };

    /*-----------------------handle Change React Select-------------------*/
    handleChange = name => value => {
        this.setState({
            [name]: (typeof value.value === 'undefined') ? '' : value.value,
        }, () => this.populateList());
    };

    render() {
        const { classes, theme } = this.props;
        const { rows, columns, pageSize, pageSizes, currentPage, sorting, tableColumnExtensions, editingStateColumnExtensions } = this.state;
        const actions = [
            {
                icon: <DeleteIcon />,
                lable: 'Delete'
            },
            {
                icon: <EditIcon />,
                lable: 'Edit'
            },
            {
                icon: <EditIcon />,
                lable: 'Price List',
                link: '/Prices'
            }
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
            //     pageurl: "/formSubCategories",
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



        //   if (rows) {
        return (
            <div >
                <Paper style={{ margin: "10px" }}>
                <EnhancedTableToolbar actions={actionsTableToolbar} onClick={this.doActions} pagetitle={"Sub-Category Prices"}></EnhancedTableToolbar>
                    {/* //.............Search From.............. */}
                    <div className={classes.searchformroot} >
                        <form className={classes.container} noValidate autoComplete="off">
                            <FormControl className={classes.formSelectControl} error aria-describedby="component-error-text">
                                {this.state.SUBCATEGORY_ID ? <FormLabel className={classes.formSelectLabel} style={{ color: "#303f9f" }}> Sub-Category  </FormLabel> : ""}
                                <SelectField
                                    className={classes.selectField}
                                    options={this.state.DDL_SUBCATEGORY}
                                    component={TextField}
                                    value={this.state.DDL_SUBCATEGORY.filter(data => data.value === this.state.SUBCATEGORY_ID)}
                                    onChange={() => this.handleChange('SUBCATEGORY_ID')}
                                    onKeyPress={e => this.handleKeyPress(e)}
                                    // error={this.state.errorVIDHI_ID ? true : false}
                                    placeholder="Sub-Category"
                                />
                            </FormControl>
                        </form>
                    </div>
                    {/* //...............Table Grid.......... */}
                    <Grid rows={rows} columns={columns} >
                        <PagingState
                            currentPage={currentPage}
                            onCurrentPageChange={this.changeCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={this.changePageSize}
                        />

                        <SortingState />
                        <IntegratedSorting columnExtensions={sorting} />
                        <IntegratedPaging />
                        <IntegratedFiltering />

                        <EditingState
                            columnExtensions={editingStateColumnExtensions}
                            onCommitChanges={this.commitChanges}
                        />
                        <Table columnExtensions={tableColumnExtensions} />
                        
                        <TableHeaderRow showSortingControls />
                        <TableEditRow />
                        <TableEditColumn

                            showEditCommand

                        />
                        <PagingPanel
                            pageSizes={pageSizes}
                        />
                        {/* <RowDetailState /> 
                                <TableRowDetail contentComponent={RowDetail} /> */}
                        {/* <Toolbar /> */}
                        {/* <SearchPanel /> */}
                        {/* <ActionsColumn actions={actions} onClick={this.doActions} pageurl={"/formSubCategories"} width={180} /> */}

                    </Grid>
                </Paper>
                <Dialog
                    open={this.state.openPopup}
                    onClose={this.handleClosePopup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.deleteOperation()} color="secondary" autoFocus>
                            Delete
                                </Button>
                        <Button onClick={this.handleClosePopup} color="primary">
                            Cancel
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
        //  }
        // else {
        //     return <div className='loadingComponent'> <CircularProgress color="primary" size={50} /></div>
        // }
    }
}

List.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(List);

