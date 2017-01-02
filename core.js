function $ (query) {
   return document.querySelectorAll(query);
}

var file_ele = document.getElementById('fileEle');
var raw_img = $('#input .img')[0],
res_img = $('#result .img')[0],
btns = $('.btn'),
in_btn = btns[0],
co_btn = btns[1],
input = $('.input'),
shreshold = input[0],
points_num = input[1],
percent = input[2];

var img_width, img_height;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var loaded = false;
var img = new Image();

in_btn.onclick = function () {
    file_ele.click();
} 

file_ele.onchange = function () {
    loaded = false;
    var src = window.URL.createObjectURL(file_ele.files[0]);
    raw_img.src = src;
}
var init = true, ca = false;

raw_img.onload = function () {
    img.src = raw_img.src;
    img.onload = function () {
        img_width = img.width;
        img_height = img.height;
        canvas.width = img_width;
        canvas.height = img_height;
        caculate();
        loaded = true;
        ca = true;
        if (init) {
            init = false;
            co_btn.click();
        }
    }
}

window.onload = function () {
    raw_img.src = "./default.jpg";
}

function caculate() {
    context.drawImage(img, 0, 0, img_width, img_height);
    var imageData = context.getImageData(0, 0, img_width, img_height);
    var edge_points = Sobel(imageData, parseInt(shreshold.value)), points = [], random;

    var num = parseInt(points_num.value);
    var edge_points_num = ~~(num * parseFloat(percent.value) * 0.01);
    
    for (var i = 0; i < num - edge_points_num; i++) {
        points.push([Math.random() * img_width , Math.random() * img_height])
    }
    for (var l = 0; l < edge_points_num; l++) {
        random = ~~(Math.random() * edge_points.length);
        points.push(edge_points[random]);
        edge_points.splice(random, 1);
    }
    points.push([0, 0] , [0, img_height] , [img_width, 0] , [img_width, img_height]);
    var triangles = Delaunay.triangulate(points);
    var x1,x2,x3,y1,y2,y3,cx,cy;
    for(var i=0;i < triangles.length; i+=3) {
        x1 = points[triangles[i]][0];
        x2 = points[triangles[i+1]][0];
        x3 = points[triangles[i+2]][0];
        y1 = points[triangles[i]][1];
        y2 = points[triangles[i+1]][1];
        y3 = points[triangles[i+2]][1];
        // 获取三角形中心点坐标
        cx = ~~((x1 + x2 + x3) / 3);
        cy = ~~((y1 + y2 + y3) / 3);
        // 获取中心点坐标的颜色值
        index = (cy * imageData.width + cx) * 4;
        var color_r = imageData.data[index];
        var color_g = imageData.data[index + 1];
        var color_b = imageData.data[index + 2];
        // 绘制三角形
        context.save();
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.fillStyle = "rgba("+color_r+","+color_g+","+color_b+", 1)";
        context.fill();
        context.restore();
    }
}

co_btn.onclick = function () {
    if (loaded) {
        if (!ca) {
            caculate();
        }
        res_img.width = raw_img.width;
        res_img.height = raw_img.height;
        res_img.src = canvas.toDataURL("image/png");
        ca = false;
    }
}

var mask = document.getElementById('mask');
var display = document.getElementById('display');
var close = document.getElementById('close');
var scale_up = $('.scale-up'),
raw_su = scale_up[0],
res_su = scale_up[1];

function handle_scale (src) {
    if (src) {
        mask.className = 'show';
        display.src = src;
    }
}

raw_su.onclick = function () {
    handle_scale(raw_img.src)
}

close.onclick = function () {
    mask.className = '';
    display.src = '';
}

res_su.onclick = function () {
    handle_scale(canvas.toDataURL("image/png"));
}
