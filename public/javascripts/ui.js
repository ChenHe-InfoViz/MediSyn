Ui = function(){
	var self = this;
	self.createLeftList();
	self.searchList();

    //main vis
    d3.select("#headerSvg").attr("height", mainVis.headerHeight);
    drawController();
    selectionEvent();

	drawRows();
	drawMutationHeader();

    initDraw();
    sortDataRows();

    //set up button clicks
    // d3.select("#firstPage").on("click", firstPageClicked);
    $("#firstPage").on("click", firstPageClicked)
    $("#firstPage").prop("disabled", true)
    $("#prePage").on("click", prePageClicked)   //note: if write prePageClick(), then thefunction is called!!!
    $("#nextPage").on("click", nextPageClicked)
    $("#lastPage").on("click", lastPageClicked)
    $("#lastPage").prop("disabled", true)
    $("#prePage").prop("disabled", true)
    $("#nextPage").prop("disabled", true)

	//drawAxisHeader();
    //drawDetailTable();
}

function updateCurrentActiveMutationPage(begin, end){
    var i;
    if(begin != null){
        activeMutationRange[0] = begin;
        currentActiveMutation = []
        for(i = begin; i < activeMutation.length; i++){
            if(activeMutation[i].type == "mutant"){
                pushMutationtoCurrent(activeMutation[i])

                if(currentActiveMutation.length >= mainVis.mutationPerPage){
                    activeMutationRange[1] = i;
                    break;
                }
            }
        }
        if(i == activeMutation.length)
            activeMutationRange[1] = i - 1;
    }
    else {
        activeMutationRange[1] = end;
        currentActiveMutation = [];
        for(i = end; i >= 0; i--){
            if(activeMutation[i].type == "mutant"){
                pushMutationtoCurrent(activeMutation[i], "head")

                if(currentActiveMutation.length >= mainVis.mutationPerPage){
                    activeMutationRange[0] = i;
                    break;
                }
            }
        }
        if(i == -1){
            activeMutationRange[0] = 0;
        }
    }

    var first = last = pre = next = true;
    for(i = activeMutationRange[0] - 1; i >= 0; i--){
        if(activeMutation[i].type == "mutant"){
            first = pre = false;
            break;
        }
    }

    for(i = activeMutationRange[1] + 1; i < activeMutation.length; i++){
        if(activeMutation[i].type == "mutant"){
            last = next = false;
        }
    }
            // console.log(activeMutationRange[0] + " " + activeMutationRange[1] + " " + activeMutation.length)

    updatePageButtonStates(first, pre, next, last) 
}

function pushMutationtoCurrent(mutation, position = null){
    if(position != null)
        currentActiveMutation.unshift(mutation)
    else currentActiveMutation.push(mutation);

    //update wild type
    var gene = containGene(currentActiveMutation, mutation.mutation)
    if(gene == null){
        gene = containGene(activeMutation, mutation.mutation)
        if(gene != null){
            if(position != null){
                currentActiveMutation.splice(1, 0, gene);
            }else
            currentActiveMutation.push(gene)
        }
    }
}

function containGene(muList, mutation){
    var gene = mutation.split("(")
    var r = $.grep(muList, function(e){
        return e.mutation == gene[0]
    })
    if(r.length > 0) return r[0];
    return null;
}

function firstPageClicked(){
    // console.log("first")
    mainVis.currentPage = 1;
    updateCurrentActiveMutationPage(0, null)
    //currentActiveMutation = activeMutation.slice(0, mainVis.mutationPerPage);
    updateMutationHeader();
    updateDataRow();
    updateColBackground();

    //updatePageButtonStates();
}

function lastPageClicked(){
    // console.log("last")
    //mainVis.currentPage = mainVis.totalPage;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.totalPage - 1), activeMutation.length);
    updateCurrentActiveMutationPage(null, activeMutation.length - 1)
    updateMutationHeader();
    updateDataRow();
    updateColBackground();

    //updatePageButtonStates();

}

function prePageClicked(){
    // console.log("previous")
    //mainVis.currentPage--;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.currentPage - 1), mainVis.mutationPerPage * mainVis.currentPage);
    updateCurrentActiveMutationPage(null, activeMutationRange[0] - 1)
    updateMutationHeader();
    updateDataRow();
    updateColBackground();

    //updatePageButtonStates();

}

function nextPageClicked(){
    // console.log("next")
    //mainVis.currentPage++;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.currentPage - 1), mainVis.mutationPerPage * mainVis.currentPage);
    updateCurrentActiveMutationPage(activeMutationRange[1] + 1, null)
    updateMutationHeader();
    updateDataRow();
    updateColBackground();

    //updatePageButtonStates();

}

