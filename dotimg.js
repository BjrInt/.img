/*
  Optimised Cropping
  Returns cropped dimensions so the thumbnail canvas is filled optimally.
  Returns an Array where :
    [0] = the cropped width;
    [1] = the cropped height;
    [2] = left padding of cropped area;
    [3] = top padding of cropped area;

*/
function OptimisedCropping(w, h, maxW, maxH){
  k = 0;
  biggest = Math.max(w, h);
  var wh = new Array();

  if(w >= h){
    wh[0] =  w * (maxW / h);
    wh[1] = maxH;
    wh[2] = (wh[0] - maxW) / 2;
    wh[3] = 0;
  }
  else{
    wh[0] =  maxW;
    wh[1] = h * (maxH / w);
    wh[2] = 0;
    wh[3] = (wh[1] - maxH) / 2;
  }

  return wh;
}


var iCanvas = 0;
var imgStorage = new Array();
var previewMode = false;

var screenWidth = 0;
var screenHeight = 0;

function NewThumbnail(){
  iCanvas++;
  var cDOM = document.createElement("canvas");
  cDOM.setAttribute("id", iCanvas +"c");
  cDOM.setAttribute("class", "thumbnailCanvas");
  cDOM.setAttribute("width", "100");
  cDOM.setAttribute("height", "100");
  document.getElementById("thumbnails").appendChild(cDOM);

  var transparency = new Image();
  transparency.src = 'transparent.png';
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

      var img = new Image();
      img.onload = function(){
        wh = OptimisedCropping(img.width, img.height, 100, 100);
        ctx.drawImage(img, wh[2], wh[3], img.width, img.height, 0, 0, wh[0], wh[1]);
      }

      img.src = "presets/" + storedCollection[i];
      imgStorage[iCanvas] = img;
  }
}

function DisplayThumbnail(id){
  previewMode = true;
  id = parseInt(id);
  displayCanvas = document.getElementById("displayCanvas");
  img = imgStorage[id];

  displayCanvas.style.display = "block";
  var ctx = displayCanvas.getContext('2d');

  displayCanvas.setAttribute("width", img.width);
  displayCanvas.setAttribute("height", img.height);
  ctx.drawImage(img, 0, 0, img.width, img.height);

  document.body.style.backgroundColor = "#444";
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
  screenHeight -= 60;
}

window.onload = function(){
  SetWindowTitle("");
  document.getElementById('_xpic').addEventListener('change', NewCanvas, false);
  SetScreenSize();
  RenderPresetCollection();
}

window.onresize = function(){
  SetScreenSize();
}

document.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
    DisplayThumbnail(event.target.id);
  }
  else{
    if(previewMode == true){
      document.body.style.backgroundColor = "#FFF";
      document.getElementById("displayCanvas").style.display = "none";
      previewMode = false;
    }
  }
});

document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;

    if(charCode == 27 && previewMode == true){
      document.body.style.backgroundColor = "#FFF";
      document.getElementById("displayCanvas").style.display = "none";
      previewMode = false;
    }
};
