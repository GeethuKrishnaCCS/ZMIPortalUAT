import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFinderWpProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  selectedDocument: string;
  getDocLibrary: any;
  showItemsFromSpecificFolder: string;
  
}

export interface IFinderWpWebPartProps {
  description: string;
  selectedDocument: string;
  getDocLibrary: any;
  showItemsFromSpecificFolder: string;
  
}