import data from "./data.json" assert { type: "json" };
import dotenv from "dotenv";
import mongoose from "mongoose";
import Department from "../models/department.js";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("\x1b[32m%s\x1b[0m", "Database Connected...");

  console.log("\x1b[34m%s\x1b[0m", "Seeding Started...");

  console.log("\x1b[31m%s\x1b[0m", "Deleting Previous Data...");
  await Department.deleteMany({});
  await Admin.deleteMany({});
  console.log("\x1b[32m%s\x1b[0m", "Deleting Previous Data Completed...");

  console.log("\x1b[36m%s\x1b[0m", "1. Seeding Departments...");
  await Department.insertMany(data.departments);
  console.log("\x1b[35m%s\x1b[0m", "Seeding Departments Completed...");

  console.log("\x1b[36m%s\x1b[0m", "2. Seeding Admins...");
  for await (const admin of data.admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
  }
  await Admin.insertMany(data.admins);
  console.log("\x1b[35m%s\x1b[0m", "Seeding Admins Completed...");

  console.log("\x1b[34m%s\x1b[0m", "Seeding Completed...");

  process.exit(0);
};

seedData();
