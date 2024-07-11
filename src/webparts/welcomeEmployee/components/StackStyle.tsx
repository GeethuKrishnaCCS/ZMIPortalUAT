import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import styles from "./EventNews.module.scss";
// import { Link } from "office-ui-fabric-react";
import * as moment from "moment";
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
      listItems: [],
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
      const max = min + 4;
      this.props.listItems.map(Post => {
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
      const max = min + 5;
    if (prevProps.listItems !== this.props.listItems) {
      
      this.props.listItems.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.listItems.length > 0 && this.props.listItems.length > this.state.RenderedNews.length && this.state.UpdateCount < 4) {
      this.props.listItems.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }
  public render(): React.ReactElement<StylingProps> {
    let i = 0;
    return (
      <div className={styles.StackStyle}>
      <div className={styles.StackStyleContainer}>
        <div  className={styles.heading}>
        <div  className={styles.title}>Event News</div>
        {/* <div  className={styles.seeall}>
          < Link  className={styles.link}  href={this.props.context.pageContext.web.serverRelativeUrl + "/_layouts/15/news.aspx"} target="_blank" underline>See all event news</Link>
          </div> */}
        </div>

          <div>
            {this.state.RenderedNews.map((Post) => {
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
                    {/* <div className={styles.AuthorContainer}>
                    {this.props.AuthorToggle ? ( <></> ) : ( <div style={{fontWeight:"bold"}}> {Post.Author}, <br/> </div> )}{" "}
                      {this.formatDateTime(Post.Created)}
                    </div> */}

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

            })}
          </div>
        {/* <br></br> */}
        {/* <div className={styles.NavigationContainer}>
          <button
            disabled={this.state.Next === 3}
            style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)'}}
            className={styles.NavigationLeftButtonStyling}
            onClick={() => this.Back(this.props.News)}>Back</button>
          <button
            disabled={this.state.Next >= this.props.News.length}
            style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
            className={styles.NavigationRightButtonStyling}
            onClick={() => this.Next(this.props.News)}>Next</button>
            <div className={styles.NavigationPageNumStyling}>{this.state.Count} out of {Math.ceil(this.props.News.length / 3)}</div>
        </div> */}
      </div>
      </div>
    );
  }
}
