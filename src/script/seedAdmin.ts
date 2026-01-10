import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/authentication";

const SeedAdmin = async () => {
  try {
    console.log("**** Seeding Admin User ****");
    const adminData = {
      name: "Mr Admin1",
      email: "admin1@gmail.com",
      role: UserRole.ADMIN,
      password: "12345678",
    };
    console.log("**** Checking Admin exist or not ****");
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingAdmin) {
      throw new Error("Admin Already Exists");
    }
    const signupAdmin = await fetch(
      `${process.env.BACKEND_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signupAdmin.ok) {
      console.log("**** Admin Create****");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("**** Email verification status updated ****");
    }
    console.log({ message: "Admin Seeded Successfully", adminData });
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

SeedAdmin();
export default SeedAdmin;
