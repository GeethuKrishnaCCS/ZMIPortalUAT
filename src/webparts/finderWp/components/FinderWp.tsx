import * as React from 'react';
import styles from './FinderWp.module.scss';
import { IFinderWpProps, IFinderWpState } from '../interfaces/IFinderWpProps';
import { FinderWpService } from '../services';
// import { escape } from '@microsoft/sp-lodash-subset';
import { debounce } from 'lodash';
import { SearchBox, Breadcrumb, IBreadcrumbItem, ActionButton, DefaultButton, IIconProps } from '@fluentui/react';
import { FileTypeIcon, IconType, } from "@pnp/spfx-controls-react/lib/FileTypeIcon";
export default class FinderWp extends React.Component<IFinderWpProps, IFinderWpState> {
  private _service: any;

  public constructor(props: IFinderWpProps) {
    super(props);
    this._service = new FinderWpService(this.props.context);

    this.state = {
      parentFolders: [],
      getDocFiles: [],
      filesInSelectedFolder: [],
      selectedFolder: null,
      breadcrumbItems: [{ text: this.props.selectedDocument, key: this.props.selectedDocument }],
      searchKey: "",
      filteredFiles: [],
      filteredFolders: [],
      breadcrumbDiv: false,
      statusMessage: "Loading..."
    }
    this.getParentFolders = this.getParentFolders.bind(this);
    this.onFolderSelected = debounce(this.onFolderSelected.bind(this), 300);
    this.onBreadcrumbItemClicked = debounce(this.onBreadcrumbItemClicked.bind(this), 300);
    this.handleSearchQueryChange = debounce(this.handleSearchQueryChange.bind(this), 300);
    this.filterFilesAndFolders = this.filterFilesAndFolders.bind(this);

  }

  public componentDidMount() {
    this.getParentFolders();
  }

  public async getParentFolders() {
    const parentFolders = await this._service.getDocumentLibraryFolder(this.props.selectedDocument);
    if (parentFolders !== null && parentFolders !== undefined) {
      if (parentFolders.length > 0) {
        const foldersWithIcon = parentFolders.map((folder: any, index: any) => {
          const icon = this.props.iconPicker[index];
          return {
            ...folder,
            icon
          };
        });
        if (foldersWithIcon.length > 0) {
          this.setState({ parentFolders: foldersWithIcon, statusMessage: "" });
        }
        else {
          this.setState({ statusMessage: "No items found." });
        }

      }
    }
  }

  private async handleSearchQueryChange(newValue: string) {
    this.setState({ searchKey: newValue },);
    await this.filterFilesAndFolders();
  }

