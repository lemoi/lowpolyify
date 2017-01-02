function Sobel(imageData, shreshold) {
    var width = imageData.width;
    var height = imageData.height;

    var kernelX = [
        [-1,0,1],
        [-2,0,2],
        [-1,0,1]
    ];

    var kernelY = [
        [-1,-2,-1],
        [0,0,0],
        [1,2,1]
    ];

    var pointCollection = [];
    var grayscaleData = [];

    function bindPixelAt(data) {
        return function(x, y, i) {
            i = i || 0;
            return data[((width * y) + x) * 4 + i];
        };
    }

    var data = imageData.data;
    var pixelAt = bindPixelAt(data);
    var x, y;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            var r = pixelAt(x, y, 0);
            var g = pixelAt(x, y, 1);
            var b = pixelAt(x, y, 2);

            var avg = (r + g + b) / 3;
            grayscaleData.push(avg, avg, avg, 255);
        }
    }

    pixelAt = bindPixelAt(grayscaleData);

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            var pixelX = (
                (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelX[0][1] * pixelAt(x, y - 1)) +
                (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelX[1][0] * pixelAt(x - 1, y)) +
                (kernelX[1][1] * pixelAt(x, y)) +
                (kernelX[1][2] * pixelAt(x + 1, y)) +
                (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelX[2][1] * pixelAt(x, y + 1)) +
                (kernelX[2][2] * pixelAt(x + 1, y + 1))
            );

            var pixelY = (
                (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
                (kernelY[0][1] * pixelAt(x, y - 1)) +
                (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
                (kernelY[1][0] * pixelAt(x - 1, y)) +
                (kernelY[1][1] * pixelAt(x, y)) +
                (kernelY[1][2] * pixelAt(x + 1, y)) +
                (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
                (kernelY[2][1] * pixelAt(x, y + 1)) +
                (kernelY[2][2] * pixelAt(x + 1, y + 1))
            );

            var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
            if (magnitude > shreshold)
            pointCollection.push([x, y]);
        }
    }
    return pointCollection;
}