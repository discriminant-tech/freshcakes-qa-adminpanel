import moment from "moment";

 const grtServerURL=()=>{
 let  todaysDate=moment().format("DD");
 if(todaysDate <= 10)
   return 'https://freshcakes-prod-server-1.herokuapp.com/freshcakes'
   if(todaysDate > 10 & todaysDate <= 20)
   return 'https://freshcakes-prod-server-2.herokuapp.com/freshcakes'
   if(todaysDate > 20 )
   return 'https://freshcakes-prod-server-3.herokuapp.com/freshcakes'
}


export const ServerUrl = grtServerURL()
// export const ServerUrl = 'https://freshcakes-qa.herokuapp.com/freshcakes'

//--- Production Server ----------
//export const ServerUrl = `http://173.249.22.163:3401/saatwiik`;