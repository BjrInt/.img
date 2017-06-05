let screenWidth = 0;
let screenHeight = 0;

let iCanvas = 0;
let imgStorage = new Array();
let previewMode = false;
let renderScaling = 1;

let shapeList = new Array();
  shapeList.push("text");
  shapeList.push("rectangle");
  shapeList.push("circle");
  //shapeList.push("triangle");

let iPreset = -1;
let isWebkit = 'WebkitAppearance' in document.documentElement.style;

let imgHeight = 500;
let imgWidth = 500;

let _settings = new Array();

let defaultValues = new Array();
  defaultValues["s"] = 14;
  defaultValues["x"] = 20;
  defaultValues["y"] = 20;
  defaultValues["h"] = 100;
  defaultValues["w"] = 100;


function ImportPresets(presetName){
  if(localStorage.getItem(presetName)){
    let cf = confirm("Load \""+presetName+"\"? All the existing settings will be erased!");

    if(cf == true){
      _settings = JSON.parse(localStorage.getItem(presetName));
      console.log(_settings.length);
      RenderPresets();
    }
  }

  SetWindowTitle(presetName);
}

function ExportPresets(){
  let presetName = prompt("Choose a name for your preset.");

  if(localStorage.getItem(presetName)){
    let cf = confirm("Overwrite \""+presetName+"\" ?");

    if(cf == true)
      localStorage.setItem(presetName, JSON.stringify(_settings));
  }
  else{
    localStorage.setItem(presetName, JSON.stringify(_settings));
    LoadPresetList(presetName);
  }

  SetWindowTitle(presetName);
}

function LoadPresetList(){
  sel = document.getElementById('localPresets');

  if(arguments.length > 0){
    opt = document.createElement('option');
    opt.setAttribute('value', arguments[0]);
    opt.innerHTML = arguments[0];

    sel.appendChild(opt);
  }
  else{
    for(i = 0; i < localStorage.length; i++){
      k = localStorage.key(i);

      opt = document.createElement('option');
        opt.setAttribute('value', k);
        opt.innerHTML = k;

      sel.appendChild(opt);
    }
  }
}

function RenderPresets(){
  /*iPreset = -1;
  document.getElementById("presetscontainer").innerHTML = '';*/

  alert('This feature is still in development.\nYour shapes were sucessfully saved though\n\n'+ JSON.stringify(_settings));
}

function OptimisedCropping(w, h, maxW, maxH){
  biggest = Math.max(w, h);
  let wh = new Array();

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
  let cDOM = document.createElement("canvas");
  cDOM.setAttribute("id", iCanvas +"c");
  cDOM.setAttribute("class", "thumbnailCanvas");
  cDOM.setAttribute("width", "100");
  cDOM.setAttribute("height", "100");
  document.getElementById("thumbnails").appendChild(cDOM);

  let transparency = new Image();
  transparency.src = 'theme/transparent.png';
  let ctx = document.getElementById(iCanvas +"c").getContext('2d');

  transparency.onload = function(){
      let ptrn = ctx.createPattern(transparency, 'repeat');
      ctx.fillStyle = ptrn;
      ctx.fillRect(0, 0, 100, 100);
  }
}

