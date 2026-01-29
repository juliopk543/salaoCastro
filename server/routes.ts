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
      console.log("Inquiry request body:", req.body);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const clientIp = Array.isArray(ip) ? ip[0] : (typeof ip === 'string' ? ip.split(',')[0].trim() : ip);
      
      const inquiryData = insertInquirySchema.parse(req.body);
      
      const existing = await storage.getInquiries();
      
      // Get current month and year
      const now = new Date();
      const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = now.getFullYear().toString();

      // Count inquiries from this IP/WhatsApp in the current month
      const monthlyInquiries = existing.filter(i => {
        const [year, month] = i.checkIn.split('-'); // Using checkIn for date context
        const isSameUser = (i.ipAddress === clientIp || (i.ipAddress && i.ipAddress.includes(clientIp as string))) || 
                          i.whatsapp === inquiryData.whatsapp;
        const isSameMonth = year === currentYear && month === currentMonth;
        return isSameUser && isSameMonth;
      });

      if (monthlyInquiries.length >= 3) {
        return res.status(429).json({ error: "Você atingiu o limite de 3 solicitações por mês." });
      }

      const duplicate = monthlyInquiries.find(i => 
        i.packageName === inquiryData.packageName &&
        (i.name === inquiryData.name || i.whatsapp === inquiryData.whatsapp)
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
      console.error("Inquiry validation error:", error);
      res.status(400).json({ error: "Invalid inquiry data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    const inquiries = await storage.getInquiries();
    res.json(inquiries);
  });

  app.get("/api/unavailable-dates", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      const unavailableDates = inquiries
        .filter(i => i.completed)
        .map(i => ({
          start: i.checkIn,
          end: i.checkOut
        }));
      res.json(unavailableDates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unavailable dates" });
    }
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
    const adminUser = (process.env['admin'] || '').trim();
    const adminPass = (process.env['senha'] || '').trim();

    if (!adminUser || !adminPass) {
      console.error("ERRO CRÍTICO: Variáveis 'admin' ou 'senha' não configuradas no Railway!");
      return res.status(500).json({ success: false, message: "Erro de configuração no servidor" });
    }

    console.log("Login attempt for:", username);

    if (username?.trim() === adminUser && password?.trim() === adminPass) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  });

  return httpServer;
}
