import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase setup
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kc3FrcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Group settings
const GROUP_SIZE = 10
const MIN_FEMALES = 3

// Password protection
let pwd = prompt("Enter admin password")
if (pwd !== "UoK2026.ICT") {
  alert("Access denied")
  window.location.href = "index.html"
}

// Load students
async function loadStudents() {
  try {
    const { data: students, error } = await supabase.from("students").select("*")
    if (error) throw error

    if (!students || students.length === 0) {
      document.getElementById("groups").innerHTML = "<p>No students registered yet.</p>"
      return
    }

    createGroups(students)
  } catch (err) {
    console.error(err)
    document.getElementById("groups").innerHTML = "<p style='color:red'>Error fetching students. Check console.</p>"
  }
}

// Grouping logic (max 10 per group, at least 3 females)
function createGroups(students) {
  let females = students.filter(s => s.gender === "female")
  let males = students.filter(s => s.gender === "male")

  const totalGroups = Math.ceil(students.length / GROUP_SIZE)
  const groups = Array.from({ length: totalGroups }, () => [])

  // Distribute females first
  let g = 0
  females.forEach(f => {
    groups[g].push(f)
    g = (g + 1) % groups.length
  })

  // Distribute males
  males.forEach(m => {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length < GROUP_SIZE) {
        groups[i].push(m)
        break
      }
    }
  })

  renderGroups(groups)
}

// Render groups with Remove/Move buttons
function renderGroups(groups) {
  const container = document.getElementById("groups")
  container.innerHTML = ""

  groups.forEach((group, i) => {
    const div = document.createElement("div")
    div.className = "group"

    const title = document.createElement("h3")
    title.textContent = "Group " + (i + 1)
    div.appendChild(title)

    group.forEach(s => {
      const p = document.createElement("p")
      p.textContent = `${s.name} (${s.reg}) `

      // Remove button
      const removeBtn = document.createElement("button")
      removeBtn.textContent = "Remove"
      removeBtn.style.marginLeft = "10px"
      removeBtn.onclick = () => removeStudent(s.reg)

      // Move button
      const moveBtn = document.createElement("button")
      moveBtn.textContent = "Move"
      moveBtn.style.marginLeft = "5px"
      moveBtn.onclick = () => {
        const newGroup = prompt("Enter new group number (1-" + groups.length + ")")
        if (newGroup) moveStudent(s.reg, parseInt(newGroup))
      }

      p.appendChild(removeBtn)
      p.appendChild(moveBtn)
      div.appendChild(p)
    })

    container.appendChild(div)
  })
}

// Remove student from Supabase
async function removeStudent(reg) {
  if (!confirm("Are you sure you want to remove this student?")) return

  const { error } = await supabase.from("students").delete().eq("reg", reg)
  if (error) {
    alert("Error removing student")
    console.error(error)
  } else {
    loadStudents()
  }
}

// Move student to a different group (requires group_number column optional)
async function moveStudent(reg, newGroup) {
  // Optional: store group_number column
  const { error } = await supabase.from("students").update({ group_number: newGroup }).eq("reg", reg)
  if (error) {
    alert("Error moving student")
    console.error(error)
  } else {
    loadStudents()
  }
}

// Run loader
loadStudents()
