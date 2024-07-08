import * as React from 'react';
import styles from './Znews.module.scss';
import type { IZnewsProps, IZnewsState } from './IZnewsProps';
import { BaseService } from '../services';
import * as _ from 'lodash';
import StackStyle from './StackStyle';
import SingleStyle from './SingleStyle';

export default class Znews extends React.Component<IZnewsProps,IZnewsState, {}> {
  private _spservices: BaseService;
  constructor(props: IZnewsProps, state: IZnewsState) {
    super(props);
    this.state = {
      SPGuid: '',
      News: [],
      Reload: false
    };
    this._spservices = new BaseService(this.props.context);
  }

  public async componentDidMount() {
    this.Get('Default');
  }
  public componentDidUpdate(prevProps: IZnewsProps) {
    if (prevProps.Site !== this.props.Site) {
      this.props.onChangeProperty("Sites");
      if (this.props.Site.length > 0) {
        this.Get('Update');
      }
      else {
        this.Get('Default');
      }
      
      this.setState({Reload: !this.state.Reload});
    }
  }
  public async Get(Choice: string) {
    const e: any[] = [];
    let URL: any;
    if (this.props.Site === undefined || this.props.Site.length < 1 || (Choice === 'Default' && this.props.Site.length < 1)) {
      URL = this.props.context.pageContext.web.absoluteUrl;
      const Posts = await this._spservices.getInfo(URL);
      Posts.map(async Post => {
        e.push({
          Author: Post.Author,
          Title: Post.Title,
          Description: Post.Description,
          Id: Post.Id,
          Created: Post.Created,
          Thumbnail: Post.BannerImageUrl,
          Url: Post.Url
          
        });
        if (this.state.Reload === true) {
          this.setState({ News: e, Reload: false });
        }
        else {
          const sorted_NewsPages:any[] = _.orderBy(e, (e: any) => {
            return e.Id;
        }, ['desc']);
          this.setState({ News: sorted_NewsPages });
        }
        
      });
    }
    else {
      this.props.Site.map(async site => {
        URL = site.url;
        const Info = await this._spservices.getInfo(URL);
        Info.map(async Post => {
          e.push({
            Author: Post.Author,
            Title: Post.Title,
            Description: Post.Description,
            Id: Post.Id,
            Created: Post.Created,
            Thumbnail: Post.BannerImageUrl,
            Url: Post.Url
          });
          if (this.state.Reload === true) {
            this.setState({ News: e, Reload: false });
          }
         else {
          const sorted_NewsPages:any[] = _.orderBy(e, (e: any) => {
            return e.Id;
        }, ['desc']);
          this.setState({ News: sorted_NewsPages });
        }
        });
      });
    }
  }
  public render(): React.ReactElement<IZnewsProps> {
   return (
      <section className={`${styles.znews}`}>
         {this.props.StyleToggle ?
      <StackStyle News={this.state.News} AuthorToggle={this.props.AuthorToggle} Reload={this.state.Reload} context={this.props.context} description={this.props.description}/> :
      <SingleStyle News={this.state.News} AuthorToggle={this.props.AuthorToggle} Reload={this.state.Reload} context={this.props.context} description={this.props.description}/>}
      </section>
    );
  }
}
