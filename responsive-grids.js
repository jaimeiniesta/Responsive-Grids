var ResponsiveGrids = (function(){
	
	var AUTHOR = "Sergi Meseguer @zigotica";
	var URL = "http://zigotica.github.com/Responsive-Grids/";
	
	
	var grids = document.createElement("div");
	grids.id = "grid";

	var gv = document.createElement("div");
	gv.className = "vert-container";

	for (var i = 0; i < 50; i++) {
		var gvi = document.createElement("div");
		if(i==0) gvi.className = "vert first-line cols"+parseInt(i+1);
		else gvi.className = "vert cols"+parseInt(i+1);
	
		gv.appendChild(gvi);
	}
	grids.appendChild(gv);

	var gh = document.createElement("div");
	gh.className = "horiz-container";

	for (var i = 0; i < 200; i++) {
		var ghi = document.createElement("div");
		if(i==0) ghi.className = "horiz first-line";
		else ghi.className = "horiz";
	
		gh.appendChild(ghi);		
	}
	grids.appendChild(gh);
		
	document.body.insertBefore(grids, document.body.childNodes[0]);
})()