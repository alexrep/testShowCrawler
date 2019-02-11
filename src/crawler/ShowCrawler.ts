import {CrawlerConfig} from "../types";
import {HTTPAdapter, MongoAdapter} from "../types/api";

export class ShowCrawler {
    private http: HTTPAdapter;
    private storage: MongoAdapter;
    private config: CrawlerConfig;
    private errorCount: number;
    private currentIndex: number;
    private requestCount: number;
    private logger: any;
    private scheduledTasks: number;

    constructor(http: HTTPAdapter, storage: MongoAdapter, offset: number, config: CrawlerConfig, logger: any) {
        this.http = http;
        this.storage = storage;
        this.config = config;
        this.errorCount = 0;
        this.currentIndex = offset;
        this.requestCount = 0;
        this.scheduledTasks = 0;
        this.logger = logger;
        this.logger.debug("ShowCrawler", config);
        this.processNext = this.processNext.bind(this);
        this.process = this.process.bind(this);
    }

    public async crawl() {
        this.logger.debug("Starting crawling");
        for  (let i = 0 ; i < this.config.parallelRequests; i++){
            this.processNext()
        }
    }

    async processNext() {
        if (this.errorCount > this.config.notFoundThreshold ) { return; }
        const id = this.currentIndex;
        this.currentIndex ++;
        this.process(id);
    }

    async process(id: number, attempt: number = 0) {
        this.requestCount ++;
        this.logger.debug("Loading %s  %s", id, attempt);
        let result;
        try {
            result = await this.http.retreiveShow(id);
        } catch (error) {

            if (error.response) {
                const status = error.response.status;
                this.logger.error("Status %s for %s", status, id);
                console.log(status);
                if (error.status === 404) {
                    this.errorCount++;
                } else if (attempt < this.config.attempts) {
                    this.scheduleSame(id, attempt + 1);
                }
            } else {
                this.logger.error(error);
            }
            return;
        } finally {
            this.requestCount --;
        }

        this.logger.info("loaded show %s", result.name);

        this.scheduleNext();
        await this.storage.storeShow(result);
        this.logger.debug("stored show %s", id);
        this.requestCount --;
    }

    scheduleNext(){
        this.scheduledTasks ++ ;
        setTimeout(()=> {
            this.scheduledTasks --;
            this.processNext()
        }, this.config.regularTimeout)
    }

    scheduleSame(id: number, attempt: number = 0){
        this.scheduledTasks ++ ;
        setTimeout(()=> {
            this.scheduledTasks --;
            this.process(id, attempt)
        }, this.config.errorTimeout)
    }

}
