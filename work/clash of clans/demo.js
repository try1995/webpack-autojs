//安卓版本高于Android 9
if(device.sdkInt>28){
    //等待截屏权限申请并同意
    threads.start(function () {
        packageName('com.android.systemui').text('ALLOW').waitFor()
        text('ALLOW').click()
    })
}
//申请截屏权限
if (!requestScreenCapture()) {
    toast("请求截图失败")
    exit()
}


sleep(1000)
let base = images.captureScreen();

// let result = images.matchTemplate(base, machine, {threshold: 0.4})
// var points = result.points
// log(points)
var lef_pint = 60
var right_point = 2294
var bottom_point = 892
var points = images.findAllPointsForColor(base, "#8f5748",{ region: [0, 0, right_point, bottom_point]})
log(points)
for (let i=0; i < points.length; i++) {
    if (points[i].x< (lef_pint+right_point)/2) {
        points[i].x -= 60
    }
    else {
        points[i].x += 60
    }
    points[i].y -= 20
}
var canvas = new Canvas(base)
var paint = new Paint()
// paint.setColor(colors.parseColor("#2196F3"))
points.forEach(point => { canvas.drawRect(point.x, point.y, point.x + 10, point.y + 10, paint)
});

var image = canvas.toImage()
images.save(image, "./temp/base_draw.png")

click(438,1016)
count = 0
while (true) {
    if (count > 888) {
        break
    }
    else if (count == 20 || count > 70) {
        click(1058, 1010)
        let num = random(0, points.length-1)
        click(points[num].x, points[num].y)
        sleep(300)
    }
    else if (count == 21) {
        click(1058, 1010)
        click(886, 1033)
    }
    else {
        let num = random(0, points.length-1)
        click(points[num].x, points[num].y)
        sleep(50)
    }
    count += 1
}

