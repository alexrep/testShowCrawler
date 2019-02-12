import {DbConfig, MongoAdapter, StoredShow} from "../types";
import {Collection, MongoClient} from "mongodb";

export class MongoAdapterImpl implements MongoAdapter{
    private collection: Collection;
    private logger: any;
    private config: DbConfig;

    constructor(client: MongoClient, config: DbConfig, logger: any) {
        this.config = config;
        this.logger = logger;
        this.collection = client.db().collection(config.collection);
        this.logger.debug("MongoAdapterImpl ", config);
    }

    async findShowsPage(page:number):Promise<StoredShow[]>{
        const offset = this.config.pageSize * page;
        return await this.collection.find().sort({id: 1}).skip(offset).limit(this.config.pageSize).toArray()
    }
}