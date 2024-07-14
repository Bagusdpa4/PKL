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
  getDetailPlanes: async (req, res, next) => {
    try {
      const planeId = parseInt(req.params.id);
      const plane = await prisma.plane.findUnique({
        where: { id: planeId },
        include: {
            DetailPlane: {
              include: {
                seat_class: true
              }
            }
          },
      });

      if (plane) {
        res.status(200).json({
          status: true,
          message: "Plane details retrieved successfully",
          data: plane,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Plane not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
