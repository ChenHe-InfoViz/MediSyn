function drawController(){
    drawEvidenceLevel();
    //drawResponseCategory();
    drawPotencyLevel();
    $("#controllerSvg").height($("#evidenceGroup").height() + $("#responseCategory").height() )

    drawSortController();
}

drawLevel = function(group, width, brightness, text, index, density = 1, eviInterval = 20 ){
  //console.log(text);
    var oneLine = group.append("g")
              .attr("transform", "translate(0, " + (eviInterval * index + 15) + ")")
              //.attr("width", 50)

    oneLine.append("line").attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("stroke-width", eviInterval)
    .attr("stroke", function(){
      return d3.hsv(0, 0, brightness)
     })

    oneLine.append("text").attr("transform", "translate(45, 5)").text(text)

    return oneLine;
  }

function drawEvidenceLevel(){
	// var svg = d3.select("#headerSvg")
	// var div = svg
	// 			.append("foreignObject").attr("width", (mainVis.barPaddingLeft - 20) + "px")    
	// 			.append("xhtml:div")
	// 			.append("div")

	// var sign = div.append("div").attr({
	// 				"class": "configHeader",
	// 				transform: "translate(0, 20)"
	// 				//"width": (mainVis.barPaddingLeft - 20) + "px",
	// 				//height: "24px"
	// 			}).text("Drugs")
	

	var evidenceGroup = d3.select("#controllerSvg").append("g").attr("id", "evidenceGroup")
						  .attr({
						  	transform: "translate(0, 12)"
						  })
	evidenceGroup.append("text").text("Evidence level from CGI").style("font-weight", "bold")
	var eviInterval = 20

	

  drawLevel(evidenceGroup, 40 * evidenceLevel["NCCN guidelines"], 1 - evidenceLevel["NCCN guidelines"], "Guidelines",0)//NCCN/FDA/ELN", 0)
  drawLevel(evidenceGroup, 40 * evidenceLevel["Late trials"], 1 - evidenceLevel["Late trials"], "Late trials", 1)
  //drawLevel(40, evidenceLevel["Early trials"], "Early trials", 2)
  drawLevel(evidenceGroup, 40 * evidenceLevel["Clinical trial"], 1 - evidenceLevel["Clinical trial"], "Clinical trials ", 2)
  drawLevel(evidenceGroup, 40 * evidenceLevel["Case report"], 1 - evidenceLevel["Case report"], "Case report", 3)
  drawLevel(evidenceGroup, 40 * evidenceLevel["Pre-clinical"], 1 - evidenceLevel["Pre-clinical"], "Pre-clinical", 4)

  var gb = evidenceGroup.append("g").attr({
  	"transform": "translate(0, 5)",
  	id: "eviBrush"
  })
  var width = $("#evidenceGroup").width();
  var height = $("#evidenceGroup").height();
  var yScale = d3.scale.ordinal().domain([0, 1, 2, 3, 4, 5]).rangeRoundBands([0, eviInterval * 6]);
  var y = d3.scale.ordinal().rangeRoundBands([0, eviInterval * 5])//domain([0, 1, 2, 3, 4, 5]).rangeRoundBands([0, 90]);;


  //console.log(height);
  var brush = d3.svg.brush()
            .y(y)
            .extent([0, eviInterval * 5])
            .on("brushend", brushed)

  gb.call(brush)//.call(brush.event)

  gb.selectAll("rect").attr("width", width + 5)
  gb.select("rect.extent").style({
  	stroke: "black",
  	"fill-opacity": 0 
  })
  
  function brushed(){
  	var b = brush.extent();

  	if(d3.event.mode == "move") {
  		var interval = b[1] - b[0];
  		d3.select(this).call(brush.extent([yScale.range()[Math.floor(b[0]/eviInterval)], yScale.range()[Math.floor( (b[0] + interval)/eviInterval)]]) );
  		//return;
  	}

  	else d3.select(this).call(brush.extent([yScale.range()[Math.round(b[0]/eviInterval)], yScale.range()[Math.round(b[1]/eviInterval)]]) );
  	b = brush.extent(); //from up to low
  	//console.log(b[0]/eviInterval + " " + b[1]/eviInterval)

  	var upper = [ evidenceLevel["NCCN guidelines"], evidenceLevel["Late trials"], evidenceLevel["Clinical trial"], evidenceLevel["Case report"], evidenceLevel["Pre-clinical"], 0 ]
  	var lower = [ 1, evidenceLevel["NCCN guidelines"], evidenceLevel["Late trials"], evidenceLevel["Clinical trial"], evidenceLevel["Case report"], evidenceLevel["Pre-clinical"] ]
  	
  	var range = [ lower[ b[1]/eviInterval ], upper[ b[0]/eviInterval ] ];

  	if(range[0] != evidenceRange[0] || range[1] != evidenceRange[1]){
  		evidenceRange = range;
  		//console.log(b)
  		//console.log(evidenceRange)
  		updateRectsByEvidenceAndEffect();
  		if(mainVis.sortBy == "numberOfMutations") sortDataRows();
  	}


  }

}

