$(document).ready(function(){
    $("#page_44_28").hide();
    $("#bookShelf").show();
    var bookshelf = {"book" : [{"author": "Dan Brown", "title": "Angels and Demons", "source": "www.danbrown.com", "wordcount": 2, "text": "dark matter"},
                              {"author": "Dan Brown", "title": "Angels and Demons", "source": "www.danbrown.com", "wordcount": 2, "text": "dark matter"}]};

    $.each(bookshelf.book, function(index, element){
        
        var author = element.author;
        var title = element.title;
        var source = element.source;
        var wordcount = element.wordcount;
        var text = element.text;
        
        var div = $('<li class="widget uib_w_30" data-uib="app_framework/listitem"><a>'+title+'</a><span id=author>'+author+'<span></li>');
        div.css({
           'cursor':'pointer', 
        });
        
        div.on('click', function(){
            $("#page_44_28").show();
            $("#bookShelf").hide();
            
            
            var sprayReader = new SprayReader('#spray_result');

        $(document).ready(function() {
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
        $("#page_44_28").hide();
        $("#bookShelf").show();
    });
});