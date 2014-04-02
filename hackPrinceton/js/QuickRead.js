function getWordPosition(index){
    var str = $("#classicContent").text(); 
    var tokens = str.split(" ");
    var start = tokens.slice(0, index-2);
    var end = tokens.slice(index+1,tokens.length);
    var highlight = tokens.slice(index-2, index+1).join(" ");
    $("#classicContent").text("");
    $("#classicContent").append(start.join(" "));
    $("#classicContent").append("<span id=highlight style='background:#FFFF00'>" + " " + highlight + " " + "</span>");
    $("#classicContent").append(end.join(" "));
} 