import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWelcomeProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  welcomeBannerImage: string;
}

export interface IWelcomeWebPartProps {
  description: string;
  welcomeBannerImage: string;
}


export interface IWelcomeState {
  displayName: string;
 

}
