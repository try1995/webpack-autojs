let base = images.read("./temp/day_base.jpg");
let machine = images.read("./temp/day_attack.jpg")

let result = images.matchTemplate(base, machine, {threshold: 0.7})
var points = result.points
log(points)

var canvas = new Canvas(base)
var paint = new Paint()
// paint.setColor(colors.parseColor("#2196F3"))
points.forEach(point => { canvas.drawLine(point.x, point.y, point.x + machine.width, point.y + machine.height, paint)
});

var image = canvas.toImage()
images.save(image, "./temp/base_draw.png")