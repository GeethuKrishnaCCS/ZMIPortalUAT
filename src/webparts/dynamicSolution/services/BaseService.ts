import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI } from "@pnp/sp";


export class BaseService {
    private _sp: SPFI;
    constructor(context: WebPartContext) {
        this._sp = getSP(context);
    }
    public async getCurrentUser(): Promise<any> {
        return this._sp.web.currentUser();
    }

    public getAdmin(listname: string, siteUrl: string): Promise<any> {
        return this._sp.web.getList(siteUrl + "/Lists/" + listname).items.select("Title,ID,Admin/EMail,Admin/Title,Admin/ID").expand("Admin")();
    }
    public getListItems(listname: string, url: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items();
    }
    public getQuickListItems(listname: string, url: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.filter("IsActive eq 1")();
    }
    public getListItemsWithFilterExpand(url: string, listname: string, filter: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.select("*").filter(filter)();
    }
    public getListItemsWithFilter(url: string, listname: string, filter: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.filter(filter)();
    }
    public async itemUpdate(siteUrl: string, listname: string, id: number, metadata: any): Promise<any> {
        return this._sp.web.getList(siteUrl + "/Lists/" + listname).items.getById(id).update(metadata);
    }
    public async itemDelete(siteUrl: string, listname: string, id: number): Promise<any> {
        return this._sp.web.getList(siteUrl + "/Lists/" + listname).items.getById(id).recycle();
    }
    public addData(data: any, listname: string, url: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.add(data);
    }
    public uploadDocument(libraryName: string, Filename: any, filedata: any): Promise<any> {
        return this._sp.web.getFolderByServerRelativePath(libraryName).files.addUsingPath(Filename, filedata, { Overwrite: true });
    }
    public getListItemsById(siteUrl: string, listname: string, id: number): Promise<any> {
        return this._sp.web.getList(siteUrl + "/Lists/" + listname).items.getById(id)();
    }
    public getSharepointGroups(audienceGroupName: any): Promise<any> {
        return this._sp.web.currentUser.groups()
    }

}





