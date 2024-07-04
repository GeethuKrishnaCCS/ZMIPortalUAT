import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdaysProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  listName: string;
}
export interface IBirthdaysWebPartProps {
  description: string;
  listName: string;
}

export interface IBirthdaysState {
  listItems: [];
  today: string;
  // bdayGreetings: any;
  // workGreetings: any;
  greetings: any;
  scrollIndex: any;
}


