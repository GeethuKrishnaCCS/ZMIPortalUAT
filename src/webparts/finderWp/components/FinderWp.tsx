import * as React from 'react';
import styles from './FinderWp.module.scss';
import { IFinderWpProps, IFinderWpState } from '../interfaces/IFinderWpProps';
import { FinderWpService } from '../services';
// import { escape } from '@microsoft/sp-lodash-subset';
import { debounce } from 'lodash';
import { DefaultButton, IIconProps, IconButton, SearchBox, Breadcrumb, IBreadcrumbItem, ActionButton } from '@fluentui/react';

export default class FinderWp extends React.Component<IFinderWpProps, IFinderWpState, {}> {
  private _service: any;

  public constructor(props: IFinderWpProps) {
    super(props);
    this._service = new FinderWpService(this.props.context);

    this.state = {
      getDocFolder: [],
      getDocFiles: [],
      filesInSelectedFolder: [],
      selectedFolder: null,
      breadcrumbItems: [{ text: this.props.selectedDocument, key: this.props.selectedDocument }],
      searchQuery: '',
      filteredFiles: [],
      filteredFolders: [],
      breadcrumbDiv: false,

    }
    this.getDocFiles = this.getDocFiles.bind(this);
    this.getDocFolder = this.getDocFolder.bind(this);
    this.handleFolderSelection = debounce(this.handleFolderSelection.bind(this), 300);
    this.onBreadcrumbItemClicked = debounce(this.onBreadcrumbItemClicked.bind(this), 300);
    this.handleSearchQueryChange = debounce(this.handleSearchQueryChange.bind(this), 300);
    this.filterFilesAndFolders = this.filterFilesAndFolders.bind(this);

  }

  public async componentDidMount() {
    await this.getDocFiles();
    await this.getDocFolder();
  }

  public async getDocFiles() {
    const getDocFiles = await this._service.getDocumentLibraryFiles(this.props.selectedDocument);
    this.setState({ getDocFiles: getDocFiles });
  }

  public async getDocFolder() {
    const getDocFOLDER = await this._service.getDocumentLibraryFolder(this.props.selectedDocument);
     // Assuming getDocFOLDER is an array and IconPicker is an array
  const iconPickerArray = this.props.iconPicker;

  // Ensure that getDocFOLDER and iconPickerArray have the same length or handle the difference
  //const maxLength = Math.max(getDocFOLDER.length, iconPickerArray.length);

  const updatedFolder = getDocFOLDER.map((folder: any, index: any) => {
    // If iconPickerArray is shorter, use undefined for missing values
    const icon = iconPickerArray[index];

    // Append the icon to each folder object
    return {
      ...folder,
      icon
    };
  });

  this.setState({ getDocFolder: updatedFolder });
  }

  private async handleSearchQueryChange(newValue: string) {
    this.setState({ searchQuery: newValue }, await this.filterFilesAndFolders);
  }

  private async filterFilesAndFolders(): Promise<void> {
    const { searchQuery, selectedFolder } = this.state;
    const filteredFiles: any[] = [];
    const filteredFolders: any[] = [];

    const folderFiles = selectedFolder
      ? await this._service.getfilesfromfolder(selectedFolder.ServerRelativeUrl)
      : await this._service.getDocumentLibraryFiles(this.props.selectedDocument);
    const subfolders = selectedFolder
      ? await this._service.getfoldersfromfolder(selectedFolder.ServerRelativeUrl)
      : await this._service.getDocumentLibraryFolder(this.props.selectedDocument);

    const filteredFolderFiles = folderFiles.filter((file: any) => file.Name.toLowerCase().includes(searchQuery.toLowerCase()));
    filteredFiles.push(...filteredFolderFiles);

    const filteredSubfolders = subfolders.filter((subfolder: any) => subfolder.Name.toLowerCase().includes(searchQuery.toLowerCase()));
    filteredFolders.push(...filteredSubfolders);

    this.setState({ filteredFiles, filteredFolders });
  }

  public async onBreadcrumbItemClicked(ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) {
    const index = this.state.breadcrumbItems.findIndex((breadcrumbItem: any) => breadcrumbItem.key === item.key);
    const breadcrumbItems = this.state.breadcrumbItems.slice(0, index + 1);
    const folder = { ServerRelativeUrl: item.key, Name: item.text };
    if (index === 0) {
      this.setState({
        selectedFolder: null,
        breadcrumbItems: [{ text: this.props.selectedDocument, key: this.props.selectedDocument }],
      });
      await this.getDocFiles();
      await this.getDocFolder();
    }
    else {
      
      await this.handleFolderSelection(folder);
      this.setState({ breadcrumbItems });
    }


  }

