function wrap(text, width, linecount = 2) {
  text.each(function() {
    var text = d3.select(this);
    //console.log(width);
    var words = text.text().trim().split(/[\s;,]+/).reverse(),
        word,
        line = [],
        lineNumber = 1,
        countLine = 0,
        lineHeight = 12, // ems
        y = text.attr("y"),
        dy = 0,//parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y);//.attr("dy", dy + "em");
        //console.log(words);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        countLine++;
        if(countLine == linecount){
          line.pop();
          tspan.text(line.join(" ") + "..");
          
          break;
        }
        if(line.length > 1){
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0)//.attr("y", y)
          .attr("dy", lineNumber * lineHeight + dy + "px")
          .text(word);
        }
        else {
            tspan.text(line.join(" "));
            tspan = text.append("tspan").attr("x", 0)//.attr("y", y)
          .attr("dy", lineNumber * lineHeight + dy + "px")
          //.text(word);
        }
      }
    }
    if(countLine > 0) text.selectAll("tspan").attr("transform", "translate(0, -8)" )
  });
}

function uniqArray(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}