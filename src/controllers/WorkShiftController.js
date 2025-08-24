const WorkShiftRepo = require("../repo/workShiftRepository");

class WorkShiftController {
    async getAll(req, res) {
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
    }

    async getById(req, res) {
        try {
            const shift = await WorkShiftRepo.findById(req.params.id);
            if (!shift) return res.status(404).json({ message: "Không tìm thấy ca làm" });
            res.json(shift);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async create(req, res) {
        try {
            const shift = await WorkShiftRepo.create(req.body);
            res.status(201).json(shift);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const shift = await WorkShiftRepo.update(req.params.id, req.body);
            res.json(shift);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            await WorkShiftRepo.delete(req.params.id);
            res.json({ message: "Xóa ca làm thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async checkIn(req, res) {
        try {
            const shift = await WorkShiftRepo.checkIn(req.params.id);
            res.json(shift);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async checkOut(req, res) {
        try {
            const shift = await WorkShiftRepo.checkOut(req.params.id);
            res.json(shift);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = new WorkShiftController();
