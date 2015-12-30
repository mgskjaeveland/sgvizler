    sgvizler.option = {

        home: (window.location.href).replace(window.location.search, ""),
        homefolder: "",

        //// Prefixes included in queries:
        namespace: {
            'rdf' : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            'rdfs': "http://www.w3.org/2000/01/rdf-schema#",
            'owl' : "http://www.w3.org/2002/07/owl#",
            'xsd' : "http://www.w3.org/2001/XMLSchema#"
        },

        query: {}, // holds options set by user in html file.
        chart: {}  // ditto.
    };