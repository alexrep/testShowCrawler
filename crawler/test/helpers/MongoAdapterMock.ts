import {MongoAdapter} from "../../src/types/api";
import {ApiShowResult} from "../../src/types";

export class MongoAdapterMock implements MongoAdapter{
    public storage: ApiShowResult[];
    constructor(){
        this.storage = []
    }
    async storeShow(show: ApiShowResult){
        this.storage.push(show);
    }

}
