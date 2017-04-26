var iCanvas = 0;

/*
  Test optimisation multiplication de matrices
*/

function OptimisedCropping(w, h){

}

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
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 100);
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
    alert(event.target.id);
  }
});
