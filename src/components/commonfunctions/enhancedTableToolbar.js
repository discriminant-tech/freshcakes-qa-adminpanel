import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Link } from "react-router-dom";



const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
        width: 150
    },
    title: {
        flex: '0 0 auto',
    },
    iconbar: {
        width: 'max-content'
    },
});

let EnhancedTableToolbar = props => {
    const { classes, actions, pagetitle, onClick } = props;

    return (
        <Toolbar className={classNames(classes.root)}       >
            <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                    {pagetitle}
                </Typography>

            </div>
            <div className={classes.spacer} />
            <div className={classes.iconbar}>
                <div className={classes.iconbar}>
                    {actions.map(action => {
                        return (
                            action.lable == 'Search' ?

                                <Tooltip title={action.lable + " " + pagetitle} >
                                    <IconButton aria-label={action.lable + " " + pagetitle} style={{ display: action.display }} onClick={() => onClick(action.lable, '')}>
                                        {action.icon}
                                    </IconButton>
                                </Tooltip>
                                :
                                action.lable == 'ExportToExcel'||action.lable == 'ExportToPDF' ?
                                    <Tooltip title= {action.lable == 'ExportToExcel'? "Export To Excel":"Download Report"}>
                                        <IconButton aria-label={action.lable + " " + pagetitle} style={{ display: action.display }} onClick={() => onClick(action.lable, '')}>
                                            {action.icon}
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <Tooltip title={action.lable + " " + pagetitle} >
                                        <IconButton aria-label={action.lable + " " + pagetitle} style={{ display: action.display }}>
                                            <Link to={action.pageurl}>   {action.icon}</Link>
                                        </IconButton>
                                    </Tooltip>
                        )
                    })}
                </div>

            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.PropTypes.shape({
        icon: PropTypes.node,
        lable: PropTypes.string,
        pageurl: PropTypes.string,
        display: PropTypes.string,
        action: PropTypes.func.isRequired
    })).isRequired,
    classes: PropTypes.object.isRequired,
    pagetitle: PropTypes.string.isRequired,
    onClick: PropTypes.func

};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);

