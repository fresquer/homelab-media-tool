import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 es un módulo nativo de Node.js — excluirlo del bundle de webpack
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
