import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Supabase setup
const supabaseUrl = 'https://xtcrnvodsqkpueuotqgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3Judm9kcHVldW90cWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODIxMDIsImV4cCI6MjA4OTI1ODEwMn0.U9vUuwNCr4yTLUHzUli2D4nbKTkxuqMVSZMvvZfa0Lw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Button click handler
document.getElementById("submitBtn").addEventListener("click", registerStudent)

async function registerStudent() {
  const name = document.getElementById("name").value.trim()
  const reg = document.getElementById("reg").value.trim()
  const gender = document.getElementById("gender").value

  if (!name || !reg || !gender) {
    alert("Please fill all fields")
    return
  }

  try {
    // Check for duplicate registration
    const { data: existing, error: selectError } = await supabase
      .from("students")
      .select()
      .eq("reg", reg)

    if (selectError) throw selectError

    if (existing && existing.length > 0) {
      alert("This registration number already exists")
      return
    }

    // Insert new student, group_number initially null
    const { error: insertError } = await supabase
      .from("students")
      .insert([{ name, reg, gender, group_number: null }])

    if (insertError) throw insertError

    document.getElementById("msg").textContent = "Registered successfully!"
    document.getElementById("msg").style.color = "green"

    // Clear form
    document.getElementById("name").value = ""
    document.getElementById("reg").value = ""
    document.getElementById("gender").value = ""
  } catch (err) {
    console.error(err)
    document.getElementById("msg").textContent = "Error registering. Check console."
    document.getElementById("msg").style.color = "red"
  }
}
