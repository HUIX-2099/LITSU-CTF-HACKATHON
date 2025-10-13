export interface Team {
  id: string
  name: string
  captain: string
  members: TeamMember[]
  score: number
  solves: number
  createdAt: string
  inviteCode?: string
}

export interface TeamMember {
  id: string
  username: string
  score: number
  role: "captain" | "member"
}

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "CyberNinjas",
    captain: "ninja_master",
    members: [
      { id: "1", username: "ninja_master", score: 1200, role: "captain" },
      { id: "2", username: "shadow_hacker", score: 800, role: "member" },
      { id: "3", username: "stealth_coder", score: 450, role: "member" },
    ],
    score: 2450,
    solves: 15,
    createdAt: "2024-01-15",
    inviteCode: "NINJA2024",
  },
  {
    id: "2",
    name: "HackTheBox",
    captain: "box_breaker",
    members: [
      { id: "4", username: "box_breaker", score: 1100, role: "captain" },
      { id: "5", username: "exploit_king", score: 700, role: "member" },
      { id: "6", username: "vuln_finder", score: 400, role: "member" },
    ],
    score: 2200,
    solves: 14,
    createdAt: "2024-01-20",
    inviteCode: "HTB2024",
  },
  {
    id: "3",
    name: "SecurityFirst",
    captain: "sec_chief",
    members: [
      { id: "7", username: "sec_chief", score: 1000, role: "captain" },
      { id: "8", username: "defense_pro", score: 650, role: "member" },
      { id: "9", username: "audit_expert", score: 450, role: "member" },
    ],
    score: 2100,
    solves: 13,
    createdAt: "2024-01-25",
    inviteCode: "SEC2024",
  },
  {
    id: "4",
    name: "BinaryExplorers",
    captain: "binary_boss",
    members: [
      { id: "10", username: "binary_boss", score: 900, role: "captain" },
      { id: "11", username: "asm_wizard", score: 600, role: "member" },
      { id: "12", username: "debugger_pro", score: 300, role: "member" },
    ],
    score: 1800,
    solves: 11,
    createdAt: "2024-02-01",
    inviteCode: "BIN2024",
  },
  {
    id: "5",
    name: "PwnStars",
    captain: "pwn_master",
    members: [
      { id: "13", username: "pwn_master", score: 850, role: "captain" },
      { id: "14", username: "shell_seeker", score: 550, role: "member" },
      { id: "15", username: "overflow_fan", score: 250, role: "member" },
    ],
    score: 1650,
    solves: 10,
    createdAt: "2024-02-05",
    inviteCode: "PWN2024",
  },
]
