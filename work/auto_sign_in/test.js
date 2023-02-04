const isWeekDay = (date) => date.getDay() % 6 !== 0

log(isWeekDay(new Date(2023,2, 5)))
log(new Date().getDay() ==9)