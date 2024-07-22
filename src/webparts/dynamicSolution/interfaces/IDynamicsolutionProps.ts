import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDynamicsolutionProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
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
export interface IDynamicsolutionPropsState {
  currentuser: string;
  editbtnvisible: boolean;
  quicklinkitems: any[];
  isModalOpen: boolean;
  NoOfcards: any;
  editAvlble: boolean;
  editImgCrdAvlble: boolean;
  editTxtCrdAvlble: boolean;
  text: string;
  order: any;
  link: string;
  ID: number;
  file: any;
  iseditModalOpen: boolean;
  editCloase: boolean;
  Height: string;
  Width: string;
  OddBackGroundColr: string;
  EvnBackGroundColr: string;
  QuicklinktypeID: string;
  quiklinksID: number;
  isValidLink: boolean;
  isHovered: any;
  webpartInstanceId: string;
  quickLinkLabel: string;
  groups: any[];
  selectedgroups: any[];
  selectedgroupsInQuickLinks: any[];
  AudienceTargetString: any;
  access: any;
  AudienceTargetStringForQLI: any;
  linkClickable: boolean;
  errorMsgForOrder: string;
  confirmDeleteDialog: boolean;
}
