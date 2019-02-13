import {MongoAdapter, StoredShow} from "../../src/types";

export class MongoAdapterMock implements MongoAdapter{
    results: StoredShow[];
    throwsError: boolean;
    constructor(results: StoredShow[], throwsError: boolean = false){
        this.results = results
        this.throwsError = throwsError;
    }
    findShowsPage(page:number): Promise<StoredShow[]>{
        if (this.throwsError){
            return Promise.reject("ERROR")
        } else {
            return Promise.resolve(this.results)
        }

    }

}
