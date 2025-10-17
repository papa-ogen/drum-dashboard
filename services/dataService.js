// services/dataService.js

/**
 * Service for handling basic data operations
 */

/**
 * Get all items from a collection
 * @param {string} collection - The collection name
 * @param {Object} db - The database instance
 * @returns {Array} Array of items
 */
export async function getAllItems(collection, db) {
  await db.read();
  return db.data[collection] || [];
}

/**
 * Get item by ID from a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @param {Object} db - The database instance
 * @returns {Object|null} The item or null if not found
 */
export async function getItemById(collection, id, db) {
  await db.read();
  const items = db.data[collection] || [];
  return items.find((item) => item.id === id) || null;
}

/**
 * Create a new item in a collection
 * @param {string} collection - The collection name
 * @param {Object} itemData - The item data
 * @param {Object} db - The database instance
 * @returns {Object} The created item
 */
export async function createItem(collection, itemData, db) {
  await db.read();

  if (!db.data[collection]) {
    db.data[collection] = [];
  }

  db.data[collection].push(itemData);
  await db.write();

  return itemData;
}

/**
 * Update an item in a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @param {Object} updateData - The update data
 * @param {Object} db - The database instance
 * @returns {Object|null} The updated item or null if not found
 */
export async function updateItem(collection, id, updateData, db) {
  await db.read();

  const items = db.data[collection] || [];
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return null;
  }

  items[itemIndex] = { ...items[itemIndex], ...updateData };
  await db.write();

  return items[itemIndex];
}

/**
 * Delete an item from a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @param {Object} db - The database instance
 * @returns {boolean} True if deleted, false if not found
 */
export async function deleteItem(collection, id, db) {
  await db.read();

  const items = db.data[collection] || [];
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return false;
  }

  items.splice(itemIndex, 1);
  await db.write();

  return true;
}
