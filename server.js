const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'practice'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/tableInsertion.html');
});

// Route to fetch students data
app.get('/students', (req, res) => {
    const query = 'SELECT * FROM students'; // Replace 'students' with your table name

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server error');
            return;
        }

        // Render the table rows as HTML
        let rows = '';

        results.forEach(row => {
            rows += `
                <tr>
                     <td>${row.sId}</td>
                    <td>${row.sName}</td>
                    <td>${row.sFName}</td>
                    <td>${row.sEmail}</td>
                    <td>${row.sDate}</td>
                    <td>
                        <button id="edit" class="edit">Edit</button>
                        <button id="delete" class="delete">Delete</button>
                    </td>
                </tr>
            `;
        });

        res.send(rows);
    });
});

app.post('/add-student',(req,res)=>{

    const { name, fname, email, date } = req.body;
  
    
    let sql = 'INSERT INTO students (sName,sFName, sEmail,sDate) VALUES (?,?,?,?)';
    db.query(sql, [name,fname, email,date], (err, results) => {
        if (err) throw err;
        res.send('Data added successfully'); // Send a success message
    });


});


app.put('/update-student/:id',(req,res)=>{
    const id = req.params.id;
    const {name ,fname,email,date} = req.body;
    const sql = 'UPDATE students SET sName =?,sFName=? ,sEmail =?,sDate=? WHERE sId = ?';
    db.query(sql,[name,fname,email,date,id],(err,result)=>{
        if(err) throw err;
        res.json({message: 'Student updated Successfully'})
    });
});

app.delete('/delete-student/:id', (req, res) => {
    const id = req.params.id;
    let sql = 'delete from students where sId = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json('Deleted successfully'); // Send a success message
    });
});



const port = 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});