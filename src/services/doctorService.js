const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Patient = require("../models/Patient");
const moment = require("moment");

const getInfoDoctor = async (firebaseUid) => {
    // Tìm user theo firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
        throw new Error("Không tìm thấy user.");
    }

    // Tìm doctor gắn với user
    const doctor = await Doctor.findOne({ userId: user._id })
        .populate("userId", "specialty username email phone avatar gender dob address role ");

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
    const doctorFields = ["exp", "giay_phep", "hospital", "status", "specialty"];

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
        .sort({ date: 1, time: 1 });

    // Chỉ lấy các cuộc hẹn chưa diễn ra (so sánh cả date + time)
    appointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        if (appt.time) {
            const [hours, minutes] = appt.time.split(":").map(Number);
            apptDate.setHours(hours, minutes, 0, 0);
        }
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

const updateAppointment = async (appointmentId, updateData) => {
    // Tìm lịch hẹn
    const appointment = await Appointment.findById(appointmentId);
    console.log("appointmentId:", appointmentId);
    if (!appointment) {
        throw new Error("Không tìm thấy lịch hẹn.");
    }

    // Các field cho phép chỉnh sửa
    const allowedFields = ["date", "time", "type", "reason", "notes", "status"];
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            appointment[field] = updateData[field];
        }
    });

    await appointment.save();

    // Populate dữ liệu để trả về đầy đủ thông tin
    const updatedAppointment = await Appointment.findById(appointment._id)
        .populate({
            path: "patientId",
            select: "age phone disease",
            populate: {
                path: "userId",
                select: "username avatar email phone dob gender"
            }
        })
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep",
            populate: {
                path: "userId",
                select: "username avatar email phone dob gender"
            }
        });

    return updatedAppointment;
};

const getAppointmentById = async (appointmentId) => {
    const appointment = await Appointment.findById(appointmentId)
        .populate({
            path: "patientId",
            select: "age phone disease",
            populate: {
                path: "userId",
                select: "username avatar email phone dob gender address"
            }
        })
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep",
            populate: {
                path: "userId",
                select: "username avatar email phone dob gender address"
            }
        });

    if (!appointment) {
        throw new Error("Không tìm thấy lịch hẹn.");
    }

    return appointment;
};

const deleteAppointment = async (appointmentId) => {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new Error("Không tìm thấy lịch hẹn.");
    }

    await Appointment.findByIdAndDelete(appointmentId);

    return { message: "Xóa lịch hẹn thành công." };
};

const getPatientPastAppointments = async (firebaseUid, patientId) => {
    const now = new Date();

    // Lấy bác sĩ từ firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // Lấy các lịch hẹn đã qua
    let appointments = await Appointment.find({
        doctorId: doctor._id,
        patientId: patientId,
        status: { $ne: "canceled" }
    })
        .populate("patientId", "age")
        .populate({
            path: "doctorId",
            select: "hospital exp status giay_phep userId",
            populate: {
                path: "userId",
                select: "username phone email avatar gender dob address"
            }
        })
        .sort({ date: -1, time: -1 }); // mới nhất lên trước

    // Lọc chính xác theo giờ phút
    appointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        if (appt.time) {
            const [hours, minutes] = appt.time.split(":").map(Number);
            apptDate.setHours(hours, minutes, 0, 0);
        }
        return apptDate <= now; // chỉ lấy lịch đã diễn ra
    });

    return appointments;
};

