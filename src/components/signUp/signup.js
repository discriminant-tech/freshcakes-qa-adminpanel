import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// import loging mutation
import { execGql } from "../apolloClient/apolloClient";
import { logInQueries, logedInQueries } from '../Queries/queries';


const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
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
});

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: 'a@b.com',
      password: '1'
    }
  }

  async logIN() {
    console.log("logIN");
    var result = '', errorMessage = '', errors = [];
    try {
      // console.log('result1');
      result = await execGql('mutation', logInQueries, this.setLogInParams())
      // console.log(result);
    }
    catch (err) {
      errors = err.errorsGql;
      errorMessage = err.errorMessageGql;
    }
    if (!result) {
      console.log(errors);
      console.log(errorMessage);
    }
    else {
      sessionStorage.setItem('token', result.data.localLogin);
      this.logedIN();
    }

  }
  setLogInParams() {
    var parameters = {
      email: this.state.email,
      password: this.state.password
    }
    return parameters

  }

  async logedIN() {
    var result = '', errorMessage = '', errors = [];
    try {
      // console.log('result1');
      result = await execGql('query', logedInQueries, "")
      // console.log(result);
    }
    catch (err) {
      errors = err.errorsGql;
      errorMessage = err.errorMessageGql;
    }
    if (!result) {
      console.log(errors);
      console.log(errorMessage);
    }
    else {
      console.log(result);

    }

  }


  render() {
    const { classes } = this.props;
    console.log(classes);

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="headline">
              Create an account
        </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First name"
                  fullWidth
                  autoComplete="fname"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  fullWidth
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="Username"
                  name="username"
                  label="Username"
                  fullWidth
                />
              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="password"
                  name="password"
                  label="Password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm Password"
                  fullWidth
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={() => this.logIN()}
              >
                Sign Up
            </Button>

            </Grid>
          </Paper>
          {JSON.stringify({ "email": this.state.email, "password": this.state.password })}
        </main>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);