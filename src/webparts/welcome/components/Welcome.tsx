import * as React from 'react';
import styles from './Welcome.module.scss';
import type { IWelcomeProps, IWelcomeState } from '../interfaces/IWelcomeProps';
// import { SearchBox } from '@fluentui/react';
import { PrimaryButton } from 'office-ui-fabric-react';
import { WelcomeService } from '../services';


export default class Welcome extends React.Component<IWelcomeProps, IWelcomeState, {}> {
  private _service: any;

  public constructor(props: IWelcomeProps) {
    super(props);
    this._service = new WelcomeService(this.props.context);

    this.state = {
      displayName: "",
      bannerDetails: []

    }

    this.getUser = this.getUser.bind(this);
    this.getData = this.getData.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

  }

  public async componentDidMount() {
    await this.getUser();
    await this.getData();
  }

  public async getUser() {
    try {
      const getcurrentuser = await this._service.getCurrentUser();
      this.setState({ displayName: getcurrentuser.Title });
    } catch (error) {
      console.error("Error fetching current user:", error);     
    }
  }
  
  public async getData() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
  
    try {
      const getBannerDetails = await this._service.getListItems(this.props.welcomeBannerList, url);
      this.setState({ bannerDetails: getBannerDetails });
    } catch (error) {
      console.error("Error fetching banner details:", error);
    }
  }
  

  private handleButtonClick(url: string) {
    window.open(url, '_blank');
  }

  public render(): React.ReactElement<IWelcomeProps> {
    const {
    } = this.props;

    return (

      <section >
        <div className={styles.msGrid} dir="ltr" >
          <div className={styles.msRow}>
            <div className={styles.msCol} >
              <div
                style={{ backgroundImage: `url(${this.props.welcomeBannerImage})` }}
                className={styles.welcomebgimage}>

                <div className={styles.welcomeheading}>{"Welcome,"} {this.state.displayName}{"!"}</div>

                <div className={styles.buttoncontainer} >
                  {this.state.bannerDetails.map((item: any) => (
                    <PrimaryButton
                      key={item.ID}
                      text={item.Title}
                      className={styles.buttonstyles}
                      onClick={() => this.handleButtonClick(item.Link.Url)}
                    />
                  ))}
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