const getSummary = async (firebaseUid) => {
    try {
        // Tìm user theo firebaseUid
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) throw new Error('Không tìm thấy user.');

        // Tìm doctor theo userId
        const doctor = await Doctor.findOne({ userId: user._id });
        if (!doctor) throw new Error('Không tìm thấy bác sĩ.');

        // New patients: Đếm bệnh nhân mới trong tuần này (7 ngày gần nhất)
        const newPatients = await Patient.countDocuments({
            createdAt: { $gte: moment().subtract(7, 'days').toDate() },
        });

        // Old patients: Đếm bệnh nhân trong tuần trước (từ 14 ngày đến 7 ngày trước)
        const oldPatients = await Patient.countDocuments({
            createdAt: {
                $gte: moment().subtract(14, 'days').toDate(),
                $lt: moment().subtract(7, 'days').toDate(),
            },
        });

        // Tính phần trăm thay đổi
        const newPatientsChange =
            oldPatients === 0
                ? newPatients > 0
                    ? '+100% so với tuần trước'
                    : '0% so với tuần trước'
                : `${((newPatients - oldPatients) / oldPatients * 100).toFixed(2)}% so với tuần trước`;

        // Appointments today: Dùng Appointment thay vì Payment
        const appointmentsToday = await Appointment.countDocuments({
            doctorId: doctor._id,
            date: {
                $gte: moment().startOf('day').toDate(),
                $lte: moment().endOf('day').toDate(),
            },
            status: { $ne: 'canceled' },
        });

        // Upcoming appointments: Dùng Appointment
        const upcomingAppointments = await Appointment.countDocuments({
            doctorId: doctor._id,
            date: { $gt: moment().endOf('day').toDate() },
            status: { $ne: 'canceled' },
        });

        // Monthly revenue
        const monthlyRevenue = await Payment.aggregate([
            {
                $match: {
                    doctorId: doctor._id,
                    timestamp: { $gte: moment().startOf('month').toDate() },
                    status: 'success',
                },
            },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const monthlyRevenueValue = monthlyRevenue[0]?.total || 0;
        const monthlyRevenueFormatted = `${monthlyRevenueValue.toLocaleString()} đ`;

        // Old revenue: Doanh thu tháng trước
        const oldRevenue = await Payment.aggregate([
            {
                $match: {
                    doctorId: doctor._id,
                    timestamp: {
                        $gte: moment().subtract(1, 'month').startOf('month').toDate(),
                        $lt: moment().startOf('month').toDate(),
                    },
                    status: 'success',
                },
            },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const oldRevenueValue = oldRevenue[0]?.total || 0;
        const monthlyRevenueChange =
            oldRevenueValue === 0
                ? monthlyRevenueValue > 0
                    ? 'Tăng 100%'
                    : 'Không đổi'
                : `${((monthlyRevenueValue - oldRevenueValue) / oldRevenueValue * 100).toFixed(2)}% so với tháng trước`;

        return {
            newPatients,
            newPatientsChange,
            appointmentsToday,
            upcomingAppointments,
            monthlyRevenue: monthlyRevenueFormatted,
            monthlyRevenueChange,
        };
    } catch (error) {
        throw new Error(`Lỗi lấy summary: ${error.message}`);
    }
};

// Lấy doanh thu theo period
const getRevenue = async (firebaseUid, period) => {
    try {

        const user = await User.findOne({ uid: firebaseUid });
        console.log("User found:", user ? user._id.toString() : null);
        if (!user) throw new Error("Không tìm thấy user.");

        const doctor = await Doctor.findOne({ userId: user._id });
        if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

        // Xác định khoảng thời gian & format nhóm
        let startDate, groupFormat, unit;
        if (period === "week") {
            startDate = moment().subtract(7, "days");
            groupFormat = "%Y-%m-%d"; // format Mongo
            unit = "day";
        } else if (period === "month") {
            startDate = moment().subtract(30, "days");
            groupFormat = "%Y-%m-%d";
            unit = "day";
        } else if (period === "year") {
            startDate = moment().subtract(1, "year");
            groupFormat = "%Y-%m"; // format Mongo
            unit = "month";
        } else {
            throw new Error("Period không hợp lệ");
        }

        // Aggregation pipeline
        const revenues = await Payment.aggregate([
            {
                $match: {
                    doctorId: doctor._id,
                    timestamp: { $gte: startDate.toDate() },
                    status: "success"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: "$timestamp",
                            timezone: "Asia/Ho_Chi_Minh"
                        }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);


        // Map để lookup
        const revenueMap = new Map(revenues.map(r => [r._id, r.total]));

        // Tạo nhãn + dữ liệu đầy đủ
        const labels = [];
        const data = [];
        let current = startDate.clone();
        const endDate = moment();

        while (current.isSameOrBefore(endDate, unit)) {
            const label =
                unit === "day"
                    ? current.format("YYYY-MM-DD")
                    : current.format("YYYY-MM");
            const value = revenueMap.get(label) || 0;
            labels.push(label);
            data.push(value);
            current.add(1, unit);
        }

        return {
            xAxisData: labels,
            data
        };
    } catch (error) {
        throw new Error(`Lỗi lấy revenue: ${error.message}`);
    }
};



// Lấy danh sách bệnh nhân cần chú ý
const getPatientsAttention = async (firebaseUid) => {
    try {
        // Tìm doctor theo firebaseUid
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) throw new Error('Không tìm thấy user.');

        const doctor = await Doctor.findOne({ userId: user._id });
        if (!doctor) throw new Error('Không tìm thấy bác sĩ.');

        // Lấy tất cả bệnh nhân có status khác "Ổn định" và có userId
        const patients = await Patient.find({
            status: { $ne: 'Ổn định' },
            userId: { $exists: true, $ne: null }
        }).populate('userId', 'username phone avatar');

        // Chỉ giữ bệnh nhân có userId populate thành công
        const validPatients = patients.filter(p => p.userId !== null);

        // Format dữ liệu trả về
        const formattedPatients = validPatients.map((p) => {
            const lastHealthRecord = p.healthRecords[p.healthRecords.length - 1] || {};
            return {
                _id: p._id, // Để fetch health data
                name: p.userId?.username || "Chưa có tên",
                age: p.age,
                bloodPressure: lastHealthRecord.bloodPressure || 'N/A',
                heartRate: lastHealthRecord.heartRate || 0,
                warning:
                    p.status === 'Khẩn cấp'
                        ? 'Huyết áp cao'
                        : p.status === 'Cần theo dõi'
                            ? 'Đường huyết thấp'
                            : 'Khác',
                image: p.userId?.avatar || 'default-avatar.jpg',
                phone: p.userId?.phone || p.phone || "N/A",
            };
        });

        return formattedPatients;
    } catch (error) {
        throw new Error(`Lỗi lấy patients: ${error.message}`);
    }
};


// Lấy dữ liệu sức khỏe của bệnh nhân
const getPatientHealth = async (patientId, period) => {
    try {
        let startDate;
        if (period === "week") startDate = moment().subtract(7, "days");
        else if (period === "month") startDate = moment().subtract(30, "days");
        else if (period === "year") startDate = moment().subtract(1, "year");
        else throw new Error("Period không hợp lệ");

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error("Không tìm thấy bệnh nhân");

        // So sánh ngày chính xác
        const records = patient.healthRecords.filter(
            (r) => new Date(r.date) >= startDate.toDate()
        );

        // Xử lý dữ liệu theo period
        const xAxisData = records.map((r) =>
            moment(r.date).format(period === "year" ? "YYYY-MM" : "YYYY-MM-DD")
        );

        const bloodPressureData = records.map(
            (r) => parseInt(r.bloodPressure.split("/")[0]) || 0
        );
        const heartRateData = records.map((r) => r.heartRate || 0);
        const bloodSugarData = records.map((r) => r.bloodSugar || 0);

        return {
            xAxisData: [...new Set(xAxisData)],
            bloodPressureData,
            heartRateData,
            bloodSugarData,
        };
    } catch (error) {
        throw new Error(`Lỗi lấy health data: ${error.message}`);
    }
};

const updatePatientHealthInfo = async (patientId, healthData) => {
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error("Không tìm thấy bệnh nhân.");
        const { disease, status, allergies, notes } = healthData;
        if (disease !== undefined) patient.disease = disease;
        if (status !== undefined) {
            const validStatuses = ["Cần theo dõi", "Ổn định", "Đang điều trị", "Theo dõi"];
            if (!validStatuses.includes(status)) {
                throw new Error("Tình trạng không hợp lệ.");
            }
            patient.status = status;
        }
        if (allergies !== undefined) patient.allergies = allergies;
        if (notes !== undefined) patient.notes = notes;
        await patient.save();
        return patient;
    } catch (error) {
        throw new Error(`Lỗi cập nhật thông tin y tế: ${error.message}`);
    }
}
module.exports = {
    getInfoDoctor,
    updateDoctor,
    getTodayAppointmentsByDoctor,
    getUpcomingAppointmentsByDoctor,
    updateAppointment,
    getAppointmentById,
    deleteAppointment,
    getPatientPastAppointments,
    getSummary,
    getRevenue,
    getPatientsAttention,
    getPatientHealth,
    updatePatientHealthInfo
};
