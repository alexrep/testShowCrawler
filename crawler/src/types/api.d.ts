import {ApiShowResult} from "./index";

export interface HTTPAdapter{
    retreiveShow(id: number): Promise<ApiShowResult>
}

export interface MongoAdapter {
    storeShow(show: ApiShowResult): Promise<void>
}