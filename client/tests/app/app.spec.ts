import {ShowServiceImpl} from "../../src/service/ShowServiceImpl";
import { expect } from 'chai';
import 'mocha';
import {MongoAdapterMock, testData, resultData} from "../helpers/MongoAdapterMock"
import loggerMock from "../helpers/LoggerMock"
import request from "supertest"
import createApplication from "../../src/app"

describe('GET /show', function() {
    it('responds with json', function(done) {
        const service =  new ShowServiceImpl(new MongoAdapterMock(testData),loggerMock);
        const app = createApplication(service, loggerMock, true);
        request(app)
            .get('/show')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds with internal error', function(done) {
        const service =  new ShowServiceImpl(new MongoAdapterMock(testData, true),loggerMock);
        const app = createApplication(service, loggerMock, true);
        request(app)
            .get('/show')
            .expect(500, done);
    });

});

describe('GET /_show', function() {
    it('responds with not found error', function(done) {
        const service =  new ShowServiceImpl(new MongoAdapterMock(testData),loggerMock);
        const app = createApplication(service, loggerMock, true);
        request(app)
            .get('/_show')
            .expect(404, done);
    });

});



