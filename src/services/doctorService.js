const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getInfoDoctor = async (firebaseUid) => {
    // Tìm user theo firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
        throw new Error("Không tìm thấy user.");
    }

    // Tìm doctor gắn với user
    const doctor = await Doctor.findOne({ userId: user._id })
        .populate("userId", "username email phone avatar gender dob address role");

    if (!doctor) {
        throw new Error("Không tìm thấy bác sĩ.");
    }

    return doctor;
};


const updateDoctor = async (firebaseUid, updateData) => {
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Update thông tin User
    const userFields = ["username", "email", "phone", "avatar", "gender", "dob", "address"];
    userFields.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });
    await user.save();

    // Update thông tin Doctor
    const doctorFields = ["exp", "giay_phep", "hospital", "status"];
    doctorFields.forEach(field => {
        if (updateData[field] !== undefined) {
            doctor[field] = updateData[field];
        }
    });
    await doctor.save();

    // Populate lại để trả về đủ info
    const updatedDoctor = await Doctor.findById(doctor._id)
        .populate("userId", "username email phone avatar gender dob address role");

    return updatedDoctor;
};


const getTodayAppointmentsByDoctor = async (firebaseUid) => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Lấy user theo firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    // Lấy doctor theo userId
    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Lấy các cuộc hẹn trong ngày hôm nay, loại bỏ canceled
    let appointments = await Appointment.find({
        doctorId: doctor._id,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "canceled" }
    })
        .populate({
            path: "patientId",
            select: "age phone disease",
            populate: {
                path: "userId",
                select: "username avatar"
            }
        })
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep userId",
            populate: {
                path: "userId",
                select: "username phone email avatar gender dob address"
            }
        })
        .sort({ time: 1 });

    // Chỉ giữ các cuộc hẹn chưa diễn ra (so sánh date + time với thời gian hiện tại)
    appointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        const [hours, minutes] = appt.time.split(":").map(Number);
        apptDate.setHours(hours, minutes, 0, 0);
        return apptDate >= now;
    });

    return appointments;
};



const getUpcomingAppointmentsByDoctor = async (firebaseUid) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Lấy user theo firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    // Lấy doctor theo userId
    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Lấy các cuộc hẹn từ hôm nay trở đi, loại bỏ canceled
    let appointments = await Appointment.find({
        doctorId: doctor._id,
        date: { $gte: today },
        status: { $ne: "canceled" }
    })

        .populate({
            path: "patientId",
            select: "age phone disease",
            populate: {
                path: "userId",
                select: "username avatar"
            }
        })
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep userId",
            populate: {
                path: "userId",
                select: "username phone email avatar gender dob address"
            }
        })
        .sort({ date: 1, time: 1 });

    // Chỉ lấy các cuộc hẹn chưa diễn ra (so sánh cả date + time)
    appointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        const [hours, minutes] = appt.time.split(":").map(Number);
        apptDate.setHours(hours, minutes, 0, 0);
        return apptDate >= now;
    });

    return appointments;
};


module.exports = {
    getInfoDoctor,
    updateDoctor,
    getTodayAppointmentsByDoctor,
    getUpcomingAppointmentsByDoctor
};
