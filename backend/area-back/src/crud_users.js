/**
 * Database client instance for performing CRUD operations.
 * @type {Object}
 */
const client = require('./db');

/**
 * Creates a new user in the database.
 *
 * @param {string} email - The email of the user to be created.
 * @param {Array} areas - The areas associated with the user.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
async function createUser(email, areas) {
  const query = 'INSERT INTO users(email, areas) VALUES($1, $2) RETURNING *';
  const values = [email, areas];
  const res = await client.query(query, values);
  console.log('User Created:', res.rows[0]);
}

/**
 * Fetches all users from the database.
 *
 * @async
 * @function getUsers
 * @returns {Promise<void>} A promise that resolves when the users have been fetched and logged.
 */
async function getUsers() {
  const query = 'SELECT * FROM users';
  const res = await client.query(query);
  console.log('Users:', res.rows);
}

/**
 * Updates a user's email and areas in the database.
 *
 * @param {number} id - The ID of the user to update.
 * @param {string} newEmail - The new email address for the user.
 * @param {Array} newAreas - The new areas associated with the user.
 * @returns {Promise<void>} - A promise that resolves when the user is updated.
 */
async function updateUser(id, newEmail, newAreas) {
  const query = 'UPDATE users SET email = $1, areas = $2 WHERE id = $3 RETURNING *';
  const values = [newEmail, newAreas, id];
  const res = await client.query(query, values);
  console.log('User Updated:', res.rows[0]);
}

/**
 * Deletes a user from the database by their ID.
 *
 * @async
 * @function deleteUser
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 */
async function deleteUser(id) {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const values = [id];
  const res = await client.query(query, values);
  console.log('User Deleted:', res.rows[0]);
}

// Export the functions for use in other modules.
module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};
