const express=require('express');
const app=express();

app.use(express.urlencoded({ extended: true }));


let {students,addStudent}=require('./student.js');

let  {mentors,addMentor}=require("./mentor.js");

let {assign_mentor_student}=require("./studentMentor.js");




//get request to show all students from student database with their details
app.get('/students',(req,res)=>{
    let output=`<h1>Mentor And Student</h1><br><a href="/">Home</a><br><a href="/students">Students</a><br><a href="/mentors">Mentors</a><br><h3>List of Students</h3><table><tr> <td><b>Name</b></td> <td><b>Age</b></td> <td><b>E-mail</b></td> <td><b>Mentor</b></td></tr>`;
    let st_names=Object.keys(students);
    st_names.forEach((s)=>{
        output+=`<tr> <td>${s}</td> <td>${students[s].age}</td> <td>${students[s].e_mail}</td> <td>${students[s].mentor}<br>${(students[s].mentor.length>0)?`<a href="/students/1/${s}">Update Mentor</a>`:`<a href="/students/0/${s}">Assign Mentor</a>`}</td></tr>`
    })
    output+="<tr><td><a href='/students/add'>Add New Student</a></td></tr></table>";
    res.status(200).send(output);
})

//get request to show a form to assign or update a mentor for a student
app.get('/students/:update/:student_name',(req,res)=>{
    let update=+req.params.update;
    let s_name=req.params.student_name;
    let mt_names=Object.keys(mentors);
    let output=`<h1>Mentor And Student</h1><br><h3>${(update?"Update Mentor":"Assign Mentor")} for ${s_name}</h3><br><form method="post" action="/students/${update}/${s_name}">`;
    mt_names.forEach((m)=>{
        output+=`<b>Mentor Name: </b>${m} ,<b>Subject: </b>${mentors[m].subject} <input type="radio" name="mentor_name" value="${m}"><br>`
    })
    output+="<button type='submit'>Submit</button></form>";
    res.send(output);
})

//post request to update the database for assigning or updating a mentor to a student
app.post('/students/:update/:student_name',(req,res)=>{
    let update=(+req.params.update)?true:false;
    let s_name=req.params.student_name;
    let m_name=req.body.mentor_name;
    try{
        assign_mentor_student([s_name],m_name,update);
        res.status(200).redirect('/students');
    }
    catch(err)
    {
        res.status(400).send(err.toString()+'<br><a href="/">Home</a><br><a href="/students">Students</a><br><a href="/mentors">Mentors</a>');
    }
})

//get request to show all the mentors from mentor database
app.get('/mentors',(req,res)=>{
    let output=`<h1>Mentor And Student</h1><br><a href="/">Home</a><br><a href="/students">Students</a><br><a href="/mentors">Mentors</a><br><h3>List of Mentors</h3><table><tr> <td><b>Name</b></td> <td><b>Subject</b></td> <td><b>E-mail</b></td><td>List of Students</td></tr>`;
    let m_names=Object.keys(mentors);
    m_names.forEach((m)=>{
        output+=`<tr> <td>${m}</td> <td>${mentors[m].subject}</td> <td>${mentors[m].e_mail}</td> <td><ul>`;
        mentors[m].students.forEach((s)=>{
            output+=`<li>${s}</li>`;
        })
        output+=`<a href="/mentors/add_students/${m}">Add Students</a></ul></td></tr>`;
    })
    output+="<tr><td><a href='mentors/add'>Add New Mentor</a></td></tr></table>";
    res.status(200).send(output);
})


//get request to assign students to a mentor by displaying a form 
app.get('/mentors/add_students/:m_name',(req,res)=>{
    let m_name=req.params.m_name;
    let output=`<h1>Mentor And Student</h1><br><a href="/">Home</a><br><a href="/students">Students</a><br><a href="/mentors">Mentors</a><br><h3>Add Students for Mentor: ${m_name}</h3><br><form method="post" action="/mentors/add_students/${m_name}">`;
    let st_names=Object.keys(students);
    let students_list=false;
    st_names.forEach((s)=>{
        if(students[s].mentor.length===0)
        {
            students_list=true;
            output+=`<b>Student Name: </b>${s}<input type="radio" name="${s}" value="${s}"><br>`;
        }
    })
    if(students_list)
    {
        output+="<button type='submit'>Submit</button></form>";
    }
    else
    {
        output+='</form><h1>All Students are assigned!!!</h1>'
    }
    res.send(output);
})


//post request to update the database for assigning students to a mentor
app.post('/mentors/add_students/:m_name',(req,res)=>{
    let m_name=req.params.m_name;
    let st_names=Object.keys(req.body);
    try{
        assign_mentor_student(st_names,m_name,false);
        res.status(200).redirect('/mentors');
    }
    catch(err)
    {
        res.send(err.toString()+'<br><a href="/">Home</a><br><a href="/students">Students</a><br><a href="/mentors">Mentors</a>')
    }
})



//post request to update the database for adding new student
app.post('/students/add',(req,res)=>{
    let body=req.body;
    addStudent(body.name,body.age,body.email);
    res.status(200).redirect('/students');
    
})



//post request to update the database for adding new mentor
app.post('/mentors/add',(req,res)=>{
    let body=req.body;
    addMentor(body.name,body.subject,body.email);
    res.status(200).redirect('/mentors');
    
})



app.listen(4000,()=>{
    console.log("Server Started");
})