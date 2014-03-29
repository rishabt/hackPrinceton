$(document).ready(function(){
    var sprayReader = new SprayReader('#spray_result');
    
    $("#speedRead").hide();
    $("#classicRead").hide();
    $("#newBook").hide();
    $("#parser").hide();
    $("#pause").hide();
    $("#resume").hide();
    $("#bookShelf").show();
    
    jQuery.extend({
        getValues: function(url) {
            var result = null;
            $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json",
                async: false,
                success: function(data) {
                    result = data;
                }
            });
            return result;
        }
    });  
    
    var results = $.getValues("https://api.mongolab.com/api/1/databases/hackdarts/collections/bookshelf?apiKey=P25ikg36IXayIZdHlnpBhhbqcpsblHGz");

    
    var firstDiv = $('<li class="divider"></li><li data-uib="app_framework/listitem"><a class="icon add">Add Your Own</a></li>');
    firstDiv.css({
       'cursor':'pointer', 
    });
    
    firstDiv.on('click', function(){
        $("#bookShelf").hide();
        $("#newBook").show();
    });
    
    $("#testShelf").append(firstDiv); 
    
    function divActions(author, title, source, wordcount, text){
        this.author = author;
        this.title = title;
        this.source = source;
        this.wordcount = wordcount;
        this.text = text;
        this.running = false;
        this.isPaused = false;
       
        var div = $('<li class="divider"></li><li data-uib="app_framework/listitem"><a>'+title+'</a><span id=author>'+author+'<span></li>');
        
        div.css({
           'cursor':'pointer', 
        });
        
        div.on('click', function(){
            $("#speedRead").show();
            $("#bookShelf").hide();
            
            var inputText = text;
            var wpm = $('#wpm').val();
            $("#classicContent").append(inputText);
            sprayReader.setInput(inputText);
            sprayReader.setWpm(wpm);
        });
        
        $("#testShelf").append(div);
    }
    
    $.each(results[0].book, function(index, element){
        this.div = new divActions(element.author, element.title, element.source, element.wordcount, element.text);
    });

    $("#upSpeed").on("click", function(){
        sprayReader.upSpeed();
    });

    $("#downSpeed").on("click", function(){
        sprayReader.downSpeed();
    });
        
    $('#start').click(function() {
        sprayReader.start(); 
        event.preventDefault();
        $("#start").hide();
        $("#pause").show();
    });
    
    $('#resume').click(function(){
        sprayReader.resume(); 
        event.preventDefault();
        $('#pause').show();
        $('#resume').hide();
    });
    
    $('#pause').click(function() {
        sprayReader.pause(); 
        event.preventDefault();
        $("#pause").hide();
        $("#resume").show();
    });
    
    $('#stop').click(function() {
        sprayReader.stop(); 
        event.preventDefault();
        $('#pause').hide();
        $('#resume').hide();
        $('#start').show();
    });

    SprayReader.prototype.upSpeed = function(){
        sprayReader.pause();
        wpm = $("#speed").text();
        wpm = parseInt(wpm, 10);
        if (wpm<850) wpm+=50;
        $("#speed").text(wpm);
        sprayReader.setWpm(wpm);
        sprayReader.resume();
    }

    SprayReader.prototype.downSpeed = function(){
        sprayReader.pause();
        wpm = $("#speed").text();
        wpm = parseInt(wpm, 10);
        if (wpm>150) wpm-=50;
        $("#speed").text(wpm);
        sprayReader.setWpm(wpm);
        sprayReader.resume();   
    }
    
    $("#daBack").on('click', function(){
        sprayReader.stop();
        $(".upage-content").hide();
        $("#bookShelf").show();
        $('#pause').hide();
        $('#resume').hide();
        $('#start').show();
    });

    $("#classicReadButton").on('click', function(){
        $("#speedRead").hide();
        $("#classicRead").show();
        sprayReader.stop();
        $('#pause').hide();
        $('#resume').hide();
        $('#start').show();
    });
    
    $("#speedReadButton").on('click', function(){
        $("#speedRead").show();
        $("#classicRead").hide();
    });

    $("#parse").on('click', function(){
        //TODO for the parser, needs to return the author, title, content, and word count which will be asynch posted to the database
    });
});
