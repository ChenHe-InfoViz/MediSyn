var mainVis = {
	itemColor: [],
	rowHeight: 20,
	rowPaddingTop: 2,
	//barWidthTimes: 100,
	xDetailScale: d3.scale.linear(),
	barPaddingLeft: 100,
	columnWidth: 40,
	circleRadius: 12, 
	stackGroupWidth: 0,//400,
	headerHeight: 80,
	sortBy: "numberOfMutations", //"numberOfMutations", certain mutation
	//mutXTranslate: (barPaddingLeft + stackGroupWidth),
	// maxActiveMutation: 10,
	currentPage: 1,
	totalPage: 1,
	// mutationPerPage: 10,
	showValue: true
}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function drawRows(){

	mainVis.mutXTranslate = mainVis.barPaddingLeft + mainVis.stackGroupWidth;
	//console.log(mainVis.mutXTranslate)
	//var c = d3.scale.category20();//d3.scaleOrdinal(d3.schemeCategory10)
	// for(var i = 0; i < mainVis.maxActiveMutation; i++){
	// 	mainVis.itemColor.push("#000000")//d3.lab(colores_google(i)).brighter(1) );
	// }

	d3.select("#bodySvg").append("g").attr("id", "colBackgroundGroup");

	d3.select("#bodySvg").append("g")
	  .attr({
			id: "rows"
			});

	//mainVis.textureObject = textureGenerator(); 
	
}

function updateColBackground(){
	var colBackground = d3.select("#colBackgroundGroup").selectAll(".colBackground").data(currentActiveMutation);
	var colBackEnter = colBackground.enter().append('rect').attr({
		class: 'colBackground',
		width: mainVis.columnWidth - 2
	})
	.style("fill", d3.rgb(254, 217, 166))
	.style("opacity", 0)

	colBackground.exit().remove();

	var rowCount = $(".oneRow").length;
	d3.select("#colBackgroundGroup").selectAll(".colBackground").attr({
		height: (mainVis.rowHeight + 2) * rowCount, 
		transform: function(d, i){ return "translate(" + (mainVis.barPaddingLeft + mainVis.columnWidth * i) + ",0)"}
	});
}

function drawTable(){
	//console.log(d3.select(this.parentNode.parentNode).datum());
	var m = d3.select(this).datum().mutation;
	var dr = d3.select(this.parentNode.parentNode).datum().drug;
	//var parts = m.split(":");
	//var mu = parts[0].trim() + "(" + parts[1] + ")";
	var detailData = $.grep(bioactivity, function(d){
		return d["Compound Name"] == dr && d["Mutation Information"] == m;
	})
	//console.log(detailData);
	var mutations = d3.select(this.parentNode.parentNode).datum().mutations;
	for(var i = 0; i < mutations.length; i++){
		if( mutations[i].mutation == m && mutations[i].effect == "Responsive")
	//if(.)
			updateDetailTable(detailData);
	}
}

function rowTransition(){

	d3.selectAll(".oneRow").each(function(d, i){
		// console.log(d.total); //console.log(i);
		//		console.log("translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")");
		d3.select(this).transition().duration(1000)
		.attr({
			transform: //function() {
				//return 
			 	"translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")"
			//}
			//y: (mainVis.rowHeight + mainVis.rowPaddingTop) * i
		});
	})

	var oneRow = d3.select("#rows").selectAll(".oneRow").data(dataRow)
	//console.log(dataRow);
	var rowGroup = oneRow.enter().append("g").attr({
			class: "oneRow",
		  })

	oneRow.exit().remove();
}