  private async filterFilesAndFolders(): Promise<void> {
    const { searchKey, selectedFolder } = this.state;
    const filteredFiles: any[] = [];
    const filteredFolders: any[] = [];

    const folderFiles = selectedFolder
      ? await this._service.getfilesfromfolder(selectedFolder.ServerRelativeUrl)
      : await this._service.getDocumentLibraryFiles(this.props.selectedDocument);
    const subfolders = selectedFolder
      ? await this._service.getfoldersfromfolder(selectedFolder.ServerRelativeUrl)
      : await this._service.getDocumentLibraryFolder(this.props.selectedDocument);

    const filteredFolderFiles = folderFiles.filter((file: any) => file.Name.toLowerCase().includes(searchKey.toLowerCase()));
    filteredFiles.push(...filteredFolderFiles);

    const filteredSubfolders = subfolders.filter((subfolder: any) => subfolder.Name.toLowerCase().includes(searchKey.toLowerCase()));
    filteredFolders.push(...filteredSubfolders);
    if (filteredFolderFiles.length !== 0 || filteredSubfolders.length !== 0) {
      this.setState({ filteredFiles, filteredFolders });
    }
    else {
      this.setState({ filteredFolders: [] })
    }
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
      //await this.getDocFiles();
      await this.getParentFolders();
    }
    else {

      await this.onFolderSelected(folder);
      this.setState({ breadcrumbItems });
    }


  }

  public async onFolderSelected(folder: any) {
    let files, subfolders = [];

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

    if (files !== null && files !== undefined) {
      if (files.length > 0) {
        this.setState({
          filesInSelectedFolder: files, statusMessage: ""
        })
      } else {
        this.setState({ filesInSelectedFolder: [] });
      }
    }

    this.setState({
      selectedFolder: { ...folder, subfolders },
      breadcrumbItems,
      searchKey: "",
      filteredFiles: [],
      filteredFolders: []
    });
  }

  public render(): React.ReactElement<IFinderWpProps> {
    const {
      hasTeamsContext,
    } = this.props;

    const KnowledgeArticle: IIconProps = { iconName: 'KnowledgeArticle' };
    const hasSearchResults = this.state.filteredFiles.length > 0 || this.state.filteredFolders.length > 0;
    const hasItemsInSelectedFolder = this.state.selectedFolder
      ? this.state.selectedFolder.subfolders.length > 0 || this.state.filesInSelectedFolder.length > 0
      : this.state.parentFolders.length > 0 || this.state.getDocFiles.length > 0;

    return (
      <section className={`${styles.finderWp} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <div className={styles.doclibraryHeading}>{this.props.selectedDocument}</div>
          <div>
            <SearchBox
              placeholder="Search Forms & Templates"
              onChange={(_, newValue) => this.handleSearchQueryChange(newValue)}
              className={styles.searchbox}
            />
          </div>
          <div>
            {this.state.breadcrumbItems.length > 1 &&
              <div className={styles.breadCrumbDiv}>
                <Breadcrumb
                  items={this.state.breadcrumbItems}
                  className={styles.breadCrumbStyle}
                  onRenderItem={(item, render) => (
                    <span className={styles.breadcrumpHeading} onClick={(ev) => this.onBreadcrumbItemClicked(ev, item)}>
                      {render!(item)}
                    </span>
                  )}
                />
              </div>
            }
          </div>
          <div className={styles.contentDiv}>
            {this.state.statusMessage !== "" && <p className={styles.noItems}>{this.state.statusMessage}</p>}
            {/* START - Parent folder structure */}
            {(this.state.searchKey === "" && !this.state.selectedFolder && this.state.parentFolders.length > 0) &&
              <div className={styles.buttongrid}>
                {this.state.parentFolders.map((item: any, index: number) => (
                  <ActionButton
                    iconProps={{ iconName: item.icon }}
                    key={item.Id}
                    className={styles.button}
                    onClick={() => this.onFolderSelected(item)}
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
              </div>}
            {/* END - Parent folder structure */}

            {/* START - Child item structure */}
            {/* START - Search results grid */}
            {(this.state.searchKey !== "" && hasSearchResults) &&
              <div>
                <h3 className={styles.searchItemDiv}>{"Search Results"}</h3>
                <div className={styles.buttongrid}>
                  {/* Folder results */}
                  {this.state.filteredFolders.map((folder: any) => (
                    <DefaultButton
                      key={folder.UniqueId}
                      className={styles.button}
                      onClick={() => this.onFolderSelected(folder)}
                      styles={{ root: { fontSize: this.props.ButtonFontSize } }}
                      iconProps={KnowledgeArticle}
                    >
                      {folder.Name}
                    </DefaultButton>
                  ))}
                  <br></br>
                  {/* File results */}
                  <div className={styles.tableContainer}>
                    <table className={styles.tableDiv}>
                      <tbody>
                        {this.state.filteredFiles.map((item: any) => (
                          <tr key={item.Id}>
                            <td className={styles.tableIconColumn}>
                              <FileTypeIcon type={IconType.image} path={item.LinkingUri !== null ? item.LinkingUri : window.location.hash + item.ServerRelativeUrl} />
                            </td>
                            <td>
                              <a href={item.LinkingUri !== null ? item.LinkingUri : window.location.hash + item.ServerRelativeUrl} target="_blank">
                                {item.Name}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>}
            {(this.state.searchKey !== "" && !hasSearchResults) && <p className={styles.noItems}>{"No items found."}</p>}
            {/* END - Search results grid */}

            {(this.state.searchKey === "" && hasItemsInSelectedFolder && this.state.selectedFolder) &&
              <div>
                {this.state.selectedFolder !== null && <div className={styles.buttongrid}>
                  {this.state.selectedFolder.subfolders.map((subfolder: any) => (
                    <div style={{ display: "flex" }}>
                      <DefaultButton
                        key={subfolder.UniqueId}
                        className={styles.button}
                        onClick={() => this.onFolderSelected(subfolder)}
                        styles={{ root: { fontSize: this.props.ButtonFontSize } }}
                        iconProps={KnowledgeArticle}
                      >
                        {subfolder.Name}
                      </DefaultButton>
                    </div>
                  ))}
                </div>}
                {this.state.filesInSelectedFolder.length > 0 && <div className={styles.tableContainer}>
                  <table className={styles.tableDiv}>
                    <tbody>
                      {this.state.filesInSelectedFolder.map((item: any) => (
                        <tr key={item.Id}>
                          <td className={styles.tableIconColumn}>
                            <FileTypeIcon type={IconType.image} path={item.LinkingUri !== null ? item.LinkingUri : window.location.hash + item.ServerRelativeUrl} />
                          </td>
                          <td>
                            <a href={item.LinkingUri !== null ? item.LinkingUri : window.location.hash + item.ServerRelativeUrl} target="_blank">
                              {item.Name}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
              </div>}
            {(this.state.searchKey === "" && !hasItemsInSelectedFolder && this.state.selectedFolder) && <p className={styles.noItems}>{"No items found."}</p>}
            {/* END - Child item structure */}
          </div>
        </div>
      </section>
    );
  }
}
