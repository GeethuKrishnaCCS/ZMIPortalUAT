import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState { 
    News: any[];
    RenderedNews: any[]; 
    UpdateCount: number; 
    Next: number; 
    Count: number; 
    Reload: boolean;

 }
export interface StylingProps {
    News: any[]; 
    AuthorToggle: string; 
    Reload: boolean; 
    context: WebPartContext; 
    description: string;
    DateToggle:string;
}
