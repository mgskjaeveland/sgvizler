.PHONY: example

JS_COMPILER = uglifyjs
XSLT = java -jar /home/martige/repo/sgvizler/bin/saxon9he.jar

JS_FILES = \
	sgvizler.js 

sgvizler.pack.js: \
	src/start.js \
	src/core.js \
	src/option.js \
	src/ui.js \
	src/parser.js \
	src/query.js \
	src/charts.js $(wildcard src/chart/*.js) \
	src/end.js

sgvizler.js: sgvizler.pack.js
	cp -f $< $@

%.pack.js:
	@rm -f $@
	cat $^ > $@
	@chmod a-w $@

%.min.js: %.js
	@rm -f $@
	$(JS_COMPILER) < $< > $@

EXAMPLES = $(wildcard example/ex*.html)

example: example/examples.xml example/examples.xsl
	cd example; $(XSLT) -s:examples.xml -xsl:examples.xsl
example/%.html: example

clean:
	rm -f sgvizler*.js
	rm $(EXAMPLES)
	rm $(SCREENSHOTS)

all: \
	$(JS_FILES) \
	$(JS_FILES:.js=.min.js) \
	example
