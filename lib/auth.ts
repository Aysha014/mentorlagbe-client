
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.BETTER_AUTH_DB_URI as string
);

const db = client.db("mentorlagbe");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [jwt()],
});
