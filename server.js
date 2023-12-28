const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'W7301@jqir#',
  database: 'college_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Home Page - Students
app.get('/', (req, res) => {
  pool.query('SELECT * FROM students', (error, results, fields) => {
    if (error) throw error;

    // Render HTML using EJS and pass student data
    res.render('students', { students: results });
  });
});

// Add Student
app.post('/addStudent', (req, res) => {
  const { studentName, department, course } = req.body;

  pool.query(
    'INSERT INTO students (StudentName, Department, Course) VALUES (?, ?, ?)',
    [studentName, department, course],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/');
    }
  );
});

// Departments Page
app.get('/departments', (req, res) => {
  pool.query('SELECT * FROM departments', (error, results, fields) => {
    if (error) throw error;

    res.render('departments', { departments: results });
  });
});

// Add Department
app.post('/addDepartment', (req, res) => {
  const { departmentName, headInstructor } = req.body;

  pool.query(
    'INSERT INTO departments (department_name, head_instructor) VALUES (?, ?)',
    [departmentName, headInstructor],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/departments');
    }
  );
});

// Instructors Page
app.get('/instructors', (req, res) => {
  pool.query('SELECT * FROM instructors', (error, results, fields) => {
    if (error) throw error;

    res.render('instructors', { instructors: results });
  });
});

// Add Instructor
app.post('/addInstructor', (req, res) => {
  const { instructorName } = req.body;

  pool.query(
    'INSERT INTO instructors (instructor_name) VALUES (?)',
    [instructorName],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/instructors');
    }
  );
});

// Courses Page
app.get('/courses', (req, res) => {
  pool.query('SELECT * FROM courses', (error, results, fields) => {
    if (error) throw error;

    res.render('courses', { courses: results });
  });
});

// Add Course
app.post('/addCourse', (req, res) => {
  const { courseName, departmentId } = req.body;

  pool.query(
    'INSERT INTO courses (course_name, department_id) VALUES (?, ?)',
    [courseName, departmentId],
    (error, results, fields) => {
      if (error) throw error;

      res.redirect('/courses');
    }
  );
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});