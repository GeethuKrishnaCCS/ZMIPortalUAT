import * as React from 'react';
import styles from './Birthdays.module.scss';
// import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdaysProps, IBirthdaysState } from '../interfaces/IBirthdaysProps';
import { BirthdaysService } from '../services';

// import { Person } from '@microsoft/mgt-react';
import { IIconProps, IconButton } from '@fluentui/react';
//import { Person } from '@microsoft/mgt-react/dist/es6/spfx';
import { Person } from '@microsoft/mgt-react';

import * as moment from 'moment';
import { TemplateHelper } from '@microsoft/mgt';
// import { avatarType } from '@microsoft/mgt-spfx';
// import { PersonCardInteraction } from '@microsoft/mgt-spfx';



export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdaysState, {}> {
  private _service: any;
  public constructor(props: IBirthdaysProps) {
    super(props);
    this._service = new BirthdaysService(this.props.context);

    this.state = {
      listItems: [],
      today: "",
      // bdayGreetings: [],
      // workGreetings: [],
      greetings: [],
      currentIndex: "", // Track the current index of displayed items
      itemsPerPage: this.props.NoOfItemDisplay !== "" ? parseInt(this.props.NoOfItemDisplay) : 3,
    }

    this.getData = this.getData.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.personDetail1 = this.personDetail1.bind(this);
  }

  public async componentDidMount() {
    await this.getData();
  }

  public async getData() {
    try {
      const url: string = this.props.context.pageContext.web.serverRelativeUrl;
      const listItem = await this._service.getItemSelectExpand(url, this.props.listName, "*, Employee/ID, Employee/Title,Employee/EMail", "Employee");

      const greetings: any[] = [];
      const currentDate = new Date();
      const todayDate = moment(currentDate).format('MMM DD, YYYY');

      const greetingsPromises = listItem.map(async (item: any) => {
        try {
          const dateOfBirth = moment(item.DateOfBirth).format('MMM DD, YYYY');
          const dateOfJoining = moment(item.DateOfJoining).format('MMM DD, YYYY');
          const dateOfWedding = moment(item.DateOfWedding).format('MMM DD, YYYY');

          const employeeInfo = await this._service.getUser(item.Employee.ID);
          // console.log('employeeInfo: ', employeeInfo);

          if (dateOfBirth === todayDate && this.props.BdayToggleValue) {
            greetings.push({ ...item, type: 'Birthday', employeeInfo });
          }
          if (dateOfJoining === todayDate && this.props.WorkToggleValue) {
            greetings.push({ ...item, type: 'Work Anniversary', employeeInfo });
          }
          if (dateOfWedding === todayDate && this.props.WeddingToggleValue) {
            greetings.push({ ...item, type: 'Wedding Anniversary', employeeInfo });
          }
        } catch (itemError) {
          console.error('Error processing item:', item, itemError);
        }
      });

      await Promise.all(greetingsPromises);

      this.setState({
        greetings: greetings,
        today: todayDate,
      }, () => {
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private handleScrollUp() {
    const newIndex = Math.max(this.state.currentIndex - this.state.itemsPerPage, 0);
    this.setState({ currentIndex: newIndex });
  }

  private handleScrollDown() {
    const newIndex = Math.min(this.state.currentIndex + this.state.itemsPerPage, this.state.greetings.length - 1);
    this.setState({ currentIndex: newIndex });
  }

  public personDetail1(_name: any, _email: any) {
    const det = {
      displayName: _name,
      mail: _email,
      personImage: this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl, '') + '//_layouts/15/userphoto.aspx?size=L&accountname=' + _email
    }
    return det;
  };


  public render(): React.ReactElement<IBirthdaysProps> {
    const { hasTeamsContext } = this.props;
    const ChevronUp: IIconProps = { iconName: 'ChevronUp' };
    const ChevronDown: IIconProps = { iconName: 'ChevronDown' };
    TemplateHelper.setBindingSyntax('[[', ']]');

    //   const personDetail1: any = {
    //     displayName: 'Geethu Krishna',
    //     mail: 'geethu.krishna@ccsdev01.onmicrosoft.com',
    //     personImage: 'https://ccsdev01.sharepoint.com//_layouts/15/userphoto.aspx?size=L&accountname=geethu.krishna@ccsdev01.onmicrosoft.com'
    // };

    const { greetings, currentIndex, itemsPerPage } = this.state;
    const displayedItems = greetings.slice(currentIndex, currentIndex + itemsPerPage);

    return (
      <section className={`${styles.birthdays} ${hasTeamsContext ? styles.teams : ''}`}>

        <div>
          <div className={styles.defaultBirthdayLabel}>{"Anniversaries"}</div>
          <div className={styles.box}>
            <div className={styles.uparrow}>
              <IconButton
                iconProps={ChevronUp}
                ariaLabel="Scroll up"
                onClick={this.handleScrollUp}
                disabled={this.state.currentIndex === 0}
                className={styles.customIconButton}
              />
            </div>

            <div className={styles.employee}>
              {displayedItems.length > 0 ? (
                displayedItems.map((item: any, index: any) => (
                  <div className={styles.persondiv} key={index} >

                    <div >
                      <mgt-person
                        view="threelines"
                        person-details={JSON.stringify(this.personDetail1(item.Employee.Title, item.Employee.EMail))}
                        show-name
                        // show-personImage
                        avatarType={this.personDetail1(item.Employee.Title, item.Employee.EMail).personImage ? "photo" : "initials"}
                        personImage={this.personDetail1(item.Employee.Title, item.Employee.EMail).personImage}
                        avatarSize='large'
                      >
                        <template data-type="line3">
                          <div className={styles.secondarytextstyle}>
                            {item.type === 'Birthday' ? `Birthday on ${moment(item.DateOfBirth).format('MMM DD')}` :
                              item.type === 'Work Anniversary' ? `Work Anniversary on ${moment(item.DateOfJoining).format('MMM DD')}` :
                                item.type === 'Wedding Anniversary' ? `Wedding Anniversary on ${moment(item.DateOfWedding).format('MMM DD')}` : ''}
                          </div>
                        </template>
                      </mgt-person>
                    </div>

                    <Person
                    // personQuery={item.Employee.Title}
                    // view="oneline"
                    />
                  </div>
                ))
              ) : (
                <div>No Anniversaries Today</div>
              )}
            </div>

            <div className={styles.downarrow}>
              <IconButton
                iconProps={ChevronDown}
                ariaLabel="Scroll down"
                onClick={this.handleScrollDown}
                disabled={this.state.currentIndex >= this.state.greetings.length - this.props.NoOfItemDisplay}
                className={styles.customIconButton}
              />
            </div>
          </div>
        </div>

      </section>
    );
  }
}

