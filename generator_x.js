
function text1() {
    function* myGenerator() {
        console.log(909)
        function a(data){
            console.log(data)
        }
        yield a(1);
        a(yield 77777);
        console.log(888)
        yield 'cooool';
        console.log(123)
        yield '!!!';
        console.log(456)
        return 'ending';
    }
    
    let hw = myGenerator();
    
    console.log(hw.next())
    console.log('------------')
    console.log(hw.next())
    console.log('------------')
    console.log(hw.next(true))
    console.log('------------')
    for(let v of myGenerator()){
        console.log(v)
    }
}
function text2(){
    //斐波那契数列
    function* fibonacci() {
        let [prev, curr] = [0, 1];
        for(;;){
            [prev, curr] = [curr, prev + curr];
            yield curr;
        }
    }
    for(let n of fibonacci()){
        if(n > 100) break;
        console.log(n)
    }
}
//通过Generator给原生js对象加额外接口
function text3(){
    function* objctEntries(obj){
        let propKeys = Reflect.ownKeys(obj);
        for(let porpKey of propKeys){
            yield [porpKey,obj[porpKey]];  
        }
    }
    let jane ={ddd:'123',bbb:'789'}
    for (let [k,v] of objctEntries(jane)){
        console.log(`${k}:${v}`)
    }
}
//通过Generator给原生js对象加额外接口，直接给他symbol.iterator方法
function text4(){
    function* objctEntries(){
        let propKeys = Object.keys(this);
        for(let porpKey of propKeys){
            yield [porpKey,this[porpKey]];
        }
    }
    let jane ={ddd:'123',bbb:'789'}
    jane[Symbol.iterator] = objctEntries;

    for (let [k,v] of jane){
        console.log(`${k}:${v}`)
    }
}
//当Generator函数被嵌套时
function text5(){
    function* foo(){
        yield 'a'
        yield 'b'
    }
    function* bar(){
        yield 'x'
        yield foo()
        yield* foo()
        yield 'y'
    }
    for (let v of bar()){
        console.log(v)
    }
}
//运行一次就改
function text6(){
    var cock = function* (){
        while(true){
            console.log('Tick!')
            yield;
            console.log('Tock!')
            yield;
        }
    }
    cock().next()
}
function text7(){
    function* gen(x){
        let y = yield x + 2//5
        console.log(y)
        return y
    }
    let g = gen(1)
    console.log(g.next())
    console.log(g.next(5))
}
text7()