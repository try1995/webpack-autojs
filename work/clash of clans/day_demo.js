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

var global_resources = {
  gold: 0,
  elixir: 0,
  dark_exixir: 0,
  trophy: 0
}

var day_attack_point;
var day_find_point;
var next_point;
var next_image;
var source_clip_path


function init_vars() {
  let day_find_image = images.read("/sdcard/脚本/temp/day_find.jpg")
  let day_base_image = images.read("/sdcard/脚本/temp/day_base.jpg");
  let day_attack_image = images.read("/adcard/脚本/temp/day_attack.jpg")
  let day_base_find_image = images.read("/scard/脚本/temp/day_base_find.jpg")
  let day_revert_image = images.read(base_path + "revert")
  let base_path = "/sdcard/脚本/temp/"
  source_clip_path = base_path + "source_clip.png"
  next_image = images.read(base_path + "next_clip.jpg")
  // let result = images.matchTemplate(day_base_image, day_attack_image, {threshold: 0.7})
  // let point = result.points[0]
  // point.x += day_attack_image.width / 2
  // point.y += day_attack_image.height / 2
  day_attack_point = [260, 1021]

  // let result_2 = images.matchTemplate(day_find_image, day_base_find_image, {threshold: 0.7})
  // let point_2 = result_2.points[0]
  // point_2.x += day_find_image.width / 2
  // point_2.y += day_find_image.height / 2
  day_find_point = [1700, 765]
  next_point = [2103, 835]
}

function ocr_source() {
  var max_loop = 100
  global_resources.gold = 0
  global_resources.trophy = 0
  console.log("orc_source")
  // var temp_path = "./temp/temp.png"

  // find next, then orc_source
  while (max_loop) {
    // images.captureScreen(temp_path)
    // var src = images.read(temp_path)
    var src = images.captureScreen()
    let result = images.matchTemplate(src, next_image, {threshold: 0.8})
    if (result.matches[0]) {
      console.log("find the next button")
      console.log(result.matches[0])
      var source_clip = images.clip(src, 183, 155, 366-187, 400-130)
      images.saveImage(source_clip, source_clip_path)
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
              global_resources.gold = text
              break
            case 1:
              global_resources.elixir = text
              break
            case 2:
              global_resources.dark_exixir = text
              break
            case 3:
            case 4:
              global_resources.trophy = text
              break
          }
      }
      if (global_resources.trophy > 60) {
        continue
      }
      if (global_resources.gold) {
        toastLog(`result: ${JSON.stringify(global_resources)}`)
        break
      }
    }
    max_loop--
    sleep(300)
  }
  
}

function find_attack(target) {
  // singal target
    if (global_resources.gold > target.gold + 200000 || global_resources.elixir > target.elixir + 200000
  || global_resources.dark_exixir > target.dark_exixir + 2000 || global_resources.trophy > target.trophy + 10) {
    return true
  }
  // gold + elixir 
  else if (global_resources.gold + global_resources.elixir > target.gold + target.elixir) {
    return true
  }
  else {
    click(next_point[0], next_point[1])
    return false
  }
}

function mutiplayer() {
  init_vars()
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
    ocr_source()
    let ret = find_attack(target)
    if (ret || count > max_serch) {
      toastLog("finish!")
      device.vibrate(3000)
      break
    }
    else {
      count ++
    }
  }

}

home()
// 音量键监听
events.observeKey()
events.onKeyDown("volume_up", function(event) {
  threads.start(function(){
    toastLog("begin!")
    mutiplayer()
  })
})
events.onKeyDown("volume_down", function(event) {
  toastLog("stop!")
  threads.shutDownAll()
})


events.onKeyDown("key_back", function(event) {
  exit()
})


events.on("exit", function() {
  toastLog("exit!")
})