import * as React from 'react';
import { IDynamicsolutionProps, IDynamicsolutionPropsState } from '../interfaces/IDynamicsolutionProps';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { BaseService } from '../services/BaseService';
import { Dialog, DialogType, Dropdown, FontWeights, IDropdownOption, IDropdownStyles, IIconProps, IconButton, Label, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from 'office-ui-fabric-react';
import { MultiSelect } from 'react-multi-select-component';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { DefaultButton, DialogFooter, Panel } from '@fluentui/react';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, } from '@fluentui/react-components';
import { RocketRegular } from "@fluentui/react-icons";
import styles from './DynamicSolution.module.scss';
import * as _ from 'lodash';


export default class Dynamicsolution extends React.Component<IDynamicsolutionProps, IDynamicsolutionPropsState, {}> {
  BaseService: any;
  public constructor(props: IDynamicsolutionProps) {
    super(props);
    this.BaseService = new BaseService(this.props.context);
    this.state = {
      currentuser: "",
      editbtnvisible: false,
      quicklinkitems: [],
      isModalOpen: false,
      NoOfcards: "",
      editAvlble: false,
      editImgCrdAvlble: false,
      editTxtCrdAvlble: false,
      text: "",
      order: null,
      link: "",
      ID: 0,
      file: {},
      iseditModalOpen: false,
      editCloase: false,
      Height: "",
      Width: "",
      OddBackGroundColr: "",
      EvnBackGroundColr: "",
      QuicklinktypeID: "",
      quiklinksID: 0,
      isValidLink: true,
      isHovered: null,
      webpartInstanceId: "",
      quickLinkLabel: "",
      groups: [],
      selectedgroups: [],
      selectedgroupsInQuickLinks: [],
      AudienceTargetString: "",
      AudienceTargetStringForQLI: "",
      access: "",
      linkClickable: true,
      errorMsgForOrder: "",
      confirmDeleteDialog: true
    };
    this._onNoOfCardChange = this._onNoOfCardChange.bind(this);
    this._IconTextChange = this._IconTextChange.bind(this);
    this._IconLinkChange = this._IconLinkChange.bind(this);
    this._onEditAvaialble = this._onEditAvaialble.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this._OnSubmit = this._OnSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this._onEditClose = this._onEditClose.bind(this);
    this._OnUpdate = this._OnUpdate.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this._onQuickLinkLabelChange = this._onQuickLinkLabelChange.bind(this);
    this._selectedGroupsForQuickLinkItems = this._selectedGroupsForQuickLinkItems.bind(this);
    this._selectedGroupsForQuickLinkType = this._selectedGroupsForQuickLinkType.bind(this);
  }

