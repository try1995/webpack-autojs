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
sleep(1000)
let base_path = "/sdcard/脚本/images/coc/"
let attack_image = images.read(base_path + "night_attack.jpg")
let base = images.captureScreen()
sleep(1000)
let result = images.matchTemplate(base, attack_image, {threshold:0.1})
log(result)
let result2 = images.matchTemplate(base, attack_image, {threshold:0.1})
log(result2)
point = result.matches[0].point
log(point)
// click(point.x, point.y)