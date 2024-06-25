const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let data = await prisma.seatClass.findMany();
      if (!data) {
        res.status(400).json({
          status: false,
          message: "failed retrive city data",
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: "success retrive city data",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
