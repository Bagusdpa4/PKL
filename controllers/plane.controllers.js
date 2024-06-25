const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllPlanes: async (req, res, next) => {
    try {
      const planes = await prisma.plane.findMany();

      res.status(200).json({
        status: true,
        message: "All planes retrieved successfully",
        data: planes,
      });
    } catch (error) {
      next(error);
    }
  },
};