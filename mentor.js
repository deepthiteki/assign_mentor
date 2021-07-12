let mentor={};
let addMentor=(name,subject,email)=>{
    mentor[`${name}`]={
        subject,
        email,
        students:[]
    }
}

module.exports={mentor,addMentor}