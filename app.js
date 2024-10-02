const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'driving_test'
});

// เช็คการเชื่อมต่อ
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// API สำหรับบันทึกข้อมูลผู้ทดสอบ
app.post('/tests', (req, res) => {
    const { first_name, last_name, physical_test_status, theory_test_score, practical_test_status } = req.body;
    const sql = 'INSERT INTO tests (first_name, last_name, physical_test_status, theory_test_score, practical_test_status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, physical_test_status, theory_test_score, practical_test_status], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Test recorded', id: result.insertId });
    });
});

// API สำหรับปรับปรุงข้อมูลผู้ทดสอบ
app.put('/tests/:id', (req, res) => {
    const { id } = req.params;
    const { physical_test_status, theory_test_score, practical_test_status } = req.body;
    const sql = 'UPDATE tests SET physical_test_status = ?, theory_test_score = ?, practical_test_status = ? WHERE id = ?';
    db.query(sql, [physical_test_status, theory_test_score, practical_test_status, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Test updated' });
    });
});

// API สำหรับลบข้อมูลผู้ทดสอบ
app.delete('/tests/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tests WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Test deleted' });
    });
});

// API สำหรับแสดงข้อมูลผู้ทดสอบ
app.get('/tests', (req, res) => {
    db.query('SELECT * FROM tests', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
