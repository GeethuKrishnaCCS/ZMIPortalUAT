import { BaseService } from "./BaseService";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getSP } from "../shared/Pnp/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sites";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/security";
// import { IDocumentLibraryInformation } from "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export class FinderWpService extends BaseService {
    private _spfi: SPFI;
    constructor(context: WebPartContext) {
        super(context);
        this._spfi = getSP(context);
    }
    public addListItem(data: any, listname: string, url: string): Promise<any> {
        return this._spfi.web.getList(url + "/Lists/" + listname).items.add(data);
    }
    public getDocLibrary(url: string): Promise<any> {
        return this._spfi.site.getDocumentLibraries(url);
    }
    // public getDocFile(data: any): Promise<any> {
    //     return this._spfi.web.lists.getByTitle(data).items.getAll();
    // }
    public getDocumentLibraryFiles(data: any): Promise<any> {
        return this._spfi.web.lists.getByTitle(data).rootFolder.files();
    }
    // public getDocumentLibraryFolder(data: any): Promise<any> {
    //     return this._spfi.web.lists.getByTitle(data).rootFolder.folders();
    // }
    public getDocumentLibraryFolder(data: any): Promise<any[]> {
        return this._spfi.web.lists.getByTitle(data)
            .rootFolder
            .folders()
            .then((folders: any[]) => {
                const foldersWithIcons = folders.filter(folder => folder.Name !== "Forms").map(folder => {
                    return this._spfi.web.getFolderByServerRelativePath(folder.ServerRelativeUrl)
                        .expand("Files")
                        ()
                        .then((folderDetails: any) => {
                            return {
                                ...folderDetails,
                                Icon: folderDetails.Icon
                            };
                        });
                });
                return Promise.all(foldersWithIcons);
            });

    }



    public getfilesfromfolder(data: any): Promise<any> {
        return this._spfi.web.getFolderByServerRelativePath(data).select().files();
    }
    // public async getfilesfromfolder(data: any): Promise<any> {
    //     try {
    //         const files = await this._spfi.web.getFolderByServerRelativePath(data).select("*,File_x0020_Type").files();
    //         return files;
    //     } catch (error) {
    //         console.error("Error fetching document library files: ", error);
    //         throw error;
    //     }
    // }


    // public getfoldersfromfolder(data: any): Promise<any> {
    //     return this._spfi.web.getFolderByServerRelativePath(data).folders();
    // }

    public async getfoldersfromfolder(data: any): Promise<any> {
        const folders = await this._spfi.web.getFolderByServerRelativePath(data).folders();
        const filteredFolders = folders.filter((folder: any) => folder.Name !== "Forms");

        return Promise.all(filteredFolders.map(async (folder: any) => {
            const subfolderFiles = await this.getfilesfromfolder(folder.ServerRelativeUrl);
            const subfolderSubfolders = await this.getfoldersfromfolder(folder.ServerRelativeUrl);
            return { ...folder, files: subfolderFiles, subfolders: subfolderSubfolders };
        }));
    }

    // public async getfoldersfromfolder(data: any): Promise<any> {
    //     const folders = await this._spfi.web.getFolderByServerRelativePath(data).folders();
    //     return Promise.all(folders.map(async (folder: any) => {
    //         const subfolderFiles = await this.getfilesfromfolder(folder.ServerRelativeUrl);
    //         const subfolderSubfolders = await this.getfoldersfromfolder(folder.ServerRelativeUrl);
    //         return { ...folder, files: subfolderFiles, subfolders: subfolderSubfolders };
    //     }));
    // }

    // public async getFolderByName(folderName: string): Promise<any> {
    //     const folders = await this._spfi.web.folders.filter(`Name eq '${folderName}'`)();
    //     return folders.length > 0 ? folders[0] : null;
    // }






}

