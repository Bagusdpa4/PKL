const router = require("express").Router();

const { order, getAll, getDetail, generateQR } = require("../controllers/order.controllers");
const { restrict } = require("../middlewares/auth.middlewares");

router.post("/ticket/order/:detailFlightId", restrict, order);
router.post("/ticket/QR", restrict, generateQR);
router.get("/ticket/orders", restrict, getAll); 
router.get("/ticket/order/:orderId", restrict, getDetail);

module.exports = router;
