import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from "react-router-dom";
import { execGql } from "../apolloClient/apolloClient";
import { logInQueries } from '../Queries/queries';



//.....styles..........
const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      open: false,
      errorMessage: '',
    }
  }


  async logIN() {
    var result = '', errorMessage = '', errors = [];
    try {
      result = await execGql('mutation', logInQueries, this.setLogInParams())
    }
    catch (err) {
      errors = err.errorsGql;
      errorMessage = err.errorMessageGql;
    }
    if (!result) {
      this.setState({ errorMessage: errorMessage })
      this.handleSnackbarClick()
    }
    else {
      sessionStorage.setItem('token', result.data.result.AUTH_TOKEN);
      this.navigateToDashboard()
    }
  }

  setLogInParams() {
    var parameters = {
      MOBILE_NUMBER: this.state.mobile,
      PASSWORD: this.state.password
    }
    return parameters
  }
  // async logedIN() {
  //   var result = '', errorMessage = '', errors = [];
  //   try {
  //     // console.log('result1');
  //     result = await execGql('query', logedInQueries, "")
  //     // console.log(result);
  //   }
  //   catch (err) {
  //     errors = err.errorsGql;
  //     errorMessage = err.errorMessageGql;
  //   }
  //   if (!result) {
  //     console.log(errors);
  //     console.log(errorMessage);
  //   }
  //   else {
  //     console.log(result);

  //   }
  // }



  // navigate To Dashboard
  navigateToDashboard() {
    //return this.props.history.push('/main')
    return this.props.history.push('/Dashboard')
  }

  // handle Snackbar Click
  handleSnackbarClick = () => {
    this.setState({ open: true });
  };
  handleSnackbarClose = () => {
    this.setState({ open: false });
  };

  componentWillMount() {
    console.log("sadsadasdsad LogIN");
    if (sessionStorage.getItem('token')) {
      this.navigateToDashboard()
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>

            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>

            <Typography variant="headline">Sign in</Typography>
            <div className={classes.form}>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="mobile">Mobile No.</InputLabel>
                <Input
                  id="mobile"
                  name="mobile"
                  autoComplete="mobile"
                  autoFocus
                  value={this.state.mobile}
                  onChange={(e) => this.setState({ mobile: e.target.value })} />
              </FormControl>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })} />
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={() => this.logIN()}>
                Sign in
              </Button>

              {/*....Create account.......*/}
              {/* <Link to={{ pathname: '/SignUp' }}>
                <Button color="primary" className={classes.button} style={{ textTransform: 'capitalize' }}>
                  Create account
                </Button>
              </Link >


              <Button
                color="primary"
                className={classes.button}
                style={{ textTransform: 'capitalize', marginLeft: "5.5em" }}
                onClick={() => this.logOut()}>
                forgot Password?
    </Button>*/}

              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                open={this.state.open}
                autoHideDuration={3000}
                onClose={this.handleSnackbarClose}
                ContentProps={{ 'aria-errormessage': 'message-id', }}
                message={<span id="message-id" >{this.state.errorMessage}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="secondary"
                    className={classes.close}
                    onClick={this.handleSnackbarClose}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />

            </div>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);