  public async handleFolderSelection(folder: any) {
    let files, subfolders = [];

    // if (folder.Name === this.props.selectedDocument) {
    //   await this.getDocFiles();
    //   await this.getDocFolder();

    // } else {
    //   files = await this._service.getfilesfromfolder(folder.ServerRelativeUrl);
    //   subfolders = await this._service.getfoldersfromfolder(folder.ServerRelativeUrl);
    // }


    if (folder.ServerRelativeUrl) {
      files = await this._service.getfilesfromfolder(folder.ServerRelativeUrl);
      subfolders = await this._service.getfoldersfromfolder(folder.ServerRelativeUrl);
    } else {
      files = await this._service.getDocumentLibraryFiles(folder.Name);
      subfolders = await this._service.getDocumentLibraryFolder(folder.Name);
    }

    await Promise.all(subfolders.map(async (subfolder: any) => {
      const subfolderFiles = await this._service.getfilesfromfolder(subfolder.ServerRelativeUrl);
      const subfolderSubfolders = await this._service.getfoldersfromfolder(subfolder.ServerRelativeUrl);
      subfolder.files = subfolderFiles;
      subfolder.subfolders = subfolderSubfolders;
    }));

    const breadcrumbItems = [...this.state.breadcrumbItems];
    const folderExists = breadcrumbItems.some(item => item.key === folder.ServerRelativeUrl);

    if (!folderExists) {
      breadcrumbItems.push({ text: folder.Name, key: folder.ServerRelativeUrl });
    }

    this.setState({
      filesInSelectedFolder: files,
      selectedFolder: { ...folder, subfolders },
      breadcrumbItems,
      searchQuery: '',
      filteredFiles: [],
      filteredFolders: []
    });
  }

  public render(): React.ReactElement<IFinderWpProps> {
    const {
      hasTeamsContext,
    } = this.props;

    const KnowledgeArticle: IIconProps = { iconName: 'KnowledgeArticle' };
    // const addFriendIcon: IIconProps = { iconName: 'AddFriend' };

    const hasSearchResults = this.state.filteredFiles.length > 0 || this.state.filteredFolders.length > 0;

    const hasItemsInSelectedFolder = this.state.selectedFolder
      ? this.state.selectedFolder.subfolders.length > 0 || this.state.filesInSelectedFolder.length > 0
      : this.state.getDocFolder.length > 0 || this.state.getDocFiles.length > 0;
   
    return (
      <section className={`${styles.finderWp} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.borderBox}>
          <div>
            <div className={styles.doclibraryHeading}>{this.props.selectedDocument}</div>
            <br></br>
            <SearchBox
              placeholder="Search Forms & Templates"
              onChange={(_, newValue) => this.handleSearchQueryChange(newValue)}
              className={styles.searchbox}
            />
            {this.state.breadcrumbItems.length>1 &&
              <div className={styles.breadCrumbDiv}>
                <Breadcrumb
                  items={this.state.breadcrumbItems}
                  onRenderItem={(item, render) => (
                    <span className={styles.breadcrumpHeading} onClick={(ev) => this.onBreadcrumbItemClicked(ev, item)}>
                      {render!(item)}
                    </span>
                  )}

                />
              </div>
            }
            <div className={styles.buttonDiv}>
              {this.state.searchQuery ? (
                hasSearchResults ? (
                  <>
                    <h3>Search Results</h3>
                    <ul>
                      {this.state.filteredFolders.map((folder: any) => (
                        <DefaultButton
                          key={folder.UniqueId}
                          className={styles.button}
                          onClick={() => this.handleFolderSelection(folder)}
                          styles={{ root: { fontSize: this.props.ButtonFontSize } }}
                        >
                          {folder.Name}
                        </DefaultButton>
                      ))}
                      {this.state.filteredFiles.map((file: any) => (
                        <div key={file.Id}>
                          <IconButton iconProps={KnowledgeArticle} ariaLabel="File icon" />
                          <a href={file.ServerRelativeUrl} target="_blank">
                            {file.Name}
                          </a>
                        </div>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className={styles.noItems}>{"No items"}</div>
                )
              ) : (
                <>
                  {hasItemsInSelectedFolder ? (
                    this.state.selectedFolder ? (
                      <>
                        <ul>
                          {this.state.selectedFolder.subfolders.map((subfolder: any) => (
                            <div style={{display:"flex"}}>                            
                            <DefaultButton
                              key={subfolder.UniqueId}
                              className={styles.button}
                              onClick={() => this.handleFolderSelection(subfolder)}
                              styles={{ root: { fontSize: this.props.ButtonFontSize } }}
                            >
                              {subfolder.Name}
                            </DefaultButton>
                            </div>
                          ))}
                        </ul>
                        <table className={styles.tableDiv}>
                          <tbody >
                            {this.state.filesInSelectedFolder.map((item: any) => (
                              <tr key={item.Id}>
                                <td>
                                  <IconButton iconProps={KnowledgeArticle} ariaLabel="File icon" />
                                </td>
                                <td>
                                  <a href={item.ServerRelativeUrl} target="_blank">
                                    {item.Name}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>
                        <ul>
                          {this.state.getDocFolder.map((item: any, index: number) => (
                            <ActionButton
                              iconProps={this.props.iconPicker[index] || 'AddFriend'}
                              key={item.Id}
                              className={styles.button}
                              onClick={() => this.handleFolderSelection(item)}
                              styles={{
                                root: {
                                  fontSize: this.props.ButtonFontSize,
                                  backgroundColor: this.props.foldercolor[index] || 'transparent',
                                }
                              }}
                            >
                              {item.Name}
                            </ActionButton>
                          ))}
                        </ul>
                        <hr />
                        <table>
                          <tbody>
                            {this.state.getDocFiles.map((item: any) => (
                              <tr key={item.Id}>
                                <td>
                                  <IconButton iconProps={KnowledgeArticle} ariaLabel="File icon" />
                                </td>
                                <td>
                                  <a href={item.ServerRelativeUrl} target="_blank">
                                    {item.Name}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )
                  ) : (
                    <div className={styles.noItems}>{"No items"}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
