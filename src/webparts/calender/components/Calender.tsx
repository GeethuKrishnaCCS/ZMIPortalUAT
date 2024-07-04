import * as React from 'react';
import styles from './Calender.module.scss';
import { ICalenderProps, ICalenderState } from '../interfaces/ICalenderProps';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseService } from '../services';
import { IIconProps, IconButton } from '@fluentui/react';
import * as moment from "moment";

export default class Calender extends React.Component<ICalenderProps,ICalenderState, {}> {
  private _Service: BaseService;
  public constructor(props: ICalenderProps) {
    super(props);
    this.state = {
      startDate :new Date(),
      endDate: new Date(),
      eventdataArray:[]

    }
    this._Service = new BaseService(this.props.context);
    this.dateChange =this.dateChange.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }
  public async componentDidMount(): Promise<void> {
    const today = moment(new Date().setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS');
    const nextDay = moment(today).add(1, 'days').format('YYYY-MM-DDT00:00:00.SSSSSSS');
   console.log(nextDay)
    let eventdataArray : any[] = [];
    const eventdata = await this._Service.getevents(this.props.context,today,nextDay)
    console.log(eventdata);
    for (let i = 0; i < eventdata.length; i++) {
      let startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
      let endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
      let starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
      let endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
      let recurrence = eventdata[i].recurrence
    let recurrenddate =recurrence !== null? recurrence.range.endDate:""
        const eventdatavalue :any = {
          startDate: startDate,
          endDate:endDate,
          subject: eventdata[i].subject,
          startTime:starttime,
          endTime:endtime,
          recurrence:recurrence,
        recurrenddate:recurrenddate
        };
        eventdataArray.push(eventdatavalue);
      
    }
     console.log(eventdataArray);
     this.setState({eventdataArray:eventdataArray});

  }
 public dateChange = async (dates: [any, any]) => {
  const [start, end] = dates;{
    this.setState({
      startDate : start,
      endDate : end
    });
    // if(end === null){
    //   this.setState({endDate : new Date()});
    //   await this.submit()
    // }
    
  }
 
 }
 public async searchEvents(){
  let eventdataArray : any[] = [];
  // let selectedStartdate = moment(new Date(this.state.startDate)).format("DD/MMM/YYYY");
  // let selectedEnddate = moment(new Date(this.state.endDate)).format("DD/MMM/YYYY");
  const eventdata = await this._Service.getevents(this.props.context,moment(this.state.startDate).format('YYYY-MM-DDT00:00:00.SSSSSSS'),moment(this.state.endDate).format('YYYY-MM-DDT23:59:00.SSSSSSS'))
  
  for (let i = 0; i < eventdata.length; i++) {
    let startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
    let endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
    let starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
    let endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
    let recurrence = eventdata[i].recurrence
    let recurrenddate =recurrence !== null? recurrence.range.endDate:""
    // if(new Date(startDate) <= new Date(selectedStartdate) && new Date(selectedEnddate)>=new Date(endDate)){
      const eventdatavalue :any = {
        startDate: startDate,
        endDate:endDate,
        subject: eventdata[i].subject,
        startTime:starttime,
        endTime:endtime,
        recurrence:recurrence,
        recurrenddate:recurrenddate
      };
      eventdataArray.push(eventdatavalue);
    // }
  }   
  console.log(eventdataArray);
   
  this.setState({eventdataArray:eventdataArray});
}
//  public loadtasks(){
//   //Send Email uisng MS Graph
//   this._Service.getevents(this.state.startDate,this.state.endDate);
//  }
  public render(): React.ReactElement<ICalenderProps> {
   const searchicon: IIconProps = { iconName: 'Search' };

    return (
      <section className={`${styles.calender} `}>
        
      <DatePicker
      selected={this.state.startDate}
      onChange={this.dateChange}
      startDate={this.state.startDate}
      endDate={this.state.endDate}
      selectsRange
      inline
    />
    <IconButton iconProps={searchicon} onClick={this.searchEvents} ariaLabel={"Search"} />
    {/* <PrimaryButton id="b2" onClick={this.submit}>Submit</PrimaryButton> */}
    {this.state.eventdataArray.map((item: any, key: any) => {
        return (<div className={styles.border}>
          <div className={styles.flex}>
      <div className={styles.fadebg}>{item.startDate}</div>
      <div className={styles.rightcnt}>
        {item.recurrence !== null && <div>Recurring Events</div>}
        <div>{item.subject}</div>
        <div>{item.startTime}-{item.endTime}</div>
      </div>
      </div>
    </div>)})}
    
    
    

      </section>
    );
  }
}
