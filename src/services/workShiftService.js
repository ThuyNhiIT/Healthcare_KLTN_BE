const User = require("../models/User");
const Doctor = require("../models/Doctor");
const WorkShift = require("../models/WorkShift");

// Lấy ca làm việc của bác sĩ
const getWorkShiftsByDoctor = async (firebaseUid, date) => {
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    const query = { doctorId: doctor._id };
    if (date) {
        const d = new Date(date);
        const startOfDay = new Date(d.setHours(0, 0, 0, 0));
        const endOfDay = new Date(d.setHours(23, 59, 59, 999));
        query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const shifts = await WorkShift.find(query).sort({ date: 1, start: 1 });
    return shifts;
};

// Tạo ca làm việc
const createWorkShifts = async (firebaseUid, shiftsData) => {
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    const createdShifts = [];

    for (const shiftData of shiftsData) {
        // Kiểm tra trùng lịch
        const conflict = await WorkShift.findOne({
            doctorId: doctor._id,
            date: shiftData.date,
            $or: [{ start: { $lt: shiftData.end }, end: { $gt: shiftData.start } }]
        });

        if (conflict) throw new Error(`Đã có ca làm việc trùng ngày ${shiftData.date} ${shiftData.start}-${shiftData.end}`);

        const newShift = new WorkShift({
            doctorId: doctor._id,
            ...shiftData
        });
        await newShift.save();
        createdShifts.push(newShift);
    }

    return createdShifts;
};
// Cập nhật ca làm việc
const updateWorkShifts = async (updates) => {
    const results = [];

    for (const item of updates) {
        const { shiftId, ...updateData } = item;
        const shift = await WorkShift.findById(shiftId);
        if (!shift) throw new Error(`Không tìm thấy ca làm việc với id ${shiftId}.`);

        const allowedFields = ["date", "start", "end"];
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                shift[field] = updateData[field];
            }
        });

        await shift.save();
        results.push(shift);
    }

    return results;
};


// Xóa ca làm việc
const deleteWorkShift = async (shiftId) => {
    const shift = await WorkShift.findById(shiftId);
    if (!shift) throw new Error("Không tìm thấy ca làm việc.");

    await WorkShift.findByIdAndDelete(shiftId);
    return { message: "Xóa ca làm việc thành công." };
};

const getTodayWorkShifts = async (firebaseUid) => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    const shifts = await WorkShift.find({
        doctorId: doctor._id,
        date: { $gte: startOfDay, $lte: endOfDay }, // Query theo range ngày
    }).sort({ start: 1 });

    return shifts;
};



// Check-in
const checkInWorkShift = async (firebaseUid, method) => {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    // Tìm user và doctor
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Lấy tất cả ca hôm nay
    const shifts = await WorkShift.find({
        doctorId: doctor._id,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!shifts.length) throw new Error("Không có ca làm việc hôm nay.");

    // Giờ hiện tại (HH:mm)
    const nowStr = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
    });

    // Tìm ca phù hợp với giờ check-in
    const shift = shifts.find(s => nowStr >= s.start && nowStr <= s.end);

    if (!shift) {
        throw new Error(`Giờ hiện tại (${nowStr}) không nằm trong bất kỳ ca làm việc nào.`);
    }

    // Kiểm tra nếu đã check-in
    if (shift.attendance.checkedIn) {
        throw new Error("Đã check-in rồi.");
    }

    // Cập nhật check-in
    shift.attendance.checkedIn = true;
    shift.attendance.checkInMethod = method;
    shift.attendance.checkInTime = nowStr;

    await shift.save();
    return shift;
};


const checkOutWorkShift = async (firebaseUid, method) => {
    const now = new Date();

    // Tính start/end của ngày hôm nay
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Tìm user và doctor
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Lấy tất cả ca hôm nay
    const shifts = await WorkShift.find({
        doctorId: doctor._id,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!shifts.length) throw new Error("Không có ca làm việc hôm nay.");

    // Giờ hiện tại (HH:mm)
    const nowStr = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
    });

    // Tìm ca phù hợp với giờ check-out
    const shift = shifts.find(s => nowStr >= s.start && nowStr <= s.end);

    if (!shift) {
        throw new Error(`Giờ hiện tại (${nowStr}) không nằm trong bất kỳ ca làm việc nào.`);
    }

    if (!shift.attendance.checkedIn) {
        throw new Error("Chưa check-in, không thể check-out.");
    }
    if (shift.attendance.checkedOut) {
        throw new Error("Đã check-out rồi.");
    }

    // Cập nhật check-out
    shift.attendance.checkedOut = true;
    shift.attendance.checkOutMethod = method;
    shift.attendance.checkOutTime = nowStr;

    await shift.save();
    return shift;
};



module.exports = {
    getWorkShiftsByDoctor,
    createWorkShifts,
    updateWorkShifts,
    deleteWorkShift,
    checkInWorkShift,
    checkOutWorkShift,
    getTodayWorkShifts
};
