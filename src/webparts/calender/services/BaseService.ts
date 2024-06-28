import { WebPartContext } from '@microsoft/sp-webpart-base';
//import { Constant } from "../shared/Constants";
// import { getSP } from "../shared/PnP/pnpjsConfig";
import { SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export class BaseService {
  // private _spfi: SPFI;
  private _sp: SPFI;
  constructor(context: WebPartContext,siteUrl: string) {
      // this._sp = getSP(context);
      this._sp = new SPFI(siteUrl).using(SPFx(context));
      this.addContractRequest = this.addContractRequest.bind(this);

  }
    public DeleteItem(url: string, listname: string, id: number): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).delete();
    }
    public getContractIndexItemById(url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id)
            .select("ContractID/Title,ContractID/ID,ContractOwner/Title,ContractOwner/EMail,Reviewers/Title,Reviewers/ID,Reviewers/EMail,Approvers/Title,ContractDocument,Author/EMail,PublishFormat").expand("ContractID,ContractOwner,Reviewers,Approvers,Author")();
    }
    public getListItems(url: string, listname: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items();

    }
    public getCurrentUser() {
        return this._sp.web.currentUser();
    }
    public getCMWorkflowDetails(url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id)
            .select("Responsible/EMail,ResponsibleComment,ResponseStatus,status,published").expand("Responsible")();
    }
    public getCMWorkflowHeaderItemById(url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id)
            .select("Title,DueDate,Requester/Title,RequesterComment,Title,Created,DueDate,Author/EMail").expand("Requester,Author")();
    }

    public getCMWorkflowDetailsItemById(url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items
            .select("Responsible/Title,ResponsibleComment,ID,HeaderID/ID").expand("Responsible,HeaderID").filter("HeaderID/ID eq '" + id + "' and Workflow eq 'Review'")();

    }
    public addContractRequest(RequestDetails: any, url: string, listname: string) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.add(RequestDetails);
    }
    public addContractTask(TaskDetails: any, url: string, listname: string) {
        this._sp.web.getList(url + "/Lists/" + listname).items.add(TaskDetails);
    }
    public updateContractRequest(Details: any, url: string, listname: string, id: number) {
        this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(Details);
    }
    public updateContractTask(TaskDetails: any, url: string, listname: string, id: number) {
        this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(TaskDetails);
    }
    public getContractRequestitembyId(url: string, listname: string, id: number): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).select("Title,Author0/ID,Author0/Title,Owner/ID,Owner/Title,CoAuthor/ID,CoAuthor/Title,Description").expand("Author0,Owner,CoAuthor")();
    }
    public getContractTaskitem(url: string, listname: string): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.select("ContractID/ID,Assignee/ID,Assignee/Title,ID").expand("ContractID,Assignee")();
    }
    public updateContractWorkflowDetail(workflowDetailsLink: any, url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(workflowDetailsLink);
    }
    public updateContractIndex(ContractIndexLink: any, url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(ContractIndexLink);
    }
    public getCMRevisionLogItemById(url: string, listname: string, hid: number, cid: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items
            .select("Status,ID,HeaderID,ContractIndexID/ID").expand("ContractIndexID")
            .filter("HeaderID eq '" + hid + "' and ContractIndexID/ID eq '" + cid + "'and Status eq 'Under Approval'")();
    }
    public updateContractRevision(contractRevisionLink: any, url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(contractRevisionLink);
    }
    public getCMDocumentsItemById(url: string, listname: string, cid: number) {
        return this._sp.web.getList(url + "/" + listname).items
            .select("WorkflowStatus,ID,ContractIndexID/ID").expand("ContractIndexID").filter("ContractIndexID/ID eq '" + cid + "'")();
    }
    public updateContractDocuments(contractDocuments: any, url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/" + listname).items.getById(id).update(contractDocuments);
    }
    public updateHeaderList(updateHeaderList: any, url: string, listname: string, id: number) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(updateHeaderList);
    }
    public addContractRevisionLogList(ContractRevisionLog: any, url: string, listname: string) {
        return this._sp.web.getList(url + "/Lists/" + listname).items.add(ContractRevisionLog);
    }
    public getLibraryItem(url: string, libraryname: string, id: number): Promise<any> {
        return this._sp.web.getList(url + "/" + libraryname).items.filter("ContractIndexID eq '" + id + "'").select("FileRef,ID,ContractID/ID").expand("ContractID,File")()
    }
    public validateReadPermission(url: string, listname: string, id: number): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id)()
    }
     public validateUpdatePermission(url: string, listname: string, data: any, id: number): Promise<any> {
        return this._sp.web.getList(url + "/Lists/" + listname).items.getById(id).update(data);
    }
} 