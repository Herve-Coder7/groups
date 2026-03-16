// firebase config paste here

const app = firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

async function registerStudent(){

let name=document.getElementById("name").value
let reg=document.getElementById("reg").value
let gender=document.getElementById("gender").value

if(!name || !reg || !gender){
alert("Fill all fields")
return
}

// check duplicate

let query=await db.collection("students")
.where("reg","==",reg)
.get()

if(!query.empty){
alert("Registration already exists")
return
}

await db.collection("students").add({
name,
reg,
gender
})

document.getElementById("msg").innerText="Registered successfully"

}

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey)

async function registerStudent() {
  let name = document.getElementById("name").value
  let reg = document.getElementById("reg").value
  let gender = document.getElementById("gender").value

  if (!name || !reg || !gender) {
    alert("Please fill all fields")
    return
  }

  // Check for duplicate reg
  let { data: existing, error: searchError } = await supabase
    .from("students")
    .select()
    .eq("reg", reg)

  if (searchError) {
    console.error(searchError)
    alert("Error checking registration")
    return
  }

  if (existing && existing.length > 0) {
    alert("Registration number already exists")
    return
  }

  // Insert student
  let { data, error } = await supabase
    .from("students")
    .insert([{ name, reg, gender }])

  if (error) {
    console.error(error)
    alert("Error saving data")
  } else {
    document.getElementById("msg").textContent = "Registered successfully"
  }
}