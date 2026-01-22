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
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
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
    const adminUser = process.env.admin;
    const adminPass = process.env.senha;

    if (username === adminUser && password === adminPass) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  });

  return httpServer;
}