function updateDataRow(){
	// console.log("datarow±±")
	var oneRow = d3.select("#rows").selectAll(".oneRow").data(dataRow)
	// console.log(dataRow);
	var rowGroup = oneRow.enter().append("g").attr({
			class: "oneRow",
			// width: mainVis.columnWidth * currentActiveMutation.length,
			//height: mainVis.rowHeight,
			//y: function(d, i) {
				//return (mainVis.rowHeight + mainVis.rowPaddingTop) * i
			transform: function(d, i) {
				return "translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")"
			}
		  })

	oneRow.exit().remove();

	rowGroup.append("rect").attr({
		class: "mutationGroupBackground",
		height: mainVis.rowHeight
	})
	.style({
		fill: d3.rgb(254, 217, 166),
		opacity: 0
	})
	// .on("mouseover", )

	var drugLabel = rowGroup.append('text')
		  .attr("class", "drugLabel")
		  .attr("width", mainVis.barPaddingLeft)
		  .attr("transform", "translate( 0, " + (mainVis.rowHeight / 2 + 5) + ")")
		  .on("mouseover", function(d, i){ 
		  	mouseoverRow(this, d, i) 
		  	var tip = d3.select(".tooltip").style("visibility", "visible")
     					.style("left", (d3.event.pageX) + "px")     
     					.style("top", (d3.event.pageY - 28) + "px")
			tip.select("text").text(d.drug);
			// tip.selectAll(".sourceText").remove();
  	// 		tip.selectAll(".paper").remove();
  	// 		tip.selectAll("a").remove();
		  }).on("mouseout", function(){
		  	mouseoutCell();
		  	d3.select(".tooltip").style("visibility", "hidden")
		  })

	var mutGroup = rowGroup.append('g').attr("class", "mutationGroup")
				.attr("transform", "translate (" + mainVis.mutXTranslate + ", 0)")

	var stackGroup = rowGroup.append("g").attr({
		class: "stackGroup",
		transform: "translate (" + mainVis.mutXTranslate + ", 0)"
	})

	//important!! update data bound to each "g" when data row updated!!
	d3.selectAll(".oneRow").each(function(d, i){
		//console.log(d.drug);
		d3.select(this).select(".drugLabel").text(d.drug)
		wrap(d3.select(this).select(".drugLabel"), mainVis.barPaddingLeft, 1)
		d3.select(this).select(".mutationGroup")//.data(d)
		d3.select(this).select(".stackGroup")
		// d3.select(this).select(".stackGroup").selectAll(".barGroup");
		;
	})

	d3.selectAll(".mutationGroup").each(function(a, j){
		//console.log(a.mutations);
		var muCircle = d3.select(this).selectAll(".mutationPath").data(currentActiveMutation)
		var circleEnter = muCircle.enter().append("rect")
					  .attr({
					  	class: "mutationPath",
					  	width: mainVis.columnWidth,
					  	height: mainVis.rowHeight
					  })
					  .on("mouseover", function(d, i){ mouseoverCell(this, d, i); })//relationMouseover(this, d); } )
					  .on("mouseout", mouseoutCell)
					  .on("click", cgiClick)
					  //.style("fill", function(d, i) { return mainVis.itemColor[activeMutation[i].color] })
		muCircle.exit().remove();
	})

	var stack = d3.selectAll(".stackGroup").each(function(d, i){
		var barGroup = d3.select(this).selectAll(".barGroup").data(currentActiveMutation)
		var stackEnter = barGroup.enter().append("g").attr({
				class: "barGroup"
			}).on("mouseover", function(a, j) { mouseoverCell(this, a, j); barMouseOver(this, a) })
			.on("mouseout", function(){
				mouseoutCell();
				d3.select(".tooltip").style("visibility", "hidden")

			})
			.on("click", barClick)

			stackEnter.append('rect').attr({
				height: mainVis.rowHeight - 10 ,	
				// transform: "translate(" + (mainVis.columnWidth * i) + ", 5)"
			})//.style("visibility", "hidden")

			barGroup.exit().remove();

	})

	updateStacks();

	updateMutationRects();

	updateHeightWidth();
	
}


function updateHeightWidth(){
	d3.select("#bodySvg").attr("height", $("#rows").height())
	d3.selectAll(".oneRow").attr("width", mainVis.barPaddingLeft + currentActiveMutation.length * mainVis.columnWidth);
	d3.selectAll(".oneRow").selectAll(".mutationGroupBackground").attr("width", mainVis.barPaddingLeft + currentActiveMutation.length * mainVis.columnWidth)
	// d3.select("#bodySvg").attr("width", $("#rows").width())

	// if(($("#main").height() - $("#rows").height() - $("#header").height() - $("#pageButton").height()) > 300)
	// 	d3.select("#body").style("height", $("#rows").height())
	// else {
	// 	d3.select("#body").style("height", ($("#main").height() - 300 - $("#header").height() - $("#pageButton").height() ) ).style("overflow-x", "auto")
	// }
		// console.log($("#main").height() - $("#rows").height() - $("#header").height())

	// $("#detail").height($("#main").height() - $("#body").height() - $("#header").height() - $("#pageButton").height() )
 //    var height = $("#detail").height() - 25;
 //    $("#previewFrame").height(height);

}

