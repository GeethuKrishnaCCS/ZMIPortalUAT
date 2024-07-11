import * as React from 'react';
import styles from './Calender.module.scss';
import { ICalenderProps, ICalenderState } from '../interfaces/ICalenderProps';
import { Calendar, DateObject } from "react-multi-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseService } from '../services';
import * as moment from "moment";
export default class Calender extends React.Component<ICalenderProps, ICalenderState, {}> {
  private _Service: BaseService;
  public constructor(props: ICalenderProps) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      eventdataArray: [],
      nodataFound: "",
      recurrenceDates:[]
    }
    this._Service = new BaseService(this.props.context);
    //this.dateChange =this.dateChange.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }
  public async componentDidMount(): Promise<void> {
    const today = moment(new Date().setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS');
    const nextDay = moment(today).add(1, 'days').format('YYYY-MM-DDT00:00:00.SSSSSSS');
    console.log(nextDay)
    const eventdataArray: any[] = [];
    const eventdata = await this._Service.getevents(this.props.context, today, nextDay)
    console.log(eventdata);
    if (eventdata.length > 0) {
      
      for (let i = 0; i < eventdata.length; i++) {
        const recurrence = eventdata[i].recurrence
        const startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
        const endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
        const starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
        const endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
        const eventdatavalue: any = {
          startDate: startDate,
          endDate: endDate,
          subject: eventdata[i].subject,
          startTime: starttime,
          endTime: endtime,
          recurrence: recurrence
        };
        eventdataArray.push(eventdatavalue);

      }
    }
    else {
      this.setState({ nodataFound: "No Data Found" })
    }
    console.log(eventdataArray);
    this.setState({ eventdataArray: eventdataArray });
  }
 

  public dateChange(dates: DateObject[]) {
    const [start, end] = dates;
    const startDate = start.toDate();
    const endDate = end !== undefined ? end.toDate() : start.toDate();
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
    this.searchEvents(startDate, endDate);

  }
  public async searchEvents(startDate: Date, endDate: Date) {
    const eventdataArray: any[] = [];
    let rstartDate:any;
    let rendDate:any;
    let recurrencetype:any;
    let recurrenceday:any;
    let recurrencedaysArray:any[]=[];
    let recurrencedays:any;
    const eventdata = await this._Service.getevents(this.props.context,
      moment(startDate.setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS'),
      moment(endDate.setMilliseconds(0)).format('YYYY-MM-DDT23:59:00.SSSSSSS'));
      
    if (eventdata.length > 0) {
      console.log(eventdata)
      for (let i = 0; i < eventdata.length; i++) {
        const startDate = moment(new Date(eventdata[i].start.dateTime)).format("MMM-DD");
        const endDate = moment(new Date(eventdata[i].end.dateTime)).format("MMM-DD");
        const starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
        const endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
        const recurrence = eventdata[i].recurrence;
        if(recurrence!=null){
          rstartDate = moment(new Date(recurrence.range.startDate)).format("MMM-DD");
          rendDate = moment(new Date(recurrence.range.endDate)).format("MMM-DD");
          recurrencetype = recurrence.pattern.type;
          if(recurrencetype === "relativeMonthly"){
            recurrencedaysArray = [];
            const daysOfWeek = eventdata[i].recurrence.pattern.daysOfWeek
            for (let i = 0; i < daysOfWeek.length; i++) {
            recurrenceday = "Every "+daysOfWeek[i];
            recurrencedaysArray.push(recurrenceday);
          }
          recurrencedays = recurrencedaysArray.join(', ');
        }
        else if(recurrencetype === "absoluteYearly"){
          let daytype:any;
          let monthtype:any;
          recurrencedaysArray = [];
          const dayOfMonth = eventdata[i].recurrence.pattern.dayOfMonth
          const month = eventdata[i].recurrence.pattern.month
          if(dayOfMonth === 1 ){daytype = "st"}
          else if(dayOfMonth === 2 ){daytype = "nd"}
          else if(dayOfMonth === 3 ){daytype = "rd"}
          else{daytype = "th"}
          if(month === 1 ){monthtype = "st"}
          else if(month === 2 ){monthtype = "nd"}
          else if(month === 3 ){monthtype = "rd"}
          else{monthtype = "th"}
          recurrencedays = dayOfMonth +daytype +" day of "+ month +monthtype +" month"
        }
        else if(recurrencetype === "weekly"){
          recurrencedaysArray = [];
          const daysOfWeek = eventdata[i].recurrence.pattern.daysOfWeek
            for (let i = 0; i < daysOfWeek.length; i++) {
            recurrenceday = "Every "+daysOfWeek[i];
            recurrencedaysArray.push(recurrenceday);
          }
          recurrencedays = recurrencedaysArray.join(', ');
        }   
      }     
        const eventdatavalue: any = {
          startDate:recurrence!=null?rstartDate: startDate,
          endDate: recurrence!=null?rendDate:endDate,
          subject: eventdata[i].subject,
          startTime: starttime,
          endTime: endtime,
          recurrence: recurrence,
          isOnlineMeeting:eventdata[i].isOnlineMeeting,
          onlineMeetingUrl:eventdata[i].isOnlineMeeting === true?eventdata[i].onlineMeeting.joinUrl:"",
          eventdays:recurrencedays
        };
        
        eventdataArray.push(eventdatavalue);
      }
      
    }
    else {
      this.setState({ nodataFound: "No Data Found" })
    }
    console.log(eventdataArray)
    this.setState({ eventdataArray: eventdataArray });
  }
 
  public render(): React.ReactElement<ICalenderProps> {
    return (
      <section className={`${styles.calender} `}>
        <Calendar
          onChange={(dateObjects) => this.dateChange(dateObjects)}
          range
          rangeHover
        />
        {this.state.eventdataArray.length > 0 &&
          <div className={styles.border}>
            {this.state.eventdataArray.map((item: any, key: any) => {
              return (
                <div className={styles.flex}>
                  <div className={styles.fadebg}>{item.startDate}-{item.endDate}</div>
                  <div className={styles.rightcnt}>
                    {item.recurrence !== null && <div className={styles.recurr}>Recurring Events</div>}
                    {item.recurrence === null && <div className={styles.recurr}>{item.subject}</div>}
                    {item.recurrence !== null && <div className={styles.recurr}>{item.eventdays}</div>}
                    {item.isOnlineMeeting!== false &&<div className={styles.subject}><a href={item.onlineMeetingUrl} target="_blank">
                          Meeting
                        </a></div>}
                    <div>{item.startTime}-{item.endTime}</div>
                    <hr />
                  </div>
                </div>
              )
            })}
          </div>
        }
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
