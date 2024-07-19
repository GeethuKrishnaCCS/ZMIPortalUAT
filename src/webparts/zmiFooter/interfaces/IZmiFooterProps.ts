import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IZmiFooterProps {
  description: string;
  siteUrl: string;
  context: WebPartContext;
  settingsList:string;
}
export interface IZmiFooterState {
  logoUrl:string;
  logolink:string;
  linkedinLogoUrl:string;
  linkedinLogolink:string;
  footerdata:any[];
}