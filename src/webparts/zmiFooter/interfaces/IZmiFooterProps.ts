import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IZmiFooterProps {
  description: string;
  siteUrl: string;
  context: WebPartContext;
  adminList:string;
  settingsList:string;
}
export interface IZmiFooterState {
  currentUserId:any;
  isAdmin:boolean;
  logoUrl:string;
  logolink:string;
  linkedinLogoUrl:string;
  linkedinLogolink:string;
  footerdata:any[];
  openEditModal:boolean;
  footerdataitem:any[];
  openEditItemModal:boolean;
}