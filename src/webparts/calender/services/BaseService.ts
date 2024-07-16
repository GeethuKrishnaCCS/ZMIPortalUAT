import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { getSP } from '../shared/PnP/pnpjsConfig';
// import { MSGraphClientV3 } from '@microsoft/sp-http';
export class BaseService {
    private _sp: SPFI;
    private currentContext: WebPartContext;
    constructor(context: WebPartContext, qdmsURL?: string) {
        this.currentContext = context;
        this._sp = getSP(this.currentContext);
    }

    public getCurrentUser() {
        return this._sp.web.currentUser();
    }
    public async getevents(context: any, start: string, end: string): Promise<any> {
        const filterQuery = `start/dateTime ge '${start}' and start/dateTime le '${end}'`; // Use the correct field name in your query
        const client = await context.msGraphClientFactory.getClient("3");
        const response = await client
            .api('me/events')
            .filter(filterQuery) // Apply the filter query here
            // .select(['start','end','subject','recurrence','isOnlineMeeting','onlineMeetingUrl'])
            .orderby('start/dateTime')
            .version('v1.0')
            .get();
        console.log(response.value);
        return response.value;
// const client = await context.msGraphClientFactory.getClient("3");
// const response = await client
//                     .api('me/events')
//                     .filter(filterQuery) // Apply the filter query here
//                     .select(['start','end','subject'])
//                     .orderby('start/dateTime')
//                     .version('v1.0')
//                     .get();

//         console.log(response.value);
//           return response.value          
    }
   

} 