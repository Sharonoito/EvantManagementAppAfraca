import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"

interface UserRow {
  name?: string
  email?: string
  role?: string
  organization?: string
  title?: string
  phone?: string
  dietary_restrictions?: string
  accessibility_needs?: string
  networking_interests?: string
  firstName?: string
  lastName?: string
}

export async function POST(request: NextRequest) {
  try {
    const { sheetId, sheetName = "Sheet1", preview = false } = await request.json()

    if (!sheetId) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Sheets ID is required",
        },
        { status: 400 },
      )
    }

    const urls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    ]

    let csvData = ""
    let lastError: any = null

    for (const csvUrl of urls) {
      try {
        const response = await fetch(csvUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; EventApp/1.0)",
          },
        })

        if (response.ok) {
          csvData = await response.text()
          if (csvData && csvData.trim() && !csvData.includes("<!DOCTYPE html>")) {
            break // Success, exit loop
          }
        }
        lastError = `HTTP ${response.status}: ${response.statusText}`
      } catch (error) {
        lastError = error
        continue
      }
    }

    if (!csvData || csvData.includes("<!DOCTYPE html>")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to access Google Sheets. Please ensure:\n1. The sheet is publicly viewable (Anyone with the link can view)\n2. The sheet ID is correct\n3. The sheet contains data",
          errors: [
            "To make your sheet public:",
            "1. Open your Google Sheet",
            "2. Click 'Share' button (top right)",
            "3. Click 'Change to anyone with the link'",
            "4. Set permission to 'Viewer'",
            "5. Click 'Done'",
            `Last error: ${lastError}`,
          ],
        },
        { status: 400 },
      )
    }

    // Parse CSV data
    const lines = csvData.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Sheet must contain at least a header row and one data row",
          errors: ["Insufficient data"],
        },
        { status: 400 },
      )
    }

    // Parse CSV manually (simple implementation)
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/"/g, "").trim())
    const dataRows = lines.slice(1).map((line) => parseCSVLine(line))

    // Map headers to expected fields
    const fieldMapping: { [key: string]: string } = {
      name: "name",
      "full name": "name",
      "first name": "firstName",
      "last name": "lastName",
      email: "email",
      "email address": "email",
      role: "role",
      organization: "organization",
      company: "organization",
      title: "title",
      "job title": "title",
      phone: "phone",
      "phone number": "phone",
      "dietary restrictions": "dietary_restrictions",
      dietary: "dietary_restrictions",
      "accessibility needs": "accessibility_needs",
      accessibility: "accessibility_needs",
      "networking interests": "networking_interests",
      interests: "networking_interests",
    }

    // Process rows
    const processedData: UserRow[] = []
    const errors: string[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNum = i + 2 // +2 because we start from row 2 (after header)

      if (!row || row.every((cell) => !cell || cell.replace(/"/g, "").trim() === "")) {
        continue // Skip empty rows
      }

      const userData: UserRow = {}
      let firstName = ""
      let lastName = ""

      // Map data based on headers
      headers.forEach((header, index) => {
        const mappedField = fieldMapping[header]
        if (mappedField && row[index]) {
          const cellValue = row[index].replace(/"/g, "").trim()
          if (mappedField === "firstName") {
            firstName = cellValue
          } else if (mappedField === "lastName") {
            lastName = cellValue
          } else {
            userData[mappedField as keyof UserRow] = cellValue
          }
        }
      })

      if (firstName || lastName) {
        userData.name = `${firstName} ${lastName}`.trim()
      }

      // Validate required fields
      if (!userData.name || !userData.email) {
        const missingFields = []
        if (!userData.name) missingFields.push("name (First Name + Last Name)")
        if (!userData.email) missingFields.push("email")
        errors.push(`Row ${rowNum}: Missing required fields (${missingFields.join(", ")})`)
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        errors.push(`Row ${rowNum}: Invalid email format`)
        continue
      }

      // Set default role
      if (!userData.role) {
        userData.role = "attendee"
      }

      // Validate role
      const validRoles = ["admin", "organizer", "attendee"]
      if (!validRoles.includes(userData.role.toLowerCase())) {
        userData.role = "attendee"
      }

      processedData.push(userData)
    }

    // If preview mode, return processed data
    if (preview) {
      return NextResponse.json({
        success: true,
        preview: processedData.slice(0, 50), // Limit preview to 50 rows
        message: `Found ${processedData.length} valid rows`,
        errors: errors.slice(0, 10), // Limit errors in preview
      })
    }

    // Import users to database
    let imported = 0
    let skipped = 0
    const importErrors: string[] = []

    for (const userData of processedData) {
      try {
        // Check if user already exists
        const existingUser = await getUserByEmail(userData.email!)
        if (existingUser) {
          skipped++
          continue
        }

        // Create user
        await createUser({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: userData.email!,
          name: userData.name!,
          role: userData.role?.toLowerCase() || "attendee",
          organization: userData.organization,
          title: userData.title,
          phone: userData.phone,
          dietary_restrictions: userData.dietary_restrictions,
          accessibility_needs: userData.accessibility_needs,
          networking_interests: userData.networking_interests
            ? userData.networking_interests.split(",").map((s) => s.trim())
            : [],
        })

        imported++
      } catch (error) {
        importErrors.push(`Failed to import ${userData.email}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      imported,
      skipped,
      errors: [...errors, ...importErrors],
    })
  } catch (error) {
    console.error("Google Sheets import error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during import",
        imported: 0,
        skipped: 0,
        errors: ["Server error occurred"],
      },
      { status: 500 },
    )
  }
}
