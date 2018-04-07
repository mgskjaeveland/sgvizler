    test("sgvizler.formParameterName", function() {
             function get(value) {
                 return sgvizler.formParameterName(value);
             }

             function set(value, newvalue) {
                 return sgvizler.formParameterName(value, newvalue);
             }

             function setget(value, newvalue) {
                 set (value, newvalue);
                 return get(value);
             }

             equal(get("query"), "query");
             equal(get("endpoint"), "endpoint");
             equal(get("endpoint_output"), "endpoint_output");
             equal(get("chart"), "chart");
             equal(get("width"), "width");
             equal(get("height"), "height");
             equal(get("ui"), "ui");

             equal(get("something_that_should_not_be_a_parameter"), undefined);

             // a setter returns undefined
             equal(set("query", "test1"), undefined);

             // the value test1 is not set, (but query = 'test1')
             equal(get("test1"), undefined);

             // setting and getting should return what we set
             equal(setget("query", "test1"), "test1");
             equal(setget("something_that_should_not_be_a_parameter", "oops!"), "oops!");
         });