// scripts/seedSession.js
require("dotenv").config();
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const EVENT_ID = process.env.SEED_EVENT_ID || "PUT-YOUR-EVENT-UUID-HERE";

// =============================================
// MOCK DATA
// =============================================
const mockSessions = [
  // Pre-Congress: 27th Oct
  {
    id: 1,
    title: "AFRACA Policy Dissemination Session",
    description:
      "Insights into Central Bank Policies on Rural and Agricultural Finance: The Case of AFRACA Members",
    speaker: "Yaw Brantuo (Moderator), Panelists from Central Banks",
    session_date: "2025-10-27",
    start_time: "10:00",
    end_time: "11:30",
    location: "Main Hall",
    max_capacity: 300,
    registered_count: 150,
    is_registered: false,
  },
  {
    id: 2,
    title: "Knowledge Exchange & Special Report Presentation",
    description:
      "Presentation of the Special Report on Financing Agrifood Systems Transformation.",
    speaker: "Ezra Anyango (Moderator) + Panelists from FAO, CPI, Shamba Centre",
    session_date: "2025-10-27",
    start_time: "11:45",
    end_time: "12:45",
    location: "Main Hall",
    max_capacity: 300,
    registered_count: 120,
    is_registered: false,
  },
  {
    id: 3,
    title: "Unlocking Public Development Bank Investment",
    description:
      "Investment towards more Inclusive Food Systems for youth and women with global case studies.",
    speaker: "AgriPDB Platform / IFAD",
    session_date: "2025-10-27",
    start_time: "13:45",
    end_time: "14:45",
    location: "Main Hall",
    max_capacity: 250,
    registered_count: 200,
    is_registered: true,
  },
  {
    id: 4,
    title: "23rd AFRACA General Assembly",
    description: "Annual General Assembly for AFRACA Members.",
    speaker: "AFRACA",
    session_date: "2025-10-27",
    start_time: "16:00",
    end_time: "19:00",
    location: "Main Auditorium",
    max_capacity: 400,
    registered_count: 380,
    is_registered: false,
  },

  // Day 2: 28th Oct
  {
    id: 5,
    title: "Executive Breakfast: Masterclass on AI in Rural and Agricultural Finance",
    description:
      "Exclusive masterclass on Artificial Intelligence in Rural and Agricultural Finance.",
    speaker: "AFRACA / Pathways Technologies",
    session_date: "2025-10-28",
    start_time: "08:00",
    end_time: "10:00",
    location: "VIP Lounge",
    max_capacity: 80,
    registered_count: 80,
    is_registered: false,
  },
  {
    id: 6,
    title: "Climate Intelligence Tools for Finance",
    description: "Showcasing innovative climate intelligence tools.",
    speaker: "Alliance for Bioversity & CIAT",
    session_date: "2025-10-28",
    start_time: "10:30",
    end_time: "11:10",
    location: "Room 101",
    max_capacity: 150,
    registered_count: 75,
    is_registered: false,
  },
  {
    id: 7,
    title: "Catalysing Rural Resilience: Agri-SME Financing",
    description:
      "Financing Innovations for Agri-SMEs through Local Institutions.",
    speaker: "Small Foundation + ARIA + Vista Bank Sierra Leone",
    session_date: "2025-10-28",
    start_time: "11:10",
    end_time: "12:00",
    location: "Main Hall",
    max_capacity: 200,
    registered_count: 150,
    is_registered: true,
  },
  {
    id: 8,
    title: "The Role of Digital Lenders in Agribusiness Value Chains",
    description:
      "Exploring digital lending innovations across Africa for agribusiness financing.",
    speaker: "Small Foundation / Emerald Africa + Panellists",
    session_date: "2025-10-28",
    start_time: "12:10",
    end_time: "13:10",
    location: "Main Auditorium",
    max_capacity: 220,
    registered_count: 180,
    is_registered: false,
  },

  // Day 3: 29th Oct
  {
    id: 9,
    title: "Opening Session",
    description:
      "Keynote speeches, ministerial addresses, and official opening of the Congress.",
    speaker:
      "Thomas Essel, Dieudonne Fikiri Alimasi, Dr. Kamau Thugge, Hon. Mutahi Kagwe + IFAD & FAO",
    session_date: "2025-10-29",
    start_time: "09:15",
    end_time: "10:30",
    location: "Main Auditorium",
    max_capacity: 500,
    registered_count: 400,
    is_registered: true,
  },
  {
    id: 10,
    title: "Global Session 1: Regional Perspectives on Financing Mechanisms",
    description:
      "Global experts share regional insights on integrating finance into food systems pathways.",
    speaker: "FAO/UNDP, AFRACA, ALIDE, APRACA, CICA",
    session_date: "2025-10-29",
    start_time: "11:00",
    end_time: "13:00",
    location: "Main Hall",
    max_capacity: 400,
    registered_count: 250,
    is_registered: false,
  },
  {
    id: 11,
    title: "Business Session 1 (AFRACA): Inclusive Financing Models",
    description:
      "Maximizing transformative policies and models for resilient agri-food systems in Africa.",
    speaker: "AFRACA + Co-operative Bank of Kenya + Credit Agricole du Maroc",
    session_date: "2025-10-29",
    start_time: "14:00",
    end_time: "15:45",
    location: "Main Hall",
    max_capacity: 300,
    registered_count: 260,
    is_registered: false,
  },

  // Day 4: 30th Oct
  {
    id: 12,
    title: "Business Session 2 (APRACA): Leveraging Green Finance",
    description:
      "Accelerating sustainable agri-food systems in Asia and the Pacific.",
    speaker: "APRACA + Panelists from Thailand, India, Cambodia, Nepal, Philippines, Indonesia",
    session_date: "2025-10-30",
    start_time: "09:00",
    end_time: "10:45",
    location: "Main Hall",
    max_capacity: 350,
    registered_count: 310,
    is_registered: true,
  },
  {
    id: 13,
    title: "Business Session 3 (ALIDE): Building Resilient Agrifood Systems",
    description:
      "Latin American institutions share mechanisms to strengthen agri-food financing.",
    speaker: "ALIDE + Banco de México + Agrobanco Peru + Finagro Colombia",
    session_date: "2025-10-30",
    start_time: "11:15",
    end_time: "13:00",
    location: "Main Hall",
    max_capacity: 300,
    registered_count: 250,
    is_registered: false,
  },
  {
    id: 14,
    title: "Global Session 2: Policy Enablers for Financing Agri-food Systems",
    description:
      "Global policy enablers and frameworks to strengthen national food system pathways.",
    speaker: "AFRACA + FAO + IFAD + AGRA + UNDP",
    session_date: "2025-10-30",
    start_time: "14:45",
    end_time: "15:45",
    location: "Main Auditorium",
    max_capacity: 400,
    registered_count: 200,
    is_registered: false,
  },

  // Day 5: 31st Oct
  {
    id: 15,
    title: "Wildlife Safari / Mombasa City Tour",
    description:
      "Full-day excursion for delegates: Tsavo National Park Safari or Mombasa City Tour.",
    speaker: "AFRACA Organizing Committee",
    session_date: "2025-10-31",
    start_time: "06:30",
    end_time: "21:30",
    location: "Tsavo National Park / Mombasa",
    max_capacity: null,
    registered_count: 100,
    is_registered: false,
  },
];

