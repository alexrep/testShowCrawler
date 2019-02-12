import {ApiShowResult, HTTPClient, HTTPConfig} from "../types";
import {HTTPAdapter} from "../types/api";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

    private getUrl(id: number): string {
        return `${this.config.url}${id}?${this.config.options}`;
    }

    private async loadWithRetries(url: string, attempt: number = 0){
        return await this.client.get(url)
            .then((res)=> { return res.data })
            .catch(async (error) => {
                if (error.response){
                    if (error.response.status !== this.config.skipRetryError && attempt <= this.config.attempts){
                        await delay(this.config.errorTimeout);
                        this.logger.warn("Retrying download %s %s %s ", error.response.status, url, attempt);
                        return this.loadWithRetries(url, attempt + 1 )
                    } else {
                        return {
                            error: {
                                status: error.response.data.status,
                                message: `${error.response.data.name} ${error.response.data.message}`
                            }
                        }
                    }
                } else {
                    return {error};
                }
            });

    }

    public async retreiveShow(id: number): Promise<ApiShowResult> {
        this.logger.debug("starting request %s", this.getUrl(id));
        const url = this.getUrl(id);
        const response = await this.loadWithRetries(url);
        if (response.error){
            throw response.error;
        }
        return await response;
    }
}