  public async componentDidMount() {
    this.getCurrentUsr();
    await this.getAdmin();
    await this._getQuicklinkType();
  }
  public async _getQuicklinkType() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    let tempAudienceTargetString: any = [];
    await this.BaseService.getListItemsWithFilterExpand(url, this.props.QuicklinkTypelistName, "Title eq '" + this.props.context.instanceId + "'")
      .then(async (quiklinks: any) => {
        if (quiklinks.length > 0) {
          if (quiklinks[0].AudienceTargets !== null && quiklinks[0].AudienceTargets !== "") {
            quiklinks[0].AudienceTargets.split(',').forEach((item) => {
              let tempgroups = {
                value: item,
                label: item
              }
              tempAudienceTargetString.push(tempgroups)
            })
          }
          const resultString = tempAudienceTargetString.map(item => item.label).join(',');
          console.log(resultString);
          this.setState({
            QuicklinktypeID: quiklinks[0].quicklinkstype,
            quiklinksID: quiklinks[0].ID,
            Height: quiklinks[0].height,
            Width: quiklinks[0].width,
            OddBackGroundColr: quiklinks[0].OddCardColor,
            EvnBackGroundColr: quiklinks[0].EvenCardColor,
            webpartInstanceId: quiklinks[0].Title,
            NoOfcards: quiklinks[0].NoOfCards,
            quickLinkLabel: quiklinks[0].QuickLinkLabel,
            selectedgroups: tempAudienceTargetString,
            AudienceTargetString: resultString
          });
          console.log(tempAudienceTargetString)
          await this.checkingcurrentUserDept(tempAudienceTargetString, "QuickLinkType");
          this.getQuickLinkItems();
        }
      });

  }
  public checkingcurrentUserDept = async (AudienceTargets, type) => {
    //getting current user groups
    let groups: any = [];

    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3): void => {
        client
          .api(`me/transitiveMemberOf/microsoft.graph.group?$count=true`)
          .get(async (error, response: any, rawResponse?: any) => {
            console.log(JSON.stringify(response));
            if (response !== null) {
              console.log(response.value);
              response.value.map((group: any) => {
                let tempgroups = {
                  value: group.displayName,
                  label: group.displayName
                }
                groups.push(tempgroups);
              });
              this.setState({ groups: groups });
            }
            if (type === "QuickLinkType") {
              if (AudienceTargets.length !== 0) {
                const access = response.value.filter((item: any) => AudienceTargets.includes(item.displayName));
                console.log(access.length);
                if (access.length > 0) {
                  this.setState({ access: true });
                }
              }
              else {
                this.setState({ access: true });
              }
            }
            else if (type === "QuickLinkItems") {
              await Promise.all(AudienceTargets.map(async (quickLink: any) => {
                let tempgroups: any = [];
                let QLItemsgroups: any = [];
                if (quickLink.AudienceTarget !== null && quickLink.AudienceTarget !== "") {
                  const splittedIGroupNames = quickLink.AudienceTarget.split(',');
                  splittedIGroupNames.forEach((group: any) => {
                    tempgroups = {
                      value: group,
                      label: group
                    }
                    QLItemsgroups.push(tempgroups);
                  });
                  quickLink.AudienceTargets = QLItemsgroups;
                  quickLink.AudienceTargetStrings = quickLink.AudienceTarget;
                  const accessForQuickLinkItems = response.value.filter((group: any) => splittedIGroupNames.includes(group.displayName));
                  accessForQuickLinkItems.length > 0 ? quickLink.access = true : quickLink.access = false;
                }
                else {
                  quickLink.access = true;
                }
              }))

              this.setState({ quicklinkitems: AudienceTargets });
            }
            console.log(this.state.quicklinkitems);
          });
      });

  }

  //get Current user 
  public async getCurrentUsr() {
    const currentuser = await this.BaseService.getCurrentUser();
    this.setState({
      currentuser: currentuser.Email,
    });

  }
  //get admin 
  public getAdmin() {
    this.BaseService.getAdmin(this.props.AdminlistName, this.props.siteUrl)
      .then((adminItems: any) => {
        const isAdmin = adminItems.some(item => item.Admin.EMail === this.props.context.pageContext.user.email);
        //for (let i in adminItems) {
        if (isAdmin === true) {
          this.setState({
            editbtnvisible: true,
            access: true
          });
          this.checkingcurrentUserDept("", "Admin")
        }
        // }
      });
  }
  //get all quicklink items from list 
  public async getQuickLinkItems() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    this.BaseService.getListItemsWithFilter(url, this.props.QuicklinkitemListname, "WebpartInstanceId eq '" + this.props.context.instanceId + "'")
      .then(async (card: any) => {
        const orderedItems = _.orderBy(card, 'QuickLinkOrder', ['asc']);
        if (card.length > 0) {
          this.checkingcurrentUserDept(orderedItems, "QuickLinkItems");
        }
      })

  }
  //on Change of no of card textfield
  public _onNoOfCardChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, noOfCards: any): void => {
    const inputValue = Number(noOfCards);
    if (inputValue < 1 || isNaN(inputValue)) {
      this.setState({
        NoOfcards: noOfCards
      });
    }
    else {
      this.setState({
        NoOfcards: noOfCards
      });

    }


  }
  //quickLinkLabel
  public _onQuickLinkLabelChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, quickLinkLabel: string): void => {
    this.setState({ quickLinkLabel: quickLinkLabel });

  }
  // on change to change the height
  public _onHeightChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, height: string): void => {
    this.setState({ Height: height });

  }
  // on change to change the width
  public _onWidthChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, width: string): void => {
    this.setState({ Width: width });

  }
  // on change to change the color
  public _onColorChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, Oddcolor: string): void => {
    this.setState({ OddBackGroundColr: Oddcolor });

  }
  public _onEvnColorChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, Evncolor: string): void => {
    this.setState({ EvnBackGroundColr: Evncolor });

  }
  // on change to change the Card text (heading)
  public _IconTextChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, icontxt: string): void => {
    this.setState({ text: icontxt });
  }
  public _IconOrderChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, iconOrder: string): void => {
    this.setState({ order: Number(iconOrder) });
  }
  // on change to change the Destination link
  public _IconLinkChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, iconlink: string): void => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const isValid = urlRegex.test(iconlink);

    this.setState({
      link: iconlink,
      isValidLink: isValid
    });
  }
  //on click of edit button ,visible the modal 
  public _onEditAvaialble() {
    this.setState({
      editbtnvisible: false,
      iseditModalOpen: true,
      editCloase: true,
      editAvlble: true,
      linkClickable: false
    })
  }
  //on click of close  button ,close  the modal 
  public _onEditClose() {
    this.setState({
      editbtnvisible: true,
      editCloase: false,
      editAvlble: false,
      iseditModalOpen: false,
      editImgCrdAvlble: false,
      editTxtCrdAvlble: false,
      linkClickable: true
    })
  }
  //onclick of each item's edit button , curresponding data  willl be bind the corresponding field
  private showModal = (cards: any, key: any) => {
    this.setState({
      isModalOpen: true,
      iseditModalOpen: false,
      text: cards.Title,
      link: cards.link,
      ID: cards.ID,
      file: cards.file,
      selectedgroupsInQuickLinks: cards.AudienceTargets !== undefined ? cards.AudienceTargets : [],
      order: cards.QuickLinkOrder
    });
  }
  //After changing the data Icon carddata update
  private _OnUpdate() {
    let updateItem;
    if (this.state.file === undefined) {
      this.BaseService.getListItemsById(this.props.siteUrl, this.props.QuicklinkitemListname, Number(this.state.ID))
        .then((item: any) => {
          if (this.state.QuicklinktypeID === "Image") {
            updateItem = {
              image: {
                Description: item.image.Description,
                Url: item.image.Url,
              },
              Title: this.state.text,
              link: this.state.link,
              AudienceTarget: item.AudienceTargetStrings !== undefined ? item.AudienceTargetStrings : this.state.AudienceTargetStringForQLI,
              QuickLinkOrder: this.state.order
            }
          }
          else if (this.state.QuicklinktypeID === "Icon") {

            updateItem = {
              CardIcon: {
                Description: item.CardIcon.Description,
                Url: item.CardIcon.Url,
              },
              Title: this.state.text,
              link: this.state.link,
              AudienceTarget: item.AudienceTargetStrings !== undefined ? item.AudienceTargetStrings : this.state.AudienceTargetStringForQLI,
              QuickLinkOrder: this.state.order
            }
          }
          else {
            this.state.QuicklinktypeID === "Text"
            updateItem = {
              Title: this.state.text,
              link: this.state.link,
              AudienceTarget: item.AudienceTargetStrings !== undefined ? item.AudienceTargetStrings : this.state.AudienceTargetStringForQLI,
              QuickLinkOrder: this.state.order
            }
          }
          this.BaseService.itemUpdate(this.props.siteUrl, this.props.QuicklinkitemListname, Number(this.state.ID), updateItem)
            .then((updateditems: any) => {
              this.getQuickLinkItems();
            });
        })

    }
    else {
      this.BaseService.uploadDocument(this.props.IconDocLibrary, this.state.file.name, this.state.file)
        .then(async (data: any) => {
          if (data !== null) {
            const filePath = window.location.protocol + "//" + window.location.host + data.data.ServerRelativeUrl;
            if (this.state.QuicklinktypeID === "Image") {

              updateItem = {
                image: {
                  Description: data.data.Name,
                  Url: filePath,
                },
                Title: this.state.text,
                link: this.state.link,
                AudienceTarget: this.state.AudienceTargetString,
                QuickLinkOrder: this.state.order
              }
            }
            else if (this.state.QuicklinktypeID === "Icon") {

              updateItem = {
                CardIcon: {
                  Description: data.data.Name,
                  Url: filePath,
                },
                Title: this.state.text,
                link: this.state.link,
                AudienceTarget: this.state.AudienceTargetString,
                QuickLinkOrder: this.state.order
              }
            }
            else {
              this.state.QuicklinktypeID === "Text"
              updateItem = {
                Title: this.state.text,
                link: this.state.link,
                AudienceTarget: this.state.AudienceTargetString,
                QuickLinkOrder: this.state.order

              }
            }

            this.BaseService.itemUpdate(this.props.siteUrl, this.props.QuicklinkitemListname, Number(this.state.ID), updateItem)
              .then((updateditems: any) => {
                this.getQuickLinkItems();

              });
          }
        })
    }
    this.setState({
      isModalOpen: false,
    });
  }
  //Delete the current data 
  private _OnDelete() {
    this.BaseService.itemDelete(this.props.siteUrl, this.props.QuicklinkitemListname, Number(this.state.ID))
      .then((deleteitems: any) => {
        this.getQuickLinkItems();
      })
    this.setState({
      isModalOpen: false,
    });
  }
  //Quicklink type selection 
  public _onSelectQuicklinkType(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption): void {
    this.setState({
      QuicklinktypeID: (option.key).toString(),
      NoOfcards: this.state.NoOfcards,
      Height: "",
      Width: "",
      OddBackGroundColr: "",
      EvnBackGroundColr: "",
    })
  }
  //After changing the quicklink type ,Icon ,  no of card , height , width , color , Icon carddata delete or add according to no of cards
  public _OnSubmit() {
    this._getQuicklinkType();
    this.getQuickLinkItems();

    let quiklinkItem = {
      quicklinkstype: this.state.QuicklinktypeID,
      height: this.state.Height,
      width: this.state.Width,
      OddCardColor: this.state.OddBackGroundColr,
      EvenCardColor: this.state.EvnBackGroundColr,
      Title: this.props.context.instanceId,
      NoOfCards: Number(this.state.NoOfcards),
      QuickLinkLabel: this.state.quickLinkLabel,
      AudienceTargets: this.state.AudienceTargetString
    }
    try {
      {
        this.state.webpartInstanceId === "" ?
          this.BaseService.addData(quiklinkItem, this.props.QuicklinkTypelistName, this.props.siteUrl) :
          this.BaseService.itemUpdate(this.props.siteUrl, this.props.QuicklinkTypelistName, Number(this.state.quiklinksID), quiklinkItem);

      }
    }

    catch (e) {
      console.error(e);

    }

    if (this.state.quicklinkitems.length > this.state.NoOfcards) {
      for (let i = this.state.quicklinkitems.length; i > this.state.NoOfcards; i--) {
        this.BaseService.itemDelete(this.props.siteUrl, this.props.QuicklinkitemListname, Number(this.state.quicklinkitems[i - 1].ID)).then((deleteitems: any) => {
          this.getQuickLinkItems();
        })
      }

    }
    else if (this.state.quicklinkitems.length < this.state.NoOfcards) {
      const addCount = this.state.NoOfcards - this.state.quicklinkitems.length;
      for (let i = 0; i < addCount; i++) {
        let dataItem = {
          Title: "",
          link: "",
          CardIcon: {
            Description: "IMAGE",
            Url: "/sites/Training/SiteAssets/cardicons",
          },
          image: {
            Description: "IMAGE",
            Url: "/sites/Training/SiteAssets/cardicons",
          },
          WebpartInstanceId: this.props.context.instanceId,
        }
        this.BaseService.addData(dataItem, this.props.QuicklinkitemListname, this.props.siteUrl).then(async (addedData: any) => {
          this.getQuickLinkItems();
        });
      }

    }
    this.setState({
      isModalOpen: false,
      iseditModalOpen: false,
    });

  }
  public _selectedGroupsForQuickLinkType = (items: any[]) => {
    let getSelectedInternalEmailID: any[] = [];
    items.forEach(item => {
      getSelectedInternalEmailID.push(item);
    })
    const resultString = getSelectedInternalEmailID.map(item => item.label).join(',');
    console.log(resultString);
    this.setState({ selectedgroups: getSelectedInternalEmailID, AudienceTargetString: resultString })
  }
  public _selectedGroupsForQuickLinkItems = (items: any[]) => {
    let getSelectedInternalEmailID: any[] = [];
    items.forEach(item => {
      getSelectedInternalEmailID.push(item);
    })
    const resultString = getSelectedInternalEmailID.map(item => item.label).join(',');
    console.log(resultString);
    this.setState({ selectedgroupsInQuickLinks: getSelectedInternalEmailID, AudienceTargetStringForQLI: resultString })
  }
  //To upload the image / Icon 
  public onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files && event.target.files[0];
    this.setState({ file: file });

  };
  //To hide the modal 
  hideModal = () => {
    this.setState({
      isModalOpen: false,
      iseditModalOpen: false,
      NoOfcards: this.state.quicklinkitems.length
    });
  };
  //when hover the icon it will change the icon as animated 
  handleHover = (key: number) => {
    this.setState({ isHovered: key });
  };
  //when hover out the icon it will change the icon to previous
  handleHoverOut = () => {
    this.setState({ isHovered: null });
  };
  private onButtonClick = (url) => {
    if (this.state.linkClickable === true) {
      window.open(url);
    }

  }
  private dialogStyles = { main: { maxWidth: 500 } };
  private dialogContentProps = {
    type: DialogType.normal,
    closeButtonAriaLabel: 'none',
    title: 'Do you want to delete?',
  };
  private modalProps = {
    isBlocking: true,
  };
  //For dialog box of cancel
  private _dialogCloseButton = () => {
    this.setState({
      isModalOpen: false,
      confirmDeleteDialog: false,
    });

  }
  private _onDeleteModalOpen = () => {
    this.setState({
      isModalOpen: false,
      confirmDeleteDialog: false,
    });
  }
  private _confirmYesDeleteItem = () => {
    this.setState({
      confirmDeleteDialog: true,
    })
    this._OnDelete();

  }
  private _confirmNoDeleteItem = () => {
    this.setState({
      confirmDeleteDialog: true,
    })
  }
  public render(): React.ReactElement<IDynamicsolutionProps> {
    const Settings: IIconProps = { iconName: 'ContentSettings' };
    const cancel: IIconProps = { iconName: 'StatusErrorFull' };
    //const LinkIcon: IIconProps = { iconName: 'NavigateForward' };
    // const LinkDblFrwd: IIconProps = { iconName: 'CheckedOutByYou12' };
    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const RightIcon: IIconProps = { iconName: 'ChevronRightSmall' };
    const RightDouble: IIconProps = { iconName: 'DoubleChevronRight8' };
    // const newIconForIconQL: IIconProps = { iconName: 'SkypeCircleArrow' };

    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 280 },
    };
    const { iseditModalOpen, isValidLink, isHovered } = this.state;
    const options: IDropdownOption[] = [
      { key: 'Icon', text: 'Icon Quick Link' },
      { key: 'Image', text: 'Image Quick Link' },
      { key: 'Text', text: 'Text Quick Link' },

    ];
    const theme = getTheme();
    const contentStyles = mergeStyleSets({
      container: {

        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        borderRadius: '1rem',
        padding: '0.5rem'


      },
      header: [
        theme.fonts.xLargePlus,
        {
          flex: '1 1 auto',
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          padding: '12px 12px 14px 24px',
        },
      ],
      heading: {
        color: theme.palette.neutralPrimary,
        fontWeight: FontWeights.semibold,
        fontSize: 'inherit',
        margin: '0',
      },
      body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
      },
    });
    const iconButtonStyles = {
      root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',

      },
      rootHovered: {
        color: theme.palette.neutralDark,
      },
    };

    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.dynamicsolution} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.flex}>
          <div className={styles.quickLinkLabel}>{this.state.quickLinkLabel}</div>
          {this.state.editbtnvisible &&
            <div className={styles.editbtn} >
              <IconButton iconProps={Settings} ariaLabel="Emoji" onClick={this._onEditAvaialble} />
            </div>
          }
          {this.state.editCloase &&
            <div> <IconButton iconProps={cancel} ariaLabel="Emoji" onClick={this._onEditClose} /></div>
          }
        </div>

        {this.state.access === true && <div>
          {this.state.QuicklinktypeID === "Icon" &&
            <div className={styles.iconmain} >
              {this.state.quicklinkitems.map((cards: any, key: any) => {
                //const isEven = key % 2 === 0;
                const display = cards.access === true ? "" : "none";
                return (

                  <div onClick={() => this.onButtonClick(cards.link)} key={key} className={styles.iconcard} style={{ width: this.state.Width !== "" ? this.state.Width : "8rem", height: this.state.Height !== "" ? this.state.Height : "11rem", display: display }} >

                    <div className={styles.iconImgDiv}>
                      <img className={styles.iconimg} src={cards.CardIcon.Url !== null ? cards.CardIcon.Url : "Image"} alt='' />
                    </div>
                    <div className={styles.texticondiv} >
                      <h5 className={styles.iconcardtitle} >{cards.Title}</h5>
                    </div>
                    {this.state.editAvlble &&
                      <div className={styles.editicon} ><IconButton iconProps={Settings} style={{ float: "right" }} ariaLabel="DRMIcon"
                        onClick={() => this.showModal(cards, key)} /></div>
                    }
                  </div>
                )
              }
              )}
            </div >
          }
          {this.state.QuicklinktypeID === "Image" &&
            <div className={styles.imagemain} >
              {this.state.quicklinkitems.map((Imagecards: any, key: any) => {
                const isEven = key % 2 === 0;
                const display = Imagecards.access === true ? "" : "none";
                return (<div key={key} className={styles.imagecard} style={{ backgroundColor: isEven ? this.state.OddBackGroundColr : this.state.EvnBackGroundColr, width: this.state.Width !== "" ? this.state.Width : "26%", height: this.state.Height !== "" ? this.state.Height : "11rem", display: display }} >

                  <div className={styles.imagecrdall} >
                    <div className={styles.imgdiv} ><img className={styles.imgcardimag} src={Imagecards.image.Url} alt='' />     </div>
                    <div className={styles.imgcrdtxticndiv} >
                      <h5>{Imagecards.Title}</h5> <a href={Imagecards.link} className={styles.imagcrdtxt} target="_blank"><IconButton title={Imagecards.Title} iconProps={key === isHovered ? RightDouble : RightIcon} style={{ float: "right" }} ariaLabel="ChevronRightSmall" onMouseEnter={() => this.handleHover(key)} onMouseLeave={this.handleHoverOut} /> </a>
                    </div>
                  </div>
                  {this.state.editAvlble &&
                    <div className={styles.imagediticon}><IconButton iconProps={Settings} style={{ float: "right" }} ariaLabel="DRMIcon" onClick={() => this.showModal(Imagecards, key)} /></div>
                  }

                </div>)
              }
              )}

            </div >
          }
          {this.state.QuicklinktypeID === "Text" &&
            <div className={styles.textcardmain}  >
              {this.state.quicklinkitems.map((Textcards: any, key: any) => {
                const isEven = key % 2 === 0;
                const display = Textcards.access === true ? "" : "none";
                return (<div className={styles.textcarddiv} style={{ backgroundColor: isEven ? this.state.OddBackGroundColr : this.state.EvnBackGroundColr, width: this.state.Width !== "" ? this.state.Width : "45%", height: this.state.Height !== "" ? this.state.Height : "4rem", display: display }}>

                  <div className={styles.textcarditem} > <h5 >{Textcards.Title}</h5> <a href={Textcards.link} target="_blank" style={{ float: "right", textDecoration: "none" }}><IconButton title={Textcards.Title} iconProps={key === isHovered ? RightDouble : RightIcon} className={styles.textcardlinkbtn} ariaLabel="ChevronRightSmall" onMouseEnter={() => this.handleHover(key)} onMouseLeave={this.handleHoverOut} /> </a> </div>
                  {this.state.editAvlble &&
                    <div className={styles.textcardeditbtn}><IconButton iconProps={Settings} className={styles.textcardeditbtnicon} ariaLabel="DRMIcon" onClick={() => this.showModal(Textcards, key)} /></div>

                  }
                </div>)
              }
              )}

            </div >
          }
        </div>}

        <Panel
          isOpen={iseditModalOpen}
          isLightDismiss={true}
          onDismiss={this.hideModal}
          headerText="Admin"
          closeButtonAriaLabel="Close"
        >
          <Accordion collapsible>
            <AccordionItem value="1">
              <AccordionHeader size="extra-large" icon={<RocketRegular />}>Cusyomize Tiles</AccordionHeader>
              <AccordionPanel>
                {this.state.editCloase &&
                  <div className={styles.modalcontents}>
                    <TextField label="QuickLink Label" value={this.state.quickLinkLabel} onChange={this._onQuickLinkLabelChange} />
                    <Dropdown
                      placeholder="Select the Layout"
                      label="Type of Quicklinks"
                      selectedKey={this.state.QuicklinktypeID}
                      onChange={this._onSelectQuicklinkType.bind(this)}
                      options={options}
                      styles={dropdownStyles}
                    />
                    <TextField label="No Of Cards" errorMessage={this.state.NoOfcards > 0 ? '' : 'No Of Cards Should be Greater than 0'} value={this.state.NoOfcards} onChange={this._onNoOfCardChange} />
                    <TextField label="Height" value={this.state.Height} onChange={this._onHeightChange} />
                    <TextField label="Width" value={this.state.Width} onChange={this._onWidthChange} />
                    <TextField label="Odd Card Color" value={this.state.OddBackGroundColr} onChange={this._onColorChange} />
                    <TextField label="Even Card Color" value={this.state.EvnBackGroundColr} onChange={this._onEvnColorChange} />
                    <div >
                      <Label>Audience Target</Label>
                      <MultiSelect
                        options={this.state.groups}
                        value={this.state.selectedgroups}
                        onChange={this._selectedGroupsForQuickLinkType}
                        labelledBy="Audience Target" hasSelectAll={true} />
                    </div>
                    <PrimaryButton className={styles.okbtn} text="Ok" onClick={this._OnSubmit} />
                  </div>
                }
              </AccordionPanel>
            </AccordionItem>

          </Accordion>

        </Panel>

        <Modal
          // titleAriaId={titleId}
          isOpen={this.state.isModalOpen}
          onDismiss={this.hideModal}
          isModeless={true}
          containerClassName={contentStyles.container}
        >
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={this.hideModal}
          />
          {this.state.editAvlble &&
            < div className={styles.editmodal} >
              {this.state.QuicklinktypeID !== "Text" &&
                <div >
                  <label htmlFor="myfile"><h5>Icon Image</h5> </label>
                  <input type="file" id="myfile" name="myfile" onChange={this.onFileChange} ></input>
                  <br />
                </div>}
              <TextField label="Text" value={this.state.text} onChange={this._IconTextChange} />
              <TextField label="Link" errorMessage={!isValidLink ? 'Please enter a valid link' : ''} type='url' value={this.state.link} onChange={this._IconLinkChange} />
              <TextField label="Order" value={this.state.order} errorMessage={(this.state.order > this.state.NoOfcards ? "Please Enter order number less than total card number" : "")} type='number' onChange={this._IconOrderChange} />
              <div >
                <Label>Audience Target</Label>
                <MultiSelect options={this.state.groups} value={this.state.selectedgroupsInQuickLinks}
                  onChange={this._selectedGroupsForQuickLinkItems}
                  labelledBy="Audience Target" hasSelectAll={true} />
              </div>
              <div className={styles.editmodaldelupdbtn} >
                <PrimaryButton text="Delete" onClick={() => this._onDeleteModalOpen()} />
                <PrimaryButton text="Update" onClick={() => this._OnUpdate()} />
              </div>
            </div>}
        </Modal>
        {/* Delete Dialog Box */}

        <div>
          <Dialog
            hidden={this.state.confirmDeleteDialog}
            dialogContentProps={this.dialogContentProps}
            onDismiss={this._dialogCloseButton}
            styles={this.dialogStyles}
            modalProps={this.modalProps}>
            <DialogFooter>
              <PrimaryButton onClick={() => this._confirmYesDeleteItem()} text="Yes" />
              <DefaultButton onClick={() => this._confirmNoDeleteItem()} text="No" />
            </DialogFooter>
          </Dialog>
        </div>
      </section>
    );
  }
}
