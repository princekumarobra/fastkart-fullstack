
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    console.warn(`Could not find the build directory: ${distPath}`);
    return;
  }

  app.use(express.static(distPath));

  app.use(async (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
