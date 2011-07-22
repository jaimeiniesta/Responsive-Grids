var ResponsiveGrids = (function(){

        var AUTHOR = "Sergi Meseguer @zigotica";
        var URL = "http://zigotica.github.com/Responsive-Grids/";

        var css = document.createElement("link") 
        css.href = "grids.css"; 
        css.rel = "stylesheet"; 
        css.type = "text/css"; 
        document.body.appendChild(css);

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
})()