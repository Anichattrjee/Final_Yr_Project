// middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Inside auth middleware.");
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found in cookies.");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secure-secret-key"
    );
    

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    console.log("Req User: ",req.user);

    console.log("exited auth middleware.");
    next();
    console.log("after calling next");
  } catch (error) {
    console.log("Error in auth middleware:", error.message);
    res.status(401).json({
      message: "Authentication failed",
      error: "auth middleware: " + error.message,
    });
  }
};

module.exports=authMiddleware;
