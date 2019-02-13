import { expect } from 'chai';
import 'mocha';
import Axios from "axios";
import {HTTPAdapterImpl} from "../../src/api/HTTPAdapterImpl";
import nock from "nock";
import loggerMock from "../helpers/LoggerMock";
import {testData} from "../helpers/testData"
import {ShowCrawler} from "../../src/crawler/ShowCrawler";
import {MongoAdapterMock} from "../helpers/MongoAdapterMock";

describe("ShowCrawler", ()=>{
    let mock;
    let show;
    let adapter;
    let storage;

    let httpTestConfig = {
        "url": "http://api.tvmaze.com/shows/",
        "host": "http://api.tvmaze.com",
        "endpoint": "/shows/",
        "options": "embed=cast",
        "attempts": 1,
        "errorTimeout": 10,
        "skipRetryError": 404,
        "retryErrorCode": 429
    };

    let crawlerTestConfig = {
        "parallelRequests": 3,
        "notFoundThreshold": 5,
        "regularTimeout": 1,
        "offset": 0,
        "validShowsCount": 20
    };

    beforeEach(()=> {
        mock = nock(httpTestConfig.host);
        show = testData[0];
        adapter = new HTTPAdapterImpl(Axios, httpTestConfig, loggerMock);
        storage =  new MongoAdapterMock()
    });

    afterEach(()=> {
        nock.cleanAll()
    });

    it("should load all data and exit when not found", async ()=> {
        const crawler = new ShowCrawler(adapter, storage,crawlerTestConfig.offset, crawlerTestConfig, loggerMock);
        mock.get((uri: string)=> uri.includes(httpTestConfig.endpoint))
            .times(crawlerTestConfig.validShowsCount)
            .reply(200, show);

        mock.get((uri: string)=> uri.includes(httpTestConfig.endpoint))
            .times(crawlerTestConfig.notFoundThreshold)
            .reply(404);

        await new Promise((res, rej)=> {
            crawler.crawl();
            crawler.on("done", res);
        });

        expect(storage.storage.length).to.equal(crawlerTestConfig.validShowsCount);
    });


});