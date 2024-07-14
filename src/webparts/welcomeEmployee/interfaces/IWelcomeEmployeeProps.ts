import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWelcomeEmployeeProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  
}

export interface IWelcomeEmployeeWebPartProps {
  description: string;
  listItems:any;
}

export interface IWelcomeEmployeeState {
  listItems:any;
}