const OverviewRepository = require("../repo/OverviewRepository");

const getSummary = async (req, res) => {
    try {
        const newPatients = await OverviewRepository.getNewPatients();
        const appointments = await OverviewRepository.getAppointmentsToday();
        const monthlyRevenue = await OverviewRepository.getRevenue("month");

        res.json({
            newPatients,
            appointmentsToday: appointments.appointmentsToday,
            upcomingAppointments: appointments.upcomingAppointments,
            monthlyRevenue,
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy tổng quan", error: err.message });
    }
};

const getRevenue = async (req, res) => {
    try {
        const period = req.query.period || "month";
        const revenue = await OverviewRepository.getRevenue(period);
        res.json({ period, revenue });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy doanh thu", error: err.message });
    }
};

const getCriticalPatients = async (req, res) => {
    try {
        const patients = await OverviewRepository.getCriticalPatients();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách bệnh nhân cần chú ý", error: err.message });
    }
};

const getPatientHealth = async (req, res) => {
    try {
        const { patientId } = req.params;
        const period = req.query.period || "week";
        const records = await OverviewRepository.getPatientHealth(patientId, period);

        if (!records) return res.status(404).json({ message: "Bệnh nhân không tồn tại" });

        res.json({ patientId, period, records });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy chỉ số sức khỏe bệnh nhân", error: err.message });
    }
};

module.exports = {
    getSummary,
    getRevenue,
    getCriticalPatients,
    getPatientHealth,
};
