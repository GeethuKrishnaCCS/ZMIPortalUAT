import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
export interface IZnewsProps {
  description: string;
  StyleToggle: string;
  AuthorToggle: string;
  sites: IPropertyFieldSite[];
  context: WebPartContext;
  Site: any[];
  onChangeProperty: any;
}
export interface IZnewsState {
  SPGuid: string;
  News: any[];
  Reload: boolean;
}