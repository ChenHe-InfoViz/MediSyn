//arrange data to rows

//var q = d3.queue();
//var drugResponsive = []; //information from cancer genome interpretor
var drugList = [];
//q.defer(function(){
	// d3.csv("javascripts/datasets/mutation.csv", function(error, data){
	// 	if(error) throw error;

	// 	for(var i = 0; i < data.length; i++){
	// 		mutation.push(data[i].mutation);
	// 	}
	// 	activeMutation = mutation.slice();
	// 	console.log(mutation);
	// })
//})
String.prototype.capitalizeFirstLetter = function() {
	//if(this == null) return null;
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function addMutationToDatarow(mutation, row){
	// if(mutation.dataset.indexOf("CGI") > -1 && mutation.dataset.indexOf("DTC") > -1 ){
	// 	row.mutations.push({mutation: mutation.mutation, effect: mutation.effect, source: mutation.source, evidence: mutation.evidence, potency: mutation.med, dtcsource: mutation.dtcsource, dataset: mutation.dataset});
	// 	row.total += 1 / mutation.med;
	// 	row.dataset.DTC = true;
	// 	if(mutation.effect == "Responsive") row.dataset.CGI = true;
	// 	if(statistics.maxTotal < row.total)
	// 		statistics.maxTotal = row.total
	// }
	//else 
	var re = $.grep(row.mutations, function(e){
		return e.mutation == mutation.mutation;
	})
	if( mutation.dataset.indexOf("CGI") > -1 ){
		if(re.length > 0) {
			if(re[0].hasOwnProperty("effect")){ 
				console.log("multiple CGI?????")
				console.log(row)
			}
			re[0].effect = mutation.effect;
			re[0].source = mutation.source;
			re[0].evidence = mutation.evidence;
			re[0].dataset.push("CGI");
			re[0].tumors = mutation.tumors;
		}
		else
		    row.mutations.push({mutation: mutation.mutation, effect: mutation.effect, source: mutation.source, evidence: mutation.evidence, dataset: mutation.dataset.slice(0, mutation.dataset.length), tumors: mutation.tumors });
		if(mutation.effect == "Responsive") row.dataset.CGI = true;

		
		//results[0].total += d.med;
	}
	else if( mutation.dataset.indexOf("DTC") > -1){
		if(re.length > 0) {
			if(re[0].hasOwnProperty("potency")){ 
				console.log(re[0])
				console.log("multiple DTC?????")
			}
			re[0].potency = mutation.med;
			//re[0].dtcsource = mutation.dtcsource;
			re[0].potencyState = mutation.potencyState;
			re[0].dataset.push("DTC");
			re[0].bioactivities = mutation.bioactivities;
		}
		else row.mutations.push({ mutation: mutation.Mutation, potency: mutation.med, potencyState: mutation.potencyState, bioactivities: mutation.bioactivities, dataset: mutation.dataset.slice(0, mutation.dataset.length) })
		if(mutation.potencyState != "resistant")
			row.total += 1 / mutation.med;
		row.dataset.DTC = true;

		if(statistics.maxTotal < row.total)
			statistics.maxTotal = row.total
	}
}

parseCGI();
//getDTCMutationList()
function getDTCMutationList(){
	$.get("javascripts/datasets/mutationDTC.txt", function(content){
		var mus = content.split("\n");
		var reg = new RegExp(/del/);
		// console.log(mutations);
		for(var i = 0; i < mus.length; i++){
			if(reg.test(mus[i])) continue; //ignore del mutation
			var firstpart = mus[i].split("-"); // only take first part for mutations like "ABL1(F317I)-nonphosphorylated"
			var muParts = firstpart[0].split(/[(,)]+/).filter(Boolean);
			var mutationTemp = []

			for(var j = 1; j < muParts.length; j++){
				mutationTemp.push( muParts[0].trim() + "(" + muParts[j].trim() + ")" );
			}

			//if(mutationTemp.length == 0) return; //ignore biomarkers like FLT1 overexpression and GLI2 amplification
			//console.log(mutationTemp)

			for(var j = 0; j < mutationTemp.length; j++){
				if(mutation.indexOf(mutationTemp[j]) < 0) mutation.push(mutationTemp[j])
				if(!mus[i].match('-') && mutationTemp[j] != mus[i])
					mutationSearchMatch.push({mutation: mutationTemp[j], search: mus[i]});
			}
		}
		mutation = mutation.sort();
		new Ui()
		setInitialActiveMutation()
		//console.log(mutationSearchMatch)
	})
}

function setInitialActiveMutation(){
	// console.log(mutation)
	var temp = [//"Q9WJQ2(K65R)",
	// "ABL1(H396P)","ABL1(M351T)","ABL1(Q252H)",
	// "ABL1(Y253F)", 
	// "BRAF(V600E)", 
	// "EGFR(T790M)", //"ABL(I242T)", "ABL(F317C)",
 // "EGFR(L861Q)",
 // "EGFR(L858R)",
 // "EGFR(G719S)",
 // "EGFR(G719C)",
 "ABL1(T315I)",
 "ABL1(F317L)",
 "ABL1(F317I)",
 "ABL1(E255K)",
 "ABL1(Y253H)",
 // "KIT(D816V)",
 // "RET(M918T)"
// "ABL1(G250E)", 
// "GHSR(S123Y)",
// "ABL1(T315I)",
// "EZH2(Y641N)",
// "Q20MD5(S31N)",
// "FLT3(D835Y)",
// "BRAF(V600E)",
// "IDE(E341A)",
// "HEXB(P504S)"
]
	for(var i = 0; i < temp.length; i++){
//mutationChecked( temp[i])
		mutationWaitingList.push(temp[i])
		//setTimeout(mutationChecked( temp[i]), 5000 * i)
		//document.getElementById("input" + temp[i]).checked = true;
	}
	mutationChecked(mutationWaitingList[0])

}

function parseDTC(){
	// d3.request("javascripts/datasets/group.csv")
	//   .response(function(text){ return d3.dsvFormat(';').parse(text.responseText); })
	//   .get(interpretDTC)
	d3.dsv(";")("javascripts/datasets/group1.csv", 
	function interpretDTC(data){
		//console.log(data)
		data.forEach(function(d, i){
			
			// split EGFR(L858R, T790M)
			//var parts = d["Mutation information"].split(/[()-]+/);
			var parts = d["Mutation information"].split("-");

			//find all drugs from DTC related to the mutation, not just ones that appear in CGI
			var results = $.grep(mutationDrug, function(e){
				return d["Compound Name"].trim().toUpperCase() == e.drug.trim().toUpperCase() && parts[0].trim() == e["mutation"] //&& e.effect == "Responsive"
			})
			//find the drug and mutation in CGI
			if(results.length > 0){
				if(results.length > 1) console.log("multiple drug entries!!!")
				//console.log(d["Compound Name"]);

				//var parts = d["Mutation information"].split(/[\(\)]+/).filter(Boolean);
				//console.log(parts)
				var muTemp = parts[0].trim();//d["Mutation information"]//parts[0] + ":" + parts[1]; 

				var bioa = {
						"Compound Name": d["Compound Name"], 
						"Standard inchi key": d["Standard inchi key"], 
						"Uniprot ID": d["Uniprot ID"], 
						"Target Pref Name": d["Target Pref Name"], 
						"Gene Name": d["Gene Names"], 
						"Mutation Information": muTemp,
						"PubMed ID": d["PubMed ID"],
					    "End Point Standard Type": d["End Point Standard Type"], 
					    "End Point Standard Relation": d["End Point Standard Relation"], 
					    "End Point Standard Value": d["End Point Standard Value"], 
					    "End Point Standard Units": d["End Point Standard Units"], 
					    "Endpoint Mode of Action": d["Endpoint Mode of Action"],
					    "Assay Format": d["Assay Format"], 
					    "Assay Type": d["Assay Type"]
					   }
			//console.log(bioa);
			//bioactivity.push(bioa);

				//console.log(results[0].mutation);
				if(!results[0].hasOwnProperty("total")){
					results[0].total = [];
					results[0].dtcsource = [];
					results[0].dataset.push("DTC")
				}

				results[0].total.push( parseFloat(d["End Point Standard Value"].replace(',','.')) )
				results[0].dtcsource.push( d["PubMed ID"] )
									//console.log(results[0]);

			}
			else {
				//data not in CGI
				var ob = {drug: d["Compound Name"].capitalizeFirstLetter(), mutation: parts[0].trim(), total: [], dtcsource: [], dataset: ["DTC"]};
				ob.total.push( parseFloat(d["End Point Standard Value"].replace(',','.')) )
				ob.dtcsource.push( d["PubMed ID"] )
				mutationDrug.push(ob)
			}


		})


		//console.log(drugList)
		
		//activeMutation = mutation.slice();

		mutationDrug.forEach(function(d, i){
			if(!d.hasOwnProperty("total")) return;

			d.total = d.total.sort();
			//console.log(d.total)
			length = d.total.length;
			if(length % 2 == 0) d.med = ( d.total[Math.floor(length / 2)] + d.total[Math.floor(length / 2) - 1] ) / 2;
			else d.med = d.total[Math.floor(length / 2)];//d.total / d.count;
			//console.log(d.med);
		})

		var subset = $.grep(mutationDrug, function(e){
			var results = $.grep(activeMutation, function(c){
				return c.mutation == e.mutation
			})
			return results.length > 0;
		})

		//var curDrug = [];
		subset.forEach(function(d, i){
			var results = $.grep(dataRow, function(e){
				return d.drug == e.drug;
			})
			//console.log(d);
			if(results.length == 0){
				var obj = {drug: d.drug, dataset: {CGI: false, DTC: false}, mutations: [], total: 0 }
				dataRow.push(obj);
				addMutationToDatarow(d, obj);
			}
			else{
				if(results.length > 1) console.log("NC: multiple entries!!");
				addMutationToDatarow(d, results[0]);
			}

		})
		//console.log(dataRow);

		new Ui();

	})
}


function parseCGI(){
	d3.tsv("javascripts/datasets/biomarkers.tsv", function(error, data){
		if(error) throw error;
		data.forEach(function(d){
			//if(d.Association == "Responsive"){
				//console.log(d.DRUG);
				if(d.Drug == "[]") return;
				var re = new RegExp(/\),|\+/);
				if(re.test(d.Biomarker) ) return; // ignore biomarkers like EGFR inframe deletion (L747),inframe insertion (P753PS), and G6PD (V98M) + G6PD (N156D)
				var drugs = d.Drug.split("(");
				drugs[0] = drugs[0].trim();
				var mutationParts = d.Biomarker.split(/[(,)]+/).filter(Boolean);
				//console.log(d.Biomarker)
				var mutationTemp = [];
				var association = d.Association.split("(");

				var tumors = d["Primary Tumor type"].split(";");


				//ignore the rows which the mutation attributes has no "()"
				for(var i = 1; i < mutationParts.length; i++){
					mutationTemp.push( mutationParts[0].trim() + "(" + mutationParts[i].trim() + ")" );
				}

				if(mutationTemp.length == 0) return; //ignore biomarkers like FLT1 overexpression and GLI2 amplification
				//console.log(mutationTemp)
				for(var j = 0; j < tumors.length; j++){
					var re = $.grep(tumorMutation, function(e){
						return e.tumor == tumors[j]
					})
					if(re.length > 0){
						if(re.length > 1) console.log("errrrr")
						re[0].mutations = re[0].mutations.concat(mutationTemp)
					}
					else tumorMutation.push({ tumor: tumors[j], mutations: mutationTemp })
				}

				for(i = 0; i < mutationTemp.length; i++){
					if( mutation.indexOf(mutationTemp[i]) < 0 ) mutation.push(mutationTemp[i])

						//console.log(mutationTemp[i]);
					//see if the entry already exists
					var r = $.grep(mutationDrug, function(e){
						return e.drug == drugs[0] && e.mutation == mutationTemp[i] && e.effect == association[0].trim();
					})
					if(r.length > 0){
						if(r.length > 1) console.log("multiple mutation drug entries!!!")
						if(evidenceLevel[d["Evidence level"]] > evidenceLevel[r[0].evidence] ){
							r[0].evidence = d["Evidence level"]
						}
						for(var j = 0; j < tumors.length; j++){
							if(r[0].tumors.indexOf(tumors[j]) < 0) r[0].tumors.push(tumors[j])
						}
					}
					else {
						mutationDrug.push( {drug: drugs[0].trim(), mutation: mutationTemp[i], effect: association[0].trim(), evidence: d["Evidence level"], source: d["Source"], dataset: ["CGI"], tumors: tumors} );
					}

				}
		})
		//console.log(drugResponsive);
		//parseDTC();
		for(var  i = 0; i < tumorMutation.length; i++){
			tumorMutation[i].mutations = uniqArray(tumorMutation[i].mutations);
		}
		//console.log(tumorMutation)
		getDTCMutationList();
	});
	

}
//})

// q.awaitAll(function(error, data){
// 	if(error) console.log(error);
// 		console.log(data)

// 	console.log("finishhhhhh")
// });