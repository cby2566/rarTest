//正则
let text = ""
let reg = /\[(.+?)\]/g
//.+ 贪婪匹配
//.+? 惰性匹配 这里需要用这个

let result = null

console.log(text.match(reg))