var sinon = require('sinon'),
    expect = require('chai').expect;

describe('Requester Spec: implicitCacheControl and implicitTraceHeader', function () {
    var testrun,
        HOST = 'https://www.postman-echo.com/get';

    describe('with undefined', function() {
        before(function(done) {
            this.run({
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request with `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
            expect(response.headers).to.have.property('cache-control', 'no-cache');
        });

        it('should send request with `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString()),
                regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/mi;

            expect(response.headers).to.have.property('postman-token').that.match(regex);
            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
        });
    });

    describe('with true', function() {
        before(function(done) {
            this.run({
                requester: {
                    implicitCacheControl: true,
                    implicitTraceHeader: true
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request with `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
            expect(response.headers).to.have.property('cache-control', 'no-cache');
        });

        it('should send request with `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString()),
                regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/mi;

            expect(response.headers).to.have.property('postman-token').that.match(regex);
            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'no-cache'});
        });
    });

    describe('with false', function() {
        before(function(done) {
            this.run({
                requester: {
                    implicitCacheControl: false,
                    implicitTraceHeader: false
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should send request without `Cache-Control: no-cache` header', function () {
            var request = testrun.request.getCall(0).args[3],
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            // .has function from sdk is being used here because we have a list of objects and this seems to be the
            // neat way of doing it for now.
            expect(request.headers.has('cache-control')).to.be.false;
            expect(response.headers).to.not.have.property('cache-control');
        });

        it('should send request without `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3],
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(response.headers).to.not.have.property('postman-token');
            expect(request.headers.has('postman-token')).to.be.false;
        });
    });

    describe('with custom headers', function() {
        before(function(done) {
            this.run({
                requester: {
                    implicitCacheControl: true,
                    implicitTraceHeader: true
                },
                collection: {
                    item: [{
                        name: 'Cache-Control and postman-token',
                        request: {
                            url: HOST,
                            header: {
                                'Cache-Control': 'max-age=1200',
                                'Postman-Token': 'CustomToken'
                            }
                        }
                    }]
                }
            }, function (err, results) {
                testrun = results;
                done(err);
            });
        });

        it('should complete the run', function () {
            expect(testrun).to.be.ok;
            sinon.assert.calledOnce(testrun.start);
            sinon.assert.calledOnce(testrun.done);
            sinon.assert.calledWith(testrun.done.getCall(0), null);

            sinon.assert.calledOnce(testrun.request);
            sinon.assert.calledWith(testrun.request.getCall(0), null);

            sinon.assert.calledOnce(testrun.response);
            sinon.assert.calledWith(testrun.response.getCall(0), null);
        });

        it('should override `Cache-Control` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Cache-Control', value: 'max-age=1200'});
            expect(response.headers).to.have.property('cache-control', 'max-age=1200');
        });

        it('should override `Postman-Token` header', function () {
            var request = testrun.request.getCall(0).args[3].toJSON(),
                response = JSON.parse(testrun.response.getCall(0).args[2].stream.toString());

            expect(request.header).to.deep.include({key: 'Postman-Token', value: 'CustomToken'});
            expect(response.headers).to.have.property('postman-token', 'CustomToken');
        });
    });
});
