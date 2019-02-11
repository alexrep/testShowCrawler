import {ApiShowResult, HTTPClient, HTTPConfig} from "../types";
import {HTTPAdapter} from "../types/api";

export class HTTPAdapterImpl implements HTTPAdapter {
    private client: HTTPClient;
    private config: HTTPConfig;
    private logger: any;

    constructor(client: HTTPClient, config: HTTPConfig, logger: any) {
        this.logger = logger;
        this.client = client;
        this.config = config;
        this.logger.debug("HTTPAdapterImpl ", config);
    }

    public getUrl(id: number): string {
        return `${this.config.url}${id}?${this.config.options}`;
    }

    public async retreiveShow(id: number): Promise<ApiShowResult> {
        this.logger.debug("starting request %s", this.getUrl(id));
        const response = await this.client.get(this.getUrl(id)).then((res)=> { return res.data }).catch((error) => { return {error}; });
        if (response.error){
            throw response.error;
        }
        return await response;
    }
}
