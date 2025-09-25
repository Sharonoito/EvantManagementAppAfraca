// // components/RegisterButton.tsx
// "use client"

// import { Button } from "@/components/ui/button"

// export function RegisterButton({ userId, sessionId }: { userId: string, sessionId: string }) {
//   const handleRegister = async () => {
//     const res = await fetch("/api/register-session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId, sessionId })
//     })
//     const data = await res.json()
//     if (data.success) {
//       alert("You have registered successfully!")
//     } else {
//       alert(data.message || "Registration failed")
//     }
//   }

//   return (
//     <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleRegister}>
//       Register
//     </Button>
//   )
// }
