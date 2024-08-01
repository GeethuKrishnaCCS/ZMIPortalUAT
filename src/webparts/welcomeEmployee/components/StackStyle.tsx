import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import styles from "./EventNews.module.scss";
import { IIconProps, IconButton, } from "@fluentui/react";
import { TooltipHost, TooltipDelay, DirectionalHint } from '@fluentui/react';

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
    this.updateRenderedNews = this.updateRenderedNews.bind(this);
    this.Next = this.Next.bind(this);
    this.Back = this.Back.bind(this);

  }

  public componentDidMount() {
    this.updateRenderedNews(this.props.listItems);
  }

  public componentDidUpdate(prevProps: StylingProps) {
    if (prevProps.listItems !== this.props.listItems) {
      this.updateRenderedNews(this.props.listItems);
    }
  }

  private updateRenderedNews(listItems: any[]) {
    const array: any[] = [];
    let count = 0;
    const min = 0;
    const max = min + 4;

    listItems.forEach(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });

    this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: 0 });

  }

  public Next(News: any) {
    const array: any[] = [];
    let count = 0;
    const min = this.state.Next;
    const max = min + 4;
    News.forEach((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next + 3;
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(News: any) {
    const array: any[] = [];
    const min = this.state.Next - 6;
    const max = this.state.Next - 2;
    let count = 0;
    News.forEach((Post: any) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    const newVal = this.state.Next - 3;
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count - 1 });
  }

  public stripHtml(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }


  public render(): React.ReactElement<StylingProps> {
    const backicon: IIconProps = { iconName: 'ChevronLeftSmall' };
    const nexticon: IIconProps = { iconName: 'ChevronRightSmall' };

    const HtmlContent = ({ html }) => (< div dangerouslySetInnerHTML={{ __html: html }} />);
    const stripHtmlTags = (html) => { const div = document.createElement('div'); div.innerHTML = html; return div.textContent || div.innerText || ''; };

    

    let i = 0;
    return (

      <div className={styles.eventNews}>
        <div className={styles.StackStyle}>
          <div className={styles.StackStyleContainer}>

            <div className={styles.teamcardwrap}>
              <IconButton iconProps={backicon}
                onClick={() => this.Back(this.props.listItems)} disabled={this.state.Next === 3}
                className={styles.NavigationLeftButtonStyling}
                ariaLabel={"Back"}
              />
              {this.state.RenderedNews.length > 0 ? (
                <div className={styles.teammembers}>
                  {this.state.RenderedNews.map((Post, key) => {
                    const plainText = this.stripHtml(Post.Description);
                    i = i + 1;
                    const truncatedDescription = plainText.length > 200 ? `${plainText.slice(0, 200)}...` : plainText;
                    return (
                      <div className={styles.NewsContainer}>
                        <div className={styles.ImgContainer}>
                          <img src={Post.ImageUrl.Url} className={styles.Image} />
                        </div>
                        <div className={styles.NewsBody}>
                          <div className={styles.EmployeeName}>{Post.Name}</div>

                          <TooltipHost
                            content={<HtmlContent html={Post.Description} />}
                            delay={TooltipDelay.zero}
                            directionalHint={DirectionalHint.bottomCenter}
                            tooltipProps={{
                              calloutProps: {
                                styles: {
                                  beak: {
                                    background: '#ecf6ff', fontSize: '15px', padding: '15px', lineHeight: '22.5px', fontWeight: '500'
                                  },
                                  beakCurtain: { background: '#ecf6ff', fontSize: '15px', padding: '15px', lineHeight: '22.5px', fontWeight: '500' },
                                  calloutMain: { background: '#ecf6ff', fontSize: '15px', padding: '15px', lineHeight: '22.5px', fontWeight: '500' }
                                },
                              },
                              styles: {

                                content: { fontSize: '15px', lineHeight: '22.5px', fontWeight: '500', fontFamily: 'var(--fontFamilyCustomFont500, var(--fontFamilyBase))' },
                              },
                            }}
                          >

                            {/* <div className={styles.TitleStyling} dangerouslySetInnerHTML={{ __html: truncatedDescription }} /> */}
                            <div className={styles.TitleStyling}> {stripHtmlTags(truncatedDescription)}</div>
                          </TooltipHost>


                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.NewsContainer}>
                  <p>No items to display</p>
                </div>
              )}
              <IconButton iconProps={nexticon}
                onClick={() => this.Next(this.props.listItems)}
                disabled={this.state.Next >= this.props.listItems.length}
                className={styles.NavigationRightButtonStyling}
                ariaLabel={"Next"} />
            </div>
          </div>
        </div>
      </div>

    );
  }
}

