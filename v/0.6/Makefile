
UGLIFY = uglifyjs
MINIFIER = $(UGLIFY)
XSLT = java -jar /home/martige/repo/sgvizler/bin/saxon9he.jar

JS_FILES = \
	sgvizler.js \
	lib/raphael-dracula.pack.js

## Dependencies
#  util.js:       [none]
#  namespace.js:  util
#  registry.js    util
#  logger.js      util
#  charts.js      util
#  datatables.js  util
#  parser.js:     namespace
#  loader.js      util, logger, registry
#  defaults.js    registry
#  Query.js       util, namespace, parser, loader, logger, option
#  container.js   util, loader, logger, Query
#  form.js        util, namespace, registry, loader, Query
sgvizler.pack.js: \
	src/start.js.part \
	src/core.js \
	src/util.js \
	src/namespace.js \
	src/registry.js \
	src/logger.js \
	src/charts.js \
	src/datatables.js \
	src/parser.js \
	src/loader.js \
	src/defaults.js \
	src/Query.js \
	src/container.js \
	src/form.js \
	sgvizler.visualization.pack.js \
	sgvizler.datatable.pack.js \
	src/end.js.part

sgvizler.visualization.pack.js: \
	src/visualization/start.js.part \
	$(wildcard src/visualization/*.js) \
	src/visualization/end.js.part

sgvizler.datatable.pack.js: \
	src/datatable/start.js.part \
	$(wildcard src/datatable/*.js) \
	src/datatable/end.js.part

sgvizler.js: sgvizler.pack.js Makefile
	cp -f $< $@

lib/raphael-dracula.pack.js: lib/raphael-1.3.1-min.js lib/dracula.js

%.pack.js:
	@rm -f $@
	cat $^ > $@
	@chmod a-w $@

%.min.js: %.js
	@rm -f $@
	$(MINIFIER) $< > $@


EXAMPLES = $(wildcard example/ex*.html)

example: example/examples.xml example/examples.xsl
	cd example; $(XSLT) -s:examples.xml -xsl:examples.xsl

example/%.html: example

docs: yuidoc.json sgvizler.pack.js
	rm -fR $@/*
	yuidoc -o $@ -e '.part,.js' -t tool/yuidoc/theme -c $< src


clean:
	rm -f sgvizler*.js
	rm $(EXAMPLES)

all: \
	$(JS_FILES) \
	$(JS_FILES:.js=.min.js) \
	docs \
	example
