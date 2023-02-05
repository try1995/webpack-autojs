/*
 * @Author: tangruyi 1635341612@qq.com
 * @Date: 2023-02-03 12:24:06
 * @LastEditors: tangruyi 1635341612@qq.com
 * @LastEditTime: 2023-02-04 10:11:43
 * @FilePath: \webpack-autojs\work\clash of clans\main.js
 * @Description: coc自动化脚本
 */
/*
autox不能打开稳定模式
*/


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

// -----------------------day-----------------------
var day_resources = {
  gold: 0,
  elixir: 0,
  dark_exixir: 0,
  trophy: 0
}

var day_attack_point
var day_attack_image
var day_find_point
var day_next_point
var day_next_image
var day_source_clip_path
var retreat_image

// --------------------night-----------------------
var night_back_image  // 回营
var night_find_image
var night_attack_points
var night_base_darw_path
var base_path
var troops = {
  barbarian:0,
  bomber:1,
  cannon:2,
  machine:3
}
// 蛮炮
let night_troop_x
let night_troop_y
let night_troop_diff

// --------------------------------------------------
function init_vars() {
    base_path = "/sdcard/脚本/images/coc/"
    day_source_clip_path = base_path + "source_clip.png"
    retreat_image = images.read(base_path + "retreat.jpg")
    day_next_image = images.read(base_path + "next_clip.jpg")
    day_attack_image = images.read(base_path + "day_attack.jpg")



    night_base_darw_path = base_path + "base_draw.png"
    night_find_image = images.read(base_path + "night_find.jpg") 
    night_back_image = images.read(base_path + "night_back.jpg")

    if (device.product == "ELZ-AN00") {
      console.log("phone")
      day_attack_point = [260, 1021]
      day_find_point = [1700, 765]
      day_next_point = [2103, 835]
      night_troop_x = 738
      night_troop_y = 1016
      night_troop_diff = 150
    }
    else {
      console.log("table")
      day_attack_point = [129, 1080]
      day_find_point = [1328, 700]
      day_next_point = [2103, 835] 
    }
}



//-----------------------------night-----------------------------

function night_find_board(base, right_point, bottom_point) {
  night_attack_points = images.findAllPointsForColor(base, "#8f5748",{ region: [0, 0, right_point, bottom_point]})
  return night_attack_points
}

function night_draw_board() {
  var lef_point = 0
  var right_point = 2370
  var points
  do {
      sleep(100)
      var base = images.captureScreen();
      points = night_find_board(base, 2294, 892)
  } while (points.length < 45);
  for (let i=0; i < points.length; i++) {
      if (points[i].x< (lef_point+right_point)/2) {
          points[i].x -= 60
      }
      else {
          points[i].x += 60
      }
      points[i].y -= 20
  }
  toastLog(`find ${points.length} point`)
  var canvas = new Canvas(base)
  var paint = new Paint()
  points.forEach(point => { canvas.drawRect(point.x, point.y, point.x + 10, point.y + 10, paint)
  });

  var image = canvas.toImage()
  images.save(image, night_base_darw_path)
}

function night_click_troops(troop) {

  switch(troop) {
    case troops.barbarian: {
      click(night_troop_x+night_troop_diff, night_troop_y)
      break
    }
    case troops.cannon: {
      click(night_troop_x+night_troop_diff*2, night_troop_y)
      break
    }
    case troops.machine: {
      click(night_troop_x+night_troop_diff*3, night_troop_y)
      break
    }
  }
}

function night_send_troops() {
  let count = 0
  while (true) {
      if (count > 888) {
          break
      }
      else if (count == 0) {
          // point barbarian
          night_click_troops(troops.barbarian)
      }
      else if (count == 25 || count == 30) {
          night_click_troops(troops.machine)
          let num = random(0, night_attack_points.length-1)
          click(night_attack_points[num].x, night_attack_points[num].y)
          night_click_troops(troops.machine)
          sleep(random(1000, 2000))
          // 点击炮车长按
          night_click_troops(troops.cannon)
          longClick(night_attack_points[num].x+10, night_attack_points[num].y+10)
          sleep(500)
      }
      else if (count > 25 && count < 86 && count % 6 == 0) {
          // 点一下技能
          night_click_troops(troops.machine)
          night_click_troops(troops.barbarian)
      }
      else if (count > 85) {
          night_click_troops(troops.machine)
          sleep(300)
          let base = images.captureScreen()
          let result = images.matchTemplate(base, night_back_image, {threshold: 0.8})
          if (result.matches[0]) {
              toastLog("back")
              click(1185, 1000)
              break
          }
      }
      else {
          let num = random(0, night_attack_points.length-1)
          click(night_attack_points[num].x, night_attack_points[num].y)
          sleep(random(30, 70))
      }
      count += 1
  }
}

