$(document).ready(function(){
    $("#speedRead").hide();
    $("#classicRead").hide();
    $("#newBook").hide();
    $("#parser").hide(); 
    $("#pause").hide();
    $("#resume").hide();
    $('#classicReadButton').hide();
    $('#addNewArticle').hide();

    function updateTheLibrary(){
        var sprayReader = new SprayReader('#spray_result');

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

            console.log(JSON.stringify(element));

            bookShelf.append(librarian(element));
            masterShelf.append(bookShelf);

            $("#deweyDecimal").append(masterShelf);
        });

        $('#library').hide();

        function librarian(shelf){
            book = shelf.books;
            var allBooks = [];

            var genre = $('<li class="divider"></li><li class="genreTag" style="line-height:.5em">'+shelf.genre.capitalize()+'</li>');

            allBooks.push(genre); 

            function divActions(author, title, source, wordcount, text){
                this.author = author;
                this.title = title;
                this.source = source;
                this.wordcount = wordcount;
                this.text = text;
                this.running = false;
                this.isPaused = false;

                if (parseInt(wordcount)>0){
                    var readTime = (Math.ceil( (wordcount / 400) * 10 ) / 10).toFixed(1);
                }
                else{
                    var readTime = 'N/A'   
                }

                var div = $('<li class="divider"></li><li data-uib="app_framework/listitem"><a>'+title+'</a><span id="author">'+author+'<span>'
                           +'<span id="readTime" style="font-size:.5em; position:absolute; text-align:right; right:30px; bottom:25px">'+ readTime +'min @400 WPM</li>');

                div.css({
                   'cursor':'pointer', 
                });

                div.on('click', function(){
                    window.scrollTo(0, 0);
                    $("#speedRead").show();
                    $("#library").hide();

                    var inputText = text;
                    var wpm = $('#wpm').val();
                    $("#classicContent").empty();
                    $("#classicContent").append(inputText);
                    sprayReader.setInput(inputText);
                    sprayReader.setWpm(wpm);
                    $('#classicReadButton').show();
                    $('#addNewArticle').hide();
                });

                return div;
            }

            $.each(book, function(index, element){
                allBooks.push(new divActions(element.author, element.title, element.source, element.wordcount, element.text));
            });

            return allBooks;
        }
    }
    
    updateTheLibrary();
    
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
        window.scrollTo(0, 0);
        sprayReader.stop();
        $(".upage-content").hide();
        $('#pause').hide();
        $('#resume').hide();
        $('#start').show();
        $("#library").show();
        $("#library").children().children().show();
        $('#classicReadButton').hide();
        $('#addNewArticle').show();
    });

    $("#classicReadButton").on('click', function(){
        $("#speedRead").hide();
        $("#classicRead").show();
        sprayReader.pause();
        $('#pause').hide();
        $('#resume').show();
        $('#start').hide();
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
        $('#enter').hide();
        $('#addNewArticle').show();
    });
    
    $("#parses").on('click', function(){
        var theURL = $('#urlEnter').text();
        
        $.ajax({
            url: "https://api.digitalocean.com/droplets/1378265/HackDarts/?client_id=25298a7e85044ac5e697843930d18b01&api_key=ae56ab09f53a962b23465d3b6b227f79&/home/charlie/alchemyapi_python/parser.py ",
            type: "POST",
            data: {textfield : theURL},
            success: function(data) {
                alert("Sucessfully Added");
                updateTheLibrary();
            }
        });
    });
    
    $('#addNewDiv').on('click', function(){
        $("#library").hide();
        $("#parser").show();
    });
    
    /*
    $("#copyPaste").on('click', function(){
        var cdTitle = $('#cpTitle').text();
        var cdAuthor = $('#cpAuthor').text();
        var cdText = $('#cpText').text();
    }); */
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
