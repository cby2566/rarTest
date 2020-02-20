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

//通过遍历器实现指针结构,在原型链上部署在Symbol.iterator方法
function text3(){
    function Obj(value){
        this.value = value;
        this.next = null;
    }
    Obj.prototype[Symbol.iterator] = function() {
        let iterator = { next : next };
        let current = this;
        function next() {
            if (current) {
                let value = current.value;
                current = current.next;
                return { done : false, value :value};
            } else {
                return { done : true};
            }
        }
        return iterator;
    }
    let a1 = new Obj({ name:"ccc"});//[[PrimitiveValue]]: 1
    let a2 = new Obj(2);
    let a3 = new Obj(3);
    a1.next = a2;
    a2.next = a3;

    for (let i of a1){
        console.log(i)
    }
}
//为没有内置[Symbol.iterator]的对象添加迭代器属性
function text3_1(){
    let obj = {
        data : ['the','world'],
        data2 : ['open','card'],
        [Symbol.iterator]() {
            const self = this;
            let index = 0;
            return {
                next() {
                    if( index < self.data.length){
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    } else {
                        return { value: undefined, done: true}
                    }
                }
            };
        }
    }
    for (let i of obj){
        console.log(i)
    }
}
function text3_2(){
    let obj = {
        a1 :'alalal',
        b1 : '777d',
        c1 : 6666,
        [Symbol.iterator]() {
            const self = this;
            let index = 0;
            let arr = Object.keys(self)
            return {
                next() {
                    if( index < arr.length){
                        let a = arr[index++];
                        let b = self[a]
                        //对象的键值不能直接填变量
                        return {
                            value: {[a]:b},
                            done: false
                        };
                    } else {
                        return { value: undefined, done: true}
                    }
                }
            };
        }
    }
    for (let i of obj){
        console.log(i)
    }
}

//联动Generator
function text4(){
    let myIterable = {};
    myIterable[Symbol.iterator] = function* () {
        yield 1;
        yield* [2,3]
        yield 4;
    };
    console.log([...myIterable])
    for (const iterator of myIterable) {
        console.log(iterator)
    }
    //简写
    let obj = {
        * [Symbol.iterator]() {
            yield 'coooool';
            yield '!!!';
        }
    };
    for (let x of obj){
        console.log(x)
    }
}
