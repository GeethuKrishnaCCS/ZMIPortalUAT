import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState {
    listItems: any[];
    RenderedNews: any[];
    UpdateCount: number;
    Next: number;
    Count: number;
    Reload: boolean;
}

export interface StylingProps {
    listItems: any[];
    context: WebPartContext;
}
