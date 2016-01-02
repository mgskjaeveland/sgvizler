<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">

  <xsl:import href="http://lenzconsulting.com/xml-to-string/xml-to-string.xsl"/>

  <xsl:output method="html" version="5.0" indent="yes" encoding="utf-8" name="html" />
  <xsl:output method="html" version="4.0" indent="yes" encoding="utf-8" name="htmlframeset"
	      doctype-system="http://www.w3.org/TR/html4/frameset.dtd" 
	      doctype-public="-//W3C//DTD HTML 4.01 Frameset//EN"/>
  
  <xsl:template match="/">

    <!-- index.html -->
    <xsl:result-document href="index.html" format="htmlframeset">
      <html>
	<head>
	  <title>Sgvizler Examples</title>
	</head>
	<frameset cols="20%,80%" id="frames">
	  <frame src="menuframe.html" name="menu" frameborder="0"/>
	  <frame src="mainframe.html" name="main" frameborder="0"/>
	</frameset>
      </html>
    </xsl:result-document>

    <!-- menuframe.html -->
    <xsl:result-document href="menuframe.html" format="html">
      <html>
	<head>
	  <link rel="stylesheet" type="text/css" href="examples.css" />
	  <xsl:call-template name="head-all"/>
	</head>
	<body id="menu">
	  <p><a href="mainframe.html" target="main">Overview</a></p>
	  <xsl:call-template name="examplesList"/>
	</body>
      </html>
    </xsl:result-document>

    <!-- mainframe.html -->
    <xsl:result-document href="mainframe.html" format="html">
      <html>
	<head>
	  <link rel="stylesheet" type="text/css" href="examples.css" />
	  <xsl:call-template name="head-all"/>
	</head>
	<body>
	  <xsl:call-template name="header"/>
	  <h1>Sgvizler Examples</h1>
	  <p>
	    Many live examples of using <a
	    href="http://dev.data2000.no/sgvizler/">Sgvizler</a> are
	    gathered here. Each example page contains a chart drawn by
	    Sgvizler on page load (some can take a while, so be
	    patient, i.e, a few seconds), a listing of the
	    <code>&lt;div&gt;</code> element which specifies the
	    chart, and the query results in a table. Additionally,
	    some pages may also contain other charts visualizing the
	    exact same query results.
	  </p>
	  <p>
	    If you're not seeing this page as frames there is a <a
	    href="index.html" target="frames">frames version</a> which
	    might be more handy.
	  </p>
	  <xsl:call-template name="examplesList"/>
	  <h2>Endpoints</h2>
	  <dl>
	    <xsl:for-each select="/root/endpoints/endpoint">
	      <dt><xsl:value-of select="name"/></dt>
	      <dd><xsl:copy-of select="description"/></dd>
	    </xsl:for-each>
	  </dl>
	</body>
      </html>
    </xsl:result-document>

    <!-- exXXXX99.html -->
    <xsl:for-each select="/root/endpoints/endpoint">
      <xsl:variable name="endpointId" select="@id"/>
      <xsl:variable name="endpointName" select="name"/>
      <xsl:for-each select="/root/examples/example[endpoint/@ref = $endpointId]">
	<xsl:variable name="filename" select="concat('ex',$endpointName,position(),'.html')" />
	<xsl:result-document href="page/{$filename}" format="html">
	  <xsl:call-template name="example-page"/>
	</xsl:result-document>
      </xsl:for-each>
    </xsl:for-each>

  </xsl:template>

  <!-- ############################################################ -->

  <xsl:template name="head-all">
    <title>Sgvizler</title>
    <meta charset="UTF-8"/>
  </xsl:template>

  <xsl:template name="head-example">
    <link rel="stylesheet" type="text/css" href="../examples.css" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.js"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript" src="../../sgvizler.js"></script>
    <script type="text/javascript">
      <xsl:variable name="endpointRef" select="endpoint/@ref"/>
      <xsl:for-each select="/root/endpoints/endpoint[@id = $endpointRef]/namespaces/namespace">
	<xsl:text>sgvizler.prefix('</xsl:text><xsl:value-of select="prefix"/><xsl:text>', '</xsl:text><xsl:value-of select="url"/><xsl:text>');
      </xsl:text>
      </xsl:for-each>
      <xsl:text>
	$(document).ready(function() { sgvizler.containerDrawAll(); });
      </xsl:text>
    </script>
  </xsl:template>


  <xsl:template name="header">
    <div id="logo">
      <a href="http://dev.data2000.no/sgvizler/">
	<img src="http://beta.data2000.no/sgvizler/misc/image/mr.sgvizler.png" alt="mr.sgvizler.png"/>
	</a><br/>Mr. Sgvizler
    </div>
  </xsl:template>

  <xsl:template name="footer">
    <div id="footer">
      <xsl:comment>Please leave a link to the Sgvizler homepage.</xsl:comment>
      <p>
	Sgvizler visualizes the result of SPARQL SELECT queries. For more
	information, see the <a
	href="http://dev.data2000.no/sgvizler/">Sgvizler</a>
	homepage. (c) 2011--2013 Martin G. Skj&#230;veland.
      </p>
    </div>
  </xsl:template>


  <xsl:template name="examplesList">
    <h2>Examples</h2>
    <xsl:for-each select="/root/endpoints/endpoint">
      <xsl:variable name="endpointId" select="@id"/>
      <xsl:variable name="endpointName" select="name"/>
      <h3><xsl:value-of select="$endpointName"/></h3>
      <ul>
	<xsl:for-each select="/root/examples/example[endpoint/@ref = $endpointId]">
	  <li>
	    <a href="page/ex{$endpointName}{position()}.html" target="main">
	      <xsl:value-of select=".//chart" separator=", "/>
	    </a>
	  </li>
	</xsl:for-each>
      </ul>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="example-page">
    <html>
      <head>
	<xsl:call-template name="head-all"/>
	<xsl:call-template name="head-example"/>
      </head>
      <xsl:call-template name="body-example"/>
    </html>
  </xsl:template>

  <xsl:template name="body-example">
    <body>
      <xsl:call-template name="header"/>
      <xsl:call-template name="exampleDiv"/>
      <xsl:if test="other">
	<h3>Same query, different charts</h3>
	<p>Not all charts may be well-suited for displaying this dataset.</p>
	<xsl:for-each select="other/example">
	  <xsl:call-template name="otherExampleDiv"/>
	</xsl:for-each>
      </xsl:if>
      <xsl:call-template name="footer"/>
    </body>
  </xsl:template>

  <xsl:template name="exampleDiv">
    <h3><code><xsl:value-of select="chart"/></code>: <xsl:value-of select="normalize-space(heading)"/></h3>
    <p><xsl:value-of select="normalize-space(description)"/></p>
    <xsl:variable name="divElement">
      <xsl:call-template name="_sgvizlerDiv">
	<xsl:with-param name="id">sgvzl_example_query</xsl:with-param>
	<xsl:with-param name="endpointRef" select="endpoint/@ref"/>
	<xsl:with-param name="query" select="query"/>
	<xsl:with-param name="chart" select="chart"/>
	<xsl:with-param name="chartoptions" select="chartoptions"/>
	<xsl:with-param name="rdf" select="rdf"/>
	<xsl:with-param name="style" select="style"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:copy-of select="$divElement"/>
    <xsl:variable name="divElementText">
      <xsl:call-template name="xml-to-string">
	<xsl:with-param name="node-set" select="$divElement"/>
      </xsl:call-template>
    </xsl:variable>
    <p>The element which draws the above chart:</p>
    <pre id="sgvzl_example_pre">
      <xsl:value-of select="replace($divElementText, '(data-sgvizler|style)', '&#10;&#32;&#32;&#32;$1')"/>
    </pre>
    <h3>The results of the query in <code>gTable</code></h3>
    <xsl:call-template name="_sgvizlerDiv">
      <xsl:with-param name="id">sgvzl_example_table</xsl:with-param>
      <xsl:with-param name="endpointRef" select="endpoint/@ref"/>
      <xsl:with-param name="query" select="query"/>
      <xsl:with-param name="rdf" select="rdf"/>
      <xsl:with-param name="style">width:800px; height:200px;</xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="otherExampleDiv">
    <h4><code><xsl:value-of select="chart"/></code></h4>
    <xsl:call-template name="_sgvizlerDiv">
      <xsl:with-param name="id">sgvzl_example_query_copy_<xsl:number value="position()"/></xsl:with-param>
      <xsl:with-param name="endpointRef" select="../../endpoint/@ref"/>
      <xsl:with-param name="query" select="../../query"/>
      <xsl:with-param name="rdf" select="../../rdf"/>
      <xsl:with-param name="chart" select="chart"/>
      <xsl:with-param name="chartoptions" select="chartoptions"/>
      <xsl:with-param name="style" select="style"/>
    </xsl:call-template>
  </xsl:template>

  <!-- ########################## -->

  <xsl:template name="_sgvizlerDiv">
    <xsl:param name="id"/>
    <xsl:param name="endpointRef"/>
    <xsl:param name="query"/>
    <xsl:param name="chart">google.visualization.Table</xsl:param>
    <xsl:param name="chartoptions"/>
    <xsl:param name="rdf"/>
    <xsl:param name="loglevel">2</xsl:param>
    <xsl:param name="style"/>

    <xsl:variable name="endpointUrl" select="/root/endpoints/endpoint[@id = $endpointRef]/url"/>

    <xsl:element name="div">
      <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
      <xsl:attribute name="data-sgvizler-endpoint"><xsl:value-of select="$endpointUrl"/></xsl:attribute>
      <xsl:attribute name="data-sgvizler-query"><xsl:value-of select="normalize-space($query)"/></xsl:attribute>
      <xsl:attribute name="data-sgvizler-chart"><xsl:value-of select="$chart"/></xsl:attribute>
      <xsl:if test="$chartoptions">
	<xsl:attribute name="data-sgvizler-chart-options"><xsl:value-of select="$chartoptions"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="$rdf">
	<xsl:attribute name="data-sgvizler-rdf"><xsl:value-of select="$rdf"/></xsl:attribute>
      </xsl:if>
      <xsl:attribute name="data-sgvizler-loglevel"><xsl:value-of select="$loglevel"/></xsl:attribute>
      <xsl:attribute name="style">
	<xsl:choose>
	  <xsl:when test="$style"><xsl:value-of select="$style"/></xsl:when>
	  <xsl:otherwise>width:800px; height:400px;</xsl:otherwise>
	</xsl:choose>
      </xsl:attribute>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
