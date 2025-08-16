import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<void> => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.users.getCurrentUserInternal
    );
    if (user.plan === "free") {
      const projectCount: Doc<"projects">[] = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      if (projectCount.length >= 5) {
        throw new Error(
          "Free users can only create 5 projects. Please upgrade your plan to create more."
        );
      }
    }
    await ctx.db.insert("projects", {
      title: args.title,
      userId: user._id,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(user._id, {
      projectsUsed: user.projectsUsed + 1,
      lastActiveAt: Date.now(),
    });
  },
});

export const getUserProjects = query({
  handler: async (ctx): Promise<Doc<"projects">[]> => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.users.getCurrentUserInternal
    );
    const projects: Doc<"projects">[] = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return projects;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; message: string }> => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.users.getCurrentUserInternal
    );
    const project: Doc<"projects"> | null = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("You do not have permission to delete this project");
    }

    await ctx.db.delete(args.projectId);

    await ctx.db.patch(user._id, {
      projectsUsed: Math.max(user.projectsUsed - 1, 0),
      lastActiveAt: Date.now(),
    });
    return { success: true, message: "Project deleted successfully" };
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args): Promise<Doc<"projects"> | null> => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.users.getCurrentUserInternal
    );
    const project: Doc<"projects"> | null = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("You do not have permission to view this project");
    }

    return project;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    canvasState: v.optional(v.any()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    activeTransformation: v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<void> => {
    const user: Doc<"users"> = await ctx.runQuery(
      internal.users.getCurrentUserInternal
    );
    const project: Doc<"projects"> | null = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("You do not have permission to update this project");
    }
    // Collect only the provided fields to patch; always update the timestamp.
    const updateData: Partial<Doc<"projects">> = {
      updatedAt: Date.now(),
    };
    if (args.canvasState !== undefined) {
      updateData.canvasState = args.canvasState;
    }
    if (args.width !== undefined) {
      updateData.width = args.width;
    }
    if (args.height !== undefined) {
      updateData.height = args.height;
    }
    if (args.currentImageUrl !== undefined) {
      updateData.currentImageUrl = args.currentImageUrl;
    }
    if (args.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = args.thumbnailUrl;
    }
    if (args.activeTransformation !== undefined) {
      updateData.activeTransformation = args.activeTransformation;
    }
    if (args.backgroundRemoved !== undefined) {
      updateData.backgroundRemoved = args.backgroundRemoved;
    }

    await ctx.db.patch(args.projectId, updateData);
    return args.projectId;
  },
});