function drawPotencyLevel(){
	var paddingTop = $("#evidenceGroup").height() + 12;
	var responseGroup = d3.select("#controllerSvg").append("g").attr("id", "responseCategory")
						  .attr({
						  	transform: "translate(0, " + (paddingTop) + ")"
						  })
	responseGroup.append("text").text("Potency level from DTC").style("font-weight", "bold")

	drawLevel(responseGroup, 40, 0, "Highly potent", 0, 0)
	drawLevel(responseGroup, 20, 0, "Potent", 1, 0)
	drawLevel(responseGroup, 8, 0, "Weak potent", 2, 0)
	var exc = drawLevel(responseGroup, 2, 0, "Resistant", 3, 0)

	exc.select("line").attr("transform", "translate(2, 0)rotate(10)")

	var  gb = responseGroup.append("g").attr({
	  	"transform": "translate(0, 5)",
	  	id: "resBrush"
	})

	var eviInterval = 20;
	  var width = $("#evidenceGroup").width();
	  // var height = $("#evidenceGroup").height();
	  var yScale = d3.scale.ordinal().domain([0, 1, 2, 3, 4]).rangeRoundBands([0, eviInterval * 5]);
	  var y = d3.scale.ordinal().rangeRoundBands([0, eviInterval * 4])//domain([0, 1, 2, 3, 4, 5]).rangeRoundBands([0, 90]);;


	  //console.log(height);
	  var brush = d3.svg.brush()
	            .y(y)
	            .extent([0, eviInterval * 4])
	            .on("brushend", brushed)

	  gb.call(brush)//.call(brush.event)

	  gb.selectAll("rect").attr("width", width + 5)
	  gb.select("rect.extent").style({
	  	stroke: "black",
	  	"fill-opacity": 0 
	  })

	  function brushed(){
	  	var b = brush.extent();

	  	// if(d3.event.mode == "move") {
	  	// 	var interval = b[1] - b[0];
	  	// 	d3.select(this).call(brush.extent([yScale.range()[Math.floor(b[0]/eviInterval)], yScale.range()[Math.floor( (b[0] + interval)/eviInterval)]]) );
	  	// 	//return;
	  	// }

	  	// else 
	  	d3.select(this).call(brush.extent([yScale.range()[Math.round(b[0]/eviInterval)], yScale.range()[Math.round(b[1]/eviInterval)]]) );
	  	b = brush.extent(); //from up to low
	  	// console.log(b[0]/eviInterval + " " + b[1]/eviInterval)

	  	// var upper = [ evidenceLevel["NCCN guidelines"], evidenceLevel["Late trials"], evidenceLevel["Clinical trial"], evidenceLevel["Case report"], evidenceLevel["Pre-clinical"], 0 ]
	  	// var lower = [ 1, evidenceLevel["NCCN guidelines"], evidenceLevel["Late trials"], evidenceLevel["Clinical trial"], evidenceLevel["Case report"], evidenceLevel["Pre-clinical"] ]
	  	
	  	var range = [ b[0]/eviInterval, b[1]/eviInterval ];

	  	if(range[0] != potencyRange[0] || range[1] != potencyRange[1]){
	  		potencyRange = range;
	  		//console.log(b)
	  		//console.log(evidenceRange)
	  		updatePotencyBar();
	  		if(mainVis.sortBy == "totalStrength") sortDataRows();
  		}
  	}
  
}

