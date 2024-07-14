const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let { JWT_SECRET_KEY } = process.env;

module.exports = {
  restrict: async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.split(" ")[1]) {
        return res.status(403).json({
          status: false,
          message: "Token not provided!",
          data: null,
        });
      }

      let token = authorization.split(" ")[1];
      jwt.verify(token, JWT_SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          const message = err.name === "TokenExpiredError" ? "Token expired" : err.message;
          return res.status(409).json({
            status: false,
            message,
            data: null,
          });
        }

        try {
          const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
          });

          if (!user) {
            return res.status(404).json({
              status: false,
              message: "User or token not found",
              data: null,
            });
          }

          delete user.password;
          req.user = user;

          next();
        } catch (error) {
          console.error("Error while checking user:", error);
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            data: null,
          });
        }
      });
    } catch (error) {
      next(error);
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: 'Only admin can access',
        data: null,
      });
    }
    next();
  },
  isUser: (req, res, next) => {
    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: false,
        message: 'You are not authorized to access this resource',
        data: null,
      });
    }
    next();
  },
};
