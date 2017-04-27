/*
  Optimised Cropping
  Returns cropped dimensions so the thulbnail canvas is filled optimally.
  Returns an Array where :
    [0] = the cropped width;
    [1] = the cropped height;
    [2] = left padding of cropped area;
    [3] = top padding of cropped area;

*/
function OptimisedCropping(w, h){
  k = 0;
  biggest = Math.max(w, h);
  var wh = new Array();

  if(w >= h){
    wh[0] =  w * (100 / h);
    wh[1] = 100;
    wh[2] = (wh[0] - 100) / 2;
    wh[3] = 0;
  }
  else{
    wh[0] =  100;
    wh[1] = h * (100 / w);
    wh[2] = 0;
    wh[3] = (wh[1] - 100) / 2;
  }

  return wh;
}


var iCanvas = 0;
function NewCanvas(e){
  iCanvas++;
  var cDOM = document.createElement("canvas");
  cDOM.setAttribute("id", "_c"+ iCanvas);
  cDOM.setAttribute("class", "thumbnailCanvas");
  cDOM.setAttribute("width", "100");
  cDOM.setAttribute("height", "100");
  document.getElementById("thumbnails").appendChild(cDOM);

  var ctx = document.getElementById("_c"+ iCanvas).getContext('2d');
  var reader = new FileReader();
  reader.onload = function(event){
      var img = new Image();
      img.onload = function(){
        wh = OptimisedCropping(img.width, img.height);
        ctx.drawImage(img, wh[2], wh[3], img.width, img.height, 0, 0, wh[0], wh[1]);
      }
      img.src = event.target.result;
  }

  reader.readAsDataURL(e.target.files[0]);
}

function SetWindowTitle(val){
  if(val.length < 12)
    wTitle = val;

  else
    wTitle = val[0] + val[1] + val[2] +  val[3]  + val[4] + "(...)" + val[val.length-3] + val[val.length-2] + val[val.length-1];

  document.title = '<' + wTitle + '>.img';
}

window.onload = function(){
  SetWindowTitle("");
  document.getElementById('_xpic').addEventListener('change', NewCanvas, false);
}

document.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'canvas') {
    //alert(event.target.id);
  }
});