function drawSortController(){

  var div = d3.select("#sortControl")

	div.append("div").style('font-weight','bold').text("Sort drugs by");

	var checkBox1 = div.append("div");
        checkBox1.append("input")
            .attr({
                type: "radio",
                id: "sortTotalStrength",
                name: "sort",
                // checked: true
            })
            .on("click", function(){
            	//sort rows by total strength
            	mainVis.sortBy = "totalStrength"
            	sortDataRows()
            });
        var label1 = checkBox1.append("label")
            .attr({
                for: "sortTotalStrength"
            });
            //.text('Ascending');
            // label1.append("img")
            // .attr({
            //     src: "./javascripts/images/ascend.png",
            //     width: 15,
            //     height: 15
            // });
        label1.append('text').text("total potency based on DTC");

		var checkBox2 = div.append("div");
        checkBox2.append("input")
            .attr({
                type: "radio",
                id: "sortNumberofMutations",
                name: "sort",
                checked: true
            })
            .on("click", function(){
            	//sort rows by number of related mutations
            	mainVis.sortBy = "numberOfMutations"
            	sortDataRows();
            });

        var label2 = checkBox2.append("label")
            .attr({
                for: "sortNumberofMutations"
            });
        label2.append('text').text("number of responsive mutations based on CGI");
        
}

function sortDataRows(){
	switch(mainVis.sortBy){
		case "totalStrength": 
			function sortPotency(a, b){ //negative: a in front of b; positive b in front
				//if(potencyRange[0] == 0 && potencyRange[1] == 3){
				// if(a.total == 0 && b.total == 0) return 1;
					if(b.total == 0) return b.total - a.total;
					if(a.total == 0) return b.total;
					return b.total - a.total;
			
			}
			dataRow.sort(function(a, b){
				return sortPotency(a,b)
			})
			d3.selectAll(".oneRow").sort(function(a, b){
				return sortPotency(a, b);
			})
			//console.log(dataRow);
			break;
		case "numberOfMutations": 
			//d3.selectAll(".oneRow").sort(function(a, b){
			sortNumberOfMutations = function(a, b){
				// console.log(a)
				var resA = 0, resB = 0, eviA = 0, eviB = 0, temp;
				for(var i = 0; i < a.mutations.length; i++){
					temp = a.mutations[i];
					if(temp.dataset.indexOf("CGI") > -1 && evidenceLevel[ temp.evidence ] <= evidenceRange[1] && evidenceLevel[temp.evidence] >= evidenceRange[0])
						if(temp.effect == "Responsive"){
							resA++;
							eviA += evidenceLevel[ a.mutations[i].evidence ];
						}
				}
				for(var i = 0; i < b.mutations.length; i++){
					temp = b.mutations[i]
					if(temp.dataset.indexOf("CGI") > -1 && evidenceLevel[ temp.evidence ] <= evidenceRange[1] && evidenceLevel[temp.evidence] >= evidenceRange[0])
						if(temp.effect == "Responsive"){
							resB++;
							eviB += evidenceLevel[ b.mutations[i].evidence ];
						}
				}

				if(resA == resB)
					return eviB - eviA;
				return resB - resA;
			}
			dataRow.sort(function(a,b){
				return sortNumberOfMutations(a,b);
			})

			d3.selectAll(".oneRow").sort(function(a,b){ return sortNumberOfMutations(a,b); })

			//console.log(dataRow)
			break;
		default: //sort by drugs
		//to do: consider filters!!
			d3.selectAll(".oneRow").sort(function(a, b){
				return sortByDrug(a, b)
			})
			dataRow.sort(function(a, b){
				return sortByDrug(a, b)
			})
			function sortByDrug(a,b){
				var aRe = $.grep(a.mutations, function(e){
					return e.mutation == mainVis.sortBy;
				})
				var bRe = $.grep(b.mutations, function(e){
					return e.mutation == mainVis.sortBy;
				})
				//sort by responsiveness, then potency
				//see if the data is showing under the filters
				
				function infoAfterFilter(ob){
					var re = {effect: null, evidence: null, potency: null}
					if(ob.dataset.indexOf("CGI") > -1 && effectControllerState[ob.effect] && evidenceLevel[ob.evidence] >= evidenceRange[0] && evidenceLevel[ob.evidence] <= evidenceRange[1]){
						re.effect = ob.effect; re.evidence = ob.evidence; 
					}
					if(ob.dataset.indexOf("DTC") > -1 && potencyLevel[ob.potencyState] >= potencyRange[0] && potencyLevel[ob.potencyState]<= potencyRange[1]){
						re.potency = ob.potency;
					}
					return re;
				}

				if(aRe.length > 0 && bRe.length > 0){
					aState = infoAfterFilter(aRe[0])
					bState = infoAfterFilter(bRe[0])
					if(aState.effect != null && bState.effect != null){
						if(aRe[0].effect == "Responsive" && bRe[0].effect == "Responsive"){
							return sortByDTC(aRe[0], bRe[0])
						}
						else if(aRe[0].effect == "Responsive"){
							return -1;
						}
						else if(bRe[0].effect == "Responsive") return 1;
						else return 0;
					}
					else if(aState.effect != null){
						return -1;
					}
					else if(bState.effect != null){
						return 1;
					}
					else return sortByDTC(aRe[0], bRe[0])
					function sortByDTC(a, b){
						if(aState.potency != null && bState.potency != null){
							return a.potency - b.potency
						}
						else if(aState.potency != null){
							return -1;
						}
						else if(bState.potency != null){
							return 1;
						}
						else {
							// console.log("nani");
							return 0;
						}
					}
				}
				else if(aRe.length > 0){
					return -1;
				}
				else if(bRe.length > 0){
					return 1;
				}
				else return 0;
		}
	}
	rowTransition();
}

