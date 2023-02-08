/*
 * @Author: tangruyi 1635341612@qq.com
 * @Date: 2023-02-04 10:07:25
 * @LastEditors: tangruyi 1635341612@qq.com
 * @LastEditTime: 2023-02-04 10:32:06
 * @FilePath: \webpack-autojs\work\auto_sign_in\main.js
 * @Description: 上下班自动打卡
 */
toast("auto_sigin_in service...")

const isWeekDay = (date) => date.getDay() % 6 !== 0
let appName
let am_in
let pm_out
let debug_s = false

function init_var() {
    am_in = [8, 38]
    if (device.product == "ELZ-AN00") {
        console.log("老公手机！")
        appName = "太保e办2.0"
        pm_out = [17, 10]
    }
    else {
        console.log("老婆手机!")
        appName = "钉钉"
        pm_out = [18, 10]
    }
}

function sign_in() {
    if (device.isScreenOn()) {
        log(`启动${appName}`)
        let ret = launchApp(appName)
        if (!ret) {
            log(`启动${appName}失败`)
        }
    }
    else {
        device.wakeUp()
        de
    }
}

function main() {
    init_var()
    while (true) {
        let date = new Date()
        if (isWeekDay(date) || debug_s) {
            if (date.getHours() == am_in[0]) {
                if (date.getMinutes() >= am_in[1]) {
                    sign_in()
                }
                else {
                    sleep(2*1000)
                }
            }
            else if (date.getHours() == pm_out[0]) {
                if (date.getMinutes() >= pm_out[1]) {
                    sign_in()
                }
                else {
                    sleep(2*1000)
                }
            }
            else if (date.getHours() == am_in[0] - 1 || date.getHours() == pm_out[0] - 1) {
                sleep(10*60*1000)
            }
            else {
                sleep(60*60*1000)
            }
        }
        else {
            // 休眠6小时
            log("当前非工作日")
            sleep(6*3600*1000)
        }
    }
}


threads.start(function() {
    main()
})