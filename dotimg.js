var screenWidth = 0;
var screenHeight = 0;

var iCanvas = 0;
var imgStorage = new Array();
var previewMode = false;
var renderScaling = 1;

var shapeList = new Array();
  shapeList.push("text");
  shapeList.push("rectangle");
  shapeList.push("circle");
  shapeList.push("triangle");

var iPreset = -1;
var isChrome = !!window.chrome && !!window.chrome.webstore;

var imgHeight = 500;
var imgWidth = 500;

var _settings = new Array();

function ImportPresets(presetName){
  if(localStorage.getItem(presetName)){
    var cf = confirm("Load \""+presetName+"\"? All the existing settings will be erased!");

    if(cf == true){
      _settings = JSON.parse(localStorage.getItem(presetName));
      RenderPresets();
    }
  }
}

function ExportPresets(){
  var presetName = prompt("Choose a name for your preset.");

  if(localStorage.getItem(presetName)){
    var cf = confirm("Overwrite \""+presetName+"\" ?");

    if(cf == true)
      localStorage.setItem(presetName, JSON.stringify(_settings));
  }
  else{
    localStorage.setItem(presetName, JSON.stringify(_settings));
  }
}

function LoadPresetList(){
  console.log(localStorage.length);

  sel = document.getElementById('localPresets');
  for(i = 0; i < localStorage.length; i++){
    k = localStorage.key(i);

    opt = document.createElement('option');
      opt.setAttribute('value', k);
      opt.innerHTML = k;

    sel.appendChild(opt);
  }
}

function RenderPresets(){

}

var defaultValues = new Array();
  defaultValues["s"] = 14;
  defaultValues["x"] = 20;
  defaultValues["y"] = 20;
  defaultValues["h"] = 100;
  defaultValues["w"] = 100;


function OptimisedCropping(w, h, maxW, maxH){
  biggest = Math.max(w, h);
  var wh = new Array();

  if(w >= h){
    wh[0] = Math.round(w * (maxW / h));
    wh[1] = maxH;
    wh[2] = Math.round((wh[0] - maxW) / 2);
    wh[3] = 0;
  }
  else{
    wh[0] = maxW;
    wh[1] = Math.round(h * (maxH / w));
    wh[2] = 0;
    wh[3] = Math.round((wh[1] - maxH) / 2);
  }

  return wh;
}

function AbsoluteCropping(w, h, maxW, maxH){
  wh = new Array();

  if((h/maxH) < (w/maxW)){
    wh[0] = maxW;
    wh[1] = Math.round((maxW / w) * h);
  }
  else{
    wh[0] = Math.round((maxH / h) * w);
    wh[1] = maxH;
  }

  return wh;
}

function NewThumbnail(){
  iCanvas++;
  var cDOM = document.createElement("canvas");
  cDOM.setAttribute("id", iCanvas +"c");
  cDOM.setAttribute("class", "thumbnailCanvas");
  cDOM.setAttribute("width", "100");
  cDOM.setAttribute("height", "100");
  document.getElementById("thumbnails").appendChild(cDOM);

  var transparency = new Image();
  transparency.src = 'theme/transparent.png';
  var ctx = document.getElementById(iCanvas +"c").getContext('2d');

  transparency.onload = function(){
      var ptrn = ctx.createPattern(transparency, 'repeat');
      ctx.fillStyle = ptrn;
      ctx.fillRect(0, 0, 100, 100);
  }
}

function NewCanvas(e){
  NewThumbnail();

  var ctx = document.getElementById(iCanvas +"c").getContext('2d');
  var reader = new FileReader();
  reader.onload = function(event){
      var img = new Image();

      img.onload = function(){
        wh = OptimisedCropping(img.width, img.height, 100, 100);
        ctx.drawImage(img, wh[2], wh[3], img.width, img.height, 0, 0, wh[0], wh[1]);
      }
      img.src = event.target.result;

      imgStorage[iCanvas] = img;
  }

  reader.readAsDataURL(e.target.files[0]);
}

function RenderPresetCollection(){
  for(i=0; i<storedCollection.length; i++){
      NewThumbnail();
      var ctx = document.getElementById(iCanvas +"c").getContext('2d');

      img = new Image();
      img.src = "presets/" + storedCollection[i];
      img.onload = function(){
        wh = OptimisedCropping(img.width, img.height, 100, 100);
        ctx.drawImage(img, wh[2], wh[3], img.width, img.height, 0, 0, wh[0], wh[1]);
      }

      imgStorage[iCanvas] = img;
  }
}

