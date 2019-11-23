import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { execTransection, exportToExcel, compareDate } from '../../commonfunctions/commonfunctions';
import EnhancedTableToolbar from '../../commonfunctions/enhancedTableToolbar';
import { ActionsColumn } from '../../commonfunctions/ActionsColumn'
import { searchBanners, BannersCRUD } from "../../Queries/queries";
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
    PagingPanel
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
                { name: "BANNER_ID", title: "Banner ID" },
                { name: "BANNER_CATEGORY", title: "Banner Category " },
                { name: "BANNER_TARGET", title: "Banner Target" },
                { name: "DISPLAY_ORDER", title: "Display Order" },
                { name: "BANNER_IMAGE", title: "Banner Image Url" },


                //{ name: "USAGECOUNT", title: "USAGECOUNT" },
                // { name: 'LR_NO', title: 'LR No' },  //name : database column name  
            ],
            tableColumnExtensions: [
                { columnName: "BANNER_ID", wordWrapEnabled: true, },
                { columnName: 'BANNER_CATEGORY', wordWrapEnabled: true, },
                { columnName: "BANNER_TARGET", wordWrapEnabled: true, },
                { columnName: "DISPLAY_ORDER", wordWrapEnabled: true,  },
                { columnName: "BANNER_IMAGE", wordWrapEnabled: true,  },
            ],
            rows: '',
            single_row: {},
            openPopup: false,
            currentPage: 0,
            pageSize: 5,
            pageSizes: [5, 10, 15],
            sorting: [
                { columnName: 'BANNER_CATEGORY' },
            ],
            showSearchFrom: 'none',
            BANNER_ID: "", 
            BANNER_CATEGORY: ""
        };
        this.doActions = this.doActions.bind(this);
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.changeSorting = sorting => this.setState({ sorting });
    }

    //........on PageLoad.......
    async componentDidMount() {
        console.log("-------------componentDidMount-------------------");
        await this.populateList();
    }



    /*---------- Populate List ---------*/
    async populateList() {
        let result = await execTransection('query', searchBanners, this.setListParams())
        console.log("--------------------------------");
        console.log(result);
        this.setState({ rows: result.data.result })
    }

    /*---------- set search query variables  ---------*/
    setListParams() {
        var parameters = {
            BANNER_ID:"%" + this.state.BANNER_ID + "%",
            BANNER_CATEGORY: "%" + this.state.BANNER_CATEGORY + "%",
           
        }
        return parameters
    }


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
            BANNER_ID: "", 
            BANNER_CATEGORY: ""
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
        let result = await execTransection('mutation', BannersCRUD, this.setDeleteParams())
        this.handleClosePopup();
        if (result) {
            await this.setState({
                popmessage: "Banner Deleted Successfully!", open: true
            });
            this.populateList();
        } else {
            this.handleClosePopup();
            await this.setState({
                popmessage: "Can not delete banner", open: true
            });
        }

    }

    /*---------- set delete query variables  ---------*/
    setDeleteParams() {
        var parameters = {
            "transaction": "LOGICAL_DELETE",
            "Banners": [{
                "BANNER_ID": this.state.single_row.BANNER_ID
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
                pageurl: "/formBanners",
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
                        <EnhancedTableToolbar actions={actionsTableToolbar} onClick={this.doActions} pagetitle={"Banners"}></EnhancedTableToolbar>
                        {/* //.............Search From.............. */}
                        <div className={classes.searchformroot} style={{ display: this.state.showSearchFrom }}>
                            <form className={classes.container} noValidate autoComplete="off">
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Banner ID"
                                    className={classes.textField}
                                    value={this.state.BANNER_ID}
                                    margin="normal"
                                    onKeyPress={e => this.handleKeyPress(e)}
                                    // error={this.state.errorVIDHI_NAME ? true : false}
                                    onChange={(e) => this.setState({ BANNER_ID: e.target.value })}
                                />
                                <TextField
                                    id="standard-with-placeholder"
                                    label="Banner Category "
                                    className={classes.textField}
                                    value={this.state.BANNER_CATEGORY}
                                    margin="normal"
                                    onKeyPress={e => this.handleKeyPress(e)}
                                    // error={this.state.errorVIDHI_NAME ? true : false}
                                    onChange={(e) => this.setState({ BANNER_CATEGORY: e.target.value })}
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
                            <ActionsColumn actions={actions} onClick={this.doActions} pageurl={"/formBanners"} />

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

