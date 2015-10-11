var global_consts = {
	runningFlag: false,
	speedRatio:1,
    generationID:0,
    curCellNum:1000,
    wallNum:0,
    mapWidth:50,
	mapHeight:50
}
var map;
var dataMap;
var mainLoop;

function initMap(){
	for(var i = 0; i < global_consts.mapHeight; i++){
		for (var j = 0; j < global_consts.mapWidth; j++) {
			map[i][j] = "dead";
			dataMap[i][j] = 0;
		}
	}
}

function createMap(mmapWidth,mmapHeight){
	global_consts.mapWidth = mmapWidth;
	global_consts.mapHeight = mmapHeight;
	map = new Array(mmapHeight);
	dataMap = new Array(mmapHeight);
	for(var i = 0; i < mmapHeight; i++){
		map[i] = new Array(mmapWidth);
		dataMap[i] = new Array(mmapWidth);
	}
}

function generateLifeRan(cellNum){
	var totalNum = global_consts.mapHeight*global_consts.mapWidth-global_consts.wallNum;
	if(cellNum > totalNum){
		alert("细胞个数太多");
	}
	else{
		var counter = 0;
		while(true){
			var temp = Math.floor(Math.random()*totalNum);
			var row = Math.floor(temp/global_consts.mapWidth);
			var col = temp%global_consts.mapWidth;
			if(map[row][col] == "dead"){
				map[row][col] = "alive";
				counter++;
			}
			if (counter >= cellNum) break;
		}
	}	
}

function refreshCanvas(){
	var table = document.getElementById("maintable");
	var context = table.getContext("2d");
	context.clearRect(0,0,global_consts.mapWidth*10,global_consts.mapHeight*10);
	for(var i = 0; i < global_consts.mapHeight; i++){
		for(var j = 0; j < global_consts.mapWidth; j++){
			if (map[i][j] == "alive") {
				context.fillStyle = "#FF0000";
			}
			else if (map[i][j] == "wall") {
				context.fillStyle = "#000000";
			}
			else{
				context.fillStyle = "#CDCDCD";
			}
			context.beginPath();
			context.arc(j*10+5,i*10+5,4,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
	}
}

function collectData(map,datamap,row,col){
	dataMap[row][col] = 0;
	for(var i = -2; i <= 2; i++){
		if(row+i < 0 || row+i >= global_consts.mapHeight || i==0)
			continue;
		else
			if(map[row+i][col] == "alive") dataMap[row][col]++;
	}
	for(var j = -2; j <= 2; j++){
			if(col+j < 0 || col+j >= global_consts.mapWidth || j==0) continue;
			else
				if(map[row][col+j] == "alive") dataMap[row][col]++;
	}
}

function willDieOrLive(map,dataMap,row,col){
	switch(dataMap[row][col]){
		default:
			map[row][col] = "dead";
			break;
		case 2:
			map[row][col] = map[row][col];
			break;
		case 3:
			map[row][col] = "alive";
			break;
	}
}

function newGeneration(map,dataMap){
	for(var i = 0; i < global_consts.mapHeight; i++){
		for(var j = 0; j < global_consts.mapWidth; j++){
			if(map[i][j] != "wall")
				collectData(map,dataMap,i,j);
		}
	}

	global_consts.curCellNum = 0;
	for(var i = 0; i < global_consts.mapHeight; i++){
		for(var j = 0; j < global_consts.mapWidth; j++){
			if(map[i][j] != "wall")
				willDieOrLive(map,dataMap,i,j);
			if(map[i][j] == "alive") global_consts.curCellNum++;
		}
	}
}

function loop(){
	newGeneration(map,dataMap);
	global_consts.generationID++;
	document.getElementById("generationID").innerHTML = "当前世代数:"+global_consts.generationID;
	document.getElementById("curCellNum").innerHTML = "当前活细胞数:"+global_consts.curCellNum;
	refreshCanvas();
	mainLoop = setTimeout('loop()',100/global_consts.speedRatio);
}

function pause(){
	clearTimeout(mainLoop);
}

function getMousePos(canvas, evt) { 
   var rect = canvas.getBoundingClientRect(); 
   return { 
     x: Math.floor(evt.clientX - rect.left * (canvas.width / rect.width)),
     y: Math.floor(evt.clientY - rect.top * (canvas.height / rect.height))
   }
 }


function main(){
	createMap(global_consts.mapWidth,global_consts.mapHeight);
	initMap();
	generateLifeRan(global_consts.curCellNum);
	refreshCanvas();
}

var btnNext = document.getElementById("nextGeneration");
btnNext.addEventListener("click",function(){
	newGeneration(map,datamap);
	refreshCanvas();
});

var btnStart = document.getElementById("startGame");
btnStart.addEventListener("click",function(){
	if(!global_consts.runningFlag){
		loop();
		global_consts.runningFlag = true;
	}
});

var btnPause = document.getElementById("pauseGame");
btnPause.addEventListener("click",function(){
	if(global_consts.runningFlag){
		pause();
		global_consts.runningFlag = false;
	}
});

var btnReset = document.getElementById("resetGame");
btnReset.addEventListener("click",function(){
	if(global_consts.runningFlag){
		pause();
		global_consts.runningFlag = false;
	}
	global_consts.curCellNum = document.getElementById("originCellNum").value;
	if (!isNaN(global_consts.curCellNum)) {
		global_consts.generationID = 0;
		document.getElementById("generationID").innerHTML = "当前世代数:0";
		document.getElementById("curCellNum").innerHTML = "当前活细胞数:"+global_consts.curCellNum;
		initMap();
		generateLifeRan(global_consts.curCellNum);
		refreshCanvas();
	}
	else{
		alert("非法输入");
		
	}
	
});

var btnChange = document.getElementById("changeSpeed");
btnChange.addEventListener("click",function(){
	var tempSpeedRatio = document.getElementById("speedRatio").value;
	if (isNaN(tempSpeedRatio) || tempSpeedRatio < 0.1 || tempSpeedRatio > 10) {
		alert("变速系数须在0.1~10之间");
	}
	else{
		global_consts.speedRatio = tempSpeedRatio;
	}
});

var btnResetTable = document.getElementById("changeTable");
btnResetTable.addEventListener("click",function(){
	if(global_consts.runningFlag){
		pause();
		global_consts.runningFlag = false;
	};
	global_consts.generationID = 0;
	document.getElementById("generationID").innerHTML = "当前世代数:0";
	document.getElementById("curCellNum").innerHTML = "当前活细胞数:0";
	mapWidth = document.getElementById("gridWidth").value;
	mapHeight = document.getElementById("gridHeight").value;
	createMap(mapWidth,mapHeight);
	initMap();
	var mainCanvas = document.getElementById("maintable");
	mainCanvas.width = mapWidth*10;
	mainCanvas.height = mapHeight*10;
	refreshCanvas();
});

var mainCanvas = document.getElementById("maintable");
mainCanvas.addEventListener("click", function (evt) { 
  var mousePos = getMousePos(mainCanvas, evt); 
  var col = Math.floor(mousePos.x/10);
  var row = Math.floor(mousePos.y/10);
  if(map[row][col] != "wall")
  	map[row][col] = "wall";
  else
  	map[row][col] = "dead";
  refreshCanvas();
}, false);

main();