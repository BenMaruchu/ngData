'use strict';

describe('Collection#findById', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    // var customers = [{
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }, {
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }, {
    //     name: faker.name.findName(),
    //     code: faker.random.uuid()
    // }];

    //customer model
    var Customer;

    beforeEach(module('ngData'));

    beforeEach(function(done) {

        inject(function($ngData, $rootScope) {
            Customer = $ngData.model('Customer', {
                properties: {
                    name: {
                        type: String,
                        defaultsTo: faker.name.findName()
                    },
                    code: {
                        type: String
                    }
                }
            });

            $ngData.initialize().then(function(response) {
                done(null, response);
            }).catch(function(error) {
                done(error);
            });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

    // beforeEach(function(done) {

    //     inject(function($rootScope) {
    //         Customer.remove().then(function(response) {
    //             done(null, response);
    //         }).catch(function(error) {
    //             done(error);
    //         });

    //         //wait for propagation
    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });

    // });


    // beforeEach(function(done) {

    //     inject(function($rootScope) {

    //         Customer
    //             .create(customers[1])
    //             .then(function(response) {
    //                 done(null, response);
    //             })
    //             .catch(function(error) {
    //                 console.log(error);
    //                 done(error);
    //             });

    //         //wait for propagation
    //         setTimeout(function() {
    //             $rootScope.$apply();
    //         }, 50);

    //     });

    // });


    it('should be able to find a document by id', inject(function() {
        expect(Customer.findById).to.be.a('function');
    }));

    it('should be able to find a document by its id', function(done) {
        inject(function($rootScope) {

            Customer
                .findById(1)
                .then(function(_customer_) {

                    expect(_customer_.id).to.exist;
                    expect(_customer_.name).to.exist;
                    expect(_customer_.code).to.exist;

                    done(null, _customer_);
                })
                .catch(function(error) {
                    done(error);
                });

            //wait for propagation
            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});