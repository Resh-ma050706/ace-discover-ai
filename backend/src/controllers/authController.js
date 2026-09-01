const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );
}

async function register(req, res) {
  const {
    name,
    email,
    password,
    college,
    degree,
    department,
    studyYear,
    skills = [],
    interests = [],
    preferredLocations = [],
    preferredEventTypes = [],
    teamAvailability = "Individual",
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
      [name.trim(), normalizedEmail, passwordHash],
    );

    const user = userResult.rows[0];

    const profileResult = await client.query(
      `
        INSERT INTO student_profiles (
          user_id,
          college,
          degree,
          department,
          study_year,
          skills,
          interests,
          preferred_locations,
          preferred_event_types,
          team_availability
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10
        )
        RETURNING *
      `,
      [
        user.id,
        college || null,
        degree || null,
        department || null,
        studyYear || null,
        JSON.stringify(skills),
        JSON.stringify(interests),
        JSON.stringify(preferredLocations),
        JSON.stringify(preferredEventTypes),
        teamAvailability,
      ],
    );

    await client.query("COMMIT");

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      profile: profileResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to register student",
    });
  } finally {
    client.release();
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
}

module.exports = {
  register,
  login,
};
