
export interface ApiShowResult {
    id : number,
    name: string,
    _embedded: object
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
    errorTimeout: number,
    attempts: number,
    skipRetryError: number
}

export interface CrawlerConfig {
    url: string,
    option: string,
    parallelRequests: number,
    notFoundThreshold: number,
    regularTimeout: number

}



export interface HTTPClient {
    get(url:string): Promise<any>
}