function updateMutationRects(){
	if(dataset.CGI == false) {
		d3.selectAll(".mutationGroup").style("display", "none");
		return;
	}
	d3.selectAll(".mutationGroup").style("display", "inline");

	d3.selectAll(".mutationGroup").each(function(a, j){

		d3.select(this).selectAll(".mutationPath").each(function(d, i){
			//console.log( d );

			var re = $.grep(a.mutations, function(e){
				return e.mutation == d.mutation;
			})

			if(re.length > 0 && re[0].dataset.indexOf("CGI") > -1){
				if(re.length > 1) console.log("multiple entries!!!...")
				//console.log(evidenceLevel[ re[0].evidence ] )

				// if( !re[0].hasOwnProperty("effect") || evidenceLevel[ re[0].evidence ] > evidenceRange[1] || evidenceLevel[ re[0].evidence ] < evidenceRange[0]) {
				// 	d3.select(this).style("visibility", "hidden");
				// 	//console.log(re[0].evidence)
				// 	return;
				// }

				// d3.select(this).attr("transform", "translate(" + mainVis.columnWidth * i + ", 0)")
				var eviLevel = evidenceLevel[re[0].evidence];
				 
				// console.log(eviLevel)
				switch(re[0].effect){
					case "Responsive":  
						// var t = mainVis.tList[0].background(function(){ return d3.hsv(0, 1, 1 - eviLevel);})
						// d3.select("#bodySvg").call(t);
					    d3.select(this)//.style("visibility", "visible" )
							//.style("fill", mainVis.textureObject.responsive[re[0].evidence].url())//function(){ return d3.hsv(120, eviLevel, 1); })
							.style("fill", function(){ return d3.hsv(120, evidenceLevel[re[0].evidence], 1 ); })
							.attr("transform", "translate(" + ( mainVis.columnWidth * i ) + ", 0)")
							.attr("width", mainVis.columnWidth * evidenceLevel[re[0].evidence]);
						break;
					case "Resistant": 
						d3.select(this)//.attr("transform", "translate( " + (mainVis.columnWidth * i) + ", 0)")
							.style("fill", function(){ return d3.hsv(0, evidenceLevel[re[0].evidence], 1); })//function(){ return d3.hsv(0, evidenceLevel[re[0].evidence], 1); })
							.attr("transform", "translate(" + ( mainVis.columnWidth * i ) + ", 0)")
							.attr("width", mainVis.columnWidth * evidenceLevel[re[0].evidence]);;
						break;
					case "No Responsive": 
						d3.select(this)//.attr("transform", "translate( " + (mainVis.columnWidth * i) + ", 0)")
							.style("fill", function(){ return d3.hsv(240, evidenceLevel[re[0].evidence], 1); })//function(){ return d3.hsv(240, evidenceLevel[re[0].evidence], 1); })
							.attr("transform", "translate(" + ( mainVis.columnWidth * i ) + ", 0)")
							.attr("width", mainVis.columnWidth * evidenceLevel[re[0].evidence]);
						break;
					case "Increased Toxicity": 
						d3.select(this)//.attr("transform", "translate( " + (mainVis.columnWidth * i) + ", 0)")
							.style("fill", function(){ return d3.hsv(300, evidenceLevel[re[0].evidence], 1); })//function(){ return d3.hsv(300, evidenceLevel[re[0].evidence], 1); })
							.attr("transform", "translate(" + ( mainVis.columnWidth * i ) + ", 0)")
							.attr("width", mainVis.columnWidth * evidenceLevel[re[0].evidence]);;
						break; 
					default: console.log("what!!!" + re[0].effect)
				}
			}
			else {
				d3.select(this).style("visibility", "hidden");
			}
		})

	})
	updateRectsByEvidenceAndEffect();
}

function updateRectsByEvidenceAndEffect(){
	d3.selectAll(".mutationGroup").each(function(a, j){

		d3.select(this).selectAll(".mutationPath").each(function(d, i){
			//console.log( d );

			var re = $.grep(a.mutations, function(e){
				return e.mutation == d.mutation;
			})

			if(re.length > 0 && re[0].dataset.indexOf("CGI") > -1){
				if(re.length > 1) console.log("multiple entries!!!...")
				if( effectControllerState[ re[0].effect ] && (evidenceLevel[ re[0].evidence ] >= evidenceRange[0] && evidenceLevel[ re[0].evidence ] <= evidenceRange[1]) )
				{
					d3.select(this).style("visibility", "visible");
				}
				else d3.select(this).style("visibility", "hidden");
			}
		})
	})
}

