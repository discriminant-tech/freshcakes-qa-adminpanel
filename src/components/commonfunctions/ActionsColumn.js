import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import { Link } from "react-router-dom";
import { Getter, Template, Plugin } from '@devexpress/dx-react-core'
import {
    Table,
} from '@devexpress/dx-react-grid-material-ui'
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

const pluginDependencies = [
    { name: 'Table' },
];

const ACTIONS_COLUMN_TYPE = 'actionsColumnType';
const NODATA_COLUMN_TYPE = 'Symbol(nodata)';
const TABLE_HEADING_TYPE = "Symbol(heading)";
const TABLE_DETAIL_TYPE = "Symbol(detail)";



function tableColumnsWithActions(tableColumns, width) {
    return [...tableColumns, { key: ACTIONS_COLUMN_TYPE, type: ACTIONS_COLUMN_TYPE, width: width }];
}

function isHeadingActionsTableCell(tableRow, tableColumn) {
    return tableRow.type.toString() === TABLE_HEADING_TYPE && tableColumn.type.toString() === ACTIONS_COLUMN_TYPE;
}

function isActionsTableCell(tableRow, tableColumn) {

    return tableRow.type.toString() !== TABLE_HEADING_TYPE && tableRow.type.toString() !== NODATA_COLUMN_TYPE && tableRow.type.toString() !== TABLE_DETAIL_TYPE && tableColumn.type.toString() === ACTIONS_COLUMN_TYPE;

}

export class ActionsColumn extends React.PureComponent {

    render() {


        const {
            actions,
            onClick,
            pageurl,
            width
        } = this.props;
        const tableColumnsComputed = ({ tableColumns }) => tableColumnsWithActions(tableColumns, width);

        return (
            <Plugin
                name="ActionsColumn"
                dependencies={pluginDependencies}
            >
                <Getter name="tableColumns" computed={tableColumnsComputed} />

                <Template
                    name="tableCell"
                    predicate={({ tableRow, tableColumn }) => isHeadingActionsTableCell(tableRow, tableColumn)}
                >
                    <Table.Cell style={{ textAlign: "center" }}>Actions</Table.Cell>
                </Template>
                <Template
                    name="tableCell"
                    predicate={({ tableRow, tableColumn }) => isActionsTableCell(tableRow, tableColumn)}
                >
                    {params => (
                        <Table.Cell  {...params} row={params.tableRow.row}>
                            {actions.map(action => {
                                return (
                                    action.lable === 'Edit' || action.lable === 'UploadDocument' ?
                                        <Tooltip title={action.lable} >
                                            <Link to={{ pathname: pageurl, state: { row: params.tableRow.row, buttonLable: action.lable } }}>
                                                <IconButton>
                                                    {action.icon}
                                                </IconButton>
                                            </Link>
                                        </Tooltip> :

                                            action.lable === 'Assign Guruji' ?
                                                params.tableRow.row.GURUJI_DETAILS.some(guruji => guruji.GURUJI_ID === null) ?
                                                    // <Tooltip title={action.lable} >
                                                    //         <IconButton  onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                    //             {action.icon}
                                                    //         </IconButton> 
                                                    // </Tooltip>
                                                    <Button style={{ alignSelf: "center" }} variant="contained" size="small" color="primary" onClick={() => onClick(action.lable, params.tableRow.row)} >
                                                        {action.lable}
                                                    </Button>
                                                    : null
                                                // :
                                                // action.lable === 'Update Status' ?
                                                //     <Button variant="contained" size="small" color="primary" onClick={() => onClick(action.lable, params.tableRow.row)} >
                                                //         {action.lable}
                                                //     </Button>Process Refund

                                                : action.lable === "Process Refund" ?
                                                    params.tableRow.row.REFUND_STATUS === "APPROVED" ?
                                                        <Tooltip title={action.lable} >
                                                            <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                {action.icon}
                                                            </IconButton>
                                                        </Tooltip> : null



                                                    : action.lable === "Cash Recieved" ?
                                                        parseFloat(params.tableRow.row.BALANCE_AMOUNT) > 0.00 && params.tableRow.row.BOOKING_STATUS === "COMPLETE" && params.tableRow.row.MODE_OF_PAYMENT === "CASH" ? <Tooltip title={action.lable} >
                                                            <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                {action.icon}
                                                            </IconButton>
                                                        </Tooltip> : null

                                                        :
                                                        action.lable === 'Authenticate' || action.lable === 'Block' || action.lable === 'Unblock' ?
                                                            //params.tableRow.row.IS_BLACKLISTED
                                                            params.tableRow.row.IS_AUTHENTIC === "N" ?
                                                                action.lable === 'Block' || action.lable === 'Unblock' ? null :
                                                                    <Tooltip title={action.lable} >
                                                                        <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                            {action.icon}
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                : params.tableRow.row.IS_BLACKLISTED === "N" ?
                                                                    action.lable === 'Block' ?
                                                                        <Tooltip title={action.lable} >
                                                                            <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                                {action.icon}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        : null

                                                                    : action.lable === 'Unblock' ?
                                                                        <Tooltip title={action.lable} >
                                                                            <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                                {action.icon}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        : null




                                                            :

                                                            action.lable === 'Approve' || action.lable === 'Blacklist' || action.lable

                                                                === 'Remove From Blacklist' ?
                                                                //params.tableRow.row.IS_BLACKLISTED
                                                                params.tableRow.row.IS_APPROVED === "N" ?
                                                                    action.lable === 'Blacklist' || action.lable === 'Remove From Blacklist' ? null :
                                                                        < Tooltip title={action.lable} >
                                                                            <IconButton onClick={() => onClick(action.lable,

                                                                                params.tableRow.row)}>
                                                                                {action.icon}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    : params.tableRow.row.IS_BLACKLISTED === "N" ?
                                                                        action.lable === 'Blacklist' ?
                                                                            <Tooltip title={action.lable} >
                                                                                <IconButton onClick={() => onClick(action.lable,

                                                                                    params.tableRow.row)}>
                                                                                    {action.icon}
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            : null

                                                                        : action.lable === 'Remove From Blacklist' ?
                                                                            <Tooltip title={action.lable} >
                                                                                <IconButton onClick={() => onClick(action.lable,

                                                                                    params.tableRow.row)}>
                                                                                    {action.icon}
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            : null
                                                                :

                                                                <Tooltip title={action.lable} >
                                                                    <IconButton onClick={() => onClick(action.lable, params.tableRow.row)}>
                                                                        {action.icon}
                                                                    </IconButton>
                                                                </Tooltip>
                                )
                            })}
                        </Table.Cell>
                    )}
                </Template>
            </Plugin >
        );
    }
}
ActionsColumn.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.PropTypes.shape({
        icon: PropTypes.node,
        lable: PropTypes.string,
        action: PropTypes.func.isRequired
    })).isRequired,
    width: PropTypes.number,
    onClick: PropTypes.func,
    pageurl: PropTypes.string
};
ActionsColumn.defaultProps = {
    width: 150,
};