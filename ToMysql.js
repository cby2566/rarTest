const sql = require('mysql');
const config = require('./config');
console.log(sql)


let connection = sql.createConnection(config)
connection.connect();
connection.query("SELECT * from old_table",function (error, results, fields){
    if (error) throw error;
    console.log(results);
});
connection.end();


//报错ER_NOT_SUPPORTED_AUTH_MODE
//mysql版本太高还不能node连接
//解决办法（修改加密规则为普通模式，默认是严格加密模式）——改密码
// ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
// ALTER USER 'root'@'localhost' IDENTIFIED BY 'root' PASSWORD EXPIRE NEVER;
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
