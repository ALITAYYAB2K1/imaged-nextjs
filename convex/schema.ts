import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";
import { title } from "process";
import { use } from "react";
export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),

    plan: v.union(v.literal("free"), v.literal("pro")),
    //usage tracking for plan limits
    projectsUsed: v.number(),
    exportThisMonth: v.number(),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_plan", ["plan"]),

  projects: defineTable({
    title: v.string(),
    userId: v.id("users"),
    canvasState: v.any(), // fabric.js state canvas json
    width: v.number(),
    height: v.number(),
    originalImageUrl: v.optional(v.string()), // original image url if uploaded
    currentImageUrl: v.optional(v.string()), // current image url after processing
    thumbnailUrl: v.optional(v.string()), // thumbnail url for preview

    activeTransformation: v.optional(v.string()), // active transformation type
    backgroundRemoved: v.optional(v.boolean()), // flag to check if background is removed

    folderId: v.optional(v.id("folders")), // folder id if project is in a folder

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_folder", ["folderId"])
    .index("by_title", ["title"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_name", ["name"])
    .index("by_user_updated", ["userId", "updatedAt"]),
});
