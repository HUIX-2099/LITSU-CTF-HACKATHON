// Liberia's 15 counties
export const LIBERIA_COUNTIES = [
  { id: "montserrado", name: "Montserrado", capital: "Bensonville", region: "Greater Monrovia" },
  { id: "margibi", name: "Margibi", capital: "Kakata", region: "Greater Monrovia" },
  { id: "bomi", name: "Bomi", capital: "Tubmanburg", region: "Western" },
  { id: "gbarpolu", name: "Gbarpolu", capital: "Bopolu", region: "Western" },
  { id: "grand-cape-mount", name: "Grand Cape Mount", capital: "Robertsport", region: "Western" },
  { id: "bong", name: "Bong", capital: "Gbarnga", region: "Central" },
  { id: "lofa", name: "Lofa", capital: "Voinjama", region: "Northern" },
  { id: "nimba", name: "Nimba", capital: "Sanniquellie", region: "Northern" },
  { id: "grand-bassa", name: "Grand Bassa", capital: "Buchanan", region: "Southern" },
  { id: "rivercess", name: "Rivercess", capital: "Rivercess", region: "Southern" },
  { id: "sinoe", name: "Sinoe", capital: "Greenville", region: "Southern" },
  { id: "grand-gedeh", name: "Grand Gedeh", capital: "Zwedru", region: "Eastern" },
  { id: "grand-kru", name: "Grand Kru", capital: "Barclayville", region: "Southern" },
  { id: "maryland", name: "Maryland", capital: "Harper", region: "Southern" },
  { id: "river-gee", name: "River Gee", capital: "Fish Town", region: "Eastern" },
] as const

export type CountyId = (typeof LIBERIA_COUNTIES)[number]["id"]

export function getCountyById(id: string) {
  return LIBERIA_COUNTIES.find((c) => c.id === id)
}

export function getCountiesByRegion(region: string) {
  return LIBERIA_COUNTIES.filter((c) => c.region === region)
}
