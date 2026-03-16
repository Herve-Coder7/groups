const GROUP_SIZE=10
const MIN_FEMALES=3

async function loadStudents(){

let snapshot=await db.collection("students").get()

let students=[]

snapshot.forEach(doc=>{
students.push(doc.data())
})

createGroups(students)

}

function createGroups(students){

let females=students.filter(s=>s.gender=="female")
let males=students.filter(s=>s.gender=="male")

let groups=[]

let totalGroups=Math.ceil(students.length/GROUP_SIZE)

for(let i=0;i<totalGroups;i++){
groups.push([])
}

let g=0

females.forEach(f=>{
groups[g].push(f)
g=(g+1)%groups.length
})

males.forEach(m=>{
let placed=false

for(let i=0;i<groups.length;i++){

if(groups[i].length<GROUP_SIZE){
groups[i].push(m)
placed=true
break
}

}

})

renderGroups(groups)

}

function renderGroups(groups){

let container=document.getElementById("groups")

container.innerHTML=""

groups.forEach((group,i)=>{

let div=document.createElement("div")

div.innerHTML="<h3>Group "+(i+1)+"</h3>"

group.forEach(s=>{
div.innerHTML+=s.name+" ("+s.reg+")<br>"
})

container.appendChild(div)

})

}

loadStudents()