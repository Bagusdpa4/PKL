const router = require("express").Router();

const { create, midtrans, index, show, confirmMidtrans} = require("../controllers/payment.controllers");
const { restrict } = require("../middlewares/auth.middlewares");

router.post("/payment/midtrans/confirm-midtrans", confirmMidtrans);
router.post("/payment/:orderId", restrict, create);
router.get("/payments",restrict,  index);
router.get("/payment/:id",restrict, show);
router.post("/payment/midtrans/:orderId",restrict, midtrans);

module.exports = router;
