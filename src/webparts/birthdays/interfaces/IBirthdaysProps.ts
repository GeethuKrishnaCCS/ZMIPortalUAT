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
  webpartName: string;
  bdayGreetingWish: string;
  WorkGreetingWish: string;
  weddingGreetingWish: string;
}
export interface IBirthdaysWebPartProps {
  description: string;
  listName: string;
  NoOfItemDisplay: any;
  BdayToggleValue: boolean;
  WorkToggleValue: boolean;
  WeddingToggleValue: boolean;
  webpartName: string;
  bdayGreetingWish: string;
  WorkGreetingWish: string;
  weddingGreetingWish: string;
}

export interface IBirthdaysState {
  listItems: [];
  today: string;
  // bdayGreetings: any;
  // workGreetings: any;
  greetings: any;
  currentIndex: any; // Track the current index of displayed items
  itemsPerPage: any;

}


// export interface IBirthdaysState {
//   listItems: any[];
//   today: string;
//   greetings: any[];
//   scrollIndex: number;
//   RenderedGreetings: any[]; // Add this line
//   Next: number; // Add this line
//   Count: number; // Add this line
//   UpdateCount: number;
//   Reload: boolean;
// }


