import * as React from 'react';
import styles from './ZmiFooter.module.scss';
import { IZmiFooterProps, IZmiFooterState } from '../interfaces/IZmiFooterProps';
import { BaseService } from '../services';
import { DefaultButton, IIconProps, IconButton, Modal, getTheme, mergeStyleSets, mergeStyles } from '@fluentui/react';

export default class ZmiFooter extends React.Component<IZmiFooterProps, IZmiFooterState, {}> {
  private _Service: BaseService;
  public constructor(props: IZmiFooterProps) {
    super(props);
    this.state = {
      currentUserId: null,
      isAdmin: false,
      logoUrl: "",
      logolink: "",
      linkedinLogoUrl: "",
      footerdata: [],
      linkedinLogolink: "",
      openEditModal: false,
      footerdataitem: [],
      openEditItemModal:false
    }
    this._Service = new BaseService(this.props.context);
    this.editFooter = this.editFooter.bind(this);

  }
  public async componentDidMount(): Promise<void> {
    await this.checkuserAdmin();
    const footerdataArray: any[] = []
    const footerdata = await this._Service.getListItems(this.props.siteUrl, this.props.settingsList)
    console.log(footerdata);
    for (let i = 0; i < footerdata.length; i++) {
      if (footerdata[i].Title !== "Company Logo" && footerdata[i].Title !== "LINKED IN") {
        const footerda = {
          Title: footerdata[i].Title,
          Link: footerdata[i].Link,
        };
        footerdataArray.push(footerda);
      }
      this.setState({
        footerdata: footerdataArray,
      });
    }
    const CompanyLogo = footerdata.filter((item: any) => item.Title === "Company Logo");
    if (CompanyLogo.length > 0) {
      this.setState({ logoUrl: CompanyLogo[0].Logo.Url, logolink: CompanyLogo[0].Link });
    }
    const LinkedinLogo = footerdata.filter((item: any) => item.Title === "LINKED IN");
    if (LinkedinLogo.length > 0) {
      this.setState({ linkedinLogoUrl: LinkedinLogo[0].Logo.Url, linkedinLogolink: CompanyLogo[0].Link });
    }

  }
  public async checkuserAdmin() {
    const currentuser = await this._Service.getCurrentUser();
    if (currentuser) {
      const admindata = await this._Service.getAdminListItems(this.props.siteUrl, this.props.adminList)
      console.log(admindata);
      const userAdmin = admindata.filter((item: any) => item.Admin.ID === currentuser.Id);
      if (userAdmin.length > 0) {
        this.setState({ isAdmin: true });
      }
    }

  }
  public async editFooter() {
    let LogoUrl: string = "";
    let footerdataitems: any[] = [];
    const footerdata = await this._Service.getListItems(this.props.siteUrl, this.props.settingsList)
    console.log(footerdata);
    for (let i = 0; i < footerdata.length; i++) {
      if (footerdata[i].Logo !== null) {
        LogoUrl = footerdata[0].Logo.Url;
      }
      const footerdataitem = {
        Title: footerdata[i].Title,
        Link: footerdata[i].Link,
        Logo: footerdata[i].Logo,
        LogoUrl: LogoUrl,
        Id: footerdata[i].ID

      };
      footerdataitems.push(footerdataitem)
    }
    this.setState({
      footerdataitem: footerdataitems
    });
    this.setState({
      openEditModal: true
    });
  }
  public editFooterModalClose() {
    this.setState({
      openEditModal: false
    });
  }
  public editFooterItem(Id: any) {

  }
  public render(): React.ReactElement<IZmiFooterProps> {
    const theme = getTheme();
    const borderlessButtonStyle = mergeStyles({
      border: 'none',
      padding: 0,
      backgroundColor: 'transparent',
      color: '#3797e4',
      selectors: {
        ':hover': {
          backgroundColor: 'transparent',
          color: '#3797e4'
        },
        ':active': {
          backgroundColor: 'transparent',
          color: '#3797e4'
        },
      },
    });
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
      }
    });
    const CancelIcon: IIconProps = { iconName: 'Cancel' };
    const MoreIcon: IIconProps = { iconName: 'More' }
    const iconButtonStyles = {
      root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '1px',
      },
      rootHovered: {
        color: theme.palette.neutralDark,
      },
    };
    return (
      <section className={`${styles.zmiFooter} `}>
        <div className={styles.msGrid} dir="ltr" >
          <div className={styles.msRow}>
            <div className={styles.msCol} >
              <div className={styles.footerbg}>
                <div className={styles.footercntnt}>
                  <div className={styles.companylogo}><a href={this.state.logolink} target="_blank"><img src={this.state.logoUrl} /></a></div>
                  <div className={styles.itemstyle}>{this.state.footerdata.map((item: any) => (
                    <a href={item.Link} target="_blank">{item.Title}</a>
                  ))}</div>
                  <div className={styles.footerright}>
                    <div className={styles.linkedinLogo}><a href={this.state.linkedinLogolink} target="_blank"><img src={this.state.linkedinLogoUrl} /></a></div>
                    {this.state.isAdmin && <div className={styles.editftr}><DefaultButton
                      className={borderlessButtonStyle}
                      onClick={this.editFooter}
                      text="Edit"
                    /></div>}
                  </div>
                </div>
                {/* Edit Footer */}
                <div style={{ padding: "18px" }} >
                  <Modal
                    isOpen={this.state.openEditModal}
                    isModeless={false}
                    containerClassName={contentStyles.container}>
                    <div style={{ padding: "18px" }}>
                      <div style={{ display: "flex" }}>
                        <span style={{ textAlign: "center", display: "flex", justifyContent: "center", flexGrow: "1", width: "450px", fontSize: "20px", fontFamily: 'sans-serif', fontWeight: "400" }}><b>Send For Review</b></span>
                        <IconButton
                          iconProps={CancelIcon}
                          ariaLabel="Close popup modal"
                          onClick={this.editFooterModalClose}
                          styles={iconButtonStyles} />
                      </div>
                      <div>
                        <table>
                          {this.state.footerdataitem.map((item: any) => (
                            <tr>
                              <td>{item.Title}</td>
                              <td> <IconButton
                                styles={iconButtonStyles}
                                iconProps={MoreIcon}
                                ariaLabel="More options"
                                onClick={() => this.editFooterItem(item.Id)}
                              /></td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>

                  </Modal>
                </div>
                {/* Edit Item Footer */}
                <div style={{ padding: "18px" }} >
                  <Modal
                    isOpen={this.state.openEditItemModal}
                    isModeless={false}
                    containerClassName={contentStyles.container}>
                    <div style={{ padding: "18px" }}>
                      <div style={{ display: "flex" }}>
                        <span style={{ textAlign: "center", display: "flex", justifyContent: "center", flexGrow: "1", width: "450px", fontSize: "20px", fontFamily: 'sans-serif', fontWeight: "400" }}><b>Send For Review</b></span>
                        <IconButton
                          iconProps={CancelIcon}
                          ariaLabel="Close popup modal"
                          onClick={this.editFooterModalClose}
                          styles={iconButtonStyles} />
                      </div>
                      <div>
                        <table>
                          {this.state.footerdataitem.map((item: any) => (
                            <tr>
                              <td>{item.Title}</td>
                              <td> <IconButton
                                styles={iconButtonStyles}
                                iconProps={MoreIcon}
                                ariaLabel="More options"
                                onClick={() => this.editFooterItem(item.Id)}
                              /></td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>

                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
