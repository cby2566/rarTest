//正则
let text = "[感電少女注意報 (真冬)] 蛇神の巫女貳 (C97) モリサマーをペロペロしたい。等23本合集[1.11G+338MFm百度]"
let text2 = "doumou"
let reg = /\[(.+?)\]/g
//.+ 贪婪匹配
//.+? 惰性匹配 这里需要用这个

let result = null

console.log(text2.match(reg))