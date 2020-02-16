function text1(){
    //模拟迭代器
    let it = maker(['a','b'])

    function maker(arr){
        let nextIndex = 0;
        return {
            next:function(){
                return nextIndex < arr.length ? {value : arr[nextIndex++], done : false}
                : {value : undefined , done : true}
            }
        }
    }

    console.log(it.next())
    console.log(it.next())
    console.log(it.next())
}
//es6规定所有的迭代器iterator接口部署在Symbol.iterator上

function text2(){
    //类部署Iterator接口的写法
    class RangeIterator {
        constructor (strat , stop) {
            this.value = strat;
            this.stop = stop;
        }
        [Symbol.iterator]() {
            return this;
        }
        next() {
            let value = this.value;
            if(value < this.stop){
                this.value++;
                return {done : false, value : value};
            }
            return {done : true,value : undefined}
        }
    }

    function range(strat , stop) {
        return new RangeIterator(strat , stop)
    }

    for (let value of range(0 , 3)){
        console.log(value)
    }
}