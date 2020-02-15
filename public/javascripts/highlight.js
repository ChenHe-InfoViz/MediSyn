function mouseoverCol( d, i ){
	//mouseoutCell()
	// console.log(i)
	var cols = d3.selectAll(".tumorCol");
	d3.select(cols[0][i]).style("opacity", .5)

	cols = d3.selectAll(".mutationRect");
	d3.select(cols[0][i]).style("fill", d3.rgb(254, 217, 166))

	cols = d3.selectAll(".colBackground")
	d3.select(cols[0][i]).style("opacity", .5)

}

function mouseoutCol(){
	d3.selectAll(".tumorCol").style("opacity", 0);
	//d3.select(cols[0][i]).style("opacity", .5)

	d3.selectAll(".mutationRect").style("fill", function(d, i) { if(d.type == "mutant") return "#eee"; return "#bbb"});
	//d3.select(cols[0][i]).style("fill", d3.rgb(254, 217, 166))

	d3.selectAll(".colBackground").style("opacity", 0)
	//d3.select(cols[0][i]).style("opacity", .5)
}

function mouseoverRow(self, d, i){
	//console.log(d) d is one datarow
	mouseoutCell()
	var mutationList = []
	//var rows = d3.selectAll(".mutationGroupBackground")
	var par = d3.select(self.parentNode)
	par.select(".mutationGroupBackground").style("opacity", .5)

	var mu = par.select(".mutationGroup")
	//$(self.parentNode)
	// console.log((mu).style("display"))
	if(mu.style("display") != "none")
		mu.selectAll(".mutationPath").each(function(a, j){
			if($(this).css("visibility") == "visible")
			{ mouseoverCol(a, j);
				mutationList.push(a.mutation)
			}
		});

	var stack = par.select(".stackGroup")
	if(stack.style("display") != "none")
		stack.selectAll(".barGroup rect").each(function(a, j){
			if($(this).css("visibility") == "visible")
			{ mouseoverCol(a, j) 
				mutationList.push(a.mutation)
			}
		});

	var tumorHighlight = false;
	//var mutations = d.mutations;
	//console.log(mutations)
	d3.selectAll(".tumorRow").each(function(a, j){
		tumorHighlight = false
		//console.log(a.mutations)
		for(var k = 0; k < mutationList.length; k++){
			//console.log(mutations[k].mutation)
			if(a.mutations.indexOf(mutationList[k]) > -1){
				tumorHighlight = true;
				break;
			}
		}
		if(tumorHighlight){
			d3.select(this).select(".tumorRowBackground").style("opacity", .5);

		}
	})

}

function mouseoverTumorRow(d, i){
	// console.log(d);
	var re;
	for(var i = 0; i < d.mutations.length; i++){
		re = $.grep(currentActiveMutation, function(e){
			return e.mutation == d.mutations[i]
		})
		mouseoverCol(null, currentActiveMutation.indexOf(re[0]))
	}
	

}

function mouseoutRow(){
	d3.selectAll(".mutationGroupBackground").style("opacity", 0);
	d3.selectAll(".tumorRowBackground").style("opacity", 0)
	//mouseoutCol()
}

function mouseoverCell(self, d, i){
	mouseoutCell()
	//var row = d3.select(self.parentNode.parentNode);
	// console.log(d.mutation)
	var gene = containGene(currentActiveMutation, d.mutation)

	// d3.selectAll(".oneRow").each(function(a, j){
	// 	var re = $.grep(a.mutations, function(e){
	// 		return e.mutation == d.mutation || (gene != null && e.mutation == gene.mutation)
	// 	})
	// 	for(var k = 0; k < re.length; k++){
	// 		if(dataset.CGI && re[k].dataset.indexOf("CGI") > -1 && effectControllerState[ re[k].effect ] && (evidenceLevel[ re[k].evidence ] >= evidenceRange[0] && evidenceLevel[ re[k].evidence ] <= evidenceRange[1]) )
	// 			d3.select(this).select(".mutationGroupBackground").style("opacity", .5);
	// 		else if(dataset.DTC && re[k].dataset.indexOf("DTC") > -1 && potencyLevel[ re[k].potencyState ] >= potencyRange[0] && potencyLevel[ re[k].potencyState ] <= potencyRange[1])
	// 			d3.select(this).select(".mutationGroupBackground").style("opacity", .5);
	// 	}
	// })
	var row = d3.select(self.parentNode.parentNode);

	row.select(".mutationGroupBackground").style({
		fill: d3.rgb(254, 217, 166),
		opacity: .5
	});

	d3.selectAll(".tumorRow").each(function(a, j){
		if(a.mutations.indexOf(d.mutation) > -1){
			d3.select(this).select(".tumorRowBackground").style("opacity", .5);
			//console.log(re[0]);
		}

	})

	mouseoverCol(d, i);
	if(gene != null){
		mouseoverCol(null, currentActiveMutation.indexOf(gene))
	}
}

function mouseoverMutation(d, i){
	mouseoverCol(d, i)
	d3.selectAll(".tumorRow").each(function(a, j){
		if(a.mutations.indexOf(d.mutation) > -1){
			d3.select(this).select(".tumorRowBackground").style("opacity", .5);
		}
	})
}

function mouseoutCell(){
	mouseoutCol();
	mouseoutRow();
}