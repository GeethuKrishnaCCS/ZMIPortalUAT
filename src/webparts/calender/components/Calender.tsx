import * as React from 'react';
import styles from './Calender.module.scss';
import { ICalenderProps, ICalenderState } from '../interfaces/ICalenderProps';
import { Calendar, DateObject } from "react-multi-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseService } from '../services';
// import { IIconProps, IconButton } from '@fluentui/react';
import * as moment from "moment";
// import { rrulestr } from 'rrule';

export default class Calender extends React.Component<ICalenderProps,ICalenderState, {}> {
  private _Service: BaseService;
  public constructor(props: ICalenderProps) {
    super(props);
    this.state = {
      startDate :new Date(),
      endDate: new Date(),
      eventdataArray:[],
      nodataFound:""

    }
    this._Service = new BaseService(this.props.context);
    //this.dateChange =this.dateChange.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }
  public async componentDidMount(): Promise<void> {
    const today = moment(new Date().setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS');
    const nextDay = moment(today).add(1, 'days').format('YYYY-MM-DDT00:00:00.SSSSSSS');
   console.log(nextDay)
    const eventdataArray : any[] = [];
    const eventdata = await this._Service.getevents(this.props.context,today,nextDay)
    console.log(eventdata);
    if(eventdata.length >0){
    for (let i = 0; i < eventdata.length; i++) {
      const startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
      const endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
      const starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
      const endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
      const recurrence = eventdata[i].recurrence
      const recurrenddate =recurrence !== null? recurrence.range.endDate:""
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
  }
  else{
    this.setState({nodataFound : "No Data Found"})
  }
     console.log(eventdataArray);
     this.setState({eventdataArray:eventdataArray});

  }
//  public dateChange = async (dates: [any, any]) => {
//   const [start, end] = dates;{
//     this.setState({
//       startDate : start,
//       endDate : end
//     });
//     // if(end === null){
//     //   this.setState({endDate : new Date()});
//     //   await this.submit()
//     // }
    
//   }
 
//  }
public dateChange(dates: DateObject[]){
  const [start, end] = dates;
    const startDate = start.toDate();
    const endDate = end !== undefined ? end.toDate() : start.toDate();
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  this.searchEvents(startDate,endDate);
 
}
 public async searchEvents(startDate:Date,endDate:Date){
  const eventdataArray : any[] = [];
  console.log()
  // let selectedStartdate = moment(new Date(this.state.startDate)).format("DD/MMM/YYYY");
  // let selectedEnddate = moment(new Date(this.state.endDate)).format("DD/MMM/YYYY");
  const eventdata = await this._Service.getevents(this.props.context,
    moment(startDate.setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS'),
    moment(endDate.setMilliseconds(0)).format('YYYY-MM-DDT23:59:00.SSSSSSS'))
  if(eventdata.length >0){
  for (let i = 0; i < eventdata.length; i++) {
    const startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
    const endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
    const starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
    const endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
    const recurrence = eventdata[i].recurrence
    // if(recurrence!=null){
    //   if (eventdata[i].RecurrenceData) {
    //     const recurrenceInstances = this.parseRecurrenceData(eventdata[i].RecurrenceData, startDate);
    //     console.log(recurrenceInstances)
    //   }
   
    // //console.log(processedEvents)
    // }
    const recurrenddate =recurrence !== null? recurrence.range.endDate:""
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
}
else{
  this.setState ({nodataFound:"No Data Found"})
}
  console.log(eventdataArray);
   
  this.setState({eventdataArray:eventdataArray});
}
// public parseRecurrenceData(recurrenceData: string, startDate: any) {
//   const ruleSet = rrulestr(recurrenceData, { dtstart: startDate });
//   return ruleSet.all();
// }
 
// public processRecurringEvents(events:any) {
  
  
//   return events.map((event: { ID: any; Title: any; EventDate: string | number; EndDate: string | number; fAllDayEvent: any; RecurrenceData: any; }) => ({
//     id: event.ID,
//     subject: event.Title,
//     startDate: new Date(event.EventDate).toLocaleString(),
//     endDate: event.EndDate ? new Date(event.EndDate).toLocaleString() : null,
//     isAllDay: event.fAllDayEvent,    
//     recurrenceData: event.RecurrenceData,
  
//         startTime:moment(new Date(event.EventDate)).format("hh:mm A"),
//         endTime: moment(new Date(event.EndDate)).format("hh:mm A"),
        
//         // recurrence:recurrence,
//         // recurrenddate:recurrenddate
//   }));
// }
//  public loadtasks(){
//   //Send Email uisng MS Graph
//   this._Service.getevents(this.state.startDate,this.state.endDate);
//  }
  public render(): React.ReactElement<ICalenderProps> {
  //  const searchicon: IIconProps = { iconName: 'Search' };

    return (
      <section className={`${styles.calender} `}>
        <Calendar
  onChange={(dateObjects) => this.dateChange(dateObjects)}
  range
  rangeHover
/>
      {/* <DatePicker
      selected={this.state.startDate}
      onChange={this.dateChange}
      startDate={this.state.startDate}
      endDate={this.state.endDate}
      selectsRange
      inline
     />
    <IconButton iconProps={searchicon} onClick={this.searchEvents} ariaLabel={"Search"} /> */}
    {/* <PrimaryButton id="b2" onClick={this.submit}>Submit</PrimaryButton> */}
    <div>       </div>
    <div>       </div>
   {/* {this.state.nodataFound === "" &&  */}
   {this.state.eventdataArray.length>0 &&
   <div className={styles.border}>
     {this.state.eventdataArray.map((item: any, key: any) => {
        return (
          <div className={styles.flex}>
      <div className={styles.fadebg}>{item.startDate}</div>
      <div className={styles.rightcnt}>
        {item.recurrence !== null && <div className={styles.recurr}>Recurring Events</div>}
        <div className={styles.subject}>{item.subject}</div>
        <div>{item.startTime}-{item.endTime}</div>
        <hr/>
      </div>
      </div>
    )})}
    </div>
  }
    {/* } */}
    {this.state.eventdataArray.length === 0 &&
    <div>
      {this.state.nodataFound !== "" && 
      <div className={styles.border}> No Events Found</div>
      }
      </div>
      }
    
    
    

      </section>
    );
  }
}
