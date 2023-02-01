//android version > 9
if(device.sdkInt>28){
    //wait for captureScreen authority
    threads.start(function () {
        packageName('com.android.systemui').text('ALLOW').waitFor()
        text('ALLOW').click()
    })
}
//require captureScreen authority
if (!requestScreenCapture()) {
    toast("require captureScreen authority fail")
    exit()
}

var back_image
var attack_image
var points
var base_darw_path

function init_vars() {
    let base_path = "/sdcard/脚本/temp/"
    base_darw_path = base_path + "base_draw.png"
    attack_image = images.read(base_path + "night_find.jpg") 
    back_image = images.read(base_path + "night_back.jpg")
}


function find_board(base, right_point, bottom_point) {
    points = images.findAllPointsForColor(base, "#8f5748",{ region: [0, 0, right_point, bottom_point]})
    return points
}

function draw_board() {
    var lef_pint = 60
    var right_point = 2294
    var bottom_point = 892
    var points
    do {
        sleep(100)
        var base = images.captureScreen();
        points = find_board(base, right_point, bottom_point)
    } while (points.length < 20);
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
    images.save(image, base_darw_path)
}

function send_troops() {
    count = 0
    while (true) {
        if (count > 888) {
            break
        }
        else if (count == 0) {
            // point barbarian
            click(438,1016)
        }
        else if (count == 20 || count == 25 || count == 30) {
            // 点击机器人
            click(1058, 1016)
            let num = random(0, points.length-1)
            click(points[num].x, points[num].y)
            sleep(500)
            // 点击炮车长按
            click(882, 1016)
            longClick(points[num].x+2, points[num].y+2)
            sleep(500)
        }
        else if (count == 21 || count == 26 || count == 31) {
            // 点一下技能
            click(1058, 1010)
            //回到野蛮人
            click(720, 1033)
        }
        else if (count > 70) {
            click(1058, 1016)
            sleep(300)
            let base = images.captureScreen()
            let result = images.matchTemplate(base, back_image, {threshold: 0.8})
            if (result.matches[0]) {
                toastLog("回营")
                click(1185, 1000)
                break
            }
        }
        else {
            // 放野蛮人
            let num = random(0, points.length-1)
            click(points[num].x, points[num].y)
            sleep(random(30, 70))
        }
        count += 1
    }
}

function find_attack() {
    click(178, 996)
    while (true) {
        sleep(500)
        var src = images.captureScreen()
        let result = images.matchTemplate(src, attack_image, {threshold: 0.8})
            if (result.matches[0]) {
                break
            }
            else {
                click(178, 996)
            }
    }
    click(1500, 490)
    sleep(5000)
}

function main() {
    init_vars()
    var max_loop = 5
    while (max_loop) {
        find_attack()
        draw_board()
        send_troops()
        sleep(1000)
    }
}

// 音量键监听
events.observeKey()
events.onKeyDown("volume_up", function(event) {
  threads.start(function(){
    main()
  })
})
events.onKeyDown("volume_down", function(event) {
  toastLog("脚本已结束")
  threads.shutDownAll()
})

events.on("exit", function() {
  toastLog("脚本已结束")
})