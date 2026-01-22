import { db } from "./db";
import * as schema from "@shared/schema";
import { type User, type InsertUser, type Inquiry, type InsertInquiry } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  deleteInquiry(id: string): Promise<void>;
  updateInquiryStatus(id: string, completed: boolean): Promise<Inquiry>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(schema.inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(schema.inquiries).orderBy(desc(schema.inquiries.id));
  }

  async deleteInquiry(id: string): Promise<void> {
    await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));
  }

  async updateInquiryStatus(id: string, completed: boolean): Promise<Inquiry> {
    const [inquiry] = await db
      .update(schema.inquiries)
      .set({ completed })
      .where(eq(schema.inquiries.id, id))
      .returning();
    if (!inquiry) throw new Error("Inquiry not found");
    return inquiry;
  }
}

export const storage = new DatabaseStorage();