// =============================================
// END MOCK DATA
// =============================================


function toISO(dateStr, timeStr) {
  const iso = new Date(`${dateStr}T${timeStr}:00`).toISOString();
  return iso;
}

async function seed() {
  if (!EVENT_ID || EVENT_ID === "PUT-YOUR-EVENT-UUID-HERE") {
    console.error("Error: SEED_EVENT_ID env var is not set or is a placeholder.");
    process.exit(1);
  }

  let client;
  try {
    client = await pool.connect();
    console.log("Database connection successful. Starting seeding process...");

    await client.query("BEGIN");

    for (const s of mockSessions) {
      const check = await client.query(
        `SELECT id FROM sessions WHERE title=$1 AND event_id=$2 LIMIT 1`,
        [s.title, EVENT_ID]
      );

      if (check.rows.length) {
        console.log(`Skipping (exists): ${s.title}`);
        continue;
      }

      const id = uuidv4();
      const startIso = toISO(s.session_date, s.start_time);
      const endIso = toISO(s.session_date, s.end_time);

      await client.query(
        // Corrected INSERT statement based on your screenshot's column order
        `INSERT INTO sessions
         (title, description, speaker_name, speaker_bio, start_time, end_time, location, max_attendees, session_type, created_at, updated_at, event_id, id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW(),$10,$11)`,
        [
          s.title,
          s.description || "",
          s.speaker || "", // Using speaker for both speaker_name and speaker_bio
          s.speaker || "",
          startIso,
          endIso,
          s.location || "",
          s.max_capacity ?? null,
          s.session_type || "presentation",
          EVENT_ID,
          id,
        ]
      );
      console.log(`Inserted: ${s.title}`);
    }

    await client.query("COMMIT");
    console.log("Seeding complete.");

  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Seeding failed:");
    console.error("  Error message:", err.message);
    console.error("  SQL State:", err.sqlState);
    console.error("  Detail:", err.detail);
    
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

seed();