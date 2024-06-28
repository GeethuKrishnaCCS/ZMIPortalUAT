import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'FinderWpWebPartStrings';
import FinderWp from './components/FinderWp';
import { IFinderWpProps, IFinderWpWebPartProps } from './interfaces/IFinderWpProps';
import { IDropdownOption } from '@fluentui/react';
import { IDocumentLibraryInformation } from "@pnp/sp/sites";
import { FinderWpService } from './services';

export default class FinderWpWebPart extends BaseClientSideWebPart<IFinderWpWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _dropdownOptions: IDropdownOption[] = [];
  private _service: FinderWpService;

  public render(): void {
    const element: React.ReactElement<IFinderWpProps> = React.createElement(
      FinderWp,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        selectedDocument: this.properties.selectedDocument,
        getDocLibrary: this.getDocLibrary.bind(this),
        showItemsFromSpecificFolder: this.properties.showItemsFromSpecificFolder,
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new FinderWpService(this.context);
    this._environmentMessage = await this._getEnvironmentMessage();
    await this.getDocLibrary();
  }

  private async getDocLibrary(): Promise<void> {
    const url: string = this.context.pageContext.web.absoluteUrl;
    const getDoclibarry: IDocumentLibraryInformation[] = await this._service.getDocLibrary(url);
    // console.log('getDoclibarry: ', getDoclibarry);

    // getDoclibarry.forEach((docLib: IDocumentLibraryInformation) => {
    //   console.log('docLib: ', docLib);

    // });
    this._dropdownOptions = getDoclibarry.map((item: any) => ({
      key: item.Title,
      text: item.Title
    }));
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
                PropertyPaneDropdown('selectedDocument', {
                  label: 'Select Document',
                  options: this._dropdownOptions,
                  // onChanged: this.onDropdownChange.bind(this)
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
