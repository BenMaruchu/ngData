'use strict';


describe('Schema', function() {
    this.timeout = function() {
        return 8000;
    };

    var table = 'users';
    var defaultsTo = faker.name.firstName();

    var properties = {
        firstName: {
            type: String,
            unique: true,
            defaultsTo: defaultsTo
        },
        lastName: {
            type: String
        },
        ssn: {
            type: String,
            primaryKey: true,
            index: true
        }
    };

    // load the ngData module
    beforeEach(module('ngData'));


    it('should be injectable', inject(function(Schema) {
        expect(Schema).to.exist;
        expect(Schema.castToSQLType).to.exist;
        expect(Schema.propertiesDDL).to.exist;
    }));


    it('should be able to cast js data types to sql type', inject(function(Schema, DataTypes) {
        expect(Schema.castToSQLType('Number')).to.equal(DataTypes.Number);
        expect(Schema.castToSQLType(String)).to.equal(DataTypes.String);
    }));


    it('should be able to convert JSON Schema properties to SQL DDL', inject(function(Schema) {

        var ddl = Schema.propertiesDDL(properties);

        var expectedDDL =
            'firstName TEXT UNIQUE DEFAULT "' + defaultsTo + '", lastName TEXT, ssn TEXT PRIMARY KEY';

        expect(ddl).to.exist;
        expect(ddl).to.equal(expectedDDL);

    }));

    it('should be able to obtain index properties ', inject(function(Schema) {

        var indexes = Schema.getIndexes(properties);

        expect(indexes).to.exist;
        expect(indexes).to.eql(['ssn']);

    }));


    it('should be able to convert JS value to their respective SQL value', inject(function(Schema) {

        var date = new Date();
        var sqlDate = Schema.toSQLValue(date);
        expect(sqlDate).to.equal(date.toUTCString());

        var arrayy = [1, 2, 3, 4];
        var sqlArray = Schema.toSQLValue(arrayy);
        expect(sqlArray).to.equal(JSON.stringify(arrayy));

        var objecti = faker.helpers.contextualCard();
        var sqlObject = Schema.toSQLValue(objecti);
        expect(sqlObject).to.equal(JSON.stringify(objecti));
    }));


    it('should be able to update existing table data to new schema properties', inject(function(Schema) {
        var data = [{
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            ssn: faker.random.number().toString(),
        }, {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            ssn: faker.random.number().toString(),
        }];

        //add additional propertis
        var props = _.merge(properties, {
            otherName: String,
            dob: Date,
            interests: {
                type: Array,
                defaultsTo: [faker.internet.userName()]
            }
        });

        //omit property
        props = _.omit(props, 'firstName');

        data = Schema.copyData(data, props);

        expect(data[0].firstName).to.not.exist;
        expect(data[0].otherName).to.exist;
        expect(data[0].dob).to.exist;
        expect(data[0].interests).to.exist;

    }));

    beforeEach(function(done) {
        inject(function($rootScope, Schema) {

            Schema
                .alter(table, properties)
                .then(function(result) {

                    expect(result).to.exist;
                    expect(result).to.be.equal(table + ' migrated successfully');

                    done(null, result);
                })
                .catch(function(error) {
                    done(error);
                });

            setTimeout(function() {
                $rootScope.$apply();
            }, 50);

        });
    });

});