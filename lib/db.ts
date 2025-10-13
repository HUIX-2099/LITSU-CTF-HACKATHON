// Simple file-based database using JSON
// In production, this would be replaced with a real database like Supabase or PostgreSQL

export interface User {
  id: string
  username: string
  email: string
  password: string // In production, this would be hashed
  role: "user" | "admin"
  teamId?: string
  score: number
  solvedChallenges: string[]
  createdAt: string
  isOnline: boolean
  lastSeen: string
  county?: string
}

export interface Team {
  id: string
  name: string
  inviteCode: string
  members: string[]
  score: number
  createdAt: string
  county?: string
  isOnline: boolean
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  flag: string
  hints: string[]
  solvedBy: string[]
}

export interface Submission {
  id: string
  userId: string
  challengeId: string
  flag: string
  correct: boolean
  timestamp: string
}

export interface DBChallenge {
  id: string
  title: string
  description: string
  category: "web" | "crypto" | "reverse" | "pwn" | "forensics" | "misc"
  difficulty: "easy" | "medium" | "hard"
  points: number
  flag: string
  solves: number
  tags: string[]
  files?: string[]
  hints?: string[]
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  likedBy: string[]
  county?: string
  answers: ChallengeAnswer[]
}

export interface ChallengeAnswer {
  id: string
  userId: string
  username: string
  teamId?: string
  teamName?: string
  county?: string
  flag: string
  correct: boolean
  timestamp: string
}

export interface Server {
  id: string
  name: string
  type: "main" | "county"
  county?: string
  status: "online" | "offline" | "maintenance"
  cpu: number
  ram: number
  bandwidth: string
  uptime: number
  requests: number
}

// In-memory storage (simulating a database)
// In production, this would be replaced with actual database calls
const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@ctfd.io",
    password: "admin123",
    role: "admin",
    score: 0,
    solvedChallenges: [],
    createdAt: new Date().toISOString(),
    isOnline: false,
    lastSeen: new Date().toISOString(),
  },
]

let teams: Team[] = []
const submissions: Submission[] = []

const LIBERIA_COUNTIES = [
  { id: "montserrado", name: "Montserrado" },
  { id: "bomi", name: "Bomi" },
  { id: "lolphim", name: "Lolphim" },
  // Add more counties as needed
]

