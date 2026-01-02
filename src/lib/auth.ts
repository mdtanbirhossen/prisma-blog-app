import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <blog@prisma.com>',
          to: user.email,
          subject: "Prisma Blog - Email Verification",
          text: "Hello world?", // Plain-text version of the message
          html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Email Verification</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #f4f6f8;
                font-family: Arial, Helvetica, sans-serif;
              }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #4f46e5;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .verify-button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
    }
    .footer {
      background-color: #f4f6f8;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #666666;
    }
    .link {
      word-break: break-all;
      color: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <div class="content">
      <h2>Email Verification</h2>
      <p>Hello, ${user.name}</p>

      <p>
        Thank you for signing up for <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below:
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste the following link into your browser:
      </p>

      <p class="link">${verificationUrl}</p>

      <p>
        This link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>Best regards,<br />Prisma Blog Team</p>
    </div>

    <div class="footer">
      <p>© 2026 Prisma Blog. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw new Error("Failed to send verification email");
      }
    },
  },
  socialProviders: {
    google: {
      prompt:"select_account consent",
      accessType:"offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
