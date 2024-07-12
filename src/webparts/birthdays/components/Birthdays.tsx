import * as React from 'react';
import styles from './Birthdays.module.scss';
// import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdaysProps, IBirthdaysState } from '../interfaces/IBirthdaysProps';
import { BirthdaysService } from '../services';

// import { Person } from '@microsoft/mgt-react';
import { IIconProps, IconButton, } from '@fluentui/react';
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
      scrollIndex: 0,

    }
    this.getData = this.getData.bind(this);

  }

  public async componentDidMount() {
    await this.getData();
  }

  public async componentDidUpdate(prevProps: IBirthdaysProps) {
    if (prevProps.NoOfItemDisplay !== this.props.NoOfItemDisplay) {
      // Adjust the scroll index if the number of items to display changes
      this.setState((prevState) => ({
        scrollIndex: Math.min(prevState.scrollIndex, Math.max(prevState.greetings.length - this.props.NoOfItemDisplay, 0)),
      }));
    }
  }


  public async getData() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    const listItem = await this._service.getItemSelectExpand(url, this.props.listName, "*, Employee/ID, Employee/Title", "Employee");
    console.log('listItem: ', listItem);
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
      console.log('this.state.greetings: ', this.state.greetings);

      // this.state.greetings.forEach((greeting: any) => {
      //   console.log('Email: ', greeting.employeeInfo.Email);
      // });
    });
  }

  public handleScrollUp = () => {
    this.setState((prevState) => ({
      scrollIndex: Math.max(prevState.scrollIndex - 1, 0),
    }));
  };

  public handleScrollDown = () => {
    this.setState((prevState) => ({
      scrollIndex: Math.min(prevState.scrollIndex + 1, Math.max(prevState.greetings.length - this.props.NoOfItemDisplay, 0)),
    }));
  };

  public render(): React.ReactElement<IBirthdaysProps> {
    const {

      hasTeamsContext
    } = this.props;
    const ChevronUp: IIconProps = { iconName: 'ChevronUp' };
    const ChevronDown: IIconProps = { iconName: 'ChevronDown' };

    return (
      <section className={`${styles.birthdays} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <div>
            <div className={styles.defaultBirthdayLabel}>{"Anniversaries"}</div>
            <div className={styles.box}>
              <div className={styles.uparrow}>
                <IconButton
                  iconProps={ChevronUp}
                  ariaLabel="Scroll up"
                  onClick={this.handleScrollUp}
                  disabled={this.state.scrollIndex === 0}
                  className={styles.customIconButton}
                />
              </div>
              <div className={styles.hr}/>
              <div className={styles.employee}>
                {this.state.greetings.length > 0 ? (
                  this.state.greetings.slice(this.state.scrollIndex, this.state.scrollIndex + this.props.NoOfItemDisplay).map((item: any, index: any) => (
                    <div key={index} className={styles.personaDiv}>

                      <Person
                        personQuery={item.Employee.Title}
                        view="oneline"
                        // view="twolines"
                        personCardInteraction='hover'
                        avatarType='photo'

                      //   line2Property ={item.type === 'Birthday' ? `Birthday on ${moment(item.DateOfBirth).format('MMM DD')}` : 
                      // item.type === 'Work Anniversary' ? `Work Anniversary on ${moment(item.DateOfJoining).format('MMM DD')}` :
                      // item.type === 'Wedding Anniversary' ? `Wedding Anniversary on ${moment(item.DateOfWedding).format('MMM DD')}` : ''}
                      />
                      <div>{item.type === 'Birthday' ? `Birthday on ${moment(item.DateOfBirth).format('MMM DD')}` :
                        item.type === 'Work Anniversary' ? `Work Anniversary on ${moment(item.DateOfJoining).format('MMM DD')}` :
                          item.type === 'Wedding Anniversary' ? `Wedding Anniversary on ${moment(item.DateOfWedding).format('MMM DD')}` : ''}
                      </div>

                    </div>
                  ))
                ) : (
                  <div>No Anniversaries Today</div>
                )}
              </div>
              <div className={styles.hr}/>
              <div className={styles.downarrow}>
                <IconButton
                  iconProps={ChevronDown}
                  ariaLabel="Scroll down"
                  onClick={this.handleScrollDown}
                  disabled={this.state.scrollIndex >= this.state.greetings.length - this.props.NoOfItemDisplay}
                  className={styles.customIconButton}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

