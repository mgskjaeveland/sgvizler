    test("Query.queryParameter", function() {

             var Q = new sgvizler.Query();

             function get(value) {
                 return Q.queryParameter(value);
             }
             function set(value, newvalue) {
                 return Q.queryParameter(value, newvalue);
             }
             function getset(value, newvalue) {
                 return Q.queryParameter(value, newvalue).queryParameter(value);
             }

             equal(get("query"), "query");
             equal(get("output"), "output");

             equal(get("something_that_should_not_be_a_parameter"), undefined);

             // a setter returns the Query object
             equal(set("query", "test1"), Q);

             // the value test1 is not set, (but query = 'test1')
             equal(get("test1"), undefined);

             // setting and getting should return what we set
             equal(getset("query", "test1"), "test1");
             equal(getset("something_that_should_not_be_a_parameter", "oops!"), "oops!");
         });

    test("sgvizler.defaultQueryParameter", function() {

             function get(value) {
                 return sgvizler.defaultQueryParameter(value);
             }
             function set(value, newvalue) {
                 return sgvizler.defaultQueryParameter(value, newvalue);
             }
             function getset(value, newvalue) {
                 return sgvizler.defaultQueryParameter(value, newvalue).defaultQueryParameter(value);
             }

             equal(get("query"), "query");
             equal(get("output"), "output");

             equal(get("something_that_should_not_be_a_parameter"), undefined);

             // a setter returns the Query object
             equal(set("query", "test1"), sgvizler);

             // the value test1 is not set, (but query = 'test1')
             equal(get("test1"), undefined);

             // setting and getting should return what we set
             equal(getset("query", "test1"), "test1");
             equal(getset("something_that_should_not_be_a_parameter", "oops!"), "oops!");
         });