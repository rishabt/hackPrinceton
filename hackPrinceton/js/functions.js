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
        
        var div = $('<li class="widget uib_w_30" data-uib="app_framework/listitem"><a>'+title+'</a></li>');
        div.css({
           'cursor':'pointer', 
        });
        
        div.on('click', function(){
            $("#page_44_28").show();
            $("#bookShelf").hide();
        });

        $("#testShelf").append(div);  
    });
});