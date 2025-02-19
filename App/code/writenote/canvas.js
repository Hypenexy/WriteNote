function InitializeCanvas(container, state) {
   const canvas = document.createElement("canvas");
   container.appendChild(canvas);

   writenote.workspaceData.save = () => {
      return canvas.toDataURL();
   }

   const ctx = canvas.getContext('2d');
   var width, height;
   console.log(state);
   if(typeof state == "object"){
      width = state.width;
      height = state.height;
      if(state.data){
         var image = new Image();
         image.onload = function() {
            ctx.drawImage(image, 0, 0);
         };
         image.src = state.data;
      }
   }
   else{
      canvas.style.position = "Absolute";
      canvas.style.left = window.innerWidth * .1/2+"Px";
      canvas.style.bottom = window.innerHeight * .1+"Px";
      width = Math.round(window.innerWidth * .9);
      height = Math.round(window.innerHeight * .9 - 100);
   }
   canvas.width = width;
   canvas.height = height;
   writenote.workspaceData.state = {};
   writenote.workspaceData.state.width = width;
   writenote.workspaceData.state.height = height;

   ctx.lineJoin = 'round';
   ctx.lineCap = 'round';
   ctx.strokeStyle = "red";

   let drawing = false;
   let pathsry = [];
   let points = [];

   var mouse = { x: 0, y: 0 };
   var previous = { x: 0, y: 0 };

   canvas.addEventListener('mousedown', function (e) {
      if(openNotes[activeNID].saved == true){
         openNotes[activeNID].saved = false;
         changeHeaderNote(activeNID, {type: "saveChange"});
      }
      drawing = true;
      previous = { x: mouse.x, y: mouse.y };
      mouse = oMousePos(canvas, e);
      points = [];
      points.push({ x: mouse.x, y: mouse.y });
   });

   canvas.addEventListener('mousemove', function (e) {
      if (drawing) {
         previous = { x: mouse.x, y: mouse.y };
         mouse = oMousePos(canvas, e);
         // saving the points in the points array
         points.push({ x: mouse.x, y: mouse.y })
         // drawing a line from the previous point to the current point
         ctx.beginPath();
         ctx.moveTo(previous.x, previous.y);
         ctx.lineTo(mouse.x, mouse.y);
         ctx.stroke();
      }
   }, false);


   canvas.addEventListener('mouseup', function () {
      drawing = false;
      // Adding the path to the array or the paths
      pathsry.push(points);
   }, false);


   window.addEventListener("keydown", (e) => {
      if(e.ctrlKey && e.code == "KeyZ"){
         Undo();
      }
   });

   function drawPaths() {
      // delete everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw all the paths in the paths array
      pathsry.forEach(path => {
         ctx.beginPath();
         ctx.moveTo(path[0].x, path[0].y);
         for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
         }
         ctx.stroke();
      })
   }

   function Undo() {
      // remove the last path from the paths array
      pathsry.splice(-1, 1);
      // draw all the paths in the paths array
      drawPaths();
   }


   // a function to detect the mouse position
   function oMousePos(canvas, evt) {
      var ClientRect = canvas.getBoundingClientRect();
      return { //objeto
         x: Math.round(evt.clientX - ClientRect.left),
         y: Math.round(evt.clientY - ClientRect.top)
      }
   }
}
// function getPosition(mouseEvent, sigCanvas) {
//     var x, y;
//     if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
//        x = mouseEvent.pageX;
//        y = mouseEvent.pageY;
//     } else {
//        x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
//        y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
//     }

//     return { X: x - sigCanvas.offsetLeft, Y: y - sigCanvas.offsetTop };
//  }

//  function initialize() {
//     // get references to the canvas element as well as the 2D drawing context
//     var sigCanvas = element;
//     var context = sigCanvas.getContext("2d");
//     context.strokeStyle = '#333348';

//     // This will be defined on a TOUCH device such as iPad or Android, etc.
//     var is_touch_device = 'ontouchstart' in document.documentElement;

//     if (is_touch_device) {
//        // create a drawer which tracks touch movements
//        var drawer = {
//           isDrawing: false,
//           touchstart: function (coors) {
//              context.beginPath();
//              context.moveTo(coors.x, coors.y);
//              this.isDrawing = true;
//           },
//           touchmove: function (coors) {
//              if (this.isDrawing) {
//                 context.lineTo(coors.x, coors.y);
//                 context.stroke();
//              }
//           },
//           touchend: function (coors) {
//              if (this.isDrawing) {
//                 this.touchmove(coors);
//                 this.isDrawing = false;
//              }
//           }
//        };

//        // create a function to pass touch events and coordinates to drawer
//        function draw(event) {

//           // get the touch coordinates.  Using the first touch in case of multi-touch
//           var coors = {
//              x: event.targetTouches[0].pageX,
//              y: event.targetTouches[0].pageY
//           };