function updateStacks(){
	if(dataset.DTC == false) {
		d3.selectAll(".stackGroup").style("display", "none");
		return;
	}

	d3.selectAll(".stackGroup").style("display", "inline");

	d3.selectAll(".stackGroup").each(function(a, j){
		d3.select(this).selectAll(".barGroup").each(function(d, i){
			//console.log(i)
		//console.log(d)
		var results = $.grep(a.mutations, function(e){
			return d.mutation == e.mutation;
		})
		// var colorIndex = results[0].color;
		if(results.length > 0 && results[0].dataset.indexOf("DTC") > -1){
			//console.log(results[0].mutation + " " + results[0].potencyState);
			if(results.length > 1) console.log("multi...")

			var widthValue = 0, textValue;

			switch(results[0].potencyState){
				case "highly potent": widthValue = mainVis.columnWidth * .96; break;
				case "potent": widthValue = Math.floor( mainVis.columnWidth / 2 ); break;
				case "weak potent": widthValue = Math.floor( mainVis.columnWidth / 5 ); break;
				case "resistant": widthValue = 2; 
								//console.log(results[0].mutation + " " + a.drug + " " + results[0].potency); 
								  break;
			}

			d3.select(this).select("rect")
							.attr({
								width: widthValue,
								transform: function() { if(results[0].potencyState == "resistant"){ return "translate(" + (mainVis.columnWidth * i + 3) + ', 5 ) rotate(20)' } return "translate(" + (mainVis.columnWidth * i) + ', 5 )'}
							})
							.property("value", results[0].potencyState)
							.style("fill", "black")

			d3.select(this).select("rect").attr({

			});
							// .style("visibility", "visible");
				
		}
		else d3.select(this).select("rect").style("visibility", "hidden")

		})
	});

	updatePotencyBar();
}

function updatePotencyBar(){
	d3.selectAll(".stackGroup").each(function(a, j){
		a.total = 0;
		d3.select(this).selectAll(".barGroup").each(function(d, i){
			var results = $.grep(a.mutations, function(e){
				return d.mutation == e.mutation;
			})
			if(results.length > 0 && results[0].dataset.indexOf("DTC") > -1){
				var potency = d3.select(this).select("rect").node().value;
				//recalculate total potency;

				// console.log(potencyLevel[ potency ]);
				if(potencyLevel[ potency ] >= potencyRange[0] && potencyLevel[ potency ] <= potencyRange[1]){
					a.total += 1 / results[0].potency;
					d3.select(this).select("rect").style("visibility", "visible");
				}
				else {
					d3.select(this).select("rect").style("visibility", "hidden");
				}
			}

		})
	})
}

var opacityTooltip = 0;

function barMouseOver(self, d){
  var mu = d.mutation;
  var row = d3.select(self.parentNode).datum();
  var r = $.grep(row.mutations, function(e){
  	return e.mutation == mu;
  });

  var div = d3.select(".tooltip")
  div.style("visibility", "visible")
  // .transition()        
  //    .duration(200)      
  //    .style("opacity", .9)
     .style("left", (d3.event.pageX + 2) + "px")     
     .style("top", (d3.event.pageY - 28) + "px")
  //div.selectAll("a").remove();
  //div.selectAll(".sourceText").remove();
  //div.selectAll(".paper").remove();

  //$("#right text").html("DTC: <b>" + r[0].potencyState + " between " + row.drug + " and " + d.mutation + "</b>" );
  var bioText = "";
  //console.log(r[0])
  for(var i = 0; i < r[0].bioactivities.length; i++)
  { 
  	if(i > 0)     bioText += "<br/>";
	bioText += r[0].bioactivities[i]["End Point Standard Type"]; 
    bioText += r[0].bioactivities[i]["End Point Standard Relation"];
    bioText += r[0].bioactivities[i]["End Point Standard Value"];
    bioText += r[0].bioactivities[i]["End Point Standard Units"];
  }
  div.select("text").attr({class: "sourceText"}).html(bioText)
}

function barClick(d){
  //opacityTooltip = 1;
  var mu = d.mutation;
  var row = d3.select(this.parentNode).datum();
  var r = $.grep(row.mutations, function(e){
  	return e.mutation == mu;
  });

  var div = d3.select("#right")

  div.selectAll("a").remove();
    div.selectAll(".sourceText").remove();
  div.selectAll(".paper").remove();

  $("#right text").html("DTC: <b>" + r[0].potencyState + " between " + row.drug + " and " + d.mutation + "</b>" );
  var pubIdList = []
  //console.log(r[0])
  for(var i = 0; i < r[0].bioactivities.length; i++)
  { 
	pubIdList.push(r[0].bioactivities[i]["PubMed ID"])
  }
  retrieveAbstract(pubIdList, editTooltip)
}

