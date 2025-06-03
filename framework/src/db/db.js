const fs = require("fs").promises;
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

exports.getData = async (key) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData[key] ?? null;
  } catch (error) {
    console.error("Ошибка чтения БД:", error);
    return [];
  }
};

exports.saveData = async (key, value) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const json = JSON.parse(data);
    json[key] = value;
    await fs.writeFile(dbPath, JSON.stringify(json, null, 2));
  } catch (error) {
    console.error("Ошибка записи в БД:", error);
  }
};
