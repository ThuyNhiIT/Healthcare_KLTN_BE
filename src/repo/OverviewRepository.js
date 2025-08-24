const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

const getNewPatients = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return await Patient.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    } catch (error) {
        throw new Error("Lỗi khi lấy số bệnh nhân mới: " + error.message);
    }
};

const getAppointmentsToday = async () => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todayAppointments = await Appointment.find({
            date: { $gte: start, $lte: end },
        });

        const upcomingAppointments = await Appointment.find({
            date: { $gt: end },
        });

        return {
            appointmentsToday: todayAppointments.length,
            upcomingAppointments: upcomingAppointments.length,
        };
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách lịch hẹn: " + error.message);
    }
};

const getRevenue = async (period = "month") => {
    try {
        let start, end = new Date();

        if (period === "week") {
            start = new Date();
            start.setDate(start.getDate() - 7);
        } else if (period === "month") {
            start = new Date();
            start.setDate(1);
        } else if (period === "year") {
            start = new Date(new Date().getFullYear(), 0, 1);
        }

        const payments = await Payment.find({
            timestamp: { $gte: start, $lte: end },
            status: "success",
        });

        return payments.reduce((sum, p) => sum + p.amount, 0);
    } catch (error) {
        throw new Error("Lỗi khi tính doanh thu: " + error.message);
    }
};

const getCriticalPatients = async () => {
    try {
        return await Patient.find({ status: { $ne: "Ổn định" } })
            .select("name age phone bloodType status healthRecords")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách bệnh nhân cần chú ý: " + error.message);
    }
};

const getPatientHealth = async (patientId, period = "week") => {
    try {
        const patient = await Patient.findById(patientId).lean();
        if (!patient) return null;

        const now = new Date();
        let start;
        if (period === "week") {
            start = new Date();
            start.setDate(now.getDate() - 7);
        } else if (period === "month") {
            start = new Date();
            start.setMonth(now.getMonth() - 1);
        } else if (period === "year") {
            start = new Date();
            start.setFullYear(now.getFullYear() - 1);
        }

        const records = (patient.healthRecords || []).filter(hr => new Date(hr.date) >= start);
        return records;
    } catch (error) {
        throw new Error("Lỗi khi lấy chỉ số sức khỏe bệnh nhân: " + error.message);
    }
};

module.exports = {
    getNewPatients,
    getAppointmentsToday,
    getRevenue,
    getCriticalPatients,
    getPatientHealth,
};
