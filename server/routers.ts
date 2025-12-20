import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { 
  federations, 
  clubs, 
  events, 
  athletes, 
  coaches, 
  venues,
  schools,
  media 
} from "../drizzle/schema";
import { eq, desc, like, and } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== FEDERATIONS =====
  federations: router({
    list: publicProcedure
      .input(z.object({
        search: z.string().optional(),
        type: z.enum(["federation", "umbrella", "ministry", "commission"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.search) {
          conditions.push(like(federations.name, `%${input.search}%`));
        }
        if (input?.type) {
          conditions.push(eq(federations.type, input.type));
        }

        const result = await db
          .select()
          .from(federations)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(federations.id);

        return result;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(federations)
          .where(eq(federations.id, input.id))
          .limit(1);

        return result[0] || null;
      }),

    getByAbbreviation: publicProcedure
      .input(z.object({ abbreviation: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(federations)
          .where(eq(federations.abbreviation, input.abbreviation))
          .limit(1);

        return result[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        abbreviation: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        backgroundImage: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        youtube: z.string().optional(),
        type: z.enum(["federation", "umbrella", "ministry", "commission"]).default("federation"),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(federations).values(input).returning({ id: federations.id });
        return { success: true, id: result.id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        abbreviation: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        backgroundImage: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        youtube: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...data } = input;
        await db.update(federations).set(data).where(eq(federations.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(federations).where(eq(federations.id, input.id));
        return { success: true };
      }),
  }),

  // ===== CLUBS =====
  clubs: router({
    list: publicProcedure
      .input(z.object({
        federationId: z.number().optional(),
        region: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.federationId) {
          conditions.push(eq(clubs.federationId, input.federationId));
        }
        if (input?.region) {
          conditions.push(eq(clubs.region, input.region));
        }
        if (input?.search) {
          conditions.push(like(clubs.name, `%${input.search}%`));
        }

        const result = await db
          .select()
          .from(clubs)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(clubs.name);

        return result;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(clubs)
          .where(eq(clubs.id, input.id))
          .limit(1);

        return result[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(clubs).values(input).returning({ id: clubs.id });
        return { success: true, id: result.id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...data } = input;
        await db.update(clubs).set(data).where(eq(clubs.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(clubs).where(eq(clubs.id, input.id));
        return { success: true };
      }),
  }),

  // ===== EVENTS =====
  events: router({
    list: publicProcedure
      .input(z.object({
        federationId: z.number().optional(),
        upcoming: z.boolean().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.federationId) {
          conditions.push(eq(events.federationId, input.federationId));
        }
        if (input?.search) {
          conditions.push(like(events.name, `%${input.search}%`));
        }

        const result = await db
          .select()
          .from(events)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(events.startDate));

        return result;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(events)
          .where(eq(events.id, input.id))
          .limit(1);

        return result[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        description: z.string().optional(),
        posterUrl: z.string().optional(),
        eventType: z.enum(["competition", "tournament", "training", "workshop", "meeting", "other"]).default("competition"),
        startDate: z.date(),
        endDate: z.date(),
        registrationDeadline: z.date().optional(),
        location: z.string().optional(),
        region: z.string().optional(),
        venue: z.string().optional(),
        registrationUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(events).values(input).returning({ id: events.id });
        return { success: true, id: result.id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        posterUrl: z.string().optional(),
        eventType: z.enum(["competition", "tournament", "training", "workshop", "meeting", "other"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        registrationDeadline: z.date().optional(),
        location: z.string().optional(),
        region: z.string().optional(),
        venue: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...data } = input;
        await db.update(events).set(data).where(eq(events.id, id));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(events).where(eq(events.id, input.id));
        return { success: true };
      }),
  }),

  // ===== ATHLETES =====
  athletes: router({
    list: publicProcedure
      .input(z.object({
        federationId: z.number().optional(),
        clubId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.federationId) {
          conditions.push(eq(athletes.federationId, input.federationId));
        }
        if (input?.clubId) {
          conditions.push(eq(athletes.clubId, input.clubId));
        }

        const result = await db
          .select()
          .from(athletes)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(athletes.name);

        return result;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        clubId: z.number().optional(),
        biography: z.string().optional(),
        profilePhotoUrl: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        achievements: z.string().optional(),
        currentRanking: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(athletes).values(input).returning({ id: athletes.id });
        return { success: true, id: result.id };
      }),
  }),

  // ===== COACHES =====
  coaches: router({
    list: publicProcedure
      .input(z.object({
        federationId: z.number().optional(),
        clubId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.federationId) {
          conditions.push(eq(coaches.federationId, input.federationId));
        }
        if (input?.clubId) {
          conditions.push(eq(coaches.clubId, input.clubId));
        }

        const result = await db
          .select()
          .from(coaches)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(coaches.name);

        return result;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        clubId: z.number().optional(),
        biography: z.string().optional(),
        profilePhotoUrl: z.string().optional(),
        certifications: z.string().optional(),
        specialization: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(coaches).values(input).returning({ id: coaches.id });
        return { success: true, id: result.id };
      }),
  }),

  // ===== VENUES =====
  venues: router({
    list: publicProcedure
      .input(z.object({
        region: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.region) {
          conditions.push(eq(venues.region, input.region));
        }
        if (input?.search) {
          conditions.push(like(venues.name, `%${input.search}%`));
        }

        const result = await db
          .select()
          .from(venues)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(venues.name);

        return result;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        photoUrl: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        capacity: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const [result] = await db.insert(venues).values(input).returning({ id: venues.id });
        return { success: true, id: result.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
