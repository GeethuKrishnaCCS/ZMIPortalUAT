import * as React from 'react';
import styles from './Calender.module.scss';
import { ICalenderProps, ICalenderState } from '../interfaces/ICalenderProps';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseService } from '../services';
import { PrimaryButton } from '@fluentui/react';
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
    this.submit = this.submit.bind(this);
  }
  // public async componentDidMount(): Promise<void> {
  //   const today = new Date();
  //   let eventdataArray : any[] = [];
  //   const eventdata = await this._Service.gettodayevents(this.props.context,moment(today).format('YYYY-MM-DDTHH:mm:ss.SSSSSSS'))
  //   console.log(eventdata);
  //   for (let i = 0; i < eventdata.length; i++) {
  //     let startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
  //     let endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
  //     let starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
  //     let endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
  //       const eventdatavalue :any = {
  //         startDate: startDate,
  //         endDate:endDate,
  //         subject: eventdata[i].subject,
  //         startTime:starttime,
  //         endTime:endtime
  //       };
  //       eventdataArray.push(eventdatavalue);
      
  //   }
  //    console.log(eventdataArray);
  //    this.setState({eventdataArray:eventdataArray});

  // }
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
 public async submit(){
  let eventdataArray : any[] = [];
  // let selectedStartdate = moment(new Date(this.state.startDate)).format("DD/MMM/YYYY");
  // let selectedEnddate = moment(new Date(this.state.endDate)).format("DD/MMM/YYYY");
  const eventdata = await this._Service.getevents(this.props.context,moment(this.state.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSSSSS'),moment(this.state.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSSSSS'))
  
  for (let i = 0; i < eventdata.length; i++) {
    let startDate = moment(new Date(eventdata[i].start.dateTime)).format("DD/MMM/YYYY");
    let endDate = moment(new Date(eventdata[i].end.dateTime)).format("DD/MMM/YYYY");
    let starttime = moment(new Date(eventdata[i].start.dateTime)).format("hh:mm A");
    let endtime = moment(new Date(eventdata[i].end.dateTime)).format("hh:mm A");
    // if(new Date(startDate) <= new Date(selectedStartdate) && new Date(selectedEnddate)>=new Date(endDate)){
      const eventdatavalue :any = {
        startDate: startDate,
        endDate:endDate,
        subject: eventdata[i].subject,
        startTime:starttime,
        endTime:endtime
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
    <table className={styles.tableClass}>
    {this.state.eventdataArray.length !== 0 && <tbody className={styles.tbody}>
      <tr></tr>
      {this.state.eventdataArray.map((item: any, key: any) => {
        return (<tr >
        <td className={styles.td1}>{item.startDate}-<br/>{item.endDate}</td>
        <td className={styles.td2}>{item.subject}<br/>{item.startTime}-{item.endTime}</td>
      </tr>)})}
      </tbody>}
      
    </table>
    
    <PrimaryButton id="b2" onClick={this.submit}>Submit</PrimaryButton>

      </section>
    );
  }
}