function updateHeight(){
	var divHeight, svgHeight;
    if($("#tumorGroup").css("display") != "none"){
    	divHeight = svgHeight = $("#tumorGroup").height();
    	if(svgHeight > $("#tumorDiv").css("max-height"))
    		divHeight = $("#tumorDiv").css("max-height")
    }
    else divHeight = svgHeight = 0;
    $("#tumorDiv").height(divHeight + 3)
    // console.log($("#tumorGroup").css("display") )
    // console.log(height);
    $("#tumorSvg").height(svgHeight)

	//d3.select("#mutationLabelGroup").attr("transform", "translate(" + mainVis.mutXTranslate + "," + divHeight + ")");
	// d3.select("#headerSvg").attr({
	// 	height: height + mainVis.headerHeight
	// });

	d3.select("#tumorSvg").attr("width", $("#tumorGroup").width());
}

function drawMutationHeader(){
	//var tumorHeader = d3.select("#headerSvg").append("g").attr("id", "tumorHeader");
	

	//tumorHeader.append("text").text()
	d3.select("#tumorSvg").append("g").attr("id", "tumorGroup")//.attr("transform", "translate( 0, 5 ) ")
	$('.collapse').hide();
 	$('#tumorGroup').hide();
	$('.expand, .collapse, .toggleText').bind('click',function(){
		//console.log("click")
	  	$('.collapse').toggle();
	    $('.expand').toggle();
	    $('#tumorGroup').toggle();
	    updateHeight()
	    
		// console.log($("#headerSvg").height())
	  });

	d3.select("#tumorSvg").append("g").attr("id", "tumorColBackground")
	d3.select("#headerSvg").append("g").attr("id", "drugLabel").attr("transform", "translate(0, " + (mainVis.headerHeight) + ")")
	.append("text").text("Drugs").style("font-weight", "bold")

	var mutationLabelGroup = d3.select("#headerSvg").append("g").attr("id", "mutationLabelGroup")
							.attr("transform", "translate(" + mainVis.mutXTranslate + ",0)");

	//updateMutationHeader();

}