function selectionEvent(){
    d3.select("#cgi").on("click", function(){
        if(document.getElementById("cgi").checked  == true) {
            dataset.CGI = true;
            d3.select("#eviBrush").style("display", "inline");
            $('.effectCheck').prop('disabled', false)
            $("#sortNumberofMutations").prop('disabled', false)

            // d3.selectAll(".oneRow").each(function(d, i){
            //     if(d.dataset.CGI) d3.select(this).style("display", "inline");
            // })
        }
        else {
            dataset.CGI = false;
            d3.select("#eviBrush").style("display", "none");
            $('.effectCheck').prop('disabled', true)
            $("#sortNumberofMutations").prop('disabled', true)
            // if(dataset.DTC == false) d3.selectAll(".oneRow").style("display", "none");
            // else
            //     d3.selectAll(".oneRow").each(function(d, i){
            //         if(d.dataset.DTC == false) d3.select(this).style("display", "none");
            //     })
        }
        // console.log(d3.select(this);)
        updateMutationRects();
    });

    d3.select("#dtc").on("click", function(){
        if(document.getElementById("dtc").checked  == true) {
            dataset.DTC = true;
            $("#sortTotalStrength").prop('disabled', false)
            d3.select("#resBrush").style("display", "inline");


            // d3.selectAll(".oneRow").each(function(d, i){
            //     if(d.dataset.DTC) d3.select(this).style("display", "inline");
            // })
        }
        else {
            dataset.DTC = false;
            $("#sortTotalStrength").prop('disabled', true)
            d3.select("#resBrush").style("display", "none");


            // if(dataset.CGI == false) d3.selectAll(".oneRow").style("display", "none")
            // else
            //     d3.selectAll(".oneRow").each(function(d, i){
            //         if(d.dataset.CGI == false) d3.select(this).style("display", "none");
            //     })
        }
        // console.log(d3.select(this);)
        updateStacks();
    });

    //effects controller
    // get reference to element containing toppings checkboxes
    var ec = document.getElementById('effectController');

    // get reference to input elements in toppings container element
    var checkboxes = ec.getElementsByTagName('input');
    
    // assign updateTotal function to onclick property of each checkbox
    for (var i=0; i < checkboxes.length; i++) {
        // if ( tops[i].type === 'checkbox' ) {
            checkboxes[i].onclick = updateEffectController;
        // }
    }
}

function updateEffectController(e){
    effectControllerState[this.value] = this.checked;
    updateRectsByEvidenceAndEffect();
}

function initDraw(){
    $("#sortTotalStrength").prop('disabled', true)
    d3.select("#resBrush").style("display", "none");


    var svgWidth = $("#header").width()
    $("#headerSvg").width(svgWidth);
   // 
    mainVis.mutationPerPage = Math.floor( (svgWidth - mainVis.barPaddingLeft) / mainVis.columnWidth) - 3

    var svgBodyWidth = $("#body").width()
    $("#bodySvg").width(svgBodyWidth);

   // console.log("max mutation " + mainVis.mutationPerPage)


    // $("#previewFrame").on("load", function () {
    // //alert('iFrame loaded!');
    $("#iframeFader").show();

    var checkBoxHeight = $("#list").height() - 10 - $("#datasetDiv").height() - $("#effectController").height() - $("#controllerSvg").height() - $("#sortControl").height() - $("#muTitle").height() - $("#searchList").height()
    $("#checkBoxes").height(checkBoxHeight)
    //console.log(checkBoxHeight + " " + $("#datasetDiv").height() + " " + $("#effectController").height() + " " + $("#controllerSvg").height() + " " + $("#sortControl").height() + " " + $("#configHeader").height())
    // });

    d3.select("#pageButton").style("padding-left", mainVis.barPaddingLeft + "px");

    d3.select("#body").attr("height", ( $("#main").height() - $("#header").height() - $("#pageButton").height() ) ).style("overflow-x", "auto")
    

}

