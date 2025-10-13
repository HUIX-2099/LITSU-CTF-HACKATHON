export interface Challenge {
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
}

export const mockChallenges: Challenge[] = [
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
  },
  {
    id: "4",
    title: "Buffer Overflow 101",
    description:
      "A classic buffer overflow vulnerability. Exploit it to get shell access and read the flag from the server.",
    category: "pwn",
    difficulty: "hard",
    points: 500,
    flag: "CTF{buff3r_0v3rfl0w_pwn3d}",
    solves: 45,
    tags: ["buffer overflow", "binary", "exploitation"],
  },
  {
    id: "5",
    title: "XSS Playground",
    description:
      "This web application has a reflected XSS vulnerability. Craft a payload to steal the admin's cookie and get the flag.",
    category: "web",
    difficulty: "medium",
    points: 250,
    flag: "CTF{xss_c00k13_st34l3r}",
    solves: 178,
    tags: ["xss", "javascript", "web"],
  },
  {
    id: "6",
    title: "RSA Weak Keys",
    description:
      "We found an RSA encrypted message, but the key seems weak. Can you factor the modulus and decrypt the flag?",
    category: "crypto",
    difficulty: "hard",
    points: 400,
    flag: "CTF{rs4_f4ct0r1ng_ftw}",
    solves: 67,
    tags: ["rsa", "factoring", "crypto"],
  },
  {
    id: "7",
    title: "Reverse Me",
    description: "A simple binary that checks if your input is correct. Reverse engineer it to find the flag.",
    category: "reverse",
    difficulty: "medium",
    points: 300,
    flag: "CTF{r3v3rs3_3ng1n33r1ng}",
    solves: 89,
    tags: ["reverse engineering", "binary", "analysis"],
  },
  {
    id: "8",
    title: "Network Capture",
    description: "We captured some network traffic. Analyze the PCAP file and find the flag hidden in the packets.",
    category: "forensics",
    difficulty: "medium",
    points: 200,
    flag: "CTF{p4ck3t_4n4lys1s}",
    solves: 145,
    tags: ["pcap", "wireshark", "network"],
    files: ["capture.pcap"],
  },
  {
    id: "9",
    title: "Command Injection",
    description:
      "This web app executes system commands. Find a way to inject your own commands and read the flag file.",
    category: "web",
    difficulty: "easy",
    points: 150,
    flag: "CTF{c0mm4nd_1nj3ct10n}",
    solves: 267,
    tags: ["command injection", "web", "rce"],
  },
  {
    id: "10",
    title: "The Matrix",
    description: "Follow the white rabbit. Decode this mysterious message to find the flag.",
    category: "misc",
    difficulty: "easy",
    points: 100,
    flag: "CTF{f0ll0w_th3_wh1t3_r4bb1t}",
    solves: 312,
    tags: ["misc", "puzzle", "decoding"],
  },
]

export const categoryColors = {
  web: "text-primary",
  crypto: "text-secondary",
  reverse: "text-accent",
  pwn: "text-destructive",
  forensics: "text-yellow-500",
  misc: "text-green-500",
}

export const categoryBgColors = {
  web: "bg-primary/10 border-primary/20",
  crypto: "bg-secondary/10 border-secondary/20",
  reverse: "bg-accent/10 border-accent/20",
  pwn: "bg-destructive/10 border-destructive/20",
  forensics: "bg-yellow-500/10 border-yellow-500/20",
  misc: "bg-green-500/10 border-green-500/20",
}

export const difficultyColors = {
  easy: "text-green-500",
  medium: "text-yellow-500",
  hard: "text-red-500",
}
