const WorkShift = require("../models/WorkShift");

// Lấy danh sách ca làm
const findAll = async (filter = {}) => {
    try {
        return await WorkShift.find(filter).populate("doctorId", "name");
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách ca làm: " + error.message);
    }
};

// Lấy ca làm theo ID
const findById = async (id) => {
    try {
        return await WorkShift.findById(id).populate("doctorId", "name");
    } catch (error) {
        throw new Error("Lỗi khi lấy ca làm theo ID: " + error.message);
    }
};

// Tạo ca làm mới
const create = async (data) => {
    try {
        const shift = new WorkShift(data);
        return await shift.save();
    } catch (error) {
        throw new Error("Lỗi khi tạo ca làm: " + error.message);
    }
};

// Cập nhật ca làm
const update = async (id, data) => {
    try {
        return await WorkShift.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error("Lỗi khi cập nhật ca làm: " + error.message);
    }
};

// Xóa ca làm
const remove = async (id) => {
    try {
        return await WorkShift.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Lỗi khi xóa ca làm: " + error.message);
    }
};

// Check-in
const checkIn = async (id, method = "manual") => {
    try {
        const shift = await WorkShift.findById(id);
        if (!shift) throw new Error("Ca làm không tồn tại");
        if (shift.attendance.checkedIn) throw new Error("Đã chấm công vào");

        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);

        shift.attendance.checkedIn = true;
        shift.attendance.checkInTime = timeStr;
        shift.attendance.checkInMethod = method;
        shift.attendanceLogs.push({ type: "checkin", method, time: timeStr });

        return await shift.save();
    } catch (error) {
        throw new Error("Lỗi khi check-in: " + error.message);
    }
};

// Check-out
const checkOut = async (id, method = "manual") => {
    try {
        const shift = await WorkShift.findById(id);
        if (!shift) throw new Error("Ca làm không tồn tại");
        if (!shift.attendance.checkedIn) throw new Error("Chưa chấm công vào");
        if (shift.attendance.checkedOut) throw new Error("Đã chấm công ra");

        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);

        shift.attendance.checkedOut = true;
        shift.attendance.checkOutTime = timeStr;
        shift.attendanceLogs.push({ type: "checkout", method, time: timeStr });

        return await shift.save();
    } catch (error) {
        throw new Error("Lỗi khi check-out: " + error.message);
    }
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    checkIn,
    checkOut,
};