function DisplayThumbnail(id){
  previewMode = true;
  id = parseInt(id);
  displayCanvas = document.getElementById("displayCanvas");
  displayCanvas.style.marginTop = "0px"; // reset
  img = imgStorage[id];

  displayCanvas.style.display = "block";
  var ctx = displayCanvas.getContext('2d');

  if(screenHeight < img.height || screenWidth < img.width){
    wh = AbsoluteCropping(img.width, img.height, screenWidth, screenHeight);
    displayCanvas.setAttribute("width", wh[0]);
    displayCanvas.setAttribute("height", wh[1]);
    ctx.drawImage(img, 0, 0, wh[0], wh[1]);

    displayCanvas.style.marginTop = "55px";
  }
  else{
    displayCanvas.setAttribute("width", img.width);
    displayCanvas.setAttribute("height", img.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);

    marginY = (screenHeight - img.height) / 2;
    displayCanvas.style.marginTop = marginY + "px";
  }

  document.getElementById("content").setAttribute("class", "blurredbackground");
}

function SetWindowTitle(val){
  if(val.length < 12)
    wTitle = val;

  else
    wTitle = val[0] + val[1] + val[2] +  val[3]  + val[4] + "(...)" + val[val.length-3] + val[val.length-2] + val[val.length-1];

  document.title = '<' + wTitle + '>.img';
}

function SetScreenSize(){
  screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  screenWidth -= 220;
  screenHeight -= 110;
}

function AddSettings(){
  iPreset++;
  displayPreset = "";
  var closeIPreset = iPreset; // CLOSURE

  _settings[closeIPreset] = {
    shape: shapeList[0],
    x: defaultValues['x'],
    y: defaultValues['x'],
    s: defaultValues['x'],
    h: defaultValues['x'],
    w: defaultValues['x'],
    dx: 0,
    r: 0
  }

  if(iPreset < 10)
    displayPreset = "#0" + closeIPreset;
  else
    displayPreset = "#" + closeIPreset;

  // Head + parameters
  presetWrapper = document.createElement('div');
    presetWrapper.setAttribute('id', closeIPreset+'wp');

  // parameters
  presetParam = document.createElement('div');
    presetParam.setAttribute('id', closeIPreset+'pp');
    presetParam.style.display = "block"; // Bugfix (doubleclick to initiate the visibility toggle)

  // Head
  presetHeader = document.createElement('div');
  shapeSelect = CreateShapeSelect();

  figId = document.createElement('span');
    figId.setAttribute('class', 'figureid');
    figId.innerHTML = displayPreset;

  toggleParam = document.createElement('span');
    toggleParam.setAttribute('class', 'hideshowfigure');
    toggleParam.setAttribute('id', closeIPreset+'tg');
    toggleParam.innerHTML = "[Hide parameters]";

  presetHeader.appendChild(shapeSelect);
  presetHeader.appendChild(figId);
  presetHeader.appendChild(toggleParam);

  presetWrapper.appendChild(presetHeader);
  presetWrapper.appendChild(presetParam);

  document.getElementById('presetscontainer').appendChild(presetWrapper);
  ParamShape(shapeList[0], closeIPreset+'pp');

  document.getElementById(closeIPreset+'tg').onclick = function(){
    TogglePreset(closeIPreset);
  };

  clearer = document.createElement('div');
    clearer.setAttribute('class', 'paramclear');

  document.getElementById('presetscontainer').appendChild(clearer);
}

function CreateShapeSelect(){
  uniqueClass = Date.now() +"shapes";

  shapesEl = document.createElement('select');
    shapesEl.setAttribute('id', iPreset+'ss');
    shapesEl.setAttribute('class', uniqueClass);

  selectContainer = document.createElement('div');
    selectContainer.setAttribute('class', 'select');

  selectArrow = document.createElement('div');
    selectArrow.setAttribute('class', 'select__arrow');

  for(i=0; i < shapeList.length; i++){
    opt = document.createElement('option');
      opt.setAttribute('value', shapeList[i]);
      opt.style.backgroundImage = 'url(theme/' + shapeList[i] +'.png)';
      opt.innerHTML = shapeList[i];

    shapesEl.appendChild(opt);
  }

  selectContainer.appendChild(shapesEl);
  selectContainer.appendChild(selectArrow);

  return selectContainer;
}

