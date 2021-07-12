let {students}=require('./student.js');
let {mentor}=require("./mentor.js");

let assign_mentor_student=(st_names,m_name,update)=>{
    if(st_names.length>0 && m_name)
    {
        if(update)
        {
            let tmp_m=students[st_names[0]].mentor;
            let tmp_arr=mentor[tmp_m].students;
            tmp_arr.forEach((st,idx)=>{
                if(st===st_names[0])
                {
                    tmp_arr[idx]=tmp_arr[tmp_arr.length-1];
                    tmp_arr.pop();
                }
            });
            assign_mentor_student(st_names,m_name,!update);
        }
        else
        {
            st_names.forEach(st => {
                students[st].mentor=m_name;
                mentor[m_name].students.push(`${st}`);
            });
        }
    }
    else
    {
        throw new Error("Incomplete Request!!! ");
    }
    
}

module.exports={
    assign_mentor_student
}