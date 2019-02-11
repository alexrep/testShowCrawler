
export interface ApiShowResult {
    id : number,
    name: string,
    _embed: {
        cast: Actor[];
    }
}

export interface Actor{
    id : number,
    name: string,
    birthday: string
}

export interface DbConfig {
    collection: string,
}

export interface HTTPConfig {
    url: string,
    options: string,
}

export interface CrawlerConfig {
    url: string,
    option: string,
    parallelRequests: number,
    notFoundThreshold: number,
    errorTimeout: number,
    regularTimeout: number
    attempts: number
}



export interface HTTPClient {
    get(url:string): Promise<any>
}

