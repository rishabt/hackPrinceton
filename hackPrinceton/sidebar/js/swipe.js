(function($) {
    //hook up swiping
    $(function()
    {

        function dquote(str)
        {
            return str.replace(/'/g, "\"");
        }

        function clamp(x, min_v, max_v)
        {
            return Math.min(Math.max(x, min_v), max_v);
        }

        function highest_z(node_collection)
        {
            var max = -1, result = node_collection.length ? $(node_collection.get(0)) : $();
            node_collection.each(function(){ var z = parseInt($(this).css('z-index')); if(z > max){ max = z; result = $(this); }});
            return result;
        }

        jQuery.event.special.swipe.settings.threshold = .1; //default is .4, but for the whole page area smaller seems better

        var arg_array = [["swipeleft",  "leftbar",  "left",   "rightbar"],
                         ["swiperight", "rightbar", "right",  "leftbar"],
                         ["swipeup",    "topbar",   "top",    "botbar"],
                         ["swipedown",  "botbar",   "bottom", "topbar"]];
        arg_array.map(function(args)
        {
            $(".upage-content").bind(args[0], function(evt)
            {
                //if there is an open sidebar/crossbar, close it.
                var open_query = $(".swipe."+args[1]).not(".reveal").filter(function(){ return parseInt($(this).css(args[2])) == 0; });
                if(open_query.length > 0){ uib_sb.close_sidebar(open_query); }
                else //otherwise, open one
                {
                    var bestbar = highest_z($(".swipe."+args[3]).filter(function(){return $(this).css("visibility") == "visible";}).not(".reveal"));
                    uib_sb.open_sidebar(bestbar);
                }
                //clear any inadvertent text selection.
                window.getSelection().removeAllRanges();
            });
        });
        $(".upage-content").bind("movestart", function(evt){ window.getSelection().removeAllRanges();});




        $(".swipe").bind("move", function(evt)
        {
            var domNode_query = $(this);
            var arg_list = uib_sb.get_dispatch_arg_list(domNode_query);
            var prop = (arg_list[1] == "left" || arg_list[1] == "right") ? "deltaX" : "deltaY";
            var delta_v = evt[prop];
            if(arg_list[1] == "right" || arg_list[1] == "bottom"){ delta_v = -delta_v;}
            var anim = JSON.parse(dquote(domNode_query.attr("data-anim")));
            var min_v = -anim.v, max_v = 0;
            var target_v = parseInt(domNode_query.css(arg_list[1])) + delta_v;
            target_v = clamp(target_v, min_v, max_v);

            anim.dur = 10;
            uib_sb.move_sidebar(domNode_query, anim, target_v, null, arg_list[1], arg_list[2], arg_list[3], arg_list[4]);
            //clear any inadvertent text selection.
            window.getSelection().removeAllRanges();
        })
        .bind("moveend", function(evt)
        {
            var domNode_query = $(this);
            var arg_list = uib_sb.get_dispatch_arg_list(domNode_query);
            var anim = JSON.parse(dquote(domNode_query.attr("data-anim")));
            var prop = (arg_list[1] == "left" || arg_list[1] == "right") ? "velocityX" : "velocityY";
            var min_v = -anim.v, max_v = 0;
            var cur_pos = parseInt(domNode_query.css(arg_list[1]));
            var target_v = (evt[prop] < 0) ? min_v : max_v;
            if(arg_list[1] == "right" || arg_list[1] == "bottom"){target_v = (evt[prop] > 0) ? min_v : max_v;}

            anim.dur = 100;
            uib_sb.move_sidebar(domNode_query, anim, target_v, null, arg_list[1], arg_list[2], arg_list[3], arg_list[4]);
            //clear any inadvertent text selection.
            window.getSelection().removeAllRanges();
        });

    });
})(window.jQuery);