import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { execTransection, exportToExcel, compareDate } from '../../commonfunctions/commonfunctions';
import EnhancedTableToolbar from '../../commonfunctions/enhancedTableToolbar';
import { ActionsColumn } from '../../commonfunctions/ActionsColumn'
import { searchCategories, CategoriesCRUD ,populateCATEGORIESDDL} from "../../Queries/queries";
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
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
    SearchPanel,
    TableHeaderRow,
    TableRowDetail,
    PagingPanel,
    
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
        width: 400,
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,

    },
    formLabel: {

        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    },

    formSelectLabel: {
        paddingTop: '1rem',
        position: "absolute",
        fontSize: "0.80rem",
    },
    formSelectControl: {
        marginLeft: theme.spacing.unit ,
        marginRight: theme.spacing.unit,
        //   paddingTop: theme.spacing.unit,
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
                { name: "CATEGORY_ID", title: "Category ID" ,},
                { name: "CATEGORY_NAME", title: "Category Name" },
                { name: "CATEGORY_DESC", title: "Category Description" },
                { name: "DISPLAY_ORDER", title: "Display Order" },
                { name: "CATEGORY_IMAGE", title: "Category Image Url" },


                //{ name: "USAGECOUNT", title: "USAGECOUNT" },
                // { name: 'LR_NO', title: 'LR No' },  //name : database column name  
            ],
            tableColumnExtensions: [
                { columnName: "CATEGORY_ID", wordWrapEnabled: true, },
                { columnName: 'CATEGORY_NAME', wordWrapEnabled: true,  },
                { columnName: "CATEGORY_DESC", wordWrapEnabled: true,  },
                { columnName: "DISPLAY_ORDER", wordWrapEnabled: true,  },
                { columnName: "CATEGORY_IMAGE", wordWrapEnabled: true, },
            ],
            
            rows: '',
            single_row: {},
            openPopup: false,
            currentPage: 0,
            pageSize: 5,
            pageSizes: [5, 10, 15],
            sorting: [
                { columnName: 'CATEGORY_NAME' },
            ],
            showSearchFrom: 'none',
            CATEGORY_ID: "",
            CATEGORY_NAME: "",
            CATEGORY_DESC: "",

            DDL_CATEGORIES:[]
        };
        this.doActions = this.doActions.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.changeSorting = sorting => this.setState({ sorting });
    }

    //........on PageLoad.......
     componentDidMount() {
        this.populateDDL();
         this.populateList();
    }



    /*---------- Populate List ---------*/
    async populateList() {
        let result = await execTransection('query', searchCategories, this.setListParams())
        console.log("--------------------------------");
        console.log(result);


        this.setState({ rows: result.data.result })
    }

    /*---------- set search query variables  ---------*/
    setListParams() {
        var parameters = {
            CATEGORY_ID: "%" + this.state.CATEGORY_ID + "%",
            CATEGORY_NAME: "%" + this.state.CATEGORY_NAME + "%",
            CATEGORY_DESC: "%" + this.state.CATEGORY_DESC + "%",
        }
        return parameters
    }


        /* ----populates DDL---------- */
        async populateDDL() {
            let result = await execTransection('query', populateCATEGORIESDDL, this.setDropdownParams())
            console.log(result);
            this.setState({
                DDL_CATEGORIES: result.data.result.map(categories => ({
                    value: categories.CODE,
                    label: categories.DESC,
                })),
            })
        }
    
        setDropdownParams() {
            var parameters = {}
            return parameters
        };


    /*---------- do Actions Delete,Edit ---------*/
    doActions(lable, value) {
        if (lable == "Delete") {
            this.setState({ openPopup: true, single_row: value });
        }
        else if (lable == "ExportToExcel") {
            this.exportToExcel()
        } else if (lable = "Search") {
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
            CATEGORY_NAME: "",
            CATEGORY_DESC: ""
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
    async deleteOperation() {
        let result = await execTransection('mutation', CategoriesCRUD, this.setDeleteParams())
        this.handleClosePopup();
        if (result) {
            await this.setState({
                popmessage: "Category Deleted Successfully!", open: true
            });
            this.populateList();
        } else {
            this.handleClosePopup();
            await this.setState({
                popmessage: "Can not delete category", open: true
            });
        }

    }

    /*---------- set delete query variables  ---------*/
    setDeleteParams() {
        var parameters = {
            "transaction": "LOGICAL_DELETE",
            "Categories": [{
                "CATEGORY_ID": this.state.single_row.CATEGORY_ID
            }]
        }
        return parameters
    }

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
    render() {
        const { classes, theme } = this.props;
        const { rows, columns, pageSize, pageSizes, currentPage, sorting, tableColumnExtensions } = this.state;
        const actions = [
            {
                icon: <DeleteIcon />,
                lable: 'Delete'
            },
            {
                icon: <EditIcon />,
                lable: 'Edit'
            }
        ];
        const actionsTableToolbar = [
            {
                icon: <SearchIcon color='primary' fontSize="medium" />,
                pageurl: "",
                lable: 'Search',
                display: ""
            },
            {
                icon: <PlusIcon color='secondary' fontSize="medium" />,
                pageurl: "/formCategories",
                lable: 'Add',
                display: '',
            },
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
                        <EnhancedTableToolbar actions={actionsTableToolbar} onClick={this.doActions} pagetitle={"Categories"}></EnhancedTableToolbar>
                        {/* //.............Search From.............. */}
                        <div className={classes.searchformroot} style={{ display: this.state.showSearchFrom }}>
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
                            </FormControl>
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Category Description"
                                    className={classes.textField}
                                    value={this.state.CATEGORY_DESC}
                                    margin="normal"
                                    onKeyPress={e => this.handleKeyPress(e)}
                                    // error={this.state.errorVIDHI_NAME ? true : false}
                                    onChange={(e) => this.setState({ CATEGORY_DESC: e.target.value })}
                                />
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
                            {/* <RowDetailState /> */}
                            {/* <TableRowDetail contentComponent={RowDetail} /> */}
                            {/* <Toolbar /> */}
                            {/* <SearchPanel /> */}
                            <ActionsColumn actions={actions} onClick={this.doActions} pageurl={"/formCategories"} />

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

export default withStyles(styles, { withTheme: true })(List);

