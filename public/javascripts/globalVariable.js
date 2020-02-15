

// var changeBarData = {} //drug, type, value

var mutation = []; //available mutations
var mutationSearchMatch = []; //{mutation:, search:} e.g. mutation KIT(V559D), but search by KIT(V559D, T670I)
// var DTCList = [], retrivedMutationDTC = []; //avoid repeated retrival
var mutationWaitingList = []
var urlPrefix = "http://localhost:28017/test/documents/?"

var activeMutation = []; // current active mutations, {mutation: , color: index}
var currentActiveMutation = [];
var mutationRange = []; //array indocator
// var colorQueue = [0,1,2,3,4,5,6,7,8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
var mutationDrug = []; //store mutation drug relations {drug: , mutation:, effect: , evidence, source}, it contains all mutations from CGI
var dataRow = [];
// var bioactivity = [];//{Compound Name, Standard inchi key, Uniprot ID, Target Pref Name, Gene Name, Mutation information, PubMed ID
					 //End Point Standard Type, End Point Standard Relation, End Point Standard Value, End Point Standard Units, Endpoint Mode of Action,
					 //Assay Format, Assay Type}
var curTumors = []; // {tumor, count}
var tumorMutation = [];

var statistics = {
	maxTotal: 0,
	minTotal: 0
}

var evidenceLevel = {
	 "NCCN guidelines": .96, "FDA guidelines": .96, "European LeukemiaNet guidelines": .96, "CPIC guidelines": .96, "NCCN/CAP guidelines": .96,
	 "Late trials": .7, "Early trials": .5, "Clinical trial": .5, "Case report": .3, "Pre-clinical": .1
}

// var evidenceIndex = {}

var evidenceRange = [.1, .96];


var potencyLevel = {"highly potent":.5, "potent": 1.5, "weak potent": 2.5, "resistant": 3.5}
var potencyRange = [0, 4]

var dataset = {CGI: true, DTC: false}

var activeMutationRange = [0, 0];

var effectControllerState = {Responsive: true, Resistant: true, "No Responsive": true, "Increased Toxicity": true} // same as checkbox value and biomarker dataset

var tumorNameMatch = {
	LL:"Lymphoblastic leukemia",
	CANCER: "Any cancer type",
	ALL: "Acute lymphoblastic leukemia",
	NSCLC: "Non-small cell lung",
	L: "Lung",
	CML: "Chronic myeloid leukemia"
}