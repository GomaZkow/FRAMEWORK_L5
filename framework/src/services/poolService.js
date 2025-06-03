const db = require("../db/db");

exports.getPools = async () => {
  try {
    const data = (await db.getData("pools")) ?? [];
    return data;
  } catch (error) {
    console.error("Ошибка при получении списка бассейнов:", error);
    throw new Error("Не удалось получить список бассейнов");
  }
};

exports.getPoolById = async (id) => {
  try {
    const pools = (await db.getData("pools")) ?? [];
    const pool = pools.find(pool => pool.id === Number(id));
    if (!pool) {
      throw new Error("Бассейн не найден");
    }
    return pool;
  } catch (error) {
    console.error(`Ошибка при получении бассейна с ID ${id}:`, error);
    throw error;
  }
};

exports.createPool = async (poolData) => {
  try {
    if (!poolData) {
      throw new Error("Отсутствуют данные бассейна");
    }
    const pools = (await db.getData("pools")) ?? [];
    const newPool = {
      id: pools.length ? Math.max(...pools.map(pool => pool.id)) + 1 : 1,
      ...poolData,
    };
    pools.push(newPool);
    await db.saveData("pools", pools);
    return newPool;
  } catch (error) {
    console.error("Ошибка при создании бассейна:", error);
    throw new Error("Не удалось создать бассейн");
  }
};

exports.updatePool = async (id, updateData) => {
  try {
    if (!updateData) {
      throw new Error("Отсутствуют данные для обновления");
    }
    const pools = (await db.getData("pools")) ?? [];
    const index = pools.findIndex(pool => Number(pool.id) === Number(id));
    if (index === -1) {
      throw new Error("Бассейн не найден");
    }
    pools[index] = { ...pools[index], ...updateData };
    await db.saveData("pools", pools);
    return pools[index];
  } catch (error) {
    console.error(`Ошибка при обновлении бассейна с ID ${id}:`, error);
    throw error;
  }
};

exports.patchPool = async (id, patchData) => {
  try {
    if (!patchData) {
      throw new Error("Отсутствуют данные для частичного обновления");
    }
    const pools = (await db.getData("pools")) ?? [];
    const index = pools.findIndex(pool => pool.id === Number(id));
    if (index === -1) {
      throw new Error("Бассейн не найден");
    }
    pools[index] = { ...pools[index], ...patchData };
    await db.saveData("pools", pools);
    return pools[index];
  } catch (error) {
    console.error(`Ошибка при частичном обновлении бассейна с ID ${id}:`, error);
    throw error;
  }
};

exports.deletePool = async (id) => {
  try {
    let pools = (await db.getData("pools")) ?? [];
    const initialLength = pools.length;
    pools = pools.filter(pool => pool.id !== Number(id));
    if (pools.length === initialLength) {
      throw new Error("Бассейн не найден");
    }
    await db.saveData("pools", pools);
  } catch (error) {
    console.error(`Ошибка при удалении бассейна с ID ${id}:`, error);
    throw error;
  }
};