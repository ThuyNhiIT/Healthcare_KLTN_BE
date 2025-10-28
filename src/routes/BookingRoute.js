const express = require("express");
const { checkUserJwt } = require("../middleware/jwtAction");
const bookingController = require("../controllers/BookingController");
const router = express.Router();

const BookingRoutes = (app) => {
    router.use(checkUserJwt);
    router.get("/upcoming", bookingController.findUpcomingAppointments);
    router.put("/cancel/:appointmentId", bookingController.cancelBooking);
    router.get("/doctorByDate", bookingController.getDoctorsByDate);
    router.get("/doctorShifts", bookingController.getDoctorShifts);
    router.get("/workhours/:doctorId", bookingController.getDoctorWorkHours);
    router.post("/book", bookingController.bookAppointment);
    router.get("/workhoursByDate/:doctorId", bookingController.getDoctorWorkHoursByDate);
    router.post("/followUp", bookingController.createFollowUpAppointment);
    return app.use("/api/booking", router);
};

module.exports = BookingRoutes;
