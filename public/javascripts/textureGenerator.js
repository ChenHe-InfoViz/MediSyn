function textureGenerator(){

	var svg = d3.select("#bodySvg");
	var responsive = {};

	responsive["NCCN guidelines"] = responsive["FDA guidelines"] = responsive["European LeukemiaNet guidelines"]
	= responsive["CPIC guidelines"] = textures.lines().thicker().stroke("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["NCCN guidelines"], 1);});

	responsive["Late trials"] = textures.lines().thicker().stroke("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Late trials"], 1);});

	responsive["Early trials"] = responsive["Clinical trial"] = textures.lines().thicker().stroke("white").
	background(function(){ return d3.hsv(0, evidenceLevel["Clinical trial"], 1);});

	responsive["Case report"] = textures.lines().thicker().stroke("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Case report"], 1);});

	responsive["Pre-clinical"] = textures.lines().thicker().stroke("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Pre-clinical"], 1);});



	var resistant = {}
	resistant["NCCN guidelines"] = resistant["FDA guidelines"] = resistant["European LeukemiaNet guidelines"] = resistant["NCCN/CAP guidelines"]
	= resistant["CPIC guidelines"] = textures.circles().thicker().fill("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["NCCN guidelines"], 1);});

	resistant["Late trials"] = textures.circles().thicker().fill("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Late trials"], 1);});

	resistant["Early trials"] = resistant["Clinical trial"] = textures.circles().thicker().fill("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Clinical trial"], 1);});

	resistant["Case report"] = textures.circles().thicker().fill("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Case report"], 1);});

	resistant["Pre-clinical"] = textures.circles().thicker().fill("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Pre-clinical"], 1);});


	var noResponsive = {}
	noResponsive["NCCN guidelines"] = noResponsive["FDA guidelines"] = noResponsive["European LeukemiaNet guidelines"]
	= noResponsive["CPIC guidelines"] = textures.lines()
							    .orientation("vertical")
							    .stroke("white")
							    .thicker()
							    .shapeRendering("crispEdges")
	.background(function(){ return d3.hsv(0, evidenceLevel["NCCN guidelines"], 1);});

	noResponsive["Late trials"] = textures.lines()
							    .orientation("vertical")
							    .thicker()
							    .shapeRendering("crispEdges")
							    .stroke("white")
	.background(function(){ return d3.hsv(0, evidenceLevel["Late trials"], 1);});

	noResponsive["Early trials"] = noResponsive["Clinical trial"] = textures.lines()
							    .orientation("vertical")
							    .stroke("white")
							    .thicker()
							    .shapeRendering("crispEdges")
	.background(function(){ return d3.hsv(0, evidenceLevel["Clinical trial"], 1);});

	noResponsive["Case report"] = textures.lines()
							    .orientation("vertical")
							    .stroke("white")
							    .thicker()
							    .shapeRendering("crispEdges")
	.background(function(){ return d3.hsv(0, evidenceLevel["Case report"], 1);});

	noResponsive["Pre-clinical"] = textures.lines()
							    .orientation("vertical")
							    .stroke("white")
							    .thicker()
							    .shapeRendering("crispEdges")
	.background(function(){ return d3.hsv(0, evidenceLevel["Pre-clinical"], 1);});


	var toxicity = {}
	toxicity["NCCN guidelines"] = toxicity["FDA guidelines"] = toxicity["European LeukemiaNet guidelines"]
	= toxicity["CPIC guidelines"] = textures.paths()
								  .d("crosses")
								  .stroke("white")
								  .thicker()
	.background(function(){ return d3.hsv(0, evidenceLevel["NCCN guidelines"], 1);});

	toxicity["Late trials"] = textures.paths()
								  .d("crosses")
								  .stroke("white")
								  .thicker()
	.background(function(){ return d3.hsv(0, evidenceLevel["Late trials"], 1);});

	toxicity["Early trials"] = toxicity["Clinical trial"] = textures.paths()
								  .d("crosses")
								  .stroke("white")
								  .thicker()
	.background(function(){ return d3.hsv(0, evidenceLevel["Clinical trial"], 1);});

	toxicity["Case report"] = textures.paths()
								  .d("crosses")
								  .stroke("white")
								  .thicker()
	.background(function(){ return d3.hsv(0, evidenceLevel["Case report"], 1);});

	toxicity["Pre-clinical"] = textures.paths()
								  .d("crosses")
								  .stroke("white")
								  .thicker()
	.background(function(){ return d3.hsv(0, evidenceLevel["Pre-clinical"], 1);});

	var re = {responsive: responsive, resistant: resistant, noResponsive: noResponsive, toxicity: toxicity}
	for (var property in re) {
	    if (re.hasOwnProperty(property)) {
	    	
			svg.call(re[property]["NCCN guidelines"])
			svg.call(re[property]["Late trials"])
			svg.call(re[property]["Early trials"])
			svg.call(re[property]["Case report"])
			svg.call(re[property]["Pre-clinical"])
			        
	    }
	}

	return re;


}