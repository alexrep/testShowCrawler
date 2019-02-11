import {Collection, MongoClient} from "mongodb";
import {MongoAdapter} from "../types/api";
import {ApiShowResult, DbConfig} from "../types/index";

export class MongoAdapterImpl implements MongoAdapter {
    private collection: Collection;
    private logger: any;

    constructor(client: MongoClient, config: DbConfig, logger: any) {
        this.logger = logger;
        this.collection = client.db().collection(config.collection);
        this.logger.debug("MongoAdapterImpl ", config);
    }

    public async storeShow(show: ApiShowResult): Promise<any> {
        return await this.collection.insertOne(show);
    }

    public async getLastLoadedId(): Promise<number> {
        const results: ApiShowResult[]  = await this.collection.find().sort({id: -1}).limit(1).toArray();
        if (results.length > 0) {
            return results[0].id;
        } else {
            return 0;
        }
    }
}
