import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  // PropertyPaneButton,
  // PropertyPaneButtonType,
  PropertyPaneDropdown,
  PropertyPaneSlider,
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
//import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import { PropertyFieldIconPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldIconPicker';

export default class FinderWpWebPart extends BaseClientSideWebPart<IFinderWpWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _dropdownOptions: IDropdownOption[] = [];
  private _service: FinderWpService;
  private _folderFields: any[] = [];

  constructor() {
    super();
    this._folderFields = [];
  }

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
        ButtonFontSize: this.properties.ButtonFontSize,
        foldercolor: this.properties.foldercolor,
        iconPicker: this.properties.iconPicker,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    if (!this.properties.foldercolor) {
      this.properties.foldercolor = [];
    }
    if (!this.properties.iconPicker) {
      this.properties.iconPicker = [];
    }
    this._service = new FinderWpService(this.context);
    this._environmentMessage = await this._getEnvironmentMessage();
    await this.getDocLibrary();
  }

  private async getDocLibrary(): Promise<void> {
    const url: string = this.context.pageContext.web.absoluteUrl;
    const getDoclibarry: IDocumentLibraryInformation[] = await this._service.getDocLibrary(url);
    // console.log('getDoclibarry: ', getDoclibarry);

    this._dropdownOptions = getDoclibarry.map((item: any) => ({
      key: item.Title,
      text: item.Title
    }));
    if (this.properties.selectedDocument) {
      await this.onDropdownChange(this.properties.selectedDocument);
    }
  }

  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  //   super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  //   if (propertyPath.startsWith('foldercolor')) {
  //     const index = parseInt(propertyPath.match(/\d+/)[0], 10);
  //     this.properties.foldercolor[index] = newValue;
  //   }
  //   if (propertyPath === 'selectedDocument' && newValue) {
  //     this.onDropdownChange(newValue);
  //   }
  //   this.render();
  // }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    
    if (propertyPath.startsWith('foldercolor')) {
      const index = parseInt(propertyPath.match(/\d+/)[0], 10);
      this.properties.foldercolor[index] = newValue;
    }  
    if (propertyPath.startsWith('iconPicker')) {
      const index = parseInt(propertyPath.match(/\d+/)[0], 10);
      this.properties.iconPicker[index] = newValue;
    }  
    if (propertyPath === 'selectedDocument' && newValue) {
      this.onDropdownChange(newValue);
    }  
    this.render();
  }
  

  private async onDropdownChange(selectedLibrary: string): Promise<void> {
    const folders = await this._service.getDocumentLibraryFolder(selectedLibrary);
    console.log('Folders: ', folders);
  
    this._folderFields = folders.map((folder: any, index: number) => {
      //const color = this.properties.foldercolor[index] || '#FFFFFF'; 
      const icon = this.properties.iconPicker[index] || '';
      return {
        groupName: `Folder: ${folder.Name}`,
        groupFields: [
          // PropertyFieldColorPicker(`foldercolor[${index}]`, {
          //   label: `Color for ${folder.Name}`,
          //   selectedColor: color,
          //   onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
          //   properties: this.properties,
          //   disabled: false,
          //   debounce: 1000,
          //   isHidden: false,
          //   alphaSliderHidden: false,
          //   style: PropertyFieldColorPickerStyle.Full,
          //   iconName: 'Precipitation',
          //   key: `colorFieldId${index}`
          // }),
          PropertyFieldIconPicker(`iconPicker[${index}]`, {
            currentIcon: icon,
            key: `iconPickerId${index}`,
            onSave: (selectedIcon: string) => { 
              this.properties.iconPicker[index] = selectedIcon; 
              // this.context.propertyPane.refresh(); 
              // this.render(); 
            },
            buttonLabel: `Icon for ${folder.Name}`,
            renderOption: "panel",
            properties: this.properties,
            onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
            label: `Icon for ${folder.Name}`
          }),
        ]
      };
    });
  
    this.context.propertyPane.refresh();
  }
 

  // private addColor(): void {
  //   this.properties.foldercolor = [...this.properties.foldercolor, '#FFFFFF'];
  //   this.context.propertyPane.refresh();
  //   this.render();
  // }

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
            },

            ...this._folderFields,


            {
              groupName: "Change Colors & Style",
              groupFields: [
                // PropertyFieldIconPicker('iconPicker', {
                //   currentIcon: this.properties.iconPicker,
                //   key: "iconPickerId",
                //   onSave: (icon: string) => { console.log(icon); this.properties.iconPicker = icon; },
                //   onChanged:(icon: string) => { console.log(icon);  },
                //   buttonLabel: "Icon",
                //   renderOption: "panel",
                //   properties: this.properties,
                //   onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                //   label: "Icon Picker"              
                // }),
                PropertyPaneSlider('ButtonFontSize', {
                  label: 'Button Font Size',
                  min: 10,
                  max: 50,
                  value: 10,
                  showValue: true,
                  step: 1
                }),

              ]
            },
          ]
        }
      ]
    };
  }
}


