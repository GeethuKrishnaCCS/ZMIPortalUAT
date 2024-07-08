import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICalenderProps {
  siteUrl: string;
  context: WebPartContext;
  eventListName:string
}
export interface ICalenderState {
  startDate:any;
  endDate:any;
  eventdataArray:any[];
  nodataFound:string;
}