//           // Now we need to get the offset of the canvas location
//           var obj = sigCanvas;

//           if (obj.offsetParent) {
//              // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
//              do {
//                 coors.x -= obj.offsetLeft;
//                 coors.y -= obj.offsetTop;
//              }
//              // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
//              // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
//              while ((obj = obj.offsetParent) != null);
//           }

//           // pass the coordinates to the appropriate handler
//           drawer[event.type](coors);
//        }


//        // attach the touchstart, touchmove, touchend event listeners.
//        sigCanvas.addEventListener('touchstart', draw, false);
//        sigCanvas.addEventListener('touchmove', draw, false);
//        sigCanvas.addEventListener('touchend', draw, false);

//        // prevent elastic scrolling
//        sigCanvas.addEventListener('touchmove', function (event) {
//           event.preventDefault();
//        }, false); 
//     }
//     else {

//        // start drawing when the mousedown event fires, and attach handlers to
//        // draw a line to wherever the mouse moves to
//        element.onmousedown = function (mouseEvent) {
//           var position = getPosition(mouseEvent, sigCanvas);

//           context.moveTo(position.X, position.Y);
//           context.beginPath();

//           // attach event handlers
//           element.onmousemove = function (mouseEvent) {
//              drawLine(mouseEvent, sigCanvas, context);
//           }
//           element.onmouseup = function (mouseEvent) {
//              finishDrawing(mouseEvent, sigCanvas, context);
//           }
//           element.onmouseout = function (mouseEvent) {
//              finishDrawing(mouseEvent, sigCanvas, context);
//           };
//        };

//     }
//  }

//  // draws a line to the x and y coordinates of the mouse event inside
//  // the specified element using the specified context
//  function drawLine(mouseEvent, sigCanvas, context) {

//     var position = getPosition(mouseEvent, sigCanvas);

//     context.lineTo(position.X, position.Y);
//     context.stroke();
//  }

//  // draws a line from the last coordiantes in the path to the finishing
//  // coordinates and unbind any event handlers which need to be preceded
//  // by the mouse down event
//  function finishDrawing(mouseEvent, sigCanvas, context) {
//     // draw the line to the finishing coordinates
//     drawLine(mouseEvent, sigCanvas, context);

//     context.closePath();

//     // unbind any events which could draw
//     element.onmousemove = "";
//     element.onmouseup = "";
//     element.onmouseout = "";
//  }

//  initialize();




//or

// const canvas = document.getElementById('paint');
// const ctx = canvas.getContext('2d');
// canvas.width = 600;
// canvas.height = 200;
// ctx.lineJoin = 'round';
// ctx.lineCap = 'round';
// ctx.strokeStyle = "red";
// let drawing = false;
// let pathsry = [];
// let points = [];

// var mouse = { x: 0, y: 0 };
// var previous = { x: 0, y: 0 };

// canvas.addEventListener('mousedown', function (e) {
//    drawing = true;
//    previous = { x: mouse.x, y: mouse.y };
//    mouse = oMousePos(canvas, e);
//    points = [];
//    points.push({ x: mouse.x, y: mouse.y })
// });

// canvas.addEventListener('mousemove', function (e) {
//    if (drawing) {
//       previous = { x: mouse.x, y: mouse.y };
//       mouse = oMousePos(canvas, e);
//       // saving the points in the points array
//       points.push({ x: mouse.x, y: mouse.y })
//       // drawing a line from the previous point to the current point
//       ctx.beginPath();
//       ctx.moveTo(previous.x, previous.y);
//       ctx.lineTo(mouse.x, mouse.y);
//       ctx.stroke();
//    }
// }, false);


// canvas.addEventListener('mouseup', function () {
//    drawing = false;
//    // Adding the path to the array or the paths
//    pathsry.push(points);
// }, false);


// undo.addEventListener("click", Undo);

// function drawPaths() {
//    // delete everything
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
//    // draw all the paths in the paths array
//    pathsry.forEach(path => {
//       ctx.beginPath();
//       ctx.moveTo(path[0].x, path[0].y);
//       for (let i = 1; i < path.length; i++) {
//          ctx.lineTo(path[i].x, path[i].y);
//       }
//       ctx.stroke();
//    })
// }

// function Undo() {
//    // remove the last path from the paths array
//    pathsry.splice(-1, 1);
//    // draw all the paths in the paths array
//    drawPaths();
// }


// // a function to detect the mouse position
// function oMousePos(canvas, evt) {
//    var ClientRect = canvas.getBoundingClientRect();
//    return { //objeto
//       x: Math.round(evt.clientX - ClientRect.left),
//       y: Math.round(evt.clientY - ClientRect.top)
//    }
// }
