const cron = require("node-cron");
const { sequelize, Employee } = require("../models"); // import thêm sequelize

cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("🟡 Running monthly day_off update job...");

    const [rowsUpdated] = await Employee.update(
      { day_off: sequelize.literal("day_off + 1") },
      { where: { role: "employee" } }
    );

    console.log(`✅ Updated day_off for ${rowsUpdated} employees`);
  } catch (err) {
    console.error("❌ Error updating day_off:", err);
  }
});
