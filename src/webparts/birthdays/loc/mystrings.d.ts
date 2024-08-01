declare interface IBirthdaysWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;

  PropertyPaneListName: string;
  WebpartName: string;
  bdayGreetingWish: string;
  WorkGreetingWish: string;
  weddingGreetingWish: string;

  BdayToggleValue: string;
  WorkToggleValue: string;
  WeddingToggleValue: string;
  PropertyPaneNoOfItemDisplay: string;
}

declare module 'BirthdaysWebPartStrings' {
  const strings: IBirthdaysWebPartStrings;
  export = strings;
}
