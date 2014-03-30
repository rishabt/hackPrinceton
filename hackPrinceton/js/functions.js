$(document).ready(function(){
    var sprayReader = new SprayReader('#spray_result');
    
    $("#speedRead").hide();
    $("#classicRead").hide();
    $("#newBook").hide();
    $("#parser").hide();
    $("#pause").hide();
    $("#resume").hide();
    
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
    
    var results = $.getValues("https://api.mongolab.com/api/1/databases/hackdarts/collections/bookshelf/?apiKey=P25ikg36IXayIZdHlnpBhhbqcpsblHGz");

    $.each(results[0].bookShelf, function(index, element){
        var masterShelf = $("<li class ='upage-content'></li>");
        var bookShelf = $("<ul class='list widget uib_w_29' data-uib='app_framework/listview'></ul>");
        bookShelf.append(librarian(element.books));
        masterShelf.append(bookShelf);
        $("#deweyDecimal").append(masterShelf);
    });
    
    $('#library').hide();
    
    function librarian(book){
        var allBooks = [];
        
        var firstDiv = $('<li class="divider"></li><li data-uib="app_framework/listitem"><a class="icon add">Add Your Own</a></li>');
        firstDiv.css({
           'cursor':'pointer', 
        });

        firstDiv.on('click', function(){
            $("#library").hide();
            $("#parser").show();
        });

        allBooks.push(firstDiv); 

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
                $("#library").hide();

                var inputText = text;
                var wpm = $('#wpm').val();
                $("#classicContent").append(inputText);
                sprayReader.setInput(inputText);
                sprayReader.setWpm(wpm);
            });

            return div;
        }
        
        $.each(book, function(index, element){
            allBooks.push(new divActions(element.author, element.title, element.source, element.wordcount, element.text));
        });
            
        return allBooks;
    }
               
    alert($('#library')[0].outerHTML);
    
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

    $('#rewind').click(function() {
        sprayReader.rewind();
    });
    
    SprayReader.prototype.rewind = function(){
        if (sprayReader.wordIdx < 40){
            sprayReader.wordIdx = 0;   
            sprayReader.stop();
            event.preventDefault();
            sprayReader.start();
        }
        else{
            sprayReader.pause();
            event.preventDefault();
            sprayReader.wordIdx = sprayReader.wordIdx - 40;
            sprayReader.resume();   
        }
    }
    
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
        $('#pause').hide();
        $('#resume').hide();
        $('#start').show();
        $("#library").show();
        $("#library").children().children().show();
        alert($('#library')[0].outerHTML);
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
        $.ajax({
            type: "POST",
            data: JSON.stringify( {"diddly":"doodly"} ),
            contentType: "application/json"
        }).done(function( msg ) {
            console.log(msg);
        });
    });
    
    $('#enter').on('click', function(){
        $('#homePage').hide();
        $('#library').show();
    });
    
    /*
    $("#copyPaste").on('click', function(){
        
    });*/
});
