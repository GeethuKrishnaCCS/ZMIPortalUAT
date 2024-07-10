import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import styles from "./Znews.module.scss";
import { Link } from "office-ui-fabric-react";
import * as moment from "moment";
import { IIconProps, IconButton } from "@fluentui/react";
export const iconClass = mergeStyles({
  fontSize: 15,
  height: 15,
  width: 15,
});

export default class StackStyle extends React.Component<
  StylingProps,
  StylingState
> {
  constructor(props: StylingProps) {
    super(props);
    this.state = {
      News: [],
      RenderedNews: [],
      UpdateCount: 0,
      Next: 3,
      Count: 1,
      Reload: true
    };
  }

  

  public componentDidMount() {
    const array:any[] = [];
      let count = 0;
      const min = 0;
      const max = min + 3;
      this.props.News.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: 0 });
  }

  public formatDateTime(dateTime:any) {
    const formattedDate = moment(dateTime).format('MMM DD, YYYY');
    const formattedTime = moment(dateTime).format('h:mm a');
    const timezone = moment(dateTime).format('z');
    return `${formattedDate} at ${formattedTime} ${timezone}`;
  }

  public componentDidUpdate(prevProps: StylingProps) {
    const array:any[] = [];
      let count = 0;
      const min = 0;
      const max = min + 4;
    if (prevProps.News !== this.props.News) {
      
      this.props.News.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 4, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.News.length > 0 && this.props.News.length > this.state.RenderedNews.length && this.state.UpdateCount < 4) {
      this.props.News.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }
  public Next(News:any) {
    const array:any[] = [];
    let count = 0;
    const min = this.state.Next;
    const max = min + 4;
    News.map((Post:any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next + 3;
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(News:any) {
    const array:any[] = [];
    const min = this.state.Next - 6;
    const max = this.state.Next - 2;
    let count = 0;
    News.map((Post:any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next - 3;
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count - 1 });
  }
  
  public render(): React.ReactElement<StylingProps> {
    let i = 0;
    const backicon: IIconProps = { iconName: 'ChevronLeftSmall' };
    const nexticon: IIconProps = { iconName: 'ChevronRightSmall' };
    return (
      <div className={styles.StackStyle}>
      <div className={styles.StackStyleContainer}>
        <div  className={styles.heading}>
        <div  className={styles.title}>{this.props.description}</div>
        <div  className={styles.seeall}>
          < Link  className={styles.link}  href={this.props.context.pageContext.web.serverRelativeUrl + "/_layouts/15/news.aspx"} target="_blank" underline>See all event news</Link>
          </div>
        </div>

          <table>
            <tr>
         <td> <IconButton iconProps={backicon} 
         onClick={() => this.Back(this.props.News)} disabled={this.state.Next === 3}
        //  style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)'}}
         className={styles.NavigationLeftButtonStyling}
          ariaLabel={"Back"} /></td>
            <td>
            {this.state.RenderedNews.map((Post,key) => {
              i = i + 1;
              return (
                <div
                  className={styles.NewsContainer}
                  // style={{ boxShadow: 'rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px', marginRight: `${i === 3 ? '0px' : '7px'}` }}
                  >
                  <div className={styles.ImgContainer}>
                    <img src={Post.Thumbnail} className={styles.Image}/>
                  </div>
                  <div className={styles.NewsBody}>
                    <div className={styles.TitleContainer}>
                      <a className={styles.TitleStyling} href={Post.Url}>
                        {Post.Title}</a>
                    </div>
                    {/* <div className={styles.DescriptionContainer}>
                      {Post.Description ? Post.Description.substring(0,182) + '…': '…'}
                    </div> */}
                    <div className={styles.footer}>
                    <div className={styles.AuthorContainer}>
                    {this.props.AuthorToggle ? ( <></> ) : ( <div style={{fontWeight:"bold"}}> {Post.Author}, <br/> </div> )}{" "}
                    {this.props.DateToggle ? ( <></> ) : ( <div style={{fontWeight:"bold"}}> {this.formatDateTime(Post.Created)} </div> )}{" "}
                        
                    </div>
                    </div>
                    

                    {/* <div className={styles.IconContainer}>
                      <Icon className={iconClass} iconName="Like"></Icon>
                      <label className={styles.IconLabelStyling}>
                        {Post.Likes}
                      </label>
                      <Icon
                        style={{ marginLeft: "10px" }}
                        className={iconClass}
                        iconName="Comment"
                      ></Icon>
                      <label className={styles.IconLabelStyling}>
                        {Post.Comments}
                      </label>
                    </div> */}
                  </div>
                </div>
              );

            })}</td>
            <td><IconButton iconProps={nexticon} 
            onClick={() => this.Next(this.props.News)} 
            disabled={this.state.Next >= this.props.News.length}
            // style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
            className={styles.NavigationRightButtonStyling}
             ariaLabel={"Next"} /></td>
            </tr>
          </table>
        <br/>
        <div className={styles.NavigationContainer}>
          <div className={styles.NavigationPageNumStyling}>{this.state.Count} out of {Math.ceil(this.props.News.length / 3)}</div>
        </div>
      </div>
      </div>
    );
  }
}
