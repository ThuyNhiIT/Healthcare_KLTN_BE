const workShiftService = require("../services/workShiftService");

// Lấy danh sách ca làm việc trong 1 ngày/tuần/tháng
const getWorkShiftsByDoctor = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id; // lấy từ middleware auth
        const { date } = req.query; // yyyy-mm-dd (optional)
        const shifts = await workShiftService.getWorkShiftsByDoctor(firebaseUid, date);
        return res.json(shifts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Tạo ca làm việc
const createWorkShifts = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const { shifts } = req.body; // mảng ca làm việc
        const newShifts = await workShiftService.createWorkShifts(firebaseUid, shifts);
        return res.json(newShifts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật ca làm việc
const updateWorkShifts = async (req, res) => {
    try {
        const { updates } = req.body; // mảng ca làm việc cần update
        const updatedShifts = await workShiftService.updateWorkShifts(updates);
        return res.json(updatedShifts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa ca làm việc
const deleteWorkShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const result = await workShiftService.deleteWorkShift(shiftId);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa nhiều ca làm việc
const deleteManyWorkShifts = async (req, res) => {
    try {
        const { shiftIds } = req.body; // shiftIds là 1 mảng id
        const result = await workShiftService.deleteManyWorkShifts(shiftIds);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Check-in
const checkInWorkShift = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const { method } = req.body; // chỉ nhận method = "QR" hoặc "webcam"
        const updatedShift = await workShiftService.checkInWorkShift(firebaseUid, method);
        return res.json(updatedShift);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Check-out
const checkOutWorkShift = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const { method, time } = req.body; // method = "QR" hoặc "webcam"
        const updatedShift = await workShiftService.checkOutWorkShift(firebaseUid, method, time);
        return res.json(updatedShift);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTodayWorkShifts = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const shifts = await workShiftService.getTodayWorkShifts(firebaseUid);
        return res.json(shifts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkShiftsByDoctor,
    createWorkShifts,
    updateWorkShifts,
    deleteWorkShift,
    checkInWorkShift,
    checkOutWorkShift,
    getTodayWorkShifts,
    deleteManyWorkShifts
};
