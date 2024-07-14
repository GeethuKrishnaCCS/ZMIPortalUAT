import * as React from 'react';
import styles from './WelcomeEmployee.module.scss';
import type { IWelcomeEmployeeProps, IWelcomeEmployeeState } from '../interfaces/IWelcomeEmployeeProps';
import { welcomeEmployeeService } from '../services';
import StackStyle from './StackStyle';


export default class WelcomeEmployee extends React.Component<IWelcomeEmployeeProps,IWelcomeEmployeeState, {}> {

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

  public async getData (){
    const url: string = this.props.context.pageContext.web.serverRelativeUrl;
    const getEmployee = await this._service.getListItems("WelcomeEmployee", url)
    // console.log('getEmployee: ', getEmployee);
    this.setState({listItems : getEmployee})
    console.log('listItems: ', this.state.listItems);

  }

  public render(): React.ReactElement<IWelcomeEmployeeProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.welcomeEmployee} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <div className={styles.heading}>{"Welcome to ZMI Holdings"}</div>
          <div className={styles.subheading}>{"Welcome new colleague to the team"}</div>
          <StackStyle listItems={this.state.listItems} context={this.props.context} /> 
        </div>
      </section>
    );
  }
}
