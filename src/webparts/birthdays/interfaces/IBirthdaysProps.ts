import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdaysProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  listName: string;
  BdayToggleValue: boolean;
  WorkToggleValue: boolean;
  WeddingToggleValue: boolean;
  NoOfItemDisplay: any;
}
export interface IBirthdaysWebPartProps {
  description: string;
  listName: string;
  NoOfItemDisplay: any;
  BdayToggleValue: boolean;
  WorkToggleValue: boolean;
  WeddingToggleValue: boolean;
}

export interface IBirthdaysState {
  listItems: [];
  today: string;
  // bdayGreetings: any;
  // workGreetings: any;
  greetings: any;
  scrollIndex: any;
}


