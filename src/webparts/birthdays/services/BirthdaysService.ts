import { BaseService } from "./BaseService";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import { PagedItemCollection } from "@pnp/sp/items";

import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

export class BirthdaysService extends BaseService {
    private _spfi: SPFI;
    constructor(context: WebPartContext) {
        super(context);
        this._spfi = getSP(context);
    }
    public getListItems(listname: string, url: string): Promise<any> {
        return this._spfi.web.getList(url + "/Lists/" + listname).items();
    }
   

    public async getUser(userId: number): Promise<any> {
        return this._spfi.web.getUserById(userId)();
    }

    public getItemSelectExpandFilter(siteUrl: string, listname: string, select: string, expand: string, filter: string): Promise<any> {
        return this._spfi.web.getList(siteUrl + "/Lists/" + listname).items
            .select(select)
            .expand(expand)
            .filter(filter)()
    }
    public getItemSelectExpand(siteUrl: string, listname: string, select: string, expand: string): Promise<any> {
        return this._spfi.web.getList(siteUrl + "/Lists/" + listname).items
            .select(select)
            .expand(expand)
            ()
    }

    public async getGreetingItems(listname: string, url: string): Promise<any[]> {
        let finalItems: any[] = [];
        let items: PagedItemCollection<any[]> = undefined;
        do {
            if (!items) {
                items = await this._spfi.web.getList(url + "/Lists/" + listname)
                    .items
                    .top(250)
                    .getPaged();
            }
            else {
                items = await items.getNext();
            }
            if (items.results.length > 0) {
                finalItems = finalItems.concat(items.results);
            }
        } while (items.hasNext);

        return finalItems;
    }
}