function NewCanvas(e){
  NewThumbnail();

  let ctx = document.getElementById(iCanvas +"c").getContext('2d');
  let reader = new FileReader();
  reader.onload = function(event){
      let img = new Image();

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
      let ctx = document.getElementById(iCanvas +"c").getContext('2d');

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
  let ctx = displayCanvas.getContext('2d');

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
  let closeIPreset = iPreset; // CLOSURE

  if(typeof _settings[closeIPreset] == 'undefined'){
    _settings[closeIPreset] = {
      shape: shapeList[0],
      x: defaultValues['x'],
      y: defaultValues['y'],
      s: defaultValues['s'],
      h: defaultValues['h'],
      w: defaultValues['w'],
      dx: 0,
      r: 0,
      fillColor: '#000000',
      fillCollection : null,
      stratum: closeIPreset
    }
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
  ParamShape(_settings[closeIPreset]["shape"], closeIPreset+'pp');

  document.getElementById(closeIPreset+'tg').onclick = function(){
    TogglePreset(closeIPreset);
  };

  clearer = document.createElement('div');
    clearer.setAttribute('class', 'paramclear');

  document.getElementById('presetscontainer').appendChild(clearer);
}

function CreateShapeSelect(){
  shapesEl = document.createElement('select');
    shapesEl.setAttribute('id', iPreset+'ss');

  selectContainer = document.createElement('div');
    selectContainer.setAttribute('class', 'select');

  selectArrow = document.createElement('div');
    selectArrow.setAttribute('class', 'select__arrow');

  for(i=0; i < shapeList.length; i++){
    opt = document.createElement('option');
      opt.setAttribute('value', shapeList[i]);
      opt.style.backgroundImage = 'url(theme/' + shapeList[i] +'.png)';
      opt.innerHTML = shapeList[i];

    if(_settings[iPreset] !== 'undefined' && shapeList[i] == _settings[iPreset]['shape'])
      opt.setAttribute("selected", "selected");

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

  collectionLabel = document.createElement('label');
    collectionLabel.setAttribute('for', paramId+'col');
    collectionLabel.innerHTML = 'Collection';

  colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', paramId+'cp');
    colorLabel.innerHTML = 'Background color:';

  colorPicker = document.createElement('input');
    colorPicker.setAttribute('type', 'color');
    colorPicker.setAttribute('id', paramId+'cp');


  fillDiv.appendChild(h3A);
  fillDiv.appendChild(collectionLabel);
  fillDiv.appendChild(fillSelect);
  fillDiv.appendChild(colorLabel);
  fillDiv.appendChild(colorPicker);

  sel.appendChild(fillDiv);

  let labels = new Array();
  labels["x"] = "Left";
  labels["y"] = "Top";

  switch(shape){
    case "rectangle":
    labels["w"] = "Width";
    labels["h"] = "Height";
    labels["r"] = "Rotation";
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
    labels["r"] = "Rotation";
    break;
  }

  elDiv = document.createElement('div');
  elDiv.setAttribute('class', 'groupedlabel');
  h3B = document.createElement('h3');
  h3B.innerHTML = "Shape parameters";
  elDiv.appendChild(h3B);

  paramI = parseInt(paramId);

  for(let k in labels){
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
    opt = document.createElement("option");
    opt.setAttribute('value', i+'c');
    opt.setAttribute('class', 'collectoption');
    opt.innerHTML = i;

    if(!isWebkit){
      bg = document.getElementById(i+'c').toDataURL();
      opt.style.backgroundImage = 'url(' + bg + ')';
    }

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

function ResizePreview(){
  previewScale = document.getElementById('_imgscale').value;
  document.getElementById('renderblock').style.height = imgHeight * (previewScale / 100) + "px";
  document.getElementById('renderblock').style.width = imgWidth * (previewScale / 100) + "px";

  document.getElementById('mainframe').height = imgHeight * (previewScale / 100) + "px";
  document.getElementById('mainframe').width = imgWidth * (previewScale / 100) + "px";
}

function ReDraw(){

}

window.addEventListener('load', function(){
  SetWindowTitle("");
  document.getElementById('_xpic').addEventListener('change', NewCanvas, false);
  SetScreenSize();
  RenderPresetCollection();
  LoadPresetList();

  if(isWebkit)
    document.getElementById('_chromewarn').style.display = 'inline';

  document.getElementById('_imgwidth').value = imgWidth;
  document.getElementById('_imgheight').value = imgHeight;

  ResizePreview();
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
    let charCode = evt.keyCode || evt.which;

    if(charCode == 27 && previewMode == true){
      document.getElementById("content").removeAttribute("class", "blurredbackground");
      document.getElementById("displayCanvas").style.display = "none";
      previewMode = false;
    }
});

document.addEventListener('change', function(event) {
  if (event.target.tagName.toLowerCase() === 'input' && event.target.type.toLowerCase() === 'number') {
    if(event.target.id == '_imgwidth'){
      imgWidth = event.target.value;
      ResizePreview();
    }
    else if(event.target.id == '_imgheight'){
      imgHeight = event.target.value;
      ResizePreview();
    }
    else if(event.target.id == '_imgscale'){
      ResizePreview();
    }
    else{
      let shapeId = parseInt(event.target.id);
      let shapeParam = event.target.id;
        shapeParam = shapeParam.replace(/\d+pp/g, '');
      let paramValue = event.target.value;

      _settings[shapeId][shapeParam] = parseInt(paramValue);
      //console.log(JSON.stringify(_settings));
    }
  }
  else if (event.target.tagName.toLowerCase() === 'select') {
    if(event.target.id.match(/\d+ss/g)){
      let shapeId = parseInt(event.target.id);

      ParamShape(event.target.value, shapeId+'pp');
      _settings[shapeId].shape = event.target.value;
    }
    else{

    }
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

    case "debug":
    console.log('debugging');
    console.log(_settings[0]);
    break;

    default:
    console.log('Flush function.\n f(p) to erase saved presets\n f(c) to empty your collection');
  }
}
