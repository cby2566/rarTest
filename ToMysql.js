const mysql = require('mysql');
const config = require('./config');
// 连接信息
const connection = mysql.createConnection(config);

// 建立连接
/// connection.connect();
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// 执行查询
connection.query('SELECT * FROM old_table',
    function (error, results, fields) {
        if (error) {
            throw error;
        }

        // 打印查询结果
        console.log('SELECT result is: ', results);
    });
connection.end();