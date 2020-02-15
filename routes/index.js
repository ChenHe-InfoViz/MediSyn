var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');

//mongodb
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// Connection URL
var dburl = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, '../public/javascripts') });
});

// Use connect method to connect to the server
var mongodbCollection;
MongoClient.connect(dburl, function(err, db) {
  //mongodbOb = db;
  assert.equal(null, err);
  console.log("Connected successfully to server");
  mongodbCollection = db.collection("documents")


  //remove all documents
  //mongodbCollection.remove( { } )

  //update bioactivities
  // mongodbCollection.findOne({"name":  "mutationList" }, {mutations: 1}).then(
  // 	function(doc){
  // 		mutationList = doc.mutations;
  // 		//console.log(mutationList)
  // 		//getMutantBios()
  // 		getWildBios();
  // 	})
 
  //update mutation list
  //getMutationList("/api/data/bioactivity/?format=json&wildtype_or_mutant=mutated");

  // var d = mongodbCollection.find({drug: 'Tae-684'})
  // console.log(d)
  // d.forEach(function(e){
  // 	console.log(e)
  // })
  // .findOne({drug: 'Tae-684', mutation: 'RAF1'}).then(
  // 	function(doc){
  // 		console.log(doc);
  // 	})
});

router.get("/bio", function(req,res){
	var result = [];
	//console.log(req.query.mutation)
	mongodbCollection.find({ Mutation: req.query.mutation} ).toArray( function(err, docs){
		//console.log(data)
		if(err) res.json(500)
		else{
			for(var i = 0; i < docs.length; i++){
				//console.log("d " + docs[i].mutation)
				result.push(docs[i])
				//console.log(result + "dcada")
			}
			//console.log(docs.length)
			//console.log(result)
			res.json(result)
		}
	})
	
	// 	console.log(error)
	// 	response = {error: true}
	// }
	// else response = data
	
})
	
	
// })

String.prototype.capitalizeFirstLetter = function() {
	//if(this == null) return null;
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var insertDocuments = function(docs) {
  // Get the documents collection
  //var collection = mongodbOb.collection('documents');
  // Insert some documents
  mongodbCollection.insertMany(docs, function(err, result) {
    assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted " + docs.length + " documents into the collection");
    //callback(result);
  });
}

var insertOneDoc = function(doc){
	mongodbCollection.insertOne( doc, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the collection.");	
	})
}

var mutationList = [];
//get mutation list from dtc
var getMutationList = function(urlPath){
	console.log(urlPath)
	var options = {
            host: "drugtargetcommons.fimm.fi",
            port: 80,
            path: urlPath,
            method: 'GET',
        };
    var resString = "";
	var request = http.request(options, function(response) {
		response.on('data', function(d) {
            resString += d;
                    	// console.log(resString)

        });
        response.on('end', function() {
        	// console.log(resString)
        	var resJson = JSON.parse(resString);
        	var bios = resJson.bioactivities
           for(var i = 0; i < bios.length; i++){
              if(bios[i].mutation_info != null && mutationList.indexOf( bios[i].mutation_info ) < 0 ){
                mutationList.push(bios[i].mutation_info);
              }
           }
           if(resJson.meta.next != null){
              getMutationList(resJson.meta.next);
              //total++;
           }
           else{
           	console.log(mutationList)
           	insertOneDoc({name: "mutationList", mutations: mutationList})
            //getMutantBios();
            //getWildBios();
            //callback();//close db connection
           }

        })
    })
	request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

	request.end();
}

//get mutated bio value
var mutationSearchMapping = []; //mutation:, search:[]
var genes = [];

var getMutantBios = function(){
  //console.log(mutationSearchMapping)
    getMutantSearchMapping();

  getBioactivityForOneMutation(0);
}

function getWildBios(){
  getMutantSearchMapping();

  getGeneList();
  console.log(genes)
  getOneWildBios(0);
}

function getOneWildBios(index){
  if(index < genes.length){
  	var mutationDrugDocs = [];
    getWildBioPage("/api/data/bioactivity/?format=json&wildtype_or_mutant=wild_type&gene_name=" + genes[index], mutationDrugDocs, genes[index], index)
  }
  //else mongodbOb.close()
}

function getWildBioPage(urlPath, mutationDrugDocs, gene, index){
	console.log(urlPath)
	var options = {
            host: "drugtargetcommons.fimm.fi",
            port: 80,
            path: urlPath,
            method: 'GET',
        };
    var resString = "";
	var request = http.request(options, function(response) {
		response.on('data', function(d) {
            resString += d;
                    	// console.log(resString)

        });
        response.on('end', function() {
        	var resJson = JSON.parse(resString);

            try{
            
              var list = processBioactivity(resJson.bioactivities, gene, mutationDrugDocs)
              if(resJson.meta.next != null){
                  getWildBioPage(resJson.meta.next, mutationDrugDocs, gene, index);
               }
              else{
                processDocsForOneMutation(mutationDrugDocs)
                getOneWildBios(index + 1)
              }
            }
            catch(e){
                console.log("error catch " + e)
            }
        })
    })
    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

	request.end();
}

function getGeneList(){
  for(var i = 0; i < mutationSearchMapping.length; i++){
    var geParts = mutationSearchMapping[i].mutation.split("(");
    if(genes.indexOf(geParts[0].trim()) < 0){
      genes.push(geParts[0].trim())
    }
  }
}

var getBioactivityForOneMutation = function(i){
  if(i < mutationSearchMapping.length){
      var mutationDrugDocs = [];
    //for(var j = 0; j < mutationSearchMapping[i].search.length; j++){
      getBioactivity(mutationSearchMapping[i], 0, i, mutationDrugDocs)
    //}
  }
  //else getWildBios()
}

