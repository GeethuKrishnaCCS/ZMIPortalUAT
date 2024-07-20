import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI } from "@pnp/sp";

export class BaseService {
    private _sp: SPFI;
    constructor(context: WebPartContext) {
        this._sp = getSP(context);
    }
    public getCurrentUser() {
        return this._sp.web.currentUser();
    }
    public getListItems(url: string, listname: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items();
    }
    public getAdminListItems(url: string, listname: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.select('Admin/Title,Admin/ID,Admin/EMail').expand('Admin')();
    }    
   
}
