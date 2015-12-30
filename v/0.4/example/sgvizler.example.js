/*  Sgvizler example convenience functions
 *  (c) 2011 Martin G. Skjæveland
 *
 *  Sgvizler is freely distributable under the terms of an MIT-style license.
 *  Sgvizler web site: https://code.google.com/p/sgvizler/
 *--------------------------------------------------------------------------*/sgvizler.example.copyElementAsText=function(a,b){var c=document.getElementById(a),d="&lt;div ";for(var e=c.attributes.length-1;e>-1;e--)d+=c.attributes[e].nodeName+'="'+c.attributes[e].nodeValue+'"\n\t';$("#"+b).html(d+"&gt;&lt;/div&gt;")},sgvizler.example.copyQuery=function(a,b){var c=document.getElementById(a),d=document.getElementById(b),e=["data-sgvizler-query","data-sgvizler-endpoint","data-sgvizler-rdf"];for(var f=0;f<e.length;f++)c.getAttribute(e[f])&&d.setAttribute(e[f],c.getAttribute(e[f]))}