var bioTypes = ["IC50", "EC50", "XC50", "AC50", "Ki", "Kd", "KD", "KI", "ic50"];

function getBioPage(urlPath, mapping, j, mutationIndex, mutationDrugDocs){
	console.log(urlPath)
  var options = {
            host: "drugtargetcommons.fimm.fi",
            port: 80,
            path: urlPath,
            method: 'GET',
        };
    var resString = "";
	var request = http.request(options, function(response) {
		response.on('data', function(d) {
            resString += d;
                    	// console.log(resString)

        });
        response.on('end', function() {
        	var resJson = JSON.parse(resString);
            try{
            
              var list = processBioactivity(resJson.bioactivities, mapping.mutation, mutationDrugDocs)
              if(resJson.meta.next != null){
                  getBioPage(resJson.meta.next, mapping, j, mutationIndex, mutationDrugDocs);
               }
              else{
                getBioactivity(mapping, j+1, mutationIndex, mutationDrugDocs)
              }
            }
            catch(e){
                console.log("error catch " + e)
            }
        })
    })
  request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

	request.end();
}

function processBioactivity(bios, mutation, mutationDrugDocs){
  for(var i = 0; i < bios.length; i++){
        if(bioTypes.indexOf(bios[i]["endpoint_standard_type"]) < 0 || bios[i]["endpoint_standard_value"] == null) continue;
        var drug = bios[i]["compound_name"];
        if(drug == null) continue;//drug = bios[i]["chembl_id"]
        else drug = drug.capitalizeFirstLetter()
        var r = [];
    	mutationDrugDocs.forEach(function(e){
            if(drug == e.drug)
            	r.push(e) //&& mutation == e["mutation"] //&& e.effect == "Responsive"
        })
      var ob;
        if(r.length > 0){
          ob = r[0]
            //r[0].dtcsource.push( bios[i]["pubmed_id"] )
        }
        else{
            ob = {drug: drug, mutation: mutation, bioactivities: [], total: []};
            //ob.dtcsource.push( bios[i]["pubmed_id"] )
            mutationDrugDocs.push(ob)
        }
        try{
      ob.total.push( parseFloat(bios[i]["endpoint_standard_value"]) )
      var oneBio = {
        "PubMed ID": bios[i]["pubmed_id"],
        "End Point Standard Type": bios[i]["endpoint_standard_type"], 
        "End Point Standard Relation": bios[i]["endpoint_standard_relation"], 
        "End Point Standard Value": bios[i]["endpoint_standard_value"], 
        "End Point Standard Units": bios[i]["endpoint_standard_units"], 
        // "Endpoint Mode of Action": bios[i]["Endpoint Mode of Action"],
              // "Assay Format": d["Assay Format"], 
              // "Assay Type": d["Assay Type"]
      }
  }
  catch(e){
  	console.log(e)
  }

      ob.bioactivities.push(oneBio)
  
    }
}

function processDocsForOneMutation(mutationDrugDocs){
  for(var i = 0; i < mutationDrugDocs.length; i++){
      var muDrug = mutationDrugDocs[i];
      muDrug.total = muDrug.total.sort();
        //console.log(d.total)
        var length = muDrug.total.length;
        if(length % 2 == 0) muDrug.med = ( muDrug.total[Math.floor(length / 2)] + muDrug.total[Math.floor(length / 2) - 1] ) / 2;
        else muDrug.med = muDrug.total[Math.floor(length / 2)];

        // console.log(curBio.med)
        if(muDrug.med <= 1) { muDrug.potencyState = "highly potent" }
        else if(muDrug.med > 1 && muDrug.med < 1000) { muDrug.potencyState = "potent"; }
        else if (muDrug.med < 10000){
            muDrug.potencyState = "weak potent"
        }
        else {
            muDrug.potencyState = "resistant"
        }
        delete muDrug.total;

    }
    console.log(mutationDrugDocs)
    if(mutationDrugDocs.length > 0)
    	insertDocuments(mutationDrugDocs)
}
function getBioactivity(mapping, j, mutationIndex, mutationDrugDocs){
  if(j >= mapping.search.length) {
    processDocsForOneMutation(mutationDrugDocs)
    
    getBioactivityForOneMutation(mutationIndex + 1);
  }
  else{
  	var url = "/api/data/bioactivity/?format=json&mutation_info=" + mapping.search[j]; 
  getBioPage(url.replace(/ /g,"%20"), mapping, j, mutationIndex, mutationDrugDocs)
	}
}

var getMutantSearchMapping = function(){
    var reg = new RegExp(/del/);
    // console.log(mutations);
    for(var i = 0; i < mutationList.length; i++){
      if(reg.test(mutationList[i])) continue; //ignore del mutation
      var firstpart = mutationList[i].split("-"); // only take first part for mutations like "ABL1(F317I)-nonphosphorylated"
      var muParts = firstpart[0].split(/[(,)]+/).filter(Boolean);
      var mutationTemp = []

      for(var j = 1; j < muParts.length; j++){
        mutationTemp.push( muParts[0].trim() + "(" + muParts[j].trim() + ")" );
      }

      //if(mutationTemp.length == 0) return; //ignore biomarkers like FLT1 overexpression and GLI2 amplification
      //console.log(mutationTemp)

      for(var j = 0; j < mutationTemp.length; j++){
        var r = [];
        mutationSearchMapping.forEach( function(e){
        	if(e.mutation == mutationTemp[j])
        		r.push(e)
        })
        if(r.length > 0){
          if(r.length > 1) console.log("mutiple!!")
          r[0].search.push(mutationList[i])
        }
        else{
          mutationSearchMapping.push({mutation: mutationTemp[j], search: [mutationList[i]]})
        }
      }
    }
    //mutation = mutation.sort();
    console.log(mutationSearchMapping)

}

module.exports = router;
