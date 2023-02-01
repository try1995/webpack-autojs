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
let base_path = "/sdcard/脚本/temp/"
let attack_image = images.read(base_path + "day_attack.jpg") 
let base = images.captureScreen()
sleep(1000)
let result = images.matchTemplate(base, night_find_image, {threshold: 0.8})
log(result)
point = result.matches[0].point
log(point)
click(point.x, point.y)