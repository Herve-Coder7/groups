import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase setup
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Settings
const GROUP_SIZE = 10

// Password protection
let pwd = prompt("Enter admin password")
if (pwd !== "UoK2026.ICT") {
  alert("Access denied")
  window.location.href = "index.html"
}

// Wait for page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateGroups)
  loadStudents()
})

// ---------------- LOAD STUDENTS ----------------
async function loadStudents() {
  try {
    const { data: students, error } = await supabase.from("students").select("*")
    if (error) throw error

    displayGroups(students)
  } catch (err) {
    console.error(err)
    document.getElementById("groups").innerHTML =
      "<p style='color:red'>Error fetching students. Check console.</p>"
  }
}

// ---------------- GENERATE & SAVE GROUPS ----------------
async function generateGroups() {
  const { data: students, error } = await supabase.from("students").select("*")

  if (error) {
    console.error(error)
    return
  }

  if (!students || students.length === 0) {
    alert("No students to group")
    return
  }

  // Separate by gender
  let females = students.filter(s => s.gender === "female")
  let males = students.filter(s => s.gender === "male")

  let groups = []
  let groupNumber = 1

  while (males.length > 0 || females.length > 0) {
    let group = []

    // Add at least 3 females if possible
    for (let i = 0; i < 3 && females.length > 0; i++) {
      group.push(females.pop())
    }

    // Fill group up to 10
    while (group.length < GROUP_SIZE && (males.length > 0 || females.length > 0)) {
      if (males.length > 0) {
        group.push(males.pop())
      } else {
        group.push(females.pop())
      }
    }

    // SAVE group_number to Supabase
    for (let student of group) {
      const { error: updateError } = await supabase
        .from("students")
        .update({ group_number: groupNumber })
        .eq("id", student.id)

      if (updateError) {
        console.error(updateError)
      }
    }

    groups.push(group)
    groupNumber++
  }

  alert("Groups generated and saved successfully!")
  loadStudents()
}

// ---------------- DISPLAY GROUPS ----------------
function displayGroups(students) {
  const container = document.getElementById("groups")
  container.innerHTML = ""

  const grouped = {}

  students.forEach(s => {
    const g = s.group_number || "Unassigned"
    if (!grouped[g]) grouped[g] = []
    grouped[g].push(s)
  })

  for (let group in grouped) {
    const div = document.createElement("div")
    div.className = "group"

    div.innerHTML = `<h3>Group ${group}</h3>`

    grouped[group].forEach(student => {
      const p = document.createElement("p")
      p.textContent = `${student.name} (${student.reg})`

      // Remove button
      const removeBtn = document.createElement("button")
      removeBtn.textContent = "Remove"
      removeBtn.onclick = () => removeStudent(student.reg)

      // Move button
      const moveBtn = document.createElement("button")
      moveBtn.textContent = "Move"
      moveBtn.onclick = () => {
        const newGroup = prompt("Enter new group number:")
        if (newGroup) moveStudent(student.reg, parseInt(newGroup))
      }

      p.appendChild(removeBtn)
      p.appendChild(moveBtn)

      div.appendChild(p)
    })

    container.appendChild(div)
  }
}

// ---------------- REMOVE ----------------
async function removeStudent(reg) {
  if (!confirm("Remove this student?")) return

  const { error } = await supabase.from("students").delete().eq("reg", reg)

  if (error) {
    alert("Error removing student")
    console.error(error)
  } else {
    loadStudents()
  }
}

// ---------------- MOVE ----------------
async function moveStudent(reg, newGroup) {
  const { error } = await supabase
    .from("students")
    .update({ group_number: newGroup })
    .eq("reg", reg)

  if (error) {
    alert("Error moving student")
    console.error(error)
  } else {
    loadStudents()
  }
}
