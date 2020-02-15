function drawAxis(){
    var distanceBetweenAxis = 25;
    var distanceBetweenUpperAndLower = 25;

    var axisHeaderGroup = d3.select("#headerSvg").append("g")
                            .attr("class", "axisHeaderGroup")
                            .attr("transform", "translate(" + mainVis.barPaddingLeft + "," + (mainVis.headerHeight - distanceBetweenAxis * 3 - 3) + ")");

    var offsetX = 0,
        offsetY = 0;

    var xScale = d3.scale.linear().domain([0, statistics.maxTotal]).range([0, mainVis.stackGroupWidth]).nice();
    var xOverViewAxisUpper = d3.svg.axis().scale(xScale);
    var xOverViewAxisLower = d3.svg.axis().scale(xScale).orient("top").tickFormat(function(d){return ""});


    var xDetailScale = d3.scale.linear().domain([0, statistics.maxTotal]).range([0, mainVis.stackGroupWidth]).clamp(true);
    var xDetailAxisUpper = d3.svg.axis().scale(xDetailScale).ticks(5);
    var xDetailAxisLower = d3.svg.axis().scale(xDetailScale).orient("top").tickFormat(function(d){return ""});

    // add axis
    axisHeaderGroup.append("g").attr({
        "class":"x overviewAxisUpper axis",
        "transform":"translate(" + offsetX + "," + offsetY + ")"
    }).call(xOverViewAxisUpper);


    axisHeaderGroup.append("g").attr({
        "class":"x overviewAxisLower axis",
        "transform":"translate(" + offsetX + "," + (offsetY + distanceBetweenUpperAndLower) + ")"
    }).call(xOverViewAxisLower);

    var labelGroup = axisHeaderGroup.append('g').attr({
        "class": "axisLabelGroup",
        "transform": "translate(0, " + (offsetY + distanceBetweenAxis + 3) + ")"
    })
    labelGroup.append('rect').attr({
        x:0,
        y:0,
        width: mainVis.stackGroupWidth,
        height: mainVis.rowHeight,

    }).style("fill", "lightgrey")
    labelGroup.append('text')
        .attr({
            x: mainVis.stackGroupWidth / 2 - 30,
            y: 13
        })
        .text("Potency (nM)")

    axisHeaderGroup.append("g").attr({
        "class":"x detailAxisUpper axis",
        "transform":"translate(" + offsetX + "," + (offsetY + distanceBetweenAxis + distanceBetweenUpperAndLower) + ")"
    }).call(xDetailAxisUpper);

    axisHeaderGroup.append("g").attr({
        "class":"x detailAxisLower axis",
        "transform":"translate(" + offsetX + "," + (offsetY + distanceBetweenAxis + 2 * distanceBetweenUpperAndLower) + ")"
    }).call(xDetailAxisLower);

    var brush = d3.svg.brush()
            .x(xScale)
            .extent([0, statistics.maxTotal / 8])
            .on("brush", brushed)


    axisHeaderGroup.append('g').attr({
        "class": "x brush"
    }).call(brush)
    .call(brush.event)
    //.call(brush.move, xDetailScale.range());
    .selectAll("rect")
    .attr({
        "class": "brushRect",
        height: distanceBetweenAxis,
    }).style({
        "fill": "lightgrey",
        "opacity": .5 
    })
    .style("cursor", "default")

    axisHeaderGroup.select(".e")
    .append("rect")
    .attr({
        class: "handle",
        width: 3,
        height: distanceBetweenAxis,
        transform: "rotate(20)"
    })
    .style("cursor", "ew-resize")

    function brushed(){
        //console.log(brush.event)
        d3.selectAll(".brushRect").attr("width", xScale(brush.extent()[1]))
        xDetailScale.domain([0, brush.extent()[1]]);
        xDetailAxisLower.scale(xDetailScale);
        axisHeaderGroup.select(".detailAxisLower").call(xDetailAxisLower);
        xDetailAxisUpper.scale(xDetailScale);
        axisHeaderGroup.select(".detailAxisUpper").call(xDetailAxisUpper);
        mainVis.xDetailScale = xDetailScale;
        //updateBarLength();
        updateStackOrderLength();//update the position of each bar in the stack
    }

}
