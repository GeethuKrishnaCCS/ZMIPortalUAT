import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {type IPropertyPaneConfiguration, PropertyPaneToggle, PropertyPaneTextField} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ZnewsWebPartStrings';
import Znews from './components/Znews';
import { IZnewsProps } from './components/IZnewsProps';
import { IPropertyFieldSite, PropertyFieldSitePicker } from '@pnp/spfx-property-controls';
export default class ZnewsWebPart extends BaseClientSideWebPart<IZnewsProps> {

  public render(): void {
    const element: React.ReactElement<IZnewsProps> = React.createElement(
      Znews,
      {
        description: this.properties.description,
        StyleToggle: this.properties.StyleToggle,
        sites: this.properties.sites,
        context: this.context,
        AuthorToggle: this.properties.AuthorToggle,
        Site: this.properties.Site,
        onChangeProperty: this.onChangeProperty
      }
    );
    ReactDom.render(element, this.domElement);
  }
  protected onInit(): Promise<void> {
    return Promise.resolve();
  }
  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: any
  ):Promise<void> {
    if (propertyPath === "sites") {
       const value: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
       if (value  && !value.length) {
         this.properties.Site = [];
        this.context.propertyPane.refresh();
        return;
      } else {
        this.properties.Site = newValue;
        this.context.propertyPane.refresh();
        return;
      }
    }
  }
  public async getSelectedListFields() {
    if (this.properties.Site) {
      this.context.propertyPane.refresh();
    }
  }
  public onChangeProperty = (changeType: string, oldValue: any, newValue: any[]): void => {
        this.getSelectedListFields();
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
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle('StyleToggle', {
                  onText: 'Stack',
                  offText: 'Single',
                  label: 'Style'
                }),
                PropertyPaneToggle('AuthorToggle', {
                  onText: 'Hidden',
                  offText: 'Shown',
                  label: 'Author'
                }),
                PropertyFieldSitePicker('sites', {
                  label: 'Select sites',
                  initialSites: this.properties.sites,
                  context: this.context as any,
                  deferredValidationTime: 200,
                  multiSelect: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: 'sitesFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