function updateTumorTypes(){
	//console.log(curTumors)
	var tumorRow = d3.select("#tumorGroup").selectAll(".tumorRow").data(curTumors);

	var tumorRowEnter = tumorRow.enter().append("g").attr({
		class: "tumorRow",
		transform: function(d, i) { return "translate(0, " + mainVis.rowHeight * i + ")" },
	})
	tumorRow.exit().remove();

	tumorRowEnter.append("rect").attr({
		class: "tumorRowBackground",
		height: mainVis.rowHeight - 2,
		// width: mainVis.columnWidth * currentActiveMutation.length
	}).style({
		fill: d3.rgb(254, 217, 166),
		opacity: 0
	})

	tumorRowEnter.append("text")
		.attr("transform", "translate(0, 15)")
		.on("mouseover", 
		function(d, i) {
			d3.select(this.parentNode).select(".tumorRowBackground").style("opacity", .5);
			mouseoverTumorRow(d, i);
		})
	.on("mouseout", mouseoutCell);
		//.text(function(d){ return d.tumor })
	var tumorLine = d3.selectAll(".tumorRow").selectAll(".tumorLine").data(currentActiveMutation)
	var tumorLineEnter = tumorLine.enter().append("line").attr({
		class: "tumorLine",
		x1: function(d, j) { return mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * j },
		x2: function(d, j) { return mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * (j + 1) - 2 },
		y1: 10,
		y2: 10,
		'stroke-width': 2,
		stroke: 'black'
	})

	tumorLine.exit().remove();
	var tumorCol = d3.select("#tumorColBackground").selectAll(".tumorCol").data(currentActiveMutation)
	var tumorColEnter = tumorCol.enter().append("rect").attr({
		class: "tumorCol",
		width: mainVis.columnWidth - 2
	})
	.style("fill", d3.rgb(254, 217, 166))
	.style("opacity", 0)
	.on("mouseover", 
		mouseoverMutation)
	.on("mouseout", mouseoutCell);
	

	tumorCol.exit().remove();

	d3.selectAll(".tumorRowBackground").attr({
		width: mainVis.columnWidth * currentActiveMutation.length + mainVis.barPaddingLeft + mainVis.headerHeight
	})

	d3.selectAll(".tumorCol").attr({
		height: mainVis.rowHeight * $(".tumorRow").length - 2,
		transform: function(d, i){ return "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight + mainVis.columnWidth * i) + ",0)" }
	})

	//update line and text
	//d3.selectAll(".tumorRow")


	d3.selectAll(".tumorRow").each(function(d, i){
		//console.log(d.tumor)
		d3.select(this).select("text").text(d.tumor);
		d3.select(this).selectAll(".tumorLine").each(function(b, j){
			//console.log(j)
			
			if(d.mutations.indexOf(b.mutation) > -1){
				d3.select(this)
				.attr({
					// x1: mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * j,
					// x2: mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * (j + 1) - 2
				})
				.style("display", "inline")
			}
			else d3.select(this).style("display", "none")
		});
	});
}

