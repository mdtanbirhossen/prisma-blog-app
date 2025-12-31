import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins:[process.env.APP_URL!],
  user:{
    additionalFields:{
      role:{
        type:"string",
        defaultValue:"USER",
        required:false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
});
