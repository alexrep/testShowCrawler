import { expect } from 'chai';
import {MongoClient} from "mongo-mock"
import 'mocha';
import {MongoAdapterImpl} from "../../src/api/MongoAdapterImpl";
import loggerMock from "../helpers/LoggerMock"

import {testCollection} from "../helpers/testData"

describe("MongoAdapterImpl", ()=>{
    let client;
    const testConfig = {
        "url": "mongodb://localhost/showcrawler",
        "collection": "TEST_COLLECTION",
        "pageSize" : 5
    };

    beforeEach(async ()=>{
        client = await MongoClient.connect(testConfig.url, {});
        const collection = client.db().collection(testConfig.collection);
        await collection.insertMany(testCollection)
    });

    afterEach(async ()=>{
        await client.close();
    });
    // Test passes but mongo-mock appeared to behave in undocumented way and hang test runner process
    it.skip("returns paginated shows in correct order", async ()=> {
        const adapter = new MongoAdapterImpl(client,testConfig, loggerMock);
        const result = await adapter.findShowsPage(1);
        expect(result.length).to.equal(5);
        expect(result[0].id).to.equal(6);
    });
});