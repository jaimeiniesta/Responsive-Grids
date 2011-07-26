var ResponsiveGrids = (function(){
  // private stuff
  var CREDITS = {
    AUTHOR : "Sergi Meseguer @zigotica", 
    URL : "http://zigotica.github.com/Responsive-Grids/"
  };

  var bodyW = '';
  var bodyWunit = '';
  var baseline = '';
  var baselineunit = '';
  var queries = [];
  var gridsMediaCSS = '';

  var bind = function (elm, evt, fn, useCapture){
    if (elm.addEventListener){
      elm.addEventListener(evt, fn, useCapture);
      return true;
    } else if (elm.attachEvent){
      var r = elm.attachEvent("on"+evt, fn);
      return r;
    }
  };
  
  var unbind = function (elm, evt, fn, useCapture){
    if (elm.removeEventListener){
      elm.removeEventListener(evt, fn, useCapture);
      return true;
    } else if (elm.detachEvent){
      var r = elm.detachEvent("on"+evt, fn);
      return r;
    }
  };

  var listenFormFields = function(){
    // TODO: build form fields according to mediaqueries
    // if no mediaqueries, show one form and allow adding more (one per expected mediaquery)
    var inputs = document.getElementById('responsiveform').getElementsByTagName('input');
    var inputsL = inputs.length;
    // console.log(inputs); 
    for (var i = 0; i < inputsL; i++) {
      bind(inputs[i], 'keyup', updateSystem, true);
    }
  };
  
  var updateSystem = function(e){
    if (!e) var e = window.event;
    var target;
    if (e.target) target = e.target;
    else if (e.srcElement) target = e.srcElement;
    if (target.nodeType == 3) target = target.parentNode; // Safari bug
    
    writeToCSS(e.target.value);
  };
  
  var writeToCSS = function(txt){
    // TODO: instead of updating a div content, we will create a new stylesheet
    var systemInfo = document.getElementById('systemInfo');
    systemInfo.innerHTML += txt;
  };
  
  var parseCSS = function(){
    var wRE = /[^min-|^max-]width\D+([0-9.]*)+([px|em|%]*)/;
    var blRE = /line-height\D+([0-9.]*)+([px|em|%]*)/;
    var sty = document.styleSheets;
    var styL = sty.length;
    for (var i = 0; i < styL; i++) {
      // console.log(""); console.log("about to read stylesheet " + i);
      var rules = sty[i].cssRules;
      var rulesL = rules.length;
      for (var j = 0; j < rulesL; j++) {
        if(rules[j].media) {          
          if(rules[j].media.mediaText.indexOf('screen') >= 0) {
            var mediaText =  rules[j].media.mediaText;
            // console.log(""); console.log("main rule " + j + ": " + mediaText);
            var mediaRules = rules[j].cssRules;
            var mediaRulesL = mediaRules.length;
            for (var k = 0; k < mediaRulesL; k++) {
              var w = "";
              // console.log("inner rule " + k + ":");
              if(mediaRules[k].selectorText.indexOf("body") >= 0) {
                var rule =  mediaRules[k].cssText;
                var w = (wRE.exec(rule))? wRE.exec(rule)[1] : '';
                var wunit = (wRE.exec(rule))? wRE.exec(rule)[2] : '';
                var bl = (blRE.exec(rule))? blRE.exec(rule)[1] : '';
                var blunit = (blRE.exec(rule))? blRE.exec(rule)[2] : '';
                
                console.log(mediaRules[k].cssText);
                console.log(" extracted w: " + w+ " extracted wunit: " + wunit);
                console.log(" extracted bl: " + bl+ " extracted blunit: " + blunit);
                break;
              }
            }
            queries.push([mediaText, w, wunit, bl, blunit]);
          }
        }
        else if(rules[j].selectorText.indexOf('body') >= 0) { // Not @media, look for body width if any and store it
          var rule =  rules[j].cssText;
          bodyW = (wRE.exec(rule))? wRE.exec(rule)[1] : '';
          bodyWunit = (wRE.exec(rule))? wRE.exec(rule)[2] : '';
          baseline = (blRE.exec(rule))? blRE.exec(rule)[1] : '';
          baselineunit = (blRE.exec(rule))? blRE.exec(rule)[2] : '';
        }
      }
    } 
    
    if(queries.length > 0) {
      createGridBaselineDIVs();
      createGridBaselineCSS();
    }
  };
  
  var createGridBaselineCSS = function(){
    // TODO: adapt this building upon the detected mediaqueries above
    var css = document.createElement("link") ;
    css.href = "grids.css"; 
    css.rel = "stylesheet"; 
    css.type = "text/css"; 
    document.body.appendChild(css);
    
    var medias = queries.length;
        
    for (var i = 0; i < medias; i++) {      
      gridsMediaCSS += '@media ' + queries[i][0] + '{\n';
        gridsMediaCSS += '#grid {\n';
          gridsMediaCSS += 'margin-left: -'+ parseInt(queries[i][1])/2 + queries[i][2] +';\n';
          gridsMediaCSS += 'width: '+ queries[i][1] + queries[i][2] +';\n';
        gridsMediaCSS += '}\n';
        gridsMediaCSS += '#grid div.horiz {\n';
        if(queries[i][3] != '') gridsMediaCSS += 'height: '+ parseInt(queries[i][3] - 1) + queries[i][4]+';  /* height+border-bottom = line-height: '+ queries[i][3] + queries[i][4]+'; */\n';
        else gridsMediaCSS += 'height: '+ parseInt(baseline - 1)+baselineunit+';  /* height+border-bottom = line-height: '+ baseline+baselineunit+'; */\n';
        gridsMediaCSS += '}\n';
        gridsMediaCSS += '#grid div.vert {\n';
          gridsMediaCSS += 'background: #ff0;\n';
          gridsMediaCSS += 'margin-right: 10px; /* ((43+10)*6)-10 = 308 content width */\n';
          gridsMediaCSS += 'opacity: 0.05;\n';
          gridsMediaCSS += 'width: 54px;\n';
        gridsMediaCSS += '}\n';
        gridsMediaCSS += '#grid div.vert.first-line {\n';
          gridsMediaCSS += 'margin-left: 5px;\n';
        gridsMediaCSS += '}\n';
        gridsMediaCSS += '#grid div.vert.cols5 { /* this grid uses 5 cols */\n';
          gridsMediaCSS += 'margin-right: 0px;\n';
        gridsMediaCSS += '}\n';
      gridsMediaCSS += '}\n\n\n';
    }
    
    // writeToCSS(gridsMediaCSS);
    document.write('<style>'+gridsMediaCSS+'</style>');
    document.getElementById('grid').style.display = 'block';
  };


  var createGridBaselineDIVs = function(){
    console.log("");
    console.log("this is the body width (if any): " + bodyW);
    console.log("this is the baseline (if any): " + baseline);

    console.log(""); console.log(queries);
    
    var grids = document.createElement("div");
    grids.id = "grid";

    var gv = document.createElement("div");
    gv.className = "vert-container";

    for (var i = 0; i < 50; i++) {
      var gvi = document.createElement("div");
      gvi.className = "vert cols" + parseInt(i+1);
      if(i==0) gvi.className += " first-line";

      gv.appendChild(gvi);
    }
    grids.appendChild(gv);

    var gh = document.createElement("div");
    gh.className = "horiz-container";

    for (var i = 0; i < 200; i++) {
      var ghi = document.createElement("div");
      ghi.className = "horiz"
      if(i==0) ghi.className += " first-line";

      gh.appendChild(ghi);
    }
    grids.appendChild(gh);

    document.body.insertBefore(grids, document.body.childNodes[0]);
  };

  // public stuff
  return {
    init : function(){
      listenFormFields();
      parseCSS();
    }
  }
})()

ResponsiveGrids.init();