import * as React from 'react';
import styles from './Welcome.module.scss';
import type { IWelcomeProps, IWelcomeState } from '../interfaces/IWelcomeProps';
// import { SearchBox } from '@fluentui/react';
import { PrimaryButton } from 'office-ui-fabric-react';
import { WelcomeService } from '../services';


export default class Welcome extends React.Component<IWelcomeProps,IWelcomeState, {}> {
  private _service: any;

  public constructor(props: IWelcomeProps) {
    super(props);
    this._service = new WelcomeService(this.props.context);

    this.state = {
      displayName: "",
    
    }

    this.getUser = this.getUser.bind(this);
    this.getData = this.getData.bind(this);
    this.onClickHomePage = this.onClickHomePage.bind(this);
    
  }

  public async componentDidMount() {
    await this.getUser();
    await this.getData();
  }

  public async getUser(){
    const getcurrentuser = await this._service.getCurrentUser();
    console.log('getcurrentuser: ', getcurrentuser);
    this.setState({ displayName : getcurrentuser.Title})
  }

  public async getData (){
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    const getBannerDetails = await this._service.getListItems("WelcomeBanner", url)
    console.log('getBannerDetails: ', getBannerDetails);    
    // this.setState({listItems : getEmployee})
    // console.log('listItems: ', this.state.listItems);

  }

  public onClickHomePage() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    window.location.href = url;
  };
 
  public render(): React.ReactElement<IWelcomeProps> {
    const {
    } = this.props;



    return (

      <section >
        <div className={styles.msGrid} dir="ltr" >
          <div className={styles.msRow}>
            <div className={styles.msCol} >
              <div
                // style={{ background: `url(${require("../assets/bgone.jpg")})` }}
                style={{ backgroundImage: `url(${this.props.welcomeBannerImage})` }}
                className={styles.welcomebgimage}>

                <div className={styles.oneheading}>{"Welcome,"} {this.state.displayName}{"!"}</div>
                {/* <div className={styles.searchdiv}>
                  <SearchBox
                    className={styles.searchbox}
                    placeholder="Search"
                  />
                </div> */}
                <div className={styles.buttondivOne}>
                  <PrimaryButton
                    text='Request Forms'
                    className={styles.buttonstyles}
                    onClick={this.onClickHomePage}
                  />
                  <PrimaryButton
                    text='Templates'
                    className={styles.buttonstyles}
                     onClick={this.onClickHomePage}
                  />
                  <PrimaryButton
                    text='Applications'
                    className={styles.buttonstyles}
                     onClick={this.onClickHomePage}
                  />
                  <PrimaryButton
                    text='Employee Handbook'
                    className={styles.buttonstyles}
                     onClick={this.onClickHomePage}
                  />
                  <PrimaryButton
                    text='Marketing Collateral'
                    className={styles.buttonstyles}
                  />
                </div>
                <div className={styles.buttondivTwo}>
                  <PrimaryButton
                    text='Poliicies & Procedures'
                    className={styles.buttonstyles}
                     onClick={this.onClickHomePage}
                  />
                  
                  <PrimaryButton
                    text='SOPs'
                    className={styles.buttonstyles}
                     onClick={this.onClickHomePage}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
