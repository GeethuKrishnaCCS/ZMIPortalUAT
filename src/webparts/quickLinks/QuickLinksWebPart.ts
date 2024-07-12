import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle
} from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";
import * as strings from 'DynamicsolutionWebPartStrings';
import Dynamicsolution from './components/Dynamicsolution';
import { IDynamicsolutionProps } from './interfaces/IDynamicsolutionProps';
export interface IQuickLinksWebPartProps {
  context: any;
  siteUrl: string;
  AdminlistName: string;
  QuicklinkitemListname: string;
  IconDocLibrary: string;
  ImageDocLibrary: string;
  QuicklinkTypelistName: string;
  btnTextSize: string;
  btnIconSize: string;
  btnBoxSize: string;
  btnRedirectLinkSize: string;
  backgroundColor: string;
  color: string;
}

export default class DynamicsolutionWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  // protected get disableReactivePropertyChanges(): boolean {
  //   return true;
  // }

  public render(): void {
    const element: React.ReactElement<IDynamicsolutionProps> = React.createElement(
      Dynamicsolution,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        siteUrl: this.context.pageContext.web.serverRelativeUrl,
        AdminlistName: this.properties.AdminlistName,
        QuicklinkitemListname: this.properties.QuicklinkitemListname,
        IconDocLibrary: this.properties.IconDocLibrary,
        ImageDocLibrary: this.properties.ImageDocLibrary,
        QuicklinkTypelistName: this.properties.QuicklinkTypelistName,
        btnTextSize: this.properties.btnTextSize,
        btnIconSize: this.properties.btnIconSize,
        btnBoxSize: this.properties.btnBoxSize,
        btnRedirectLinkSize: this.properties.btnRedirectLinkSize,
        backgroundColor: this.properties.backgroundColor,
        color: this.properties.color,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
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
            description: "Admin Configuration"
          },
          groups: [
            {
              groupName: "Admin Settings",
              groupFields: [
                PropertyPaneTextField('QuickLinkLabel', {
                  label: "QuickLinkLabel"
                }),
                PropertyPaneTextField('AdminlistName', {
                  label: "Admin List Name"
                }),
                PropertyPaneTextField('QuicklinkitemListname', {
                  label: "Quicklink item Listname"
                }),
                PropertyPaneTextField('IconDocLibrary', {
                  label: "Icon DocumentLibrary Name"
                }),
                PropertyPaneTextField('ImageDocLibrary', {
                  label: "Image Document Library"
                }),
                PropertyPaneTextField('QuicklinkTypelistName', {
                  label: "Quicklink Type ListName"
                }),

              ]
            }

          ],
        },
        {
          header: {
            description: "Quick Link Style Configuration"
          },
          groups: [
            {
              groupName: "Change Colors & Sizes",
              groupFields: [
                PropertyPaneSlider('btnTextSize', {
                  label: "Button Text Size",
                  min: 5,
                  max: 30,
                  value: 5,
                  showValue: true,
                  step: 1
                }),
                PropertyPaneSlider('btnIconSize', {
                  label: "Button Icon Size",
                  min: 10,
                  max: 100,
                  value: 5,
                  showValue: true,
                  step: 1
                }),
                PropertyPaneSlider('btnRedirectLinkSize', {
                  label: "Button Redirect Link Size",
                  min: 10,
                  max: 30,
                  value: 5,
                  showValue: true,
                  step: 1
                }),
                PropertyPaneSlider('btnBoxSize', {
                  label: "Button Box Size",
                  min: 30,
                  max: 500,
                  value: 5,
                  showValue: true,
                  step: 1
                }),

                PropertyFieldColorPicker("backgroundColor", {
                  label: "Color of Button Tile",
                  selectedColor: this.properties.backgroundColor ? this.properties.backgroundColor : "White",
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: "Precipitation",
                  key: "backgroundColorFieldId",
                }),
                PropertyFieldColorPicker("color", {
                  label: "Color of Text & Icon",
                  selectedColor: this.properties.color ? this.properties.color : "White",
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: "Precipitation",
                  key: "colorFieldId",
                }),

              ]
            }

          ],
        }
      ]
    };
  }
}


