
import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

import { hashPassword } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  setupAuth(app);

  // Seed Data
  if (process.env.NODE_ENV !== "test") {
    const existingUsers = await storage.getUsers();
    if (existingUsers.length === 0) {
      const hashedPassword = await hashPassword("admin");
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "system_admin",
        permissions: ["create_user", "delete_user", "manage_content"]
      });
      console.log("Seeded admin user (password: admin)");
    }
  }

  // === AUTH Routes ===
  // (Handled by setupAuth mostly, but ensuring api contract alignment)

  // === USER Routes ===
  app.get(api.users.list.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role === 'member') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post(api.users.create.path, async (req, res) => {
    // Only admin can create users
    if (!req.isAuthenticated() || req.user.role === 'member') {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const input = api.users.create.input.parse(req.body);
      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword
      });
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.users.updatePermissions.path, async (req, res) => {
    // Only system_admin can update permissions
    if (!req.isAuthenticated() || req.user.role !== 'system_admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { permissions } = req.body;
    const user = await storage.updateUserPermissions(Number(req.params.id), permissions);
    res.json(user);
  });

  // === MEMBER Routes ===
  app.get(api.members.list.path, async (req, res) => {
    const members = await storage.getMembers(req.query.search as string);
    res.json(members);
  });

  app.post(api.members.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    try {
      const input = api.members.create.input.parse(req.body);
      const member = await storage.createMember(input);
      res.status(201).json(member);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.members.get.path, async (req, res) => {
    const member = await storage.getMember(Number(req.params.id));
    if (!member) return res.status(404).json({ message: "Not found" });
    res.json(member);
  });

  // === ANNOUNCEMENT Routes ===
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.post(api.announcements.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    // Check permissions if needed, for now logged in users can post as per request
    // "Both admins and regular users should be able to... post announcements"
    
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...input,
        authorId: req.user.id
      });
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === COMMENT Routes ===
  app.get(api.comments.list.path, async (req, res) => {
    const comments = await storage.getComments(Number(req.params.id));
    res.json(comments);
  });

  app.post(api.comments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.comments.create.input.parse(req.body);
      const comment = await storage.createComment({
        ...input,
        authorId: req.user.id
      });
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === GROUP Routes ===
  app.get(api.groups.list.path, async (req, res) => {
    const groups = await storage.getGroups();
    res.json(groups);
  });

  app.post(api.groups.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const input = api.groups.create.input.parse(req.body);
      const group = await storage.createGroup(input);
      res.status(201).json(group);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.groups.addMember.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(403).json({ message: "Forbidden" });
    const { memberId } = req.body;
    const groupMember = await storage.addGroupMember({
      groupId: Number(req.params.id),
      memberId: Number(memberId),
      status: 'pending'
    });
    res.status(201).json(groupMember);
  });

  app.patch('/api/group-members/:id/status', async (req, res) => {
    if (!req.isAuthenticated() || req.user.role === 'member') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { status } = req.body;
    const updated = await storage.updateGroupMemberStatus(Number(req.params.id), status);
    res.json(updated);
  });

  return httpServer;
}
