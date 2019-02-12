import {CrawlerConfig} from "../types";
import {HTTPAdapter, MongoAdapter} from "../types/api";
import EventEmitter = NodeJS.EventEmitter;

export class ShowCrawler extends EventEmitter{
    private http: HTTPAdapter;
    private storage: MongoAdapter;
    private config: CrawlerConfig;
    private notFoundInRow: number;
    private currentIndex: number;
    private requestCount: number;
    private logger: any;
    private scheduledTasks: number;

    constructor(http: HTTPAdapter, storage: MongoAdapter, offset: number, config: CrawlerConfig, logger: any) {
        super();
        this.http = http;
        this.storage = storage;
        this.config = config;
        this.notFoundInRow = 0;
        this.currentIndex = offset;
        this.requestCount = 0;
        this.scheduledTasks = 0;
        this.logger = logger;
        this.logger.debug("ShowCrawler", config);
        this.processNext = this.processNext.bind(this);
    }

    public async crawl() {
        this.logger.debug("Starting crawling");
        for  (let i = 0 ; i < this.config.parallelRequests; i++){
            this.processNext()
        }
    }

    async processNext() {
        if (this.notFoundInRow <= this.config.notFoundThreshold ) {
            const id = this.currentIndex;
            this.currentIndex ++;
            await this.process(id);
        }

        if (this.noTasksLeft()){
            this.logger.info("Job is done");
            this.emit("done")
        }
    }

    private noTasksLeft():boolean{
        return this.requestCount == 0 && this.scheduledTasks == 0
    }

    async process(id: number, attempt: number = 0) {
        this.requestCount ++;
        this.logger.debug("Loading %s  %s", id, attempt);
        let result;
        try {
            result = await this.http.retreiveShow(id);
        } catch (error) {
            const status = error.status;
            if (status) {
                this.logger.error("Status %s %s for %s", status, error.message , id);
                if (status === 404) {
                    this.notFoundInRow++;
                }
            } else {
                this.logger.error(error);
            }
            return;
        } finally {
            this.requestCount --;
        }
        this.notFoundInRow = 0;
        this.logger.info("loaded show %s", result.name);

        this.scheduleNext();
        try {
            await this.storage.storeShow(result);
            this.logger.debug("stored show %s", id);
        } catch (err){
            this.logger.error("Error while storing %s", err.message);
        }

        this.requestCount --;
    }

    private scheduleNext(){
        this.scheduledTasks ++ ;
        setTimeout(()=> {
            this.scheduledTasks --;
            this.processNext()
        }, this.config.regularTimeout)
    }
}
