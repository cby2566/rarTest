
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
text2()