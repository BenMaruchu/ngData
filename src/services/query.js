(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name Query
     * @description query builder based on squel
     * @see https://hiddentao.github.io/squel/
     */

    angular
        .module('ngData')
        .factory('Query', function(SQL) {

            /**
             * @description Query functional constructor
             * @param {Object} options 
             */
            function Query(options) {
                // harmonize options
                options = _.merge({
                    type: 'select'
                }, options);

                if (options.collection) {
                    this.collection = options.collection;
                }

                this.type = options.type;

                this._init();

            }

            Query.prototype.sql;

            Query.prototype.collection;

            Query.prototype.expression;

            Query.prototype._init = function() {
                //instantiate SQL
                this.sql = SQL[this.type]();

                //set a table to use
                switch (this.type) {
                    case 'select':
                        this.sql.from(this.collection.tableName);
                        break;
                    case 'update':
                        this.sql.table(this.collection.tableName);
                        break;
                    case 'insert':
                        this.sql.into(this.collection.tableName);
                        break;
                    case 'delete':
                        this.sql.from(this.collection.tableName);
                        break;
                }
            };


            /**
             * @description find documents
             * @param  {Object}   conditions
             * @param  {Array}   projections [optional fields to return]
             * @param  {Object}   options     [optional]
             * @param  {Function} callback
             * @return {Query}
             */
            Query.prototype.find = function(conditions, projections /*options*/ ) {
                //harmonize arguments
                if (_.isArray(conditions) || _.isString(conditions)) {
                    projections = conditions;
                    conditions = undefined;
                } else if (_.isPlainObject(conditions)) {
                    //TODO check if the projections is a string or is an array
                }

                if (!this.sql && this.type === 'select') {
                    this.sql = SQL.select().from(this.collection.tableName);
                }

                if (projections) {
                    this.sql.columns(projections);
                }

                return this;
            };


            /**
             * @description Finds a single document by its _id field.
             *              findById(id) is equivalent to findOne({ id: id }).
             * @param  {(Object|String|Number)}   id   value of `id` to query by
             * @param  {Object}   projections optional fields to return
             * @param  {Object}   options     [optional]
             * @param  {Function} callback
             * @return {Query}               
             */
            Query.prototype.findById = function(id, projections, options) {
                return this.find({
                    id: id
                }, projections, options);
            };

            /**
             * @description Issue a mongodb findAndModify remove command by a
             *               document's _id field. findByIdAndRemove(id, ...) is
             *               equivalent to findOneAndRemove({ id: id }, ...).
             * @param  {(Object|String|Number)}   id   value of `id` to query by
             * @param  {Object}   options
             * @return {Query}            
             */
            Query.prototype.findByIdAndDelete = function( /*id, options*/ ) {

            };

            /**
             * @description Issues findAndModify update command by a
             *              document's id field. findByIdAndUpdate(id, ...) is
             *              equivalent to findOneAndUpdate({ id: id }, ...).
             * @param  {Object}   id       value of `id` to query by
             * @param  {Object}   update
             * @param  {Object}   options
             * @return {Query}            
             */
            Query.prototype.findByIdAndUpdate =
                function( /*id, update, options*/ ) {

                };

            /**
             * @description Find One document
             * @param  {Object}   conditions
             * @param  {Object}   projections [ optional fields to return ]
             * @param  {Object}   options
             * @return {Query}               
             */
            Query.prototype.findOne =
                function( /*conditions, projections, options*/ ) {

                };

            /**
             * @description Issue a findAndModify remove command
             * @param  {Object}   conditions
             * @param  {Object}   options
             * @param  {Function} callback
             * @return {Query}              
             */
            Query.prototype.findOneAndRemove =
                function( /*conditions, options*/ ) {

                };

            /**
             * @description Issues a mongodb findAndModify update command.
             * @param  {Object}   conditions
             * @param  {Object}   update
             * @param  {Object}   options
             * @return {Query}    
             */
            Query.prototype.findOneAndUpdate =
                function( /*conditions, update, options*/ ) {

                };

            /**
             * @description Specify the 'where' query conditions
             * @param  {String} path
             * @param  {Object} val  [optional]
             * @return {Query}      
             */
            Query.prototype.where = function(path /*val*/ ) {

                // instantiate expression object
                this.expression = SQL.expr();

                if (path) {
                    if (typeof(path === 'string')) {
                        this.select = this.select.where(path);
                    }
                }

                return this;
            };

            /**
             * @description Specifies the maximum number of records the query
             *              will return. can not be used with distinct
             * @param  {Number} val [description]
             * @return {Query}  
             */
            Query.prototype.limit = function( /*val*/ ) {

            };

            /**
             * @description Sets the sort order
             * @param  {(Object|String)} arg [description]
             * @return {Query} 
             */
            Query.prototype.sort =
                Query.prototype.order = function(arg) {

                    for (var i = 0; arguments.length; i++) {
                        if (_.isString(arguments[i])) {

                            this.sql.order(arguments[i]);
                        }
                    }

                    if (_.isPlainObject(arg)) {

                        _.forEach(arg, function(value, key) {
                            this.sql.order(key, value);
                        }.bind(this));
                    }
                };

            /**
             * @description Specifies a 'greater than' query condition.
             * @param  {(String|Object)} path
             * @param  {Number} val
             * @return {Query}  
             *  @example
             *     Customer
             *         .select()
             *         .where()
             *         .gt({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .gt('age',20)   
             */
            Query.prototype.gt = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' > ' + value);
                    }.bind(this));
                }

                //harmonize arguments
                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' > ' + val);
                }

                return this;
            };

            /**
             * @description Specifies a 'greater or equal' query condition.
             * @param  {(String|Object)} path
             * @param  {Number} val
             * @return {Query}   
             *  @example
             *     Customer
             *         .select()
             *         .where()
             *         .gte({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .gte('age',20)
             */
            Query.prototype.gte = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' >= ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' >= ' + val);
                }

                return this;
            };

            /**
             * @description Specifies a 'less than' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             * @example
             *     Customer
             *         .select()
             *         .where()
             *         .lt({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .lt('age',20)
             */
            Query.prototype.lt = function(path, val) {
                //TODO implement different joiner

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' < ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' < ' + val);
                }

                return this;
            };

            /**
             * @description Specifies a 'less or equal' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             *  @example
             *     Customer
             *         .select()
             *         .where()
             *         .lte({
             *                 age:20,
             *                  height: 140
             *             })
             *
             * or 
             *     Customer
             *         .select()
             *         .where()
             *         .lte('age',20)
             */
            Query.prototype.lte = function(path, val) {

                // harmonize arguments
                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' <= ' + value);
                    }.bind(this));
                }

                if (_.isNumber(path)) {
                    val = path;
                }

                if (path && val) {
                    this.expression.and(path + ' <= ' + val);
                }

                return this;
            };

            /**
             * @description Specifies a 'in' query condition.
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}  
             */
            Query.prototype.in = function( /*path, val*/ ) {

            };

            /**
             * @description Specifies which document fields to include or
             *              exclude (also known as the query "projection")
             * @param  {(Object|String)} arg
             * @return {Query}   
             */
            Query.prototype.select = function(arg) {
                // harmonize argument
                if (_.isString(arg) || _.isArray(arg)) {

                    return this.find(arg);
                }

                return this;
            };

            /**
             * @description Specifies arguments for an $and condition.
             * @return {Query}       
             */
            Query.prototype.and = function() {

                /* jshint camelcase: false*/
                this.expression.and_begin();
                /*jshint camelcase: true*/

                return this;
            };

            /**
             * @description Specifies arguments for an $or condition.
             * @param  {Array} array
             * @return {Query}  
             */
            Query.prototype.or = function() {

                /* jshint camelcase: false*/
                this.expression.or_begin();
                /*jshint camelcase: true*/

                return this;
            };

            /**
             * @description Specifies arguments for an $nor condition.
             * @param  {Array} array
             * @return {Query} 
             */
            Query.prototype.nor = function( /*array*/ ) {

            };

            /**
             * @description Specifies arguments for not equal query condition
             * @param  {String} path 
             * @param  {Number} val 
             * @return {Query}  
             */
            Query.prototype.ne = function(path, val) {
                //harmonize arguments
                if (_.isNumber(path)) {
                    val = path;
                    path = undefined;
                }

                if (path && val) {
                    this.expression.and(path + ' <> ' + val);
                }

                if (_.isPlainObject(path) && !val) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' <> ' + value);
                    }.bind(this));
                }

                return this;
            };

            /**
             * @description Specifying this query as a count query.
             * @param  {Object}   criteria
             * @return {Query} 
             */
            Query.prototype.count = function( /*criteria*/ ) {

                return this;
            };

            /**
             * @description Declares or executes a distinct() operation.
             * @param  {String}   fields
             * @param  {(Object|Query)}   criteria
             * @return {Query}    
             */
            Query.prototype.distinct = function( /*fields, criteria*/ ) {
                //TODO create a simple select query based on the fields
                this.sql.distinct();

                return this;
            };

            /**
             * @description Specifies the complementary comparison value for
             *               paths specified with where()
             * @param {String} path
             * @param  {Object} val
             * @return {Query}     
             */
            Query.prototype.equals = function(path, val) {

                if (_.isString(path) && val) {
                    this.expression.and(path + ' = ' + val);
                }

                if (_.isPlainObject(path)) {
                    // reading object properties
                    _.forEach(path, function(value, key) {
                        this.expression.and(key + ' = ' + value);
                    }.bind(this));
                }

                return this;
            };

            /**
             * @description Specifies an $exists condition
             * @param  {String} path
             * @param  {Number} val
             * @return {Query}      
             */
            Query.prototype.exists = function( /*path, val*/ ) {

            };

            /**
             * @description Executes this query and returns a promise
             * @return {promise}
             */
            Query.prototype.then = function() {

            };


            //TODO implement the min,max, avg, sum

            /**
             * @description Specifies the number of documents to skip.
             * @param {Number} val
             * @return {Query} 
             */
            Query.prototype.offset =
                Query.prototype.skip = function( /*val*/ ) {

                };

            /**
             * @description  finalize the squel expression builder conditions 
             * 
             */
            Query.prototype._finalizeQuery = function() {
                // check the expession condition if is still open
                if (this.expression) {
                    this.sql.where(this.expression);
                }
            };

            /**
             * @description convert current query into its string presentation
             * @return {String} current query sql 
             */
            Query.prototype.toString = function() {

                this._finalizeQuery();

                return this.sql.toString();
            };

            return Query;
        });
}());