Ui.prototype.searchList = function(){
	var self = this;
	self.searchResultArray = {};
    self.searchResultIndex = 0;
    $("#searchInput").on('search', function(){
        self.searchSets($(this).val());
    });
    $("#searchInput").keyup(function(){
        self.searchSets($(this).val());
    });
    $("#upButton").hide();
    $("#downButton").hide();
    $("#upButton").on('click', function(){
        //console.log("----------");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex--;
        if(self.searchResultIndex < 0)
            self.searchResultIndex = self.searchResultArray.length - 1;
        if($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")){
            $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        }
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
    $("#downButton").on('click', function() {
        //console.log("++++++++++++++");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function () {
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex++;
        if (self.searchResultIndex > self.searchResultArray.length - 1)
            self.searchResultIndex = 0;
        // if ($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")) {
        //     $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        // }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
}

Ui.prototype.searchSets = function(text){
    //console.log("searchhhhhh");
    var self = this;
    if(self.searchResultArray.length > 0)
    self.searchResultArray.each(function(){
        $(this).html($(this).text());
    });
    var curText = text.trim();
    if(curText.length > 0)
    {
        self.searchResultArray = $("ul li")
            .find("label")
            .filter(function () {
                var matchStart = $(this).text().toLowerCase().indexOf(curText.toLowerCase());
                if(matchStart > -1){
                    var matchEnd = matchStart + curText.length - 1;
                    var beforeMatch = $(this).text().slice(0, matchStart);
                    var matchText = $(this).text().slice(matchStart, matchEnd + 1);
                    var afterMatch = $(this).text().slice(matchEnd + 1);
                    $(this).html(beforeMatch + "<em>" + matchText + "</em>" + afterMatch);
                    return true;
                }
                return false;
            });
        $("#searchResult").text(self.searchResultArray.length + " result(s)");
    }
    else {
        $("#searchResult").text("");
        self.searchResultArray.length = 0;
    }
    if(self.searchResultArray.length > 2)
    {
        $("#upButton").show();
        $("#downButton").show();
    }
    else{
        $("#upButton").hide();
        $("#downButton").hide();
    }
    if(self.searchResultArray.length > 0){
        // if($(self.searchResultArray[0]).parent().parent().is(":hidden")){
        //     $(self.searchResultArray[0]).parent().parent().parent().find(".labelInParent").trigger('click');
        // }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        self.searchResultIndex = 0;
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
    }
    //draw matched text background
    $(self.searchResultArray[0]).find("em").each(function(){
        $(this).css("background", "#fb954b");
    })
}

//var curBioList = [];
//var ajaxQueue = [];

Ui.prototype.createLeftList = function(){
	var divEle = document.getElementById("checkBoxes");
	var ulElement = document.createElement("ul");
	divEle.appendChild(ulElement);

	mutation.forEach(function(d, i){
		var li = document.createElement("li");

		ulElement.appendChild(li);
        var inputElement = document.createElement("input");
        inputElement.id = "input" + d;
        inputElement.type = "checkbox";
        inputElement.value = d;

        //initial checkbox state
        // var results = $.grep(activeMutation, function(e){
        //     return d == e.mutation;
        // })
        // if(results.length > 0) inputElement.checked = true;

        inputElement.addEventListener('click', function () {
            //console.log(this.value);
            if(this.checked){
                //console.log(activeMutation);
                mutationWaitingList.push(this.value);
                if(mutationWaitingList.length == 1){
                    $("body").addClass("wait");

                    mutationChecked(this.value);
                }
            }
            else {
                removeMutation(this.value)
            }

        });

        var labelText = document.createElement("label");
        labelText.htmlFor = inputElement.id;
        labelText.appendChild(document.createTextNode(" " + d));
        li.appendChild(inputElement);
        li.appendChild(labelText).appendChild(document.createElement("br"));
	})

    console.log(mutation.length)
    
    // $("#checkBoxes").height(500)
    //$("#checkBoxes").height($("#list").height() - $("#searchList").height() - $("#muTitle").height())
}

function updatePageButtonStates(first, pre, next, last){
    if(first != null){
        $("#firstPage").prop("disabled", first)
    }
    if(pre != null){
        $("#prePage").prop("disabled", pre)
    }
    if(next != null){
        $("#nextPage").prop("disabled", next)
    }
    if(last != null){
        $("#lastPage").prop("disabled", last)
    }

}

//first add wild type, then the mutation
// function mutationChecked(mutation){

//     //updateActiveMutationList(mutation, "mutant")

//     //console.log(curTumors)
    
//     //if(retrivedMutationDTC.indexOf(mutation) < 0){
//     updateMutationDrug(mutation)
    
        
//     //}
//     // else //already retrived from DTC before
//     // {
//     //     // console.log("elelelse")
//     //     var gene = mutation.split("(")
//     //     var re = $.grep(activeMutation, function(e){
//     //         return e.mutation == gene[0];
//     //     })
//     //     var DTCresults;

//     //     if(re.length == 0){
//     //         DTCresults = $.grep(DTCList, function(e){
//     //             return e.mutation == gene[0];
//     //         })
//     //         updateActiveData(DTCresults, gene[0]);
//     //     }
//     //     var DTCresults = $.grep(DTCList, function(e){
//     //         return e.mutation == mutation;
//     //     })
//     //     //console.log(DTCresults)

//     //     updateActiveData(DTCresults, mutation);

        

//     //     updateMatrix();
        
//     // }
    
// }

function updateMatrix(){
    updateMutationHeader();

    updateDataRow();
    updateColBackground();

    sortDataRows();
}
//first add wild type, then mutant type
function updateActiveMutationList(mutation, type){
    var o = { mutation: mutation, type: type}
    activeMutation.push(o)
    var gene;

    if(type == "mutant"){
    
        if(currentActiveMutation.length < mainVis.mutationPerPage) {
            gene = containGene(activeMutation, mutation)

            // console.log(mainVis.mutationPerPage)
            // console.log("current " + currentActiveMutation.length + " " + currentActiveMutation)
            currentActiveMutation.push(o);
            activeMutationRange[1] = activeMutation.length - 1;
            if(gene != null && currentActiveMutation.indexOf(gene) < 0)
                currentActiveMutation.push(gene);
        }

        else if( activeMutationRange[1] + 4 > activeMutation.length){
            updatePageButtonStates(null, null, false, false)
        }        
        // console.log(activeMutationRange[0] + " " + activeMutationRange[1] + " " + activeMutation.length)

        // if(Math.ceil( activeMutation.length / mainVis.mutationPerPage ) > mainVis.totalPage){
        //     // console.log(mainVis.totalPage)
        //     mainVis.totalPage++;
        //     updatePageButtonStates()
        // }
    }
}

//var bioTypes = ["IC50", "EC50", "XC50", "AC50", "Ki", "Kd"];

function mutationChecked(mutation){
    document.getElementById("input" + mutation).checked = true;
    for(var i = 0; i < tumorMutation.length; i++){
        if(tumorMutation[i].mutations.indexOf(mutation) > -1){
            var t = $.grep(curTumors, function(e){
                return e.tumor == tumorMutation[i].tumor;
            })
            if(t.length > 0){
                t[0].mutations.push(mutation)
            }
            else {
                var o = {tumor: tumorMutation[i].tumor, mutations: []}
                o.mutations.push(mutation)
                curTumors.push(o)
            }
        }
    }
    //console.log(curTumors)


    var gene = mutation.split("(")
    var re = $.grep(activeMutation, function(e){
                    return e.mutation == gene[0];
                  })
    
    if(re.length == 0){
        retrieveWildtype(mutation, gene[0])//, urlPrefix + "wildtype_or_mutant=wild_type&gene_name=" + gene[0])//, list)
    }
    else {
        retrieveMutation(mutation)
    }

}

// function mutationSearchUrl(mutation){
//     var r = $.grep(mutationSearchMatch, function(e){
//         return e.mutation == mutation;
//     })
//     var searchBy = mutation;
//     if(r.length > 0){
//         if(r.length > 1) {
//             console.log("mutiple search term!!" + r[0].mutation)
//         }
//         searchBy = r[0].search;
//     }

//     return urlPrefix + "mutation_info=" + searchBy
// }

function retrieveMutation(mutation){
    $.ajax({
            type: "GET",
            url: "/bio/?mutation=" + mutation + " wildtype",
            dataType: "json",
            success: function(response){
                try{
                
                  //var list = processBioactivity(response.bioactivities, mutation, "mutant")
                  response.forEach(function(e){
                    e.dataset = ["DTC"]
                  })
                  updateActiveData(response, mutation, "mutant")
                  $("body").removeClass("wait");

                  updateActiveMutationList(mutation, "mutant");
                  updateMatrix();

                  if(mutationWaitingList.indexOf(mutation) < 0){
                    console.log("not exist")
                  }
                  else mutationWaitingList.splice(mutationWaitingList.indexOf(mutation), 1)
                  if(mutationWaitingList.length > 0) mutationChecked(mutationWaitingList[0])
                  else if($("#iframeFader").css("display") != "none") $("#iframeFader").fadeOut(500);

                }
                catch(e){
                    console.log("error catch " + e)
                }

            },

            error: function () {
                console.log("get page request failed.");
                //count++;
                //paperRequestLoop();
            },

            //timeout: 1500
        })
}

function retrieveWildtype(mutation, gene){
    $.ajax({
            type: "GET",
            url: "/bio/?mutation=" + gene,
            dataType: "json",
            success: function(response){
                //var list = processBioactivity(response.bioactivities, gene, "wildtype")
                //console.log(response)
                response.forEach(function(e){
                    e.dataset = ["DTC"]
                  })
                if(response.length > 0){
                    updateActiveMutationList(gene, "wild")
                    updateActiveData(response, gene, "wild")
                }
                retrieveMutation(mutation)
                //updateActiveMutationList(mutation, "mutant");

                //updateMatrix();

            },
            error: function(){
                console.log("error wild type")
            }
    })
}

// function processBioactivity(bios, mutation, type){
//     var curBioList = [];

//     for(var i = 0; i < bios.length; i++){
//         if(bioTypes.indexOf(bios[i]["endpoint_standard_type"]) < 0 || bios[i]["endpoint_standard_value"] == null) continue;
//         var drug = bios[i]["compound_name"];
//         if(drug == null) continue;//drug = bios[i]["chembl_id"]
//         else drug = drug.capitalizeFirstLetter()
//         var r = $.grep(curBioList, function(e){
//             return drug == e.drug && mutation == e["mutation"] //&& e.effect == "Responsive"
//         })
//         if(r.length > 0){
//             r[0].total.push( parseFloat(bios[i]["endpoint_standard_value"] ) )
//             r[0].dtcsource.push( bios[i]["pubmed_id"] )
//         }
//         else{
//                 var ob = {drug: drug, mutation: mutation, total: [], dtcsource: [], dataset: ["DTC"], type: type};
//                 ob.total.push( parseFloat(bios[i]["endpoint_standard_value"]) )
//                 ob.dtcsource.push( bios[i]["pubmed_id"] )
//                 curBioList.push(ob)
//             }
//     }

//     // console.log(curBioList);
//       for(var i = curBioList.length - 1; i > -1; i--){

//       //for(var i = 0; i < curBioList.length; i++){
//         //get median of bioactivities
//         //all ajax finish
//         var curBio = curBioList[i];
//         curBioList[i].total = curBioList[i].total.sort();
//         //console.log(d.total)
//         var length = curBioList[i].total.length;
//         if(length % 2 == 0) curBioList[i].med = ( curBioList[i].total[Math.floor(length / 2)] + curBioList[i].total[Math.floor(length / 2) - 1] ) / 2;
//         else curBioList[i].med = curBioList[i].total[Math.floor(length / 2)];

//         // console.log(curBio.med)
//         if(curBioList[i].med <= 1) { curBio.potencyState = "highly potent" }
//         else if(curBioList[i].med > 1 && curBioList[i].med < 1000) { curBio.potencyState = "potent"; }
//         else if (curBioList[i].med < 10000){
//             curBio.potencyState = "weak potent"
//         }
//         else {
//             curBio.potencyState = "resistant"
//             //curBioList.splice(i, 1);
//             // curBio.potencyState = "resistant"
//         }
//       }
//       // DTCList = DTCList.concat(curBioList);
//       // retrivedMutationDTC.push(mutation);
//       return curBioList;
// }

function updateActiveData(DTCresults, mutation, type){
    var tempList;
    if(type == "mutant"){
        var results = $.grep(mutationDrug, function(e){
            return e.mutation == mutation;
        })
        tempList = DTCresults.concat(results);
    }
    else tempList = DTCresults;
    //console.log(DTCresults)
    for(var j = 0; j < tempList.length; j++){
        // if(tempList[j].dataset.indexOf("CGI") > -1){
        //     for(var i = 0; i < tempList[j].tumors.length; i++){
        //         var t = $.grep(curTumors, function(e){
        //             return e.tumor == tempList[j].tumors[i];
        //         })
        //         if(t.length > 0) {
        //             if(t.length > 1) console.log("more than one tumor!!")
        //             t[0].count++;
        //         }
        //         else curTumors.push({tumor: tempList[j].tumors[i], count: 1});
        //     }
        // }

        var drugs = $.grep(dataRow, function(e){
            return e.drug == tempList[j].drug;
        })
        if(drugs.length > 0){
            //console.log(drugs[0])
            if(drugs.length > 1) console.log("multiple entries here!!!")
            addMutationToDatarow(tempList[j], drugs[0]);
        }
        else {
            var obj = {drug: tempList[j].drug, dataset: {CGI: false, DTC: false}, mutations: [], total: 0}
            dataRow.push(obj);
            addMutationToDatarow(tempList[j], obj)
        }
    }


}