function cgiClick(d){
  //opacityTooltip = 1;
  var mu = d.mutation;
  var row = d3.select(this.parentNode).datum();
  var r = $.grep(row.mutations, function(e){
  	return e.mutation == mu;
  });

  var div = d3.select("#right")
  // div.style("visibility", "visible")
  // // .transition()        
  // //    .duration(200)      
  // //    .style("opacity", .9)
  //    .style("left", (d3.event.pageX) + "px")     
  //    .style("top", (d3.event.pageY - 28) + "px")
  //div.append("text").text("Source:\n")
  //for(var i = 0; i < d.dtcsource.length; i++)
  div.selectAll(".sourceText").remove();
  div.selectAll(".paper").remove();
  div.selectAll("a").remove();
  $("#right text").html("CGI: <b>" + r[0].effect + " between " + row.drug + " and " + d.mutation + "</b> based on <b>" + r[0].evidence + "</b>" );
  var pubmedIdList = []

  //console.log(r[0].source)
  var parts = r[0].source.split(/[:;]+/)
  for(var i = 0; i < parts.length; i++){
	  if(parts[i] == "PMID"){
	  		pubmedIdList.push(parts[i+1])
	  		// 

	     	 // if( $("#previewFrame").attr("src") != ("https://www.ncbi.nlm.nih.gov/pubmed/?term=" + parts[i+1]) )
	     	 // 	$("#previewFrame").attr("src", "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + parts[i+1]);
	     	 i++;
	   }
	   else{
	   	 div.append("text")
	   	 .attr("class", "sourceText").text(parts[i]).append("br")
	   	 // $("#previewFrame").attr("src", "");
	   }
	}
	// console.log(pubmedIdList)
	retrieveAbstract(pubmedIdList, editTooltip)
     
}

function editTooltip(list){
//"http://dx.doi.org/" + doi
	var tooltip = d3.select("#right");
	tooltip.selectAll(".paper").remove();

	for(var i = 0; i < list.length; i++){
		var div = tooltip.append("div").attr("class", "paper")
		div.append("text").style("font-weight", "bold").text("Title").append("br")
		div.append("text").text(list[i].title).append("br")
		div.append("text").style("font-weight", "bold").text("Abstract").append("br")
		div.append("text").text(list[i].abstract).append("br")
		if(list[i].doi != null){
			div.append('text').text("DOI: ");
			div.append("a")
	     	 .style({
	            'cursor':'pointer',
	            'text-decoration': 'underline'
	        }).on("click", function(){
	        	//$("#iframeFader").show();

	        	window.open("https://doi.org/" + this.text, '_blank');
	            //$("#previewFrame").attr("src", "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.text);
	        })
	     	 .text(list[i].doi)
	     	 .append("br")
		}
		div.append("br")
	}

}

function retrieveAbstract(idList, callback){
	idList = uniqArray(idList)
	var abstract = []; //{title: abstract:doi}
	var pre = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id="
	$.ajax({
		type: "GET",
        url: pre + idList.join(","),
        dataType: "xml",
		success: function (XMLArray) {
		//if
        // var xml = $.parseXML(XMLArray);
        // 		console.log(xml)
        // 		console.log(pre + idList.join(","))

        $(XMLArray).find("PubmedArticleSet").find("PubmedArticle").each(function () {
        	var ar = $(this).find("MedlineCitation").find("Article")
        	var title = $(this).find("ArticleTitle").text()
        	        	// console.log(title)

        	var ab = $(this).find("Abstract").find("AbstractText").text()

        	var doi = $(this).find("ELocationID").text()
            abstract.push({title: title, abstract: ab, doi: doi})
        });
        //
        callback(abstract);
    	},
    	error: function(){

    	}
    });
}

// function relationMouseout(){
// 	opacityTooltip = 0;
//   //var self = this;
//   setTimeout(function () {
//       if (opacityTooltip == 0) {
//         // d3.select(self).style({  
//         //   'stroke': '#ddd'
//         // });
//           d3.select(".tooltip").style("visibility", "hidden")
//           // .transition()        
//           //   .duration(200)      
//           //   .style("opacity", 0); 
//       }
//   }, 3000);
// }

// function rectMouseout(){
// 	opacityTooltip = 0;
//   //var self = this;
//   setTimeout(function () {
//       if (opacityTooltip == 0) {
//         // d3.select(self).style({  
//         //   'stroke': '#ddd'
//         // });
//           d3.select(".tooltip").style("visibility", "hidden")
//           // .transition()        
//           //   .duration(200)      
//           //   .style("opacity", 0); 
//       }
//   }, 3000);
// }
