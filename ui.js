var canvas = document.getElementById("canvas");
var rect = document.getElementById("dom_rect");
var rect_canvas = document.getElementById("rect_canvas");
var circle_canvas = document.getElementById("circle_canvas");
var circle = document.getElementById("circle");
var animcheck = document.getElementById("animcheck");

var typelist = document.getElementById("typelist");
typelist.addEventListener("click", function(e) {
    var type = typelist.selectedIndex;
    setCurrentType(type);
    animcheck.disabled = type != 0;
})

var theRenderFunc;
var SHOULD_REQ_ANIM_FRAME = false;
animcheck.addEventListener("click", function(e) {
    SHOULD_REQ_ANIM_FRAME = animcheck.checked;
    theRenderFunc();
});

setCurrentType(0);

function setCurrentType(type) {
    switch (type) {
    case 0:
        rect_canvas.style.display = "none";
        circle_canvas.style.display = "none";
        canvas.style.display = "block";
        setupCanvas(canvas);
        break;

    case 1:
        canvas.style.display = "none";
        rect_canvas.style.display = "none";
        circle_canvas.style.display = "block";
        document.addEventListener("mousemove", function(e) {
            circle.setAttribute("cx", e.clientX);
            circle.setAttribute("cy", e.clientY);
        });
        break;

    case 2:
        canvas.style.display = "none";
        circle_canvas.style.display = "none";
        rect_canvas.style.display = "block";
        document.addEventListener("mousemove", function(e) {
            rect.style.left = Math.min(e.clientX-50, 1024-100);
            rect.style.top = e.clientY-50;
        });
        break;
    }
}

function setupCanvas(canvas) {
    var ctx = canvas.getContext("2d")

    var WIDTH = 1024;
    var HEIGHT = 1024;
    var RADIUS = 50;

    function clearScreen() {
        clearRect(0, 0, WIDTH, HEIGHT);
    }

    function clearRect(x, y, w, h) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x, y, w, h);
    }

    function makeImage() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(RADIUS, RADIUS, RADIUS, 0, Math.PI*2);
        ctx.fill();

        return ctx.getImageData(0, 0, RADIUS*2, RADIUS*2);
    }

    clearScreen();
    var img = makeImage();
    clearScreen();

    var posX = 0, posY = 0, x = 0, y = 0;

    function render() {
        clearRect(posX, posY, RADIUS*2, RADIUS*2);
        ctx.putImageData(img, x, y);
        posX = x;
        posY = y;
        if (SHOULD_REQ_ANIM_FRAME)
            window.requestAnimationFrame(render);
    }

    document.addEventListener("mousemove", function(e) {
        x = e.clientX - RADIUS;
        y = e.clientY - RADIUS;
        if (!SHOULD_REQ_ANIM_FRAME)
            render();
    });

    theRenderFunc = render;

    render();
}
