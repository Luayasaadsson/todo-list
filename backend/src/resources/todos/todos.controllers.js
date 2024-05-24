import { pool } from "./../../db/connect.js";

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Create todo by user
export async function createTodoByUser(req, res) {
  try {
    const { userId } = req.params;
    const { title, content } = req.body;

    const result = await query(
      "INSERT INTO todos (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );

    if (result.affectedRows < 1)
      return res.status(400).json({ error: "Todo not created!" });

    res.status(201).json({ id: result.insertId, message: "Todo created!" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}

// Get todos by user
export async function getTodosByUser(req, res) {
  try {
    const { userId } = req.params;

    const result = await query("SELECT * FROM todos WHERE user_id = ?", [
      userId,
    ]);

    if (!result.length)
      return res.status(404).json({ message: "No todos found" });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}

// Get a specific todo by user
export async function getTodoByUser(req, res) {
  try {
    const { userId, todoId } = req.params;

    const result = await query(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId]
    );

    if (!result.length)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error details:", error);

    res.status(500).json({ error: "Database query failed!" });
  }
}

// Update todo by id
export async function updateTodoById(req, res) {
  try {
    const { id } = req.params;
    const { title, content, completed } = req.body;

    const result = await query(
      "UPDATE todos SET title = ?, content = ?, completed = ? WHERE id = ?",
      [title, content, completed, id]
    );

    if (result.affectedRows < 1)
      return res.status(404).json({ error: "Todo not updated!" });

    res.status(200).json({ message: "Todo updated!" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}

// Delete todo by id
export async function deleteTodoById(req, res) {
  try {
    const { id } = req.params;

    const result = await query("DELETE FROM todos WHERE id = ?", [id]);

    if (result.affectedRows < 1)
      return res.status(404).json({ error: "Todo not found or not deleted!" });

    res.status(200).json({ message: "Todo deleted!" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }
}
