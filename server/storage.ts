
import { db, pool } from "./db";
import {
  users, members, announcements, comments, groups, groupMembers,
  type User, type InsertUser,
  type Member, type InsertMember,
  type Announcement, type InsertAnnouncement,
  type Comment, type InsertComment,
  type Group, type InsertGroup,
  type GroupMember, type InsertGroupMember
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPermissions(id: number, permissions: string[]): Promise<User>;
  getUsers(): Promise<User[]>;

  // Members
  createMember(member: InsertMember): Promise<Member>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByUserId(userId: number): Promise<Member | undefined>;
  getMembers(search?: string): Promise<Member[]>;

  // Announcements
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncements(): Promise<(Announcement & { author: User })[]>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(announcementId: number): Promise<(Comment & { author: User })[]>;

  // Groups
  createGroup(group: InsertGroup): Promise<Group>;
  getGroups(): Promise<Group[]>;
  addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember>;
  updateGroupMemberStatus(id: number, status: string): Promise<GroupMember>;
  getGroupMembers(groupId: number): Promise<(GroupMember & { member: Member })[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user as any).returning();
    return newUser;
  }
  
  async updateUserPermissions(id: number, permissions: string[]): Promise<User> {
    const [updated] = await db.update(users)
      .set({ permissions })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Members
  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getMemberByUserId(userId: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.userId, userId));
    return member;
  }

  async getMembers(search?: string): Promise<Member[]> {
    // Returns all members - filtering happens on frontend for simplicity
    return await db.select().from(members);
  }

  // Announcements
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }

  async getAnnouncements(): Promise<(Announcement & { author: User })[]> {
    const result = await db.query.announcements.findMany({
      with: {
        author: true
      },
      orderBy: [desc(announcements.createdAt)]
    });
    return result;
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComments(announcementId: number): Promise<(Comment & { author: User })[]> {
    const result = await db.query.comments.findMany({
      where: eq(comments.announcementId, announcementId),
      with: {
        author: true
      },
      orderBy: [desc(comments.createdAt)]
    });
    return result;
  }

  // Groups
  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups).values(group).returning();
    return newGroup;
  }

  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async addGroupMember(groupMember: InsertGroupMember): Promise<GroupMember> {
    const [newMember] = await db.insert(groupMembers).values(groupMember).returning();
    
    // Update member count
    await db.update(groups)
      .set({ memberCount: sql`member_count + 1` })
      .where(eq(groups.id, groupMember.groupId));
      
    return newMember;
  }

  async updateGroupMemberStatus(id: number, status: string): Promise<GroupMember> {
    const [updated] = await db.update(groupMembers)
      .set({ status })
      .where(eq(groupMembers.id, id))
      .returning();
    return updated;
  }

  async getGroupMembers(groupId: number): Promise<(GroupMember & { member: Member })[]> {
    return await db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, groupId),
      with: {
        member: true
      }
    });
  }
}

export const storage = new DatabaseStorage();
