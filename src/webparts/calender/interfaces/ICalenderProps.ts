import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICalenderProps {
  siteUrl: string;
  context: WebPartContext;
  eventListName:string;
  description:string;
}
export interface ICalenderState {
  startDate:any;
  endDate:any;
  eventdataArray:any[];
  nodataFound:string;
  recurrenceDates:Date[];
  currentIndex: any; // Track the current index of displayed items
  itemsPerPage: any;
}
