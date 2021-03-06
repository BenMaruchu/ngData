'use strict';

describe('Collection#new', function() {
    this.timeout = function() {
        return 10000;
    };

    //fixtures
    var customers = [{
        name: faker.name.findName(),
        code: faker.random.uuid()
    }, {
        name: faker.name.findName(),
        code: faker.random.uuid()
    }, {
        name: faker.name.findName(),
        code: faker.random.uuid()
    }];

    //customer model
    var Customer;

    beforeEach(module('ngData'));

    beforeEach(inject(function($ngData) {

        Customer = $ngData.model('Customer', {
            properties: {
                name: {
                    type: String,
                    presence: true,
                    defaultsTo: faker.name.findName()
                },
                code: {
                    type: String,
                    length: {
                        minimum: 3
                    }
                }
            }
        });

    }));


    it('should be able to instantiate new model instance', inject(function() {

        expect(Customer.new).to.exist;
        var user = Customer.new();

        expect(user).to.exist;
        expect(user).to.have.ownProperty('name');
        expect(user).to.have.ownProperty('code');

    }));


    it('should be able to instantiate new model instance with data', inject(function() {

        var user = Customer.new(customers[0]);

        expect(user.name).to.be.equal(customers[0].name);
        expect(user.code).to.be.equal(customers[0].code);

    }));

});