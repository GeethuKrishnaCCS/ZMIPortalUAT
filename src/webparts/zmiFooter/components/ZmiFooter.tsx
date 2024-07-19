import * as React from 'react';
import styles from './ZmiFooter.module.scss';
import { IZmiFooterProps, IZmiFooterState } from '../interfaces/IZmiFooterProps';
import { BaseService } from '../services';

export default class ZmiFooter extends React.Component<IZmiFooterProps,IZmiFooterState, {}> {
  private _Service: BaseService;
  public constructor(props: IZmiFooterProps) {
    super(props);
    this.state = {
      logoUrl: "",
      logolink:"",
      linkedinLogoUrl:"",
      footerdata:[],
      linkedinLogolink:""
    }
    this._Service = new BaseService(this.props.context);
  }
  public async componentDidMount(): Promise<void> {
    const footerdataArray:any[]=[]
    const footerdata = await this._Service.getListItems(this.props.siteUrl, this.props.settingsList)
    console.log(footerdata);
    for (let i = 0; i < footerdata.length; i++) {
      if(footerdata[i].Title !== "Company Logo" && footerdata[i].Title !== "LINKED IN"){
      const categorydata = {
        Title: footerdata[i].Title,
        Link: footerdata[i].Link,
      };
      footerdataArray.push(categorydata);
    }
    this.setState({
      footerdata: footerdataArray,
    });
  }
    const CompanyLogo = footerdata.filter((item: any) => item.Title === "Company Logo");
    if (CompanyLogo.length > 0) {
      this.setState({ logoUrl: CompanyLogo[0].Logo.Url, logolink:CompanyLogo[0].Link});
    }
    const LinkedinLogo = footerdata.filter((item: any) => item.Title === "LINKED IN");
    if (LinkedinLogo.length > 0) {
      this.setState({ linkedinLogoUrl: LinkedinLogo[0].Logo.Url,linkedinLogolink:CompanyLogo[0].Link});
    }

  }
  public render(): React.ReactElement<IZmiFooterProps> {
    return (
      <section className={`${styles.zmiFooter} `}>
       <div className={styles.msGrid} dir="ltr" >
      <div className={styles.msRow}>
       <div className={styles.msCol} >
       <div className={styles.footerbg}>
        <table>
          <tr>
            <td><a href={this.state.logolink} target="_blank"><img className={styles.companylogo} src={this.state.logoUrl} /></a></td>
            {this.state.footerdata.map((item: any) => (
          <td className={styles.itemstyle}><a href={item.Link} target="_blank">{item.Title}</a></td>
        ))}
<td><a href={this.state.linkedinLogolink} target="_blank"><img className={styles.linkedinLogo} src={this.state.linkedinLogoUrl} /></a></td>
        
          </tr>
        </table>
        <div></div>
        
        
        {/* <div>CREATE FORM</div>
        <div>COMPANY NEWSLETTER</div>
        <div>GALLERY</div>
        <div>LINKED IN</div>
        <div>EDIT</div> */}
        </div>
        </div>
        </div>
       </div>
      </section>
    );
  }
}
