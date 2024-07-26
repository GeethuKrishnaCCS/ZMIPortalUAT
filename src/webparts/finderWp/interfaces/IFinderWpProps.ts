
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
  // showItemsFromSpecificFolder: string;
  ButtonFontSize: string;
  foldercolor: string[];
  iconPicker: any[];

}

export interface IFinderWpWebPartProps {
  iconPicker: any[];
  description: string;
  selectedDocument: string;
  getDocLibrary: any;
  // showItemsFromSpecificFolder: string;
  ButtonFontSize: string;
  foldercolor: string[];
}

export interface IFinderWpStateOLD {
  getDocFolder: any;
  getDocFiles: any;
  filesInSelectedFolder: any;
  selectedFolder: any;
  breadcrumbItems: any;
  searchQuery: any;
  filteredFiles: any;
  filteredFolders: any;
  breadcrumbDiv: boolean;
  NoItemsDiv: string;
}

export interface IFinderWpState {
  parentFolders: any[];
  getDocFiles: any;
  filesInSelectedFolder: any;
  selectedFolder: any;
  breadcrumbItems: any;
  searchKey: any;
  filteredFiles: any;
  filteredFolders: any;
  breadcrumbDiv: boolean;
  statusMessage: string;
}