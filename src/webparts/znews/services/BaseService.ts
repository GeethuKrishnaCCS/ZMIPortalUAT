import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI, SPFx } from "@pnp/sp";
//import { Web } from '@pnp/sp/webs';

export class BaseService {
    private _sp: SPFI;
    private _webSP: SPFI;
    private _localContext: WebPartContext;
    constructor(context: WebPartContext) {
        this._sp = getSP(context);
        this._localContext = context;
    }
    public getListItems(url: string, listname: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items();
    }
    public async getInfo(site: any): Promise<any[]> {
        try {
            //const siteWeb =  Web(site);
            this._webSP = new SPFI(site).using(SPFx(this._localContext));
            const Items: any = await this._webSP.web.lists.getByTitle("Site Pages").items
                .select("id,Title,Description,BannerImageUrl,Created,Author/ID,Author/FirstName,Author/LastName,Author/Title,FileRef")
                .filter('PromotedState eq 2')
                .expand("Author/ID")();


            const Res: any[] = [];
            Items.map((item: any) => {
                const Url = site.split('/sites/')[0] + item.FileRef;
                const Date = item.Created;
                Res.push({
                    Author: item.Author.Title,
                    Title: item.Title,
                    Description: item.Description,
                    Id: item.Id,
                    Created: Date,
                    BannerImageUrl: item.BannerImageUrl.Url,
                    Url: Url
                });
            });
            return Res;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }


}
