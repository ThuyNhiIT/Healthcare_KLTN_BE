const appointmentRepository = require("../repo/appointmentRepository");

// Lấy lịch hẹn theo ngày / tuần + filter + phân trang
const getAppointments = async (req, res) => {
    try {
        const { view = "day", date, keyword, page, limit } = req.query;

        const filter = {};

        // Lọc theo ngày / tuần
        const now = new Date();
        let start, end;
        if (view === "day") {
            start = new Date(date || now);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 1);
        } else if (view === "week") {
            const d = date ? new Date(date) : now;
            const day = d.getDay(); // 0-Chủ nhật, 1-Thứ 2,...
            start = new Date(d);
            start.setDate(d.getDate() - day + 1); // Thứ 2
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 7); // Chủ nhật
        }
        filter.dateTime = { $gte: start, $lt: end };

        // Search keyword: tên bệnh nhân, bệnh lý, bác sĩ, lý do khám
        if (keyword) {
            filter.$or = [
                { reason: { $regex: keyword, $options: "i" } },
                { type: { $regex: keyword, $options: "i" } },
            ];
        }

        const appointments = await appointmentRepository.getAppointments(filter, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 5,
        });

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy chi tiết lịch hẹn
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await appointmentRepository.getAppointmentById(req.params.id);
        if (!appointment)
            return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm lịch hẹn mới
const createAppointment = async (req, res) => {
    try {
        const appointment = await appointmentRepository.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật lịch hẹn
const updateAppointment = async (req, res) => {
    try {
        const appointment = await appointmentRepository.updateAppointment(req.params.id, req.body);
        if (!appointment)
            return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa lịch hẹn
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await appointmentRepository.deleteAppointment(req.params.id);
        if (!appointment)
            return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
        res.json({ message: "Xóa lịch hẹn thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};
