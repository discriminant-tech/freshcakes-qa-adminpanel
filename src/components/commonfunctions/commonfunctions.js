
import { execGql } from '../apolloClient/apolloClient';
import { ServerUrl } from '../ServerURL/serverURL';
import axios from 'axios';
import moment from 'moment';

//function to execute query and mutation
export function execTransection(gqlType, gqlTypeName, gqlVariables) {
    var result = '', errorMessage = '', errors = [];
    try {
        result = execGql(gqlType, gqlTypeName, gqlVariables)
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
        //console.log(result);
        return result
    }
}


/**
  * Downloads Document
  * @param queryParams 
  * @returns URI
  */
export async function downloadDocuments(queryParams) {
    console.log(queryParams);

    let url = `${ServerUrl}?query=query`;
    url = url + "{downloadDocuments(DocumentType:" + queryParams.DocumentType + ",";
    url = url + "ParamArray:" + JSON.stringify(queryParams.ParamArray) + ")}";

    let uri = encodeURI(url)
    let resFile = await axios({
        baseURL: uri,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            "authorization": `Bearer ${sessionStorage.getItem('token')}`
        },
        responseType: 'blob'
    });
    if (resFile.data.size == 255) {
        this.setState({
            popmessage: "File not availabe !", open: true
        });
    } else {
        const file = new Blob(
            [resFile.data],
            { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL);
    }
    //console.log(uri);
    //return uri;

}




/**
* Downloads Excel Report
* @param queryParams 
* @returns URI
*/
export function exportToExcel(queryParams) {
    console.log(queryParams);

    let url = `${ServerUrl}?query=query`;
    url = url + "{exportToExcel(ReportType:[" + queryParams.ReportType + "],";
    url = url + "ParamArray:" + JSON.stringify(queryParams.ParamArray) + ",";
    url = url + "ReportName:" + JSON.stringify(queryParams.ReportName) + ")}";

    let uri = encodeURI(url)

    return uri;
}

/*-----------------------Compare Date --------------------*/
export const compareDate = (a, b) => {
    const dataMyOne = moment(a).format('YYYYMMDD');
    const dataMyTwo = moment(b).format('YYYYMMDD');


    if (dataMyOne === dataMyTwo) {
        return 0;
    }
    return (dataMyOne < dataMyTwo) ? -1 : 1;
}

/*-----------------------get older  Date --------------------*/
export const getolderDate = (months) => {
    var d = moment().subtract(months, 'months').format('YYYY-MM-DD');
    return d
}

/*-----------------------get upcoming  Date --------------------*/
export const getUpcomingDate = (months) => {
    var d = moment().add(months, 'months').format('YYYY-MM-DD');
    return d
}