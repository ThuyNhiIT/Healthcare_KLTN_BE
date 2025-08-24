const WorkShiftRepo = require("../repositories/workShiftRepository");

// Lấy tất cả ca làm (có filter theo doctorId, tuần)
const getAll = async (req, res) => {
    try {
        const { doctorId, weekStart } = req.query;
        let filter = {};
        if (doctorId) filter.doctorId = doctorId;
        if (weekStart) {
            const start = new Date(weekStart);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            filter.date = { $gte: start, $lte: end };
        }
        const shifts = await WorkShiftRepo.findAll(filter);
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy ca làm theo ID
const getById = async (req, res) => {
    try {
        const shift = await WorkShiftRepo.findById(req.params.id);
        if (!shift) return res.status(404).json({ message: "Không tìm thấy ca làm" });
        res.json(shift);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo ca làm mới
const create = async (req, res) => {
    try {
        const shift = await WorkShiftRepo.create(req.body);
        res.status(201).json(shift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật ca làm
const update = async (req, res) => {
    try {
        const shift = await WorkShiftRepo.update(req.params.id, req.body);
        res.json(shift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa ca làm
const remove = async (req, res) => {
    try {
        await WorkShiftRepo.remove(req.params.id);
        res.json({ message: "Xóa ca làm thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Check-in
const checkIn = async (req, res) => {
    try {
        const shift = await WorkShiftRepo.checkIn(req.params.id);
        res.json(shift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Check-out
const checkOut = async (req, res) => {
    try {
        const shift = await WorkShiftRepo.checkOut(req.params.id);
        res.json(shift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    checkIn,
    checkOut,
};
