$(document).ready(function(){
    $("#page_44_28").hide();
    $("#bookShelf").show();
    $("#newBook").hide();  

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
    
    $.each(results[0].book, function(index, element){
        var author = element.author;
        var title = element.title;
        var source = element.source;
        var wordcount = element.wordcount;
        var text = element.text;
        
        
        var div = $('<li class="divider"></li><li data-uib="app_framework/listitem"><a>'+title+'</a><span id=author>'+author+'<span></li>');
        div.css({
           'cursor':'pointer', 
        });

        div.on('click', function(){
            $("#page_44_28").show();
            $("#bookShelf").hide();
            
            var sprayReader = new SprayReader('#spray_result');
            
        $(document).ready(function() {
            
                $("#upSpeed").on("click", function(){
                    sprayReader.pause();
                       wpm = $("#speed").text();
                       wpm = parseInt(wpm, 10);
                       if (wpm<850) wpm+=50;
                       $("#speed").text(wpm);
                        sprayReader.setWpm(wpm);
                    sprayReader.resume();
                   });

                    $("#downSpeed").on("click", function(){
                        sprayReader.pause();
                       wpm = $("#speed").text();
                       wpm = parseInt(wpm, 10);
                        if (wpm>150) wpm-=50;
                        $("#speed").text(wpm);
                        sprayReader.setWpm(wpm);
                        sprayReader.resume();
                   });
            
            running = false;
            isPaused = false;
          $('#start').click(function(event) {
              if(!running && !isPaused){
                running=true;
                isPaused=false;
                var inputText = text;
                var wpm = $('#wpm').val();
    
                sprayReader.setInput(inputText);
                sprayReader.setWpm(wpm);
                sprayReader.start(); 

                event.preventDefault();
                  $("#start").text("");
                  $("#start").text("pause");
              }
              else if (isPaused && !running){//Resume function
                    running = true;
                  isPaused = false;
                  sprayReader.resume();
                    event.preventDefault();
                $("#start").text("");
                  $("#start").text("pause");
              }
              else if (!isPaused && running){
                running = false; 
                isPaused = true;
                sprayReader.pause();
                event.preventDefault();
                  $("#start").text(""); 
                  $("#start").text("start");
              }
              else{
                 running = false;
                  isPaused = true;
              }
          });

          $('#stop').click(function(event) {
                running = false;
                isPaused = false;
                sprayReader.stop();
                event.preventDefault();
                $("#start").text("");
                $("#start").text("start");
          });
        });
        });

        $("#testShelf").append(div);  
    });
    $("#daBack").on('click', function(){
        $(".upage-content").hide();
        $("#bookShelf").show();
    });
});
