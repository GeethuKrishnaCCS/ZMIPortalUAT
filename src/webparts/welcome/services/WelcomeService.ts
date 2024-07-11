import { BaseService } from "./BaseService";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists"
import "@pnp/sp/fields";

export class WelcomeService extends BaseService {
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

    public async getCurrentUser(): Promise<any> {
        return this._spfi.web.currentUser();
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


}