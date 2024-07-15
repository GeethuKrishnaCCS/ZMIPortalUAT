import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import styles from "./Znews.module.scss";
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
          </div>


          <div className={styles.NewsSlider}>
                <div className={styles.Prevbtn}>
                    <IconButton iconProps={backicon} 
                      onClick={() => this.Back(this.props.News)} disabled={this.state.Next === 3}
                      className={styles.NavigationLeftButtonStyling}
                      ariaLabel={"Back"} />
                </div>
                <div className={styles.NewsCard}>
                        {this.state.RenderedNews.map((Post,key) => {
                        i = i + 1;
                        return (
                          <div className={styles.NewsContainer}>
                            <div className={styles.ImgContainer}>
                              <img src={Post.Thumbnail} className={styles.Image} alt=""/>
                            </div>
                            <div className={styles.NewsBody}>
                              <div className={styles.TitleContainer}>
                                <a className={styles.TitleStyling} href={Post.Url}>
                                  {Post.Title}</a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
                <div className={styles.Nextbtn}>
                      <IconButton iconProps={nexticon} 
                      onClick={() => this.Next(this.props.News)} 
                      disabled={this.state.Next >= this.props.News.length}
                      className={styles.NavigationRightButtonStyling}
                      ariaLabel={"Next"} />
                </div>
          </div>
       
          <div className={styles.NavDot}>
            <div className={styles.Dot}><div className={styles.InnerDot}></div></div>
          </div>  
          <div className={styles.NavigationContainer}>
            <div className={styles.NavigationPageNumStyling}>{this.state.Count} out of {Math.ceil(this.props.News.length / 3)}</div>
          </div>
      </div>
      </div>
    );
  }
}
