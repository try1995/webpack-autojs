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
let base_path = "/sdcard/脚本/temp/"
let attack_image = images.read(base_path + "day_attack.jpg") 
let base = images.captureScreen()
sleep(1000)
let result = images.matchTemplate(base, attack_image, {threshold: 0.8})
log(result)
point = result.matches[0].point
log(point)
click(point.x, point.y)