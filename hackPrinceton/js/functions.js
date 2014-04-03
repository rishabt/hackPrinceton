$(document).ready(function(){
    var sprayReader = new SprayReader('#spray_result');
    $("#instaRead").hide();
    $("#speedRead").hide();
    $("#classicRead").hide();
    $("#newBook").hide();
    $("#parser").hide(); 
    $("#pause").hide();
    $("#resume").hide();
    $('#classicReadButton').hide();
    $('#addNewArticle').hide();
    
    function updateTheLibrary(){
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

        var results = $.getValues("https://api.mongolab.com/api/1/databases/hackdarts/collections/content/?apiKey=P25ikg36IXayIZdHlnpBhhbqcpsblHGz");    
        
        $.each(results, function(index, element){
            var masterShelf = $("<li class ='upage-content'></li>");
            var bookShelf = $("<ul class='list widget uib_w_29' data-uib='app_framework/listview'></ul>");

            if (index == 0){
                var addNewDiv = $('<li data-uib="app_framework/listitem"><a class="icon add">Add Your Own</a></li>');
                addNewDiv.css({
                    'cursor':'pointer', 
                });
                addNewDiv.on('click', function(){
                    $("#library").hide();
                    $("#parser").show();
                });
                bookShelf.prepend(addNewDiv);   
                
                var instaRead = $('<li data-uib="app_framework/listitem"><a>Instant Read (Copy-Paste)</a></li>');
                instaRead.css({
                    'cursor':'pointer', 
                });
                instaRead.on('click', function(){
                    $("#library").hide();
                    $("#instaRead").show();
                });
                
                bookShelf.prepend(addNewDiv);
                bookShelf.prepend(instaRead);
            }
            
            bookShelf.append(librarian(element.books, element.genre));
            masterShelf.append(bookShelf);
            $("#deweyDecimal").append(masterShelf);
        });

        $('#library').hide();

        function librarian(shelf, genre){
            var allBooks = [];

            var genre = $('<li class="divider"></li><li class="genreTag" style="line-height:1em">'+genre.capitalize()+'</li>');

            allBooks.push(genre); 

            function divActions(author, title, source, wordcount, text){
                this.author = author;
                this.title = title;
                this.source = source;
                this.wordcount = wordcount;
                this.text = text;

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

                    $("#classicContent").empty();
                    $("#classicContent").append(text);
                    
                    var wpm = $('#wpm').val();
                    sprayReader.setInput(text);
                    sprayReader.setWpm(wpm);
                    
                    //This is to change the header
                    /* 
                    if (title.length > 21){
                        title = title.substring(0, 20)+'...';
                    }
    
                    $("#headerString").text(title);
                    */
                    
                    $("#speedRead").show();
                    $("#library").hide();
                    $('#classicReadButton').show();
                    $('#addNewArticle').hide();
                });

                return div;
            }

            $.each(shelf, function(index, element){
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
        if(!sprayReader.isRunning){
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
        event.preventDefault();
        
        //$("#headerString").text("QUICK READS");
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
        getWordPosition(sprayReader.realIndex[sprayReader.wordIdx]);
        $("#speedRead").hide();
        $("#classicRead").show();
        sprayReader.pause();
        $('#pause').hide();
        $('#resume').show();
        $('#start').hide();
        window.scrollTo($('#highlight'));
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
    

    $("#copyPaste").on('click', function(){
        var cdTitle = $('#cpTitle').text();
        var cdAuthor = $('#cpAuthor').text();
        var cdGenre = $('#cpGenre').text();
        var cdText = $('#cpText').text();
        //var cdCount = countWords(cdText);
        
        $.ajax({
            //url: "https://api.mongolab.com/api/1/databases/hackdarts/collections/content/?apiKey=P25ikg36IXayIZdHlnpBhhbqcpsblHGz",
            type: "POST",
            data: {textfield : cdTitle, textfield : cdAuthor, textfield : cdGenre, textfield : cdText},
            success: function(data) {
                alert("Sucessfully Added");
                updateTheLibrary();
            }
        });
    }); 
    
    $('#instaReadButton').on('click', function(){
        window.scrollTo(0, 0);

        var text = $('#instaReadText').val();
        alert(text);
        
        $("#classicContent").empty();
        $("#classicContent").append(text);

        var wpm = $('#wpm').val();
        sprayReader.setInput(text); 
        sprayReader.setWpm(wpm);

        //This is to change the header
        /* 
        if (title.length > 21){
        title = title.substring(0, 20)+'...';
        }

        $("#headerString").text(title);
        */

        $("#speedRead").show();
        $("#library").hide();
        $('#classicReadButton').show();
        $('#instaRead').hide();
    });
    
    function countWords(s){
        s = s.replace(/(^\s*)|(\s*$)/gi,"");
        s = s.replace(/[ ]{2,}/gi," ");
        s = s.replace(/\n /,"\n");
        return s.split(' ').length;
    }
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
