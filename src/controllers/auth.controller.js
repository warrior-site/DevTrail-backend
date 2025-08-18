import { createUser, findUserByEmail } from "../dao/user.dao.js";
import bcrypt from "bcrypt"
import { setCookie } from "../service/setCookies.js";


export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Run DB lookup & hashing in parallel
    const [alreadyUser, hashedPassword] = await Promise.all([
      findUserByEmail(email),
      bcrypt.hash(password, 10),
    ]);

    if (alreadyUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await createUser({ username, email, password: hashedPassword });

    // Set cookie/token
    setCookie(res, user);

    return res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set cookie/token
    setCookie(res, user);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

export const githubLoginClerk = async (req, res) => {

  try {

    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authorization.replace("Bearer ", "");
    const session = await clerkClient.sessions.verifySession(token);

    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const clerkUser = await clerkClient.users.getUser(session.userId);

    const email = clerkUser.emailAddresses[0].emailAddress;
    const username = clerkUser.username || email.split("@")[0];

    // Check if user exists in our DB
    let user = await findUserByEmail(email);
    if (!user) {
      // If first-time GitHub login → create local user entry
      user = await createUser({
        username,
        email,
        password: null, // since it's GitHub auth
      });
    }

    setCookie(res, user);

    return res.status(200).json({
      message: "GitHub login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });


  } catch (error) {
    console.log("github login error : ", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }

}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};