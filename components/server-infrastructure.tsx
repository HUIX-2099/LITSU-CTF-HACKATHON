"use client"

import { useEffect, useState } from "react"
import { Server, Activity, Cpu, HardDrive, Network, Zap } from "lucide-react"
import { LIBERIA_COUNTIES } from "@/lib/counties"

interface ServerStatus {
  name: string
  county?: string
  status: "online" | "warning" | "offline"
  cpu: number
  memory: number
  requests: number
  latency: number
}

export function ServerInfrastructure() {
  const [servers, setServers] = useState<ServerStatus[]>([])

  useEffect(() => {
    const generateServers = () => {
      const mainServer: ServerStatus = {
        name: "MONROVIA-MAIN-01",
        county: "Montserrado",
        status: "online",
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 60,
        requests: Math.floor(Math.random() * 1000) + 5000,
        latency: Math.floor(Math.random() * 10) + 5,
      }

      const countyServers: ServerStatus[] = LIBERIA_COUNTIES.map((county) => ({
        name: `${county.name.toUpperCase().replace(/\s+/g, "-")}-SRV-01`,
        county: county.name,
        status: Math.random() > 0.1 ? "online" : "warning",
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 30) + 40,
        requests: Math.floor(Math.random() * 500) + 100,
        latency: Math.floor(Math.random() * 20) + 10,
      }))

      setServers([mainServer, ...countyServers])
    }

    generateServers()
    const interval = setInterval(generateServers, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-2 border-primary p-6">
        <div className="flex items-center gap-3 mb-6">
          <Network className="w-8 h-8 text-primary" />
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">SERVER INFRASTRUCTURE</h3>
            <p className="text-xs font-mono text-white/60">REAL-TIME MONITORING SYSTEM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <div
              key={server.name}
              className={`border-2 p-4 ${
                server.status === "online"
                  ? "border-green-500/50 bg-green-500/5"
                  : server.status === "warning"
                    ? "border-yellow-500/50 bg-yellow-500/5"
                    : "border-red-500/50 bg-red-500/5"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono font-bold">{server.name}</span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    server.status === "online"
                      ? "bg-green-500 animate-pulse"
                      : server.status === "warning"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-red-500"
                  }`}
                />
              </div>

              {server.county && (
                <div className="text-xs text-white/60 mb-3 font-mono">COUNTY: {server.county.toUpperCase()}</div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-primary" />
                    <span className="font-mono">CPU</span>
                  </div>
                  <span className="font-bold">{server.cpu}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-primary" />
                    <span className="font-mono">MEM</span>
                  </div>
                  <span className="font-bold">{server.memory}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="font-mono">REQ/S</span>
                  </div>
                  <span className="font-bold">{server.requests}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="font-mono">LATENCY</span>
                  </div>
                  <span className="font-bold">{server.latency}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
