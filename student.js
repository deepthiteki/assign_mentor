let students={};
let addStudent=(name,subject,email)=>{
    students[`${name}`]={
        subject,
        email,
        mentor:""
    }
}

module.exports={students,addStudent}