import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'BirthdaysWebPartStrings';
import Birthdays from './components/Birthdays';
import { IBirthdaysProps, IBirthdaysWebPartProps } from './interfaces/IBirthdaysProps';
import { SharePointProvider } from '@microsoft/mgt-sharepoint-provider';
import { Providers } from '@microsoft/mgt-element';


export default class BirthdaysWebPart extends BaseClientSideWebPart<IBirthdaysWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IBirthdaysProps> = React.createElement(
      Birthdays,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        listName: this.properties.listName,
        NoOfItemDisplay: this.properties.NoOfItemDisplay,
        BdayToggleValue: this.properties.BdayToggleValue,
        WorkToggleValue: this.properties.WorkToggleValue,
        WeddingToggleValue: this.properties.WeddingToggleValue,
        webpartName: this.properties.webpartName,
        bdayGreetingWish: this.properties.bdayGreetingWish,
        WorkGreetingWish: this.properties.WorkGreetingWish,
        weddingGreetingWish: this.properties.weddingGreetingWish,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    if (!Providers.globalProvider) {
      Providers.globalProvider = new SharePointProvider(this.context);
    }
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listName', {
                  label: strings.PropertyPaneListName
                }),
                PropertyPaneTextField('webpartName', {
                  label: strings.WebpartName
                }),
                PropertyPaneTextField('bdayGreetingWish', {
                  label: strings.bdayGreetingWish
                }),
                PropertyPaneToggle('BdayToggleValue', {
                  label: strings.BdayToggleValue,
                  checked: this.properties.BdayToggleValue
                }),
                PropertyPaneTextField('WorkGreetingWish', {
                  label: strings.WorkGreetingWish
                }),
                PropertyPaneToggle('WorkToggleValue', {
                  label: strings.WorkToggleValue,
                  checked: this.properties.WorkToggleValue
                }),
                PropertyPaneTextField('weddingGreetingWish', {
                  label: strings.weddingGreetingWish
                }),
                PropertyPaneToggle('WeddingToggleValue', {
                  label: strings.WeddingToggleValue,
                  checked: this.properties.WeddingToggleValue
                }),
                PropertyPaneTextField('NoOfItemDisplay', {
                  label: strings.PropertyPaneNoOfItemDisplay
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
