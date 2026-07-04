import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { z } from "zod";
import { createMemberUser, getMemberUserByUsername, verifyMemberPassword, createBooking, getMemberBookings, getAllBookings, getAllMemberUsers } from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Member authentication and management
  member: router({
    register: publicProcedure
      .input(z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(6),
        email: z.string().email().optional(),
        fullName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Check if username already exists
          const existing = await getMemberUserByUsername(input.username);
          if (existing) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already taken",
            });
          }

          await createMemberUser(
            input.username,
            input.password,
            input.email,
            input.fullName
          );

          return { success: true, message: "Account created successfully" };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create account",
          });
        }
      }),

    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const user = await verifyMemberPassword(input.username, input.password);
          if (!user) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid username or password",
            });
          }

          return {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullName: user.fullName,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Login failed",
          });
        }
      }),
  }),

  // Booking management
  booking: router({
    create: publicProcedure
      .input(z.object({
        memberId: z.number(),
        lessonDate: z.date(),
        platform: z.enum(["zoom", "whatsapp", "telegram", "signal"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await createBooking(
            input.memberId,
            input.lessonDate,
            input.platform,
            input.notes
          );

          return { success: true, message: "Booking created successfully" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create booking",
          });
        }
      }),

    getMemberBookings: publicProcedure
      .input(z.object({ memberId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await getMemberBookings(input.memberId);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch bookings",
          });
        }
      }),
  }),

  // Admin management
  admin: router({
    getAllMembers: adminProcedure.query(async () => {
      try {
        return await getAllMemberUsers();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch members",
        });
      }
    }),

    getAllBookings: adminProcedure.query(async () => {
      try {
        return await getAllBookings();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch bookings",
        });
      }
    }),

    createMember: adminProcedure
      .input(z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(6),
        email: z.string().email().optional(),
        fullName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Check if username already exists
          const existing = await getMemberUserByUsername(input.username);
          if (existing) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already taken",
            });
          }

          await createMemberUser(
            input.username,
            input.password,
            input.email,
            input.fullName
          );

          return { success: true, message: "Member created successfully" };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create member",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