function night_find_attack() {
    click(178, 996)
    while (true) {
        sleep(500)
        var src = images.captureScreen()
        let result = images.matchTemplate(src, night_find_image, {threshold: 0.5})
            if (result.matches[0]) {
                break
            }
            else {
                click(178, 996)
            }
    }
    click(1500, 490)
    sleep(6000)
}

function night_mutiplayer() {
  var max_loop = 5
  while (max_loop) {
      night_find_attack()
      night_draw_board()
      night_send_troops()
      sleep(1000)
  }
}

// ----------------------------------------day---------------------------

function day_ocr_source() {
  var max_loop = 100
  day_resources.gold = 0
  day_resources.trophy = 0
  console.log("orc_source")
  // var temp_path = "./temp/temp.png"

  // find next, then orc_source
  while (max_loop) {
    // images.captureScreen(temp_path)
    // var src = images.read(temp_path)
    var src = images.captureScreen()
    let result = images.matchTemplate(src, day_next_image, {threshold: 0.8})
    if (result.matches[0]) {
      console.log("find the next button")
      console.log(result.matches[0])
      var source_clip = images.clip(src, 183, 155, 366-187, 400-130)
      images.saveImage(source_clip, day_source_clip_path)
      console.log("save source clip image")
      var res = gmlkit.ocr(source_clip, "zh").text.split("\n")
      console.log(res)
      for (var i = 0; i < res.length; i ++) { 
        let text = res[i].replace(" ","")
        text = text.replace("I", "1")
        text = text.replace("S", "5")
        text = text.replace("o", "0")
        text = parseInt(text)
        switch(i)
          {
            case 0:
              day_resources.gold = text
              break
            case 1:
              day_resources.elixir = text
              break
            case 2:
              day_resources.dark_exixir = text
              break
            case 3:
            case 4:
              day_resources.trophy = text
              break
          }
      }
      if (day_resources.trophy > 60) {
        continue
      }
      if (day_resources.gold) {
        toastLog(`result: ${JSON.stringify(day_resources)}`)
        break
      }
    }
    max_loop--
    sleep(300)
  }
  
}

function day_find_attack(target) {
  // singal target
    if (day_resources.gold > target.gold + 200000 || day_resources.elixir > target.elixir + 200000
  || day_resources.dark_exixir > target.dark_exixir + 2000 || day_resources.trophy > target.trophy + 10) {
    return true
  }
  // gold + elixir 
  else if (day_resources.gold + day_resources.elixir > target.gold + target.elixir) {
    return true
  }
  else {
    click(day_next_point[0], day_next_point[1])
    return false
  }
}


function day_mutiplayer() {
  console.log("point attack")
  sleep(300)
  click(day_attack_point[0], day_attack_point[1])
  sleep(1000)
  console.log("point find")
  click(day_find_point[0], day_find_point[1])

  var target = {
  gold: 700000,
  elixir: 750000,
  dark_exixir: 7500,
  trophy:35
  }

  var count = 1
  var max_serch = 50
  while (true) {
    console.log(`find ${count} times`)
    day_ocr_source()
    let ret = day_find_attack(target)
    if (ret || count > max_serch) {
      toastLog(`finish in ${count} times`)
      device.vibrate(2000)
      sleep(5000)
      let base = images.captureScreen()
      // 检测到撤退再退出
      let ret = images.matchTemplate(base, retreat_image, {threshold: 0.6})
      if (ret.matches[0]) {
        break
      }
      else {
        count = 0
      }
    }
    else {
      count ++
    }
  }
}

// ---------------------------------------------main---------------
function main() {
    init_vars()
    let base = images.captureScreen()
    images.saveImage(base, base_path + "temp.png")
    let result = images.matchTemplate(base, day_attack_image, {threshold: 0.5})
    log(result)
    if (result.matches[0])  {
        toastLog("day world!")
        day_mutiplayer()
    }
    else {
        toastLog("night world!")
        night_mutiplayer()
    }
}

home()
let exit_script
// 按键监听
events.observeKey()
events.onKeyDown("volume_up", function(event) {
  threads.start(function(){
    toastLog("begin!")
    exit_script=false
    main()
    exit_script=true
  })
})
events.onKeyDown("volume_down", function(event) {
  if (exit_script) {
    exit()
  }
  else {
    threads.shutDownAll()
    toastLog("stop!")
    exit_script = true
  }
})

events.on("exit", function() {
  toastLog("exit!")
})