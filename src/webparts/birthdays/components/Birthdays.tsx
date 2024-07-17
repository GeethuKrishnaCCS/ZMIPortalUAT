import * as React from 'react';
import styles from './Birthdays.module.scss';
// import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdaysProps, IBirthdaysState } from '../interfaces/IBirthdaysProps';
import { BirthdaysService } from '../services';

// import { Person } from '@microsoft/mgt-react';
import { IIconProps, IconButton } from '@fluentui/react';
import { Person } from '@microsoft/mgt-react/dist/es6/spfx';
import * as moment from 'moment';
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

  }

  public async componentDidMount() {
    await this.getData();
  }



  public async getData() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    const listItem = await this._service.getItemSelectExpand(url, this.props.listName, "*, Employee/ID, Employee/Title", "Employee");
    // console.log('listItem: ', listItem);
    this.setState({ listItems: listItem });

    const greetings: any[] = [];
    const currentDate = new Date();
    const todayDate = currentDate.toLocaleDateString('en-GB');

    const greetingsPromises = listItem.map(async (item: any) => {
      const dateOfBirth = new Date(item.DateOfBirth);
      const formattedDate = dateOfBirth.toLocaleDateString('en-GB');

      const dateOfJoining = new Date(item.DateOfJoining);
      const formattedDOJ = dateOfJoining.toLocaleDateString('en-GB');

      const dateOfWedding = new Date(item.DateOfWedding);
      const formattedDOW = dateOfWedding.toLocaleDateString('en-GB');

      const employeeInfo = await this._service.getUser(item.Employee.ID);

      if (formattedDate === todayDate && this.props.BdayToggleValue) {
        greetings.push({ ...item, type: 'Birthday', employeeInfo });
      }
      if (formattedDOJ === todayDate && this.props.WorkToggleValue) {
        greetings.push({ ...item, type: 'Work Anniversary', employeeInfo });
      }
      if (formattedDOW === todayDate && this.props.WeddingToggleValue) {
        greetings.push({ ...item, type: 'Wedding Anniversary', employeeInfo });
      }
    });

    await Promise.all(greetingsPromises);

    this.setState({
      greetings: greetings,
      today: todayDate,
    }, () => {
    });
  }


  private handleScrollUp() {
    const newIndex = Math.max(this.state.currentIndex - this.state.itemsPerPage, 0);
    this.setState({ currentIndex: newIndex });
    console.log('upcurrentIndex: ', this.state.currentIndex);
  }


  private handleScrollDown() {
    const newIndex = Math.min(this.state.currentIndex + this.state.itemsPerPage, this.state.greetings.length - 1);
    this.setState({ currentIndex: newIndex });
    console.log('downcurrentIndex: ', this.state.currentIndex);
  }


  public render(): React.ReactElement<IBirthdaysProps> {
    const { hasTeamsContext } = this.props;
    const ChevronUp: IIconProps = { iconName: 'ChevronUp' };
    const ChevronDown: IIconProps = { iconName: 'ChevronDown' };

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
                  <div key={index} >

                    <Person
                      personQuery={item.Employee.Title}
                      view="twolines"
                      personCardInteraction='hover'
                      avatarType='photo'
                      avatarSize='large'
                      line2Property='hiiii'
                    />
                    <div className={styles.secondarytextstyle}>{item.type === 'Birthday' ? `Birthday on ${moment(item.DateOfBirth).format('MMM DD')}` :
                      item.type === 'Work Anniversary' ? `Work Anniversary on ${moment(item.DateOfJoining).format('MMM DD')}` :
                        item.type === 'Wedding Anniversary' ? `Wedding Anniversary on ${moment(item.DateOfWedding).format('MMM DD')}` : ''}
                    </div>


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

