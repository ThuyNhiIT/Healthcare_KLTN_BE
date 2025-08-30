const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const bookingController = require("../controllers/BookingController");
const router = express.Router();

const BookingRoutes = (app) => {
    router.use(checkUserJwt);
    router.get("/upcoming", bookingController.findUpcomingAppointments);
    router.put("/cancel/:appointmentId", bookingController.cancelBooking);
    return app.use("/api/booking", router);
};

module.exports = BookingRoutes;
