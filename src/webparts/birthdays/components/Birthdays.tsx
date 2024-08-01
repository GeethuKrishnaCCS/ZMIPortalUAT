import * as React from 'react';
import styles from './Birthdays.module.scss';
import { IBirthdaysProps, IBirthdaysState } from '../interfaces/IBirthdaysProps';
import { BirthdaysService } from '../services';
import { IIconProps, IconButton } from '@fluentui/react';
import { Person } from '@microsoft/mgt-react';

import * as moment from 'moment';
import { TemplateHelper } from '@microsoft/mgt';



export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdaysState, {}> {
  private _service: any;
  public constructor(props: IBirthdaysProps) {
    super(props);
    this._service = new BirthdaysService(this.props.context);

    this.state = {
      listItems: [],
      today: "",
      greetings: [],
      currentIndex: 0,
      itemsPerPage: this.props.NoOfItemDisplay !== "" ? parseInt(this.props.NoOfItemDisplay) : 3,
    }

    this.getAnniversaryDetail = this.getAnniversaryDetail.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
    this.handleScrollDown = this.handleScrollDown.bind(this);
    this.getEmployeeDetail = this.getEmployeeDetail.bind(this);
  }

  public async componentDidMount() {
    await this.getAnniversaryDetail();
  }

  public async getAnniversaryDetail() {
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
          console.error('Error in Fetching Data:', item, itemError);
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

  public getEmployeeDetail(_name: any, _email: any) {
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

    const { greetings, currentIndex, itemsPerPage } = this.state;
    const displayedItems = greetings.slice(currentIndex, currentIndex + itemsPerPage);

    return (
      <section className={`${styles.birthdays} ${hasTeamsContext ? styles.teams : ''}`}>

        <div>
          <div className={styles.defaultBirthdayLabel}>{this.props.webpartName}</div>
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
                        person-details={JSON.stringify(this.getEmployeeDetail(item.Employee.Title, item.Employee.EMail))}
                        styles={{ fontSize: "14px", fontFamily: 'var(--fontFamilyCustomFont500, var(--fontFamilyBase))' }}
                        show-name
                        avatarType='initials'
                        avatarSize='large'
                      >
                        <template data-type="line3">
                          <div className={styles.secondarytextstyle}>
                            {item.type === 'Birthday' ? `${this.props.bdayGreetingWish} on ${moment(item.DateOfBirth).format('MMM DD')}` :
                              item.type === 'Work Anniversary' ? `${this.props.WorkGreetingWish} on ${moment(item.DateOfJoining).format('MMM DD')}` :
                                item.type === 'Wedding Anniversary' ? `${this.props.weddingGreetingWish} on ${moment(item.DateOfWedding).format('MMM DD')}` : ''}
                          </div>
                        </template>
                      </mgt-person>
                    </div>

                    <Person
                    //  personQuery={item.Employee.Title}
                    //  view="oneline"
                    // avatarType='initials'
                    />
                  </div>
                ))
              ) : (
                <div>{"No Anniversaries Today"}</div>
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

