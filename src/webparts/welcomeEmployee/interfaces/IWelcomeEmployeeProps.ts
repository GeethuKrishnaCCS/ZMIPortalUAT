import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWelcomeEmployeeProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  WelcomeEmployeelistname: string;
  WelcomeGreeting: string;
  
}

export interface IWelcomeEmployeeWebPartProps {
  description: string;
  listItems:any;
  WelcomeEmployeelistname: string;
  WelcomeGreeting: string;
}

export interface IWelcomeEmployeeState {
  listItems:any;
}