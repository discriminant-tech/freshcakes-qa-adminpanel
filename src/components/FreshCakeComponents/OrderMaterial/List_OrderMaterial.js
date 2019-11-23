import * as React from "react";
import PropTypes, { number } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { execTransection } from "../../commonfunctions/commonfunctions";
import EnhancedTableToolbar from "../../commonfunctions/enhancedTableToolbar";

import { getTotalOrderMaterial } from "../../Queries/queries";

import SearchIcon from "@material-ui/icons/Search";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";

import Snackbar from "@material-ui/core/Snackbar";

import {
  RowDetailState,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel
} from "@devexpress/dx-react-grid-material-ui";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import * as moment from "moment";
import List from "@material-ui/core/List";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  input: {
    display: "flex",
    padding: 0
  },
  button: {
    margin: theme.spacing.unit
  },
  errorField: {
    margin: 10,
    marginTop: 0
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    width: 400
  },
  selectField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,

    width: 400
  },
  formSelectControl: {
    marginLeft: theme.spacing.unit * 2.5,
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  formLabel: {
    paddingTop: "1rem",
    position: "absolute",
    fontSize: "0.80rem"
  },
  formSelectLabel: {
    paddingTop: "1rem",
    position: "absolute",
    fontSize: "0.80rem"
  },
  pdfField: {
    maxWidth: "max-content"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  root: {
    ...theme.mixins.gutters(),
    marginLeft: "5%",
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: "85%"
  },
  searchformroot: {
    ...theme.mixins.gutters(),
    // marginLeft: "5%",
    //  paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: "85%"
    // overflowX: 'auto',
  }
});

const nextDate = moment()
  .add(1, "days")
  .format("YYYY-MM-DD");

class Orders extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "ORDER_DATE_FRMT", title: "Order Date" },
        { name: "CATEGORY_NAME", title: "Category" },
        { name: "SUBCATEGORY_NAME", title: "Sub-Category" },

        { name: "ORDER_QUANTITY", title: "Order Quantity" },
        { name: "ORDER_UOM", title: "UOM" },
        { name: "ORDER_PRICE", title: "Order Price" }
      ],
      tableColumnExtensions: [
        { columnName: "ORDER_DATE_FRMT", wordWrapEnabled: true },
        { columnName: "CATEGORY_NAME", wordWrapEnabled: true },
        { columnName: "SUBCATEGORY_NAME", wordWrapEnabled: true },
        { columnName: "ORDER_PRICE", wordWrapEnabled: true },
        { columnName: "ORDER_QUANTITY", wordWrapEnabled: true },
        { columnName: "ORDER_UOM", wordWrapEnabled: true }
      ],
      rows: "",
      single_row: [],
      openPopup: false,
      currentPage: 0,
      pageSize: 5,
      pageSizes: [5, 10, 15],
      sorting: [{ columnName: "ORDER_DATE" }],
      showSearchFrom: "none",

      ORDER_FROM_DATE: nextDate,
      ORDER_TO_DATE: nextDate,
      orderDetails: []
    };
    this.doActions = this.doActions.bind(this);
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSorting = sorting => this.setState({ sorting });
  }

  //........on PageLoad.......
  componentDidMount() {
    this.populateList();
  }

  /*---------- Populate List ---------*/
  async populateList() {
    let result = await execTransection(
      "query",
      getTotalOrderMaterial,
      this.setListParams()
    );
    console.log(result);
    this.setState({ rows: result.data.result });
  }

  /*---------- set search query variables  ---------*/
  setListParams() {
    var parameters = {
      ORDER_FROM_DATE: this.state.ORDER_FROM_DATE.split("-").join(""),
      ORDER_TO_DATE: this.state.ORDER_TO_DATE.split("-").join("")
    };

    return parameters;
  }

  /*---------- do Actions Delete,Edit ---------*/
  async doActions(lable, value) {
    if (lable === "Search") this.toggleSearchForm();
  }

  /*---------- Toggle Searc hForm ---------*/
  toggleSearchForm() {
    if (this.state.showSearchFrom === "none") {
      this.setState({
        showSearchFrom: "block"
      });
    } else if (this.state.showSearchFrom === "block") {
      this.setState({
        showSearchFrom: "none"
      });
    }
    //  this.clearSearchScreen()
  }

  /*---------- clear Search Screen ---------*/
  async clearSearchScreen() {
    await this.setState({
      ORDER_FROM_DATE: nextDate,
      ORDER_TO_DATE: nextDate
    });
    this.populateList();
  }

  /*-----------------------handle Close Snackbars--------------------*/
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  /*-----------------------populates the list on enter keypress  --------------------*/
  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.populateList();
    }
  }

  render() {
    const { classes, theme } = this.props;
    const {
      rows,
      columns,
      pageSize,
      pageSizes,
      currentPage,
      sorting,
      tableColumnExtensions
    } = this.state;

    const actionsTableToolbar = [
      {
        icon: <SearchIcon color="primary" fontSize="medium" />,
        pageurl: "",
        lable: "Search",
        display: ""
      }
    ];
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };

    if (rows) {
      return (
        <div>
          <Paper style={{ margin: "10px" }}>
            <EnhancedTableToolbar
              actions={actionsTableToolbar}
              onClick={this.doActions}
              pagetitle={"Order Materials"}
            ></EnhancedTableToolbar>
            {/* //.............Search From.............. */}
            <div
              className={classes.searchformroot}
              style={{ display: this.state.showSearchFrom }}
            >
              <form className={classes.container} noValidate autoComplete="off">
                <FormControl
                  className={classes.formControl}
                  error
                  aria-describedby="component-error-text"
                >
                  <TextField
                    id="date"
                    label="From Date"
                    type="date"
                    value={this.state.ORDER_FROM_DATE}
                    onKeyPress={e => this.handleKeyPress(e)}
                    onChange={e =>
                      this.setState({ ORDER_FROM_DATE: e.target.value })
                    }
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>

                <FormControl
                  className={classes.formControl}
                  error
                  aria-describedby="component-error-text"
                >
                  <TextField
                    id="date"
                    label="To Date"
                    type="date"
                    value={this.state.ORDER_TO_DATE}
                    onKeyPress={e => this.handleKeyPress(e)}
                    onChange={e =>
                      this.setState({ ORDER_TO_DATE: e.target.value })
                    }
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </form>

              <Button
                variant="contained"
                size="large"
                color="primary"
                className={classes.button}
                onClick={() => this.populateList()}
              >
                Search
              </Button>
              <Button
                variant="contained"
                size="large"
                className={classes.button}
                onClick={() => this.clearSearchScreen()}
              >
                Clear
              </Button>
            </div>

            {/* //...............Table Grid.......... */}
            <Grid rows={rows} columns={columns}>
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
              <Table columnExtensions={tableColumnExtensions} />
              <TableHeaderRow showSortingControls />
              <PagingPanel pageSizes={pageSizes} />
              <RowDetailState />
            </Grid>
          </Paper>

          {/*.......Snackbar............  */}
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            open={this.state.open}
            autoHideDuration={2000}
            onClose={this.handleClose}
            message={this.state.popmessage}
          ></Snackbar>
        </div>
      );
    } else {
      return (
        <div className="loadingComponent">
          {" "}
          <CircularProgress color="primary" size={50} />
        </div>
      );
    }
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Orders);