function updateMutationHeader(index){
	// console.log("mutation HHHH")
	updateTumorTypes()
	updateHeight()

	var mutationLabel = d3.select("#mutationLabelGroup").selectAll(".mutationLabel").data(currentActiveMutation);

	//var mutationRect = d3.select("#mutationLabelGroup").selectAll(".mutationRect").data(activeMutation);
	//var mutationText = d3.select("#mutationLabelGroup").selectAll(".mutationText").data(activeMutation);

	var mutationLabelEnter = mutationLabel.enter().append("g").attr("class", "mutationLabel")
			.on("mouseover", function(d, i) { 
				var tip = d3.select(".tooltip").style("visibility", "visible")
     					.style("left", (d3.event.pageX) + "px")     
     					.style("top", (d3.event.pageY - 28) + "px")
			tip.select("text").text(d.mutation);
			// tip.selectAll(".sourceText").remove();
  	// 		tip.selectAll(".paper").remove();
  	// 		tip.selectAll("a").remove();
				mouseoverMutation(d, i) } )
			.on("mouseout", function(){
				mouseoutCell();
				d3.select(".tooltip").style("visibility", "hidden")
			});

	d3.selectAll(".mutationLabel").each(function(d, i){
		// console.log(d);
		d3.select(this).select(".mutationRemove")
		d3.select(this).select(".mutationRect")

		//d3.select(this).select(".mutationRect")
		d3.select(this).select(".mutationText")//.data(d)
		//d3.select(this).select(".stackGroup")
	})

	//var textGroup = mutationLabelEnter.append("g").attr("class", "mutationGroup");
	// console.log(currentActiveMutation)
	var mutationRect = mutationLabelEnter.append('rect').attr({
		class: "mutationRect",
		width: mainVis.columnWidth - 2,
		height: mainVis.headerHeight,
		transform: "translate( " + (mainVis.headerHeight - 8) + ", " + ( - mainVis.headerHeight) + ")skewX(-45)",
		y: 12
	})//.append("g").attr("class", "mutationLabel");
	.on("click", function(d){
		mainVis.sortBy = d.mutation;
		sortDataRows();
		$("#sortTotalStrength").prop("checked", false);
		$("#sortNumberofMutations").prop("checked", false);
	}).style("cursor", "s-resize")
	// .on("mouseover", function(d,i){ mouseoverCol(d, i) } )



	var mutationDelete = mutationLabelEnter.append("text").text("\uf00d")//append("svg:image")
							.attr("class", "mutationRemove")
							.attr("transform", "translate(0, 8)")//rotate(45)")
							//.attr("xlink:href","javascripts/remove.png")
							// .attr({
							// 	width: 12,
							// 	height: 12
							// })
							.on("click", function(d){
								//uncheck left list
								//console.log(document.getElementById("input" + d.mutation).checked);
								if(document.getElementById("input" + d.mutation))
									document.getElementById("input" + d.mutation).checked =  false;

								removeMutation(d.mutation)
				                //updateStacks();
				                //updateStackOrderLength();
				                //sortDataRows();

							}).style('cursor', "pointer")
							.style({"font-family": "FontAwesome",
								"font-size": 15})


	// var mutationRectEnter = mutationLabelEnter.append('rect')

	

	// d3.selectAll(".mutationRemove").each(function(d, i){
	// 	d3.select(this)
	// 	//.style("fill", mainVis.itemColor[d.color] )
	// 	//.transition().duration(3000)
	// 	.attr({
	// 		transform: "translate( " + ( mainVis.columnWidth * i + mainVis.headerHeight - 6) + ", 8)"
	// 	})
	// })

	// d3.selectAll(".mutationRect").each(function(d, i){
	// 	d3.select(this)
	// 	.style("fill", "#cccccc")//mainVis.itemColor[d.color] )//.transition().duration(3000)
	// 	.attr({
	// 		transform: "translate( " + (mainVis.columnWidth * i + mainVis.headerHeight) + ", 0) skewX(-45)"
	// 	})
	// })
	var mutationTextEnter = mutationLabelEnter.append('text').attr({
		class: "mutationText",
		transform: "translate( 14, -2 )rotate(-45)"
	}).on("click", function(d){
		mainVis.sortBy = d.mutation;
		sortDataRows();
		$("#sortTotalStrength").prop("checked", false);
		$("#sortNumberofMutations").prop("checked", false);

	}).style("cursor", "s-resize")


	d3.selectAll(".mutationText").text(function(d){ if(d.type == "mutant") return d.mutation; return d.mutation + " wild type" })
	
	d3.selectAll(".mutationRect").style("fill", function(d, i){ if(d.type == "mutant") return "#eee"; return "#bbb"})

	d3.selectAll(".mutationLabel").attr("transform", function(d, i){
		wrap(d3.select(this).select(".mutationText"), mainVis.headerHeight)
		// var self = d3.select(this).attr({
		// 	transform: 
			return "translate( " + (mainVis.columnWidth * ( i + 1/2)) + "," + ( mainVis.headerHeight - 10) + ")"
	 	// })
	 	// console.log(d.mutation)
		// self.select(".mutationText").text(d.mutation).on("mouseover", function(){

		// 	var tip = d3.select(".tooltip").style("visibility", "visible")
  //    					.style("left", (d3.event.pageX) + "px")     
  //    					.style("top", (d3.event.pageY - 28) + "px")
		// 	tip.select("text").text(d.mutation);
		// 	tip.selectAll(".sourceText").remove();
  // 			tip.selectAll(".paper").remove();

		// 	// tip.attr({
		// 	// 	height: function(){ return $(".tooltip text").height(); },
		// 	// 	width: function(){ return $(".tooltip text").width(); },
		// 	// })
		// })
		// .on("mouseout", function(){
		// 	d3.select(".tooltip")
		// 	.transition()        
  //           .duration(200)      
  //           .style("visibility", "hidden");
		// })
	})

	mutationLabel.exit().remove();
}

