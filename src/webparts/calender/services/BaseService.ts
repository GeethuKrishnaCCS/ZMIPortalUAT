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
        //const filterQuery = `start/dateTime ge '${start}' and start/dateTime le '${end}'`; // Use the correct field name in your query
        const filterQuery = `(start/dateTime ge '${start}' and start/dateTime le '${end}') or isAllDay eq true`;
        const client = await context.msGraphClientFactory.getClient("3");
        const response = await client
            .api('me/events')
            .filter(filterQuery) // Apply the filter query here
            // .select(['start','end','subject','recurrence','isOnlineMeeting','onlineMeetingUrl'])
            .orderby('start/dateTime')
            .version('v1.0')
            .get();
        let data = response.value;

        // Check if there's a next link for pagination
        let nextLink = response['@odata.nextLink'];
        // Fetch the next page of results if nextLink exists
        while (nextLink) {
            const nextResponse = await client.api(nextLink).get();
            data = data.concat(nextResponse.value); // Append new data to the existing data
            nextLink = nextResponse['@odata.nextLink']; // Update the nextLink for the next iteration
        }

        console.log(data.value);
        return data;


    }


} 