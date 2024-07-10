import * as React from 'react';
import styles from './Calender.module.scss';
import { ICalenderProps, ICalenderState } from '../interfaces/ICalenderProps';
import { Calendar, DateObject } from "react-multi-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseService } from '../services';
import * as moment from "moment";
import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';
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
    const eventdata = await this._Service.getevents(this.props.context,
      moment(startDate.setMilliseconds(0)).format('YYYY-MM-DDT00:00:00.SSSSSSS'),
      moment(endDate.setMilliseconds(0)).format('YYYY-MM-DDT23:59:00.SSSSSSS'));
      
    if (eventdata.length > 0) {
      
      for (let i = 0; i < eventdata.length; i++) {
        const startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
        const endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
        const starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
        const endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
        const recurrence = eventdata[i].recurrence;
        if(recurrence!=null){
          const  reccurenceData:any[]=[];
          reccurenceData.push(eventdata[i]);
          const recurdate = await this.generateRecurrence(reccurenceData);
          console.log(recurdate);
        }        
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
    console.log(eventdataArray)
    this.setState({ eventdataArray: eventdataArray });
  }
  public generateRecurrence = (events: any[]) => {
    let dates: Date[] = [];
    events.forEach(async (event) => {
      if(event.recurrence!=null)
        {
      let currentDate = new Date(event.start.dateTime);
      let endDate = new Date(event.recurrence.range.endDate);
 
      while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
        dates.push(new Date(event.start.dateTime));
        let recurrancepattern = event.recurrence!== null?event.recurrence.pattern.type:""
        currentDate = await this.getNextRecurrenceDate(event.start.dateTime,recurrancepattern);
      }
    }
    });
    console.log(dates);
    this.setState({recurrenceDates:dates});
  
  };
  public getNextRecurrenceDate = (currentDate: Date,recurrancepattern:string): Date => {
    switch (recurrancepattern) {
      case 'daily':
        return addDays(currentDate, 1);
      case 'weekly':
        return addWeeks(currentDate, 1);
      case 'monthly':
        return addMonths(currentDate, 1);
      case 'yearly':
        return addYears(currentDate, 1);
      case 'custom':
        // Add custom logic here. For example, every 3 days:
        return addDays(currentDate, 3);
      default:
        return currentDate;
    }
  };
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
                  <div className={styles.fadebg}>{item.startDate}</div>
                  <div className={styles.rightcnt}>
                    {item.recurrence !== null && <div className={styles.recurr}>Recurring Events</div>}
                    <div className={styles.subject}>{item.subject}</div>
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