function ParamShape(shape, paramId){
  sel = document.getElementById(paramId);
  sel.innerHTML = "";

  h3A = document.createElement('h3');
  h3A.innerHTML = "Fill with...";

  fillSelect = CreateSelectFromCollection(paramId);
  fillDiv = document.createElement('div');
  fillDiv.setAttribute('class', 'filloptions');
  fillDiv.appendChild(h3A);
  fillDiv.appendChild(fillSelect);

  sel.appendChild(fillDiv);

  var labels = new Array();
  labels["x"] = "Left";
  labels["y"] = "Top";

  switch(shape){
    case "rectangle":
    labels["w"] = "Width";
    labels["h"] = "Height";
    break;

    case "circle":
    labels["w"] = "Radius";
    break;

    case "triangle":
    labels["w"] = "Base";
    labels["h"] = "Height";
    labels["dx"] = "Peak";
    labels["r"] = "Rotation";
    break;

    case "text":
    labels["s"] = "Font Size";
    break;
  }

  elDiv = document.createElement('div');
  elDiv.setAttribute('class', 'groupedlabel');
  h3B = document.createElement('h3');
  h3B.innerHTML = "Shape parameters";
  elDiv.appendChild(h3B);

  paramI = parseInt(paramId);

  for(var k in labels){
    elInput = document.createElement("input");
    elInput.setAttribute("id", paramId+k);
    elInput.setAttribute("class", "nbinput");
    elInput.setAttribute("type", "number");

    if(typeof _settings[paramI] !== 'undefined')
      elInput.setAttribute('value', _settings[paramI][k]);

    else if(typeof defaultValues[k] !== 'undefined')
      elInput.setAttribute('value', defaultValues[k]);
    else
      elInput.setAttribute('value', '0');


    labEl = document.createElement("label");
    labEl.setAttribute("for", paramId+k);
    labEl.innerHTML = labels[k];

    elDiv.appendChild(labEl);
    elDiv.appendChild(elInput);
    sel.appendChild(elDiv);
  }
}

function CreateSelectFromCollection(paramId){
  selEl = document.createElement('select');
  selEl.setAttribute('id', paramId+'col');

  selContainer = document.createElement('div');
  selContainer.setAttribute('class', 'select');

  selArrow =  document.createElement('div');
  selArrow.setAttribute('class', 'select__arrow');

  browseOpt = document.createElement('option');
  browseOpt.setAttribute('disabled', 'disabled');
  browseOpt.setAttribute('selected', 'selected');
  browseOpt.innerHTML = "Browse";
  selEl.appendChild(browseOpt);

  len = imgStorage.length;

  for(i=1; i < len; i++){
    bg = document.getElementById(i+'c').toDataURL();

    opt = document.createElement("option");
    opt.setAttribute('value', i+'c');
    opt.setAttribute('class', 'collectoption');
    opt.innerHTML = i;
    opt.style.backgroundImage = 'url(' + bg + ')';
    selEl.appendChild(opt);
  }

  selContainer.appendChild(selEl);
  selContainer.appendChild(selArrow);
  return selContainer;
}

function TogglePreset(id){
  elState = document.getElementById(id+'pp');
  if(elState.style.display == "block"){
    elState.style.display = "none";
    document.getElementById(id+'tg').innerHTML = "[Show parameters]";
    document.getElementById(id+'ss').disabled = true;
  }
  else{
    elState.style.display = "block";
    document.getElementById(id+'tg').innerHTML = "[Hide parameters]";
    document.getElementById(id+'ss').disabled = false;
  }
}

function SetSelectHead(val){
  bg = document.getElementById(val).toDataURL();
  document.getElementById("_test").style.backgroundImage = 'url(' + bg + ')';
}


window.addEventListener('load', function(){
  SetWindowTitle("");
  document.getElementById('_xpic').addEventListener('change', NewCanvas, false);
  SetScreenSize();
  RenderPresetCollection();
  LoadPresetList();

  if(isChrome)
    alert("This tool is optimized for Firefox, expect odd behavior on Chrome. You've been warned!\n Check out the github page for more info...");
});

window.addEventListener('resize', function(){
  SetScreenSize();
  console.log('resized')
});

document.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
    DisplayThumbnail(event.target.id);
  }
  else{
    if(previewMode == true){
      document.getElementById("content").removeAttribute("class", "blurredbackground");
      document.getElementById("displayCanvas").style.display = "none";
      previewMode = false;
    }
  }
});

document.addEventListener('keydown', function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;

    if(charCode == 27 && previewMode == true){
      document.getElementById("content").removeAttribute("class", "blurredbackground");
      document.getElementById("displayCanvas").style.display = "none";
      previewMode = false;
    }
});

document.addEventListener('change', function(event) {
  if (event.target.tagName.toLowerCase() === 'input' && event.target.type.toLowerCase() === 'number') {
    var shapeId = parseInt(event.target.id);
    var shapeParam = event.target.id;
      shapeParam = shapeParam.replace(/\d+pp/g, '');
    var paramValue = event.target.value;

    _settings[shapeId][shapeParam] = parseInt(paramValue);
    console.log(JSON.stringify(_settings));
  }
  else if (event.target.tagName.toLowerCase() === 'select' && event.target.id.match(/\d+ss/g)) {
    var shapeId = parseInt(event.target.id);

    ParamShape(event.target.value, shapeId+'pp');
    _settings[shapeId].shape = event.target.value;
  }
});

/*
  ----------------------
    CONSOLE Functions :
  ----------------------
*/

function FlushPresets(){
  localStorage.clear();
}

function FlushCollection(){

}

function f(arg){
  switch(arg){
    case "s":
    FlushSettings();
    break;

    case "p":
    FlushPresets();
    break;

    case "c":
    FlushCollection();
    break;

    default:
    console.log('Flush function.\n f(p) to erase saved presets\n f(c) to empty your collection');
  }
}
