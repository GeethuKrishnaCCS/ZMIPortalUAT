import * as React from 'react';
import styles from './WelcomeEmployee.module.scss';
import type { IWelcomeEmployeeProps, IWelcomeEmployeeState } from '../interfaces/IWelcomeEmployeeProps';
import { welcomeEmployeeService } from '../services';
import StackStyle from './StackStyle';
import * as _ from 'lodash';


export default class WelcomeEmployee extends React.Component<IWelcomeEmployeeProps, IWelcomeEmployeeState, {}> {

  private _service: any;
  public constructor(props: IWelcomeEmployeeProps) {
    super(props);
    this._service = new welcomeEmployeeService(this.props.context);

    this.state = {
      listItems: [],
    }
    this.getData = this.getData.bind(this);

  }

  public async componentDidMount() {
    await this.getData();
  }

  public async getData() {
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    
    try {
      const getEmployee = await this._service.getListItems(this.props.WelcomeEmployeelistname, url);
      const sortedemployees = _.orderBy(getEmployee, (e: any) => {
        return e.Id;
    }, ['desc']);
      this.setState({ listItems: sortedemployees });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  

  public render(): React.ReactElement<IWelcomeEmployeeProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.welcomeEmployee} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <div className={styles.heading}>{"Welcome to ZMI Holdings"}</div>
          <div className={styles.subheading}>{this.props.WelcomeGreeting}</div>
          <StackStyle listItems={this.state.listItems} context={this.props.context} />
        </div>
      </section>
    );
  }
}
