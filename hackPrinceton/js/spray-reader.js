

var SprayReader = function(container){
  this.container = $(container);
};

SprayReader.prototype = {
  wpm: null,
  msPerWord: null,
  wordIdx: null,
  input: null,
  words: null,
  isRunning: false,
    realIndex: null,
  timers: [],
  
  setInput: function(theInput) {
        $('#theProgress').css({
            'background' : '#123456',
            'width' : '0',
        });
    var realIndex = [];
      
    input = theInput;
    
    // Split on spaces
    var allWords = input.split(/\s+/);
    
    var word = '';
    var result = '';
    
    // Preprocess words
    var tmpWords = allWords.slice(0); // copy Array
    var t = 0;

      var j = 0;
    for (var i=0; i<allWords.length; i++){
        startT = t;
      if(allWords[i].indexOf('.') != -1){
        tmpWords[t] = allWords[i].replace('.', '');
      }

      // Double up on long words and words with commas.
      if((allWords[i].indexOf(',') != -1 || allWords[i].indexOf(':') != -1 || allWords[i].indexOf('-') != -1 || allWords[i].indexOf('(') != -1|| allWords[i].length > 8) && allWords[i].indexOf('.') == -1){
        tmpWords.splice(t+1, 0, allWords[i]);
        tmpWords.splice(t+1, 0, allWords[i]);
        t++;
        t++;
      }

      // Add an additional space after punctuation.
      if(allWords[i].indexOf('.') != -1 || allWords[i].indexOf('!') != -1 || allWords[i].indexOf('?') != -1 || allWords[i].indexOf(':') != -1 || allWords[i].indexOf(';') != -1|| allWords[i].indexOf(')') != -1){
        tmpWords.splice(t+1, 0, ".");
        tmpWords.splice(t+1, 0, ".");
        tmpWords.splice(t+1, 0, ".");
        t++;
        t++;
        t++;
      }

      t++;
        j++;
        for(var k=startT; k<t; k++){
            realIndex.push(j);
        }
    }
      this.realIndex = realIndex.slice(0);
    this.words = tmpWords.slice(0);
    this.wordIdx = 0;
  },
  
  setWpm: function(wpm) {
    wpm = $("#speed").text();
    this.wpm = parseInt(wpm, 10);
    this.msPerWord = 60000/wpm;
  },
    
  start: function() {
      this.timers = [];
      this.wordIdx = 0;
      this.isRunning = true;
    
    thisObj = this;
    
    this.resume();
  },
  
  pause: function() {
    this.isRunning = false;
    for(var i = 0; i < this.timers.length; i++) {
      clearTimeout(this.timers[i]);
    }
  },
    
    stop: function(){
        //TODO TRY TO CLEAR THE RESULT ON STOP
        this.isRunning = false;
        for(var i = 0; i < this.timers.length; i++) {
          clearTimeout(this.timers[i]);
        }
        this.timers.length = 0;
        this.wordIdx = 0;
    },

  resume: function() {
      origInd = this.wordIdx;
    for(var i = 0; i < this.timers.length-origInd; i++) {
        this.timer[i] = this.timer[origInd+i];
    }
      this.timers.push(setInterval(function() {
      thisObj.displayWordAndIncrement();
    }, this.msPerWord));
      this.isRunning = true;
  },
     
    progressUpdate : function(){
        var percent = (Math.ceil( (100*this.wordIdx / this.words.length) * 10 ) / 10).toFixed(2);
        console.log($('#progressBar').width());
        $('#theProgress').width(percent+'%');
    },
    
  displayWordAndIncrement: function() {
    var pivotedWord = pivot(this.words[this.wordIdx]);
    this.progressUpdate();
    this.container.html(pivotedWord);
    
    this.wordIdx++;
    if (thisObj.wordIdx >= thisObj.words.length) {
      this.wordIdx = 0;
      this.stop();
        $('#theProgress').css({
            'background' : '#00FF00',
            'width' : '100%',
        });
    }
  }
};

// Find the red-character of the current word.
function pivot(word){
    var length = word.length;

    // Longer words are "right-weighted" for easier readability.
    if(length<6){

        var bit = 1;
        while(word.length < 22){
            if(bit > 0){
                word = word + '.';
            }
            else{
                word = '.' + word;
            }
            bit = bit * -1;
        }

        var start = '';
        var end = '';
        if((length % 2) === 0){
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        } else{
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        }

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    }

    else{

        var tail = 22 - (word.length + 7);
        word = '.......' + word + ('.'.repeat(tail));

        var start = word.slice(0, word.length/2);
        var end = word.slice(word.length/2, word.length);

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";

    }

    result = result.replace(/\./g, "<span class='invisible'>.</span>");

    return result;
}

// Let strings repeat themselves,
// because JavaScript isn't as awesome as Python.
String.prototype.repeat = function( num ){
    return new Array( num + 1 ).join( this );
}