function removeMutation(mutation){
	//console.log(document.getElementById("input" + d.mutation).checked);
	var muList = [mutation];
	var contains = false;
	var gene = mutation.split("(")

	var results = $.grep(activeMutation, function(e){
		return mutation == e.mutation;
	})
	// colorQueue.push(results[0].color);
	activeMutation.splice(activeMutation.indexOf(results[0]), 1)
	if(currentActiveMutation.indexOf(results[0]) > -1){
		contains = true;
		currentActiveMutation.splice(currentActiveMutation.indexOf(results[0]), 1)
		activeMutationRange[1]--;
	}

	//remove wild type from active mutation
	results = $.grep(activeMutation, function(e){
		return gene[0] == e.mutation;
	})
	var r = $.grep(activeMutation, function(e){
		var g = e.mutation.split("(")
		return gene[0].trim() == g[0].trim() && gene[0].trim() != e.mutation.trim();
	})
	if(r.length == 0){
		if(results.length > 0){
			activeMutation.splice(activeMutation.indexOf(results[0]), 1);
			muList.push(gene[0]);
			if(!contains && currentActiveMutation.indexOf(results[0]) > -1) console.log("possible error!")
			//if(currentActiveMutation.indexOf(results[0]) > -1) 	currentActiveMutation.splice(currentActiveMutation.indexOf(results[0]), 1)
		}
	}
	r = $.grep(currentActiveMutation, function(e){
		var g = e.mutation.split("(")
		return gene[0].trim() == g[0].trim() && gene[0].trim() != e.mutation.trim();
	})
	if(r.length == 0){
		if(results.length > 0 && currentActiveMutation.indexOf(results[0]) > -1){
			currentActiveMutation.splice(currentActiveMutation.indexOf(results[0]), 1)
			activeMutationRange[1]--;
		}
	}

	var cgiRe = $.grep(curTumors, function(e){
		return e.mutations.indexOf(mutation) > -1;
	})

	for(var i = curTumors.length - 1; i > -1; i--){
		var temp = curTumors[i].mutations;
		if(temp.indexOf(mutation) > -1){
			temp.splice(temp.indexOf(mutation), 1)
			if(temp.length == 0) curTumors.splice(i, 1)
		}
	}
	
	if(contains){
		var k;
		for(k = activeMutationRange[1] + 1; k < activeMutation.length; k++){
			if(activeMutation[k].type != "mutant") continue;
			if(currentActiveMutation.length >= mainVis.mutationPerPage) break;
			pushMutationtoCurrent(activeMutation[k])
			// currentActiveMutation.push(activeMutation[k]);
			// var ge = activeMutation[k].split("(")
			// var t1 = $.grep(activeMutation, function(e){
			// 	return e.mutation == ge[0];
			// })
			// var t2 = $.grep(currentActiveMutation, function(e){
			// 	return e.mutation == ge[0];
			// })
			// if(t1.length > 0 && t2.length == 0) currentActiveMutation.push(t1[0])
			//activeMutationRange[1]++;
		}
		activeMutationRange[1] = k- 1;
	}

	var nextpage = true;
	for(var k = activeMutationRange[1] + 1; k < activeMutation.length; k++){
		if(activeMutation[k].type == "mutant"){
			nextpage = false;
			break;
		}
	}

	console.log(activeMutationRange[0] + " " + activeMutationRange[1] + " " + activeMutation.length)


	updatePageButtonStates(null, null, nextpage, nextpage);


	//currentActiveMutation = activeMutation.slice( (mainVis.currentPage - 1) * mainVis.mutationPerPage, mainVis.currentPage * mainVis.mutationPerPage)

	//console.log(activeMutation)
	//console.log(mutation)
    for(var j = dataRow.length - 1; j > -1; j--){
            var mu = dataRow[j].mutations;
            var re = $.grep(mu, function(e){
            	for(var k = 0; k < muList.length; k++){
            		if(e.mutation == muList[k])
            			return true;
            	}
            	return false;
                //return e.mutation == mutation;
            })
            for(var k = 0; k < re.length; k++){
                //console.log(d);
                mu.splice(mu.indexOf(re[0]), 1);
                if(mu.length == 0) dataRow.splice(j, 1);
                else if(re[0].dataset.indexOf("DTC") > -1 && re[0].potencyState != "resistant")
                	dataRow[j].total -= 1 / re[0].potency;
                //console.log(dataRow[j])
                
            }
        }

    //console.log(dataRow)
    //update main vis
    updateMatrix();
}