import * as React from 'react';
import styles from './Birthdays.module.scss';
// import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdaysProps, IBirthdaysState } from '../interfaces/IBirthdaysProps';
import { BirthdaysService } from '../services';
import * as moment from 'moment';
import { IIconProps, IconButton, Persona, PersonaPresence, PersonaSize } from '@fluentui/react';


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

      const employeeInfo = await this._service.getUser(item.Employee.ID);

      if (formattedDate === todayDate) {
        greetings.push({ ...item, type: 'Birthday', employeeInfo });
      }
      if (formattedDOJ === todayDate) {
        greetings.push({ ...item, type: 'Work Anniversary', employeeInfo });
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
      scrollIndex: Math.min(prevState.scrollIndex + 1, prevState.greetings.length - 4),
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
              />
            </div>
            <div className={styles.hr}></div>
            <div className={styles.employee}>
              {this.state.greetings.length > 0 ? (
                this.state.greetings.slice(this.state.scrollIndex, this.state.scrollIndex + 4).map((item: any, index: any) => (
                  <div key={index} className={styles.personaDiv}>
                    <Persona
                      text={item.Employee.Title}
                      secondaryText={`${item.type} on ${item.type === 'Birthday' ? moment(item.DateOfBirth).format("MMM DD") : moment(item.DateOfJoining).format("MMM DD")}`}
                      imageUrl={
                        "https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=" +
                        item.employeeInfo.Email +
                        "&UA=0&sc=1538493608488"
                      }
                      size={PersonaSize.size40}
                      presence={PersonaPresence.none}
                    />
                  </div>
                ))
              ) : (
                <div>No Anniversaries Today</div>
              )}
            </div>
            <div className={styles.hr}></div>
            <div className={styles.downarrow}>
              <IconButton
                iconProps={ChevronDown}
                ariaLabel="Scroll down"
                onClick={this.handleScrollDown}
                disabled={this.state.scrollIndex >= this.state.greetings.length - 4}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  }
}