let challenges: DBChallenge[] = [
  {
    id: "1",
    title: "Basic SQL Injection",
    description:
      "A simple login form is vulnerable to SQL injection. Can you bypass the authentication and retrieve the flag?",
    category: "web",
    difficulty: "easy",
    points: 100,
    flag: "CTF{sql_1nj3ct10n_b4s1cs}",
    solves: 234,
    tags: ["sql", "injection", "web"],
    hints: ["Try using ' OR '1'='1", "Look at the SQL query structure"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    likedBy: [],
    answers: [],
  },
  {
    id: "2",
    title: "Caesar's Secret",
    description:
      "Julius Caesar used this cipher to protect his messages. The flag has been encrypted with ROT13. Decrypt it!",
    category: "crypto",
    difficulty: "easy",
    points: 50,
    flag: "CTF{r0t13_1s_n0t_s3cur3}",
    solves: 456,
    tags: ["caesar", "rot13", "classical"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    likedBy: [],
    answers: [],
  },
  {
    id: "3",
    title: "Hidden in Plain Sight",
    description: "We intercepted this image. There's something hidden inside it. Can you find the secret message?",
    category: "forensics",
    difficulty: "medium",
    points: 200,
    flag: "CTF{st3g4n0gr4phy_m4st3r}",
    solves: 123,
    tags: ["steganography", "image", "forensics"],
    files: ["challenge.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    likedBy: [],
    answers: [],
  },
]

const servers: Server[] = [
  {
    id: "main-monrovia",
    name: "Monrovia Main Server",
    type: "main",
    county: "montserrado",
    status: "online",
    cpu: 45,
    ram: 62,
    bandwidth: "2.4 MB/s",
    uptime: 99.9,
    requests: 15420,
  },
  ...LIBERIA_COUNTIES.map((county, index) => ({
    id: `county-${county.id}`,
    name: `${county.name} Server`,
    type: "county" as const,
    county: county.id,
    status: (index % 3 === 0 ? "maintenance" : "online") as "online" | "offline" | "maintenance",
    cpu: Math.floor(Math.random() * 60) + 20,
    ram: Math.floor(Math.random() * 70) + 20,
    bandwidth: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB/s`,
    uptime: 95 + Math.random() * 4,
    requests: Math.floor(Math.random() * 5000) + 1000,
  })),
]

// User operations
export async function createUser(username: string, email: string, password: string): Promise<User> {
  const existingUser = users.find((u) => u.email === email || u.username === username)
  if (existingUser) {
    throw new Error("User already exists")
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, hash this with bcrypt
    role: "user",
    score: 0,
    solvedChallenges: [],
    createdAt: new Date().toISOString(),
    isOnline: false,
    lastSeen: new Date().toISOString(),
  }

  users.push(newUser)
  return newUser
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) || null
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  users[userIndex] = { ...users[userIndex], ...updates }
  return users[userIndex]
}

export async function getAllUsers(): Promise<User[]> {
  return users
}

export async function deleteUser(id: string): Promise<void> {
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Remove user from their team if they're in one
  const user = users[userIndex]
  if (user.teamId) {
    await leaveTeam(id, user.teamId)
  }

  users.splice(userIndex, 1)
}

export async function updateUserStatus(id: string, isOnline: boolean): Promise<void> {
  const user = await getUserById(id)
  if (user) {
    await updateUser(id, {
      isOnline,
      lastSeen: new Date().toISOString(),
    })
  }
}

export async function getOnlineUsers(): Promise<User[]> {
  return users.filter((u) => u.isOnline)
}

// Team operations
export async function createTeam(name: string, creatorId: string): Promise<Team> {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const newTeam: Team = {
    id: Date.now().toString(),
    name,
    inviteCode,
    members: [creatorId],
    score: 0,
    createdAt: new Date().toISOString(),
    isOnline: false,
  }

  teams.push(newTeam)

  // Update user's teamId
  await updateUser(creatorId, { teamId: newTeam.id })

  return newTeam
}

export async function joinTeam(userId: string, inviteCode: string): Promise<Team> {
  const team = teams.find((t) => t.inviteCode === inviteCode)
  if (!team) {
    throw new Error("Invalid invite code")
  }

  if (!team.members.includes(userId)) {
    team.members.push(userId)
  }

  await updateUser(userId, { teamId: team.id })

  return team
}

export async function getTeamById(id: string): Promise<Team | null> {
  return teams.find((t) => t.id === id) || null
}

export async function getAllTeams(): Promise<Team[]> {
  return teams
}

export async function leaveTeam(userId: string, teamId: string): Promise<void> {
  const team = teams.find((t) => t.id === teamId)
  if (team) {
    team.members = team.members.filter((id) => id !== userId)
    if (team.members.length === 0) {
      teams = teams.filter((t) => t.id !== teamId)
    }
  }
  await updateUser(userId, { teamId: undefined })
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  const teamIndex = teams.findIndex((t) => t.id === id)
  if (teamIndex === -1) {
    throw new Error("Team not found")
  }

  teams[teamIndex] = { ...teams[teamIndex], ...updates }
  return teams[teamIndex]
}

export async function deleteTeam(id: string): Promise<void> {
  const team = teams.find((t) => t.id === id)
  if (team) {
    // Remove team reference from all members
    for (const memberId of team.members) {
      await updateUser(memberId, { teamId: undefined })
    }
  }
  teams = teams.filter((t) => t.id !== id)
}

export async function getTeamMembers(teamId: string): Promise<User[]> {
  const team = await getTeamById(teamId)
  if (!team) return []

  return users.filter((u) => team.members.includes(u.id))
}

// Submission operations
export async function submitFlag(userId: string, challengeId: string, flag: string): Promise<boolean> {
  const challenge = await getChallengeById(challengeId)
  if (!challenge) {
    throw new Error("Challenge not found")
  }

  const correct = challenge.flag === flag
  const submission: Submission = {
    id: Date.now().toString(),
    userId,
    challengeId,
    flag,
    correct,
    timestamp: new Date().toISOString(),
  }

  submissions.push(submission)

  if (correct) {
    const user = await getUserById(userId)
    if (user && !user.solvedChallenges.includes(challengeId)) {
      await updateUser(userId, {
        score: user.score + challenge.points,
        solvedChallenges: [...user.solvedChallenges, challengeId],
      })

      // Update challenge solves count
      await updateChallenge(challengeId, {
        solves: challenge.solves + 1,
      })

      // Update team score if user is in a team
      if (user.teamId) {
        const team = await getTeamById(user.teamId)
        if (team) {
          team.score += challenge.points
        }
      }
    }
  }

  return correct
}

export async function getUserSubmissions(userId: string): Promise<Submission[]> {
  return submissions.filter((s) => s.userId === userId)
}

export async function createChallenge(
  challenge: Omit<DBChallenge, "id" | "createdAt" | "updatedAt" | "solves">,
): Promise<DBChallenge> {
  const newChallenge: DBChallenge = {
    ...challenge,
    id: Date.now().toString(),
    solves: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    likedBy: [],
    answers: [],
  }

  challenges.push(newChallenge)
  return newChallenge
}

export async function getAllChallenges(): Promise<DBChallenge[]> {
  return challenges
}

export async function getChallengeById(id: string): Promise<DBChallenge | null> {
  return challenges.find((c) => c.id === id) || null
}

export async function updateChallenge(id: string, updates: Partial<DBChallenge>): Promise<DBChallenge> {
  const challengeIndex = challenges.findIndex((c) => c.id === id)
  if (challengeIndex === -1) {
    throw new Error("Challenge not found")
  }

  challenges[challengeIndex] = {
    ...challenges[challengeIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return challenges[challengeIndex]
}

export async function deleteChallenge(id: string): Promise<void> {
  challenges = challenges.filter((c) => c.id !== id)
}

export async function getAllServers(): Promise<Server[]> {
  return servers
}

export async function getServerById(id: string): Promise<Server | null> {
  return servers.find((s) => s.id === id) || null
}

export async function getServersByCounty(county: string): Promise<Server[]> {
  return servers.filter((s) => s.county === county)
}

export async function incrementChallengeViews(challengeId: string): Promise<void> {
  const challenge = await getChallengeById(challengeId)
  if (challenge) {
    await updateChallenge(challengeId, {
      views: (challenge.views || 0) + 1,
    })
  }
}

export async function toggleChallengeLike(challengeId: string, userId: string): Promise<boolean> {
  const challenge = await getChallengeById(challengeId)
  if (!challenge) return false

  const likedBy = challenge.likedBy || []
  const isLiked = likedBy.includes(userId)

  if (isLiked) {
    await updateChallenge(challengeId, {
      likes: (challenge.likes || 0) - 1,
      likedBy: likedBy.filter((id) => id !== userId),
    })
    return false
  } else {
    await updateChallenge(challengeId, {
      likes: (challenge.likes || 0) + 1,
      likedBy: [...likedBy, userId],
    })
    return true
  }
}

export async function getChallengeAnswers(challengeId: string): Promise<ChallengeAnswer[]> {
  const challenge = await getChallengeById(challengeId)
  return challenge?.answers || []
}
