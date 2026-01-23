import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.post("/api/inquiries", async (req, res) => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const clientIp = Array.isArray(ip) ? ip[0] : ip;
      
      const inquiryData = insertInquirySchema.parse(req.body);
      
      // Check for duplicate from same IP for same package in last 24h (simple version)
      const existing = await storage.getInquiries();
      const duplicate = existing.find(i => 
        i.ipAddress === clientIp && 
        i.packageName === inquiryData.packageName &&
        i.name === inquiryData.name
      );

      if (duplicate) {
        return res.status(429).json({ error: "Você já enviou uma solicitação para este pacote recentemente." });
      }

      const inquiry = await storage.createInquiry({
        ...inquiryData,
        ipAddress: clientIp as string
      });
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "Invalid inquiry data" });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    const inquiries = await storage.getInquiries();
    res.json(inquiries);
  });

  app.delete("/api/inquiries/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await storage.deleteInquiry(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  app.patch("/api/inquiries/:id/status", async (req, res) => {
    const id = req.params.id;
    const { completed } = req.body;
    try {
      const inquiry = await storage.updateInquiryStatus(id, !!completed);
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry status" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    
    // Using explicit process.env keys to ensure they are read correctly
    const adminUser = process.env['admin'];
    const adminPass = process.env['senha'];

    console.log("Login attempt for:", username);

    if (username?.trim() === adminUser?.trim() && password?.trim() === adminPass?.trim()) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  });

  return httpServer;
}
