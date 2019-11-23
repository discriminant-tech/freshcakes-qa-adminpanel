import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeOutlined from "@material-ui/icons/HomeSharp";

import PeopleOutline from "@material-ui/icons/PeopleOutlined";
import CategoryOutline from "@material-ui/icons/AddLocation";

import ShoppingCart from "@material-ui/icons/ShoppingCart";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";

import CategoryIcon from "@material-ui/icons/Category";
import ViewListIcon from "@material-ui/icons/ViewList";
import Avatar from "@material-ui/core/Avatar";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ViewCarouselIcon from "@material-ui/icons/ViewCarousel";

import { Link } from "react-router-dom";
import { execGql } from "../apolloClient/apolloClient";
import { logoutQueries } from "../Queries/queries";

import Tooltip from "@material-ui/core/Tooltip";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  title1: {
    color: "white"
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    // height: '100vh',
    overflow: "auto",
    fontSize: 30
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  titleMenu: {
    fontSize: 14
  }
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      top: false,
      left: false,
      bottom: false,
      right: false,
      openSubItem1: false
    };
  }

  toggleDrawer = (side, open) => () => {
    document.title = `Fresh Cakes`;
    this.setState({
      [side]: open
    });
  };

  async logout() {
    try {
      await execGql("mutation", logoutQueries, "");
      sessionStorage.clear();
      this.props.history.push("/");
      this.props.history.go(0);
    } catch (err) {
      console.log(err);
    }
  }

  handleClick(type) {
    if (type === "gurujis") {
      this.setState({
        openSubItem1: !this.state.openSubItem1
      });
    } else if (type === "blogs") {
      this.setState({
        openSubItem2: !this.state.openSubItem2
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="fixed" className={classNames(classes.appBar)}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                // onClick={this.handleDrawerOpen}
                onClick={this.toggleDrawer("left", true)}
                className={classNames(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Fresh Cakes Admin
              </Typography>

              {/* <Link to={'/main'}>
                                <Tooltip title="Apps" aria-label="Apps">
                                    <IconButton aria-label="Apps" nativeColor="#f06292" >
                                        <AppsIcon />
                                    </IconButton>
                                </Tooltip>
                            </Link> */}

              <Tooltip title="Logout" aria-label="Logout">
                <IconButton
                  aria-label="Logout"
                  color="inherit"
                  onClick={() => this.logout()}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer
            open={this.state.left}
            onClose={this.toggleDrawer("left", false)}
          >
            <Divider />
            <List>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer("left", false)}
                onKeyDown={this.toggleDrawer("left", false)}
              >
                <ListItem inset>
                  <Avatar src="images/logo.png" />
                  <ListItemText
                    primaryTypographyProps={{
                      style: {
                        color: "#dd2c00",
                        fontWeight: "bold",
                        fontSize: "18px"
                      }
                    }}
                    primary="Welcome"
                  />
                </ListItem>
                <Divider />

                {/* ----------------------------------- */}
                <Link to={"/Dashboard"}>
                  <ListItem
                    button
                    onClick={() => this.toggleDrawer("left", false)}
                  >
                    <ListItemIcon>
                      <HomeOutlined nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Link to={"/Categories"}>
                  <ListItem button>
                    <ListItemIcon>
                      <CategoryIcon nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Categories" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Link to={"/SubCategories"}>
                  <ListItem button>
                    <ListItemIcon>
                      <ViewListIcon nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Sub-Categories" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Link to={"/Prices"}>
                  <ListItem button>
                    <ListItemIcon>
                      <MonetizationOnIcon nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Sub-Category Prices" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Divider variant="middle" />
                <Link to={"/Orders"}>
                  <ListItem button>
                    <ListItemIcon>
                      <ShoppingCart nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                  </ListItem>
                </Link>
                {/* ----------------------------------- */}
                {/* <Link to={"/OrderMaterial"}>
                  <ListItem button>
                    <ListItemIcon>
                      <AddShoppingCart nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Order Material" />
                  </ListItem>
                </Link> */}

                {/* -------------------------------- */}
                <Divider variant="middle" />
                <Link to={"/Users"}>
                  <ListItem button>
                    <ListItemIcon>
                      <PeopleOutline nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Link to={"/Addresses"}>
                  <ListItem button>
                    <ListItemIcon>
                      <CategoryOutline nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Addresses" />
                  </ListItem>
                </Link>

                {/* ----------------------------------- */}
                <Link to={"/Banners"}>
                  <ListItem button>
                    <ListItemIcon>
                      <ViewCarouselIcon nativeColor="#08c65b" />
                    </ListItemIcon>
                    <ListItemText primary="Banners" />
                  </ListItem>
                </Link>
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Header);
