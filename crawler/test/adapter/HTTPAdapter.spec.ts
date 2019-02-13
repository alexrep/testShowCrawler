import { expect } from 'chai';
import 'mocha';
import Axios from "axios";
import {HTTPAdapterImpl} from "../../src/api/HTTPAdapterImpl";
import nock from "nock";
import loggerMock from "../helpers/LoggerMock";
import {testData} from "../helpers/testData"

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

describe("HTTPAdapterImpl", () => {
    let mock;
    let show;
    let adapter;

    beforeEach(()=> {
        mock = nock(httpTestConfig.host);
        show = testData[0];
        adapter = new HTTPAdapterImpl(Axios,httpTestConfig, loggerMock);
    });
    afterEach(()=> {
        nock.cleanAll()
    });

    it("should load show by id", async ()=> {
        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .reply(200, show);
        const res = await adapter.retrieveShow(show.id);
        expect(res).to.deep.equal(show);
    });

    it("should throw error on 404 return code", async ()=> {
        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .reply(httpTestConfig.skipRetryError);
        const error = await adapter.retrieveShow(show.id).catch((err)=> err);
        expect(error.status).to.equal(httpTestConfig.skipRetryError);

    });

    it("should retry download on error", async ()=> {
        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .once()
            .reply(httpTestConfig.retryErrorCode);

        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .once()
            .reply(200, show);
        const res = await adapter.retrieveShow(show.id);
        expect(res).to.deep.equal(show);
    });

    it("should throw error when out of attempts", async ()=> {
        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .times(3)
            .reply(httpTestConfig.retryErrorCode);

        mock.get(`${httpTestConfig.endpoint}${show.id}`)
            .query({embed: "cast"})
            .once()
            .reply(200, show);
        const error = await adapter.retrieveShow(show.id).catch((err)=> err);
        expect(error.status).to.equal(httpTestConfig.retryErrorCode);
    });

});