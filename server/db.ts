import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  // #region agent log
  const hasUrl = !!process.env.DATABASE_URL;
  const urlLen = process.env.DATABASE_URL?.length ?? 0;
  fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'db.ts:getDb',message:'getDb entry',data:{hasUrl,urlLen},hypothesisId:'A',timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Supabase pooler (transaction mode) does not support prepared statements — causes 500 errors
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(client);
      // #region agent log
      fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'db.ts:getDb',message:'db created',data:{dbCreated:true},hypothesisId:'A',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'db.ts:getDb',message:'db connect failed',data:{err:String(error)},hypothesisId:'B',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  // #region agent log
  fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'db.ts:getDb',message:'getDb exit',data:{dbNull:!_db},hypothesisId:'A',timestamp:Date.now()})}).catch(()=>{});
  // #endregion
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

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
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

// TODO: add feature queries here as your schema grows.
