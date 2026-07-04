import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, memberUsers, bookings, InsertMemberUser, InsertBooking } from "../drizzle/schema";
import { ENV } from './_core/env';
import * as bcrypt from 'bcryptjs';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createMemberUser(username: string, password: string, email?: string, fullName?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  const result = await db.insert(memberUsers).values({
    username,
    passwordHash,
    email,
    fullName,
  });

  return result;
}

export async function getMemberUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(memberUsers).where(eq(memberUsers.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function verifyMemberPassword(username: string, password: string) {
  const user = await getMemberUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export async function createBooking(memberId: number, lessonDate: Date, platform: string, notes?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(bookings).values({
    memberId,
    lessonDate,
    platform,
    notes,
  });

  return result;
}

export async function getMemberBookings(memberId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(bookings).where(eq(bookings.memberId, memberId));
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(bookings);
}

export async function getAllMemberUsers() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(memberUsers);
}
