import { MongoClient } from "mongodb";

const users = [
  { name: "QA Customer", email: "qa.customer@fixmate.test", role: "customer" },
  { name: "QA Technician", email: "qa.technician@fixmate.test", role: "technician" },
  { name: "QA Admin", email: "qa.admin@fixmate.test", role: "admin" },
];

const password = "FixMate123";

async function main() {
  const base = "http://localhost:3000";

  for (const user of users) {
    const response = await fetch(`${base}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: base },
      body: JSON.stringify({ ...user, password }),
    });
    console.log(user.role, "sign-up", response.status, (await response.text()).slice(0, 120));
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("fixMate");

  for (const user of users) {
    const result = await db
      .collection("user")
      .updateOne({ email: user.email }, { $set: { role: user.role } });
    console.log(user.role, "role update", result.modifiedCount);
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
