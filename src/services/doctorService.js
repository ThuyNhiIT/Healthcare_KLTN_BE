const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Patient = require("../models/Patient");
const moment = require('moment');
const Wallet = require("../models/Wallet");
const getInfoDoctor = async (firebaseUid) => {
  // Tìm user theo firebaseUid
  const user = await User.findOne({ uid: firebaseUid });
  if (!user) {
    throw new Error("Không tìm thấy user.");
  }

  // Tìm doctor gắn với user
  const doctor = await Doctor.findOne({ userId: user._id }).populate(
    "userId",
    "specialty username email phone avatar gender dob address role "
  );

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
  const userFields = [
    "username",
    "email",
    "phone",
    "avatar",
    "gender",
    "dob",
    "address",
  ];
  userFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });
  await user.save();

  // Update thông tin Doctor
  const doctorFields = ["exp", "giay_phep", "hospital", "status", "specialty"];

  doctorFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      doctor[field] = updateData[field];
    }
  });
  await doctor.save();

  // Populate lại để trả về đủ info
  const updatedDoctor = await Doctor.findById(doctor._id).populate(
    "userId",
    "username email phone avatar gender dob address role"
  );

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
    status: { $ne: "canceled" },
  })
    .populate({
      path: "patientId",
      select: "age phone disease",
      populate: {
        path: "userId",
        select: "username avatar uid",
      },
    })
    .populate({
      path: "doctorId",
      select: "hospital exp status giay_phep userId",
      populate: {
        path: "userId",
        select: "username phone email avatar gender dob address uid",
      },
    })
    .sort({ date: 1, time: 1 });

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
    status: { $ne: "canceled" },
  })

    .populate({
      path: "patientId",
      select: "age phone disease",
      populate: {
        path: "userId",
        select: "username avatar uid",
      },
    })
    .populate({
      path: "doctorId",
      select: "hospital exp status giay_phep userId",
      populate: {
        path: "userId",
        select: "username phone email avatar gender dob address uid",
      },
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
  allowedFields.forEach((field) => {
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
        select: "username avatar email phone dob gender uid",
      },
    })
    .populate({
      path: "doctorId",
      select: "hospital exp status giay_phep",
      populate: {
        path: "userId",
        select: "username avatar email phone dob gender uid",
      },
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
        select: "username avatar email phone dob gender address uid",
      },
    })
    .populate({
      path: "doctorId",
      select: "hospital exp status giay_phep",
      populate: {
        path: "userId",
        select: "username avatar email phone dob gender address uid",
      },
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
    status: { $ne: "canceled" },
  })
    .populate({
      path: "patientId",
      select: "patientId age",
      populate: {
        path: "userId",
        select: "username phone email avatar gender dob address uid _id",
      },
    })
    .populate({
      path: "doctorId",
      select: "hospital exp status giay_phep userId",
      populate: {
        path: "userId",
        select: "username phone email avatar gender dob address uid _id",
      },
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
    // ===== Tìm user và doctor =====
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

    // ===== Tìm wallet =====
    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) throw new Error("Không tìm thấy wallet của user.");

    // ===== Bệnh nhân mới trong 7 ngày =====
    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: moment().subtract(7, "days").toDate() },
    });

    // ===== Bệnh nhân tuần trước (7-14 ngày trước) =====
    const oldPatients = await Patient.countDocuments({
      createdAt: {
        $gte: moment().subtract(14, "days").toDate(),
        $lt: moment().subtract(7, "days").toDate(),
      },
    });

    const newPatientsChange =
      oldPatients === 0
        ? newPatients > 0
          ? "+100% so với tuần trước"
          : "0% so với tuần trước"
        : `${(((newPatients - oldPatients) / oldPatients) * 100).toFixed(
          2
        )}% so với tuần trước`;

    // ===== Cuộc hẹn hôm nay =====
    const appointmentsToday = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: {
        $gte: moment().startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      },
      status: { $ne: "canceled" },
    });

    // ===== Cuộc hẹn sắp tới =====
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: { $gt: moment().endOf("day").toDate() },
      status: { $ne: "canceled" },
    });

    // ===== Doanh thu tháng hiện tại =====
    const monthlyRevenueValue = wallet.history
      .filter(h => h.createdAt >= moment().startOf("month").toDate())
      .reduce((sum, h) => sum + h.amount, 0);

    const oldRevenueValue = wallet.history
      .filter(h =>
        h.createdAt >= moment().subtract(1, "month").startOf("month").toDate() &&
        h.createdAt < moment().startOf("month").toDate()
      )
      .reduce((sum, h) => sum + h.amount, 0);

    const monthlyRevenueFormatted = `${monthlyRevenueValue.toLocaleString()} đ`;

    const monthlyRevenueChange =
      oldRevenueValue === 0
        ? monthlyRevenueValue > 0
          ? "Tăng 100%"
          : "Không đổi"
        : `${(
          ((monthlyRevenueValue - oldRevenueValue) / oldRevenueValue) *
          100
        ).toFixed(2)}% so với tháng trước`;

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

module.exports = { getSummary };


// Lấy doanh thu theo period
const getRevenue = async (firebaseUid, period) => {
  try {
    const user = await User.findOne({ uid: firebaseUid });
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
          status: "success",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: "$timestamp",
              timezone: "Asia/Ho_Chi_Minh",
            },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map để lookup
    const revenueMap = new Map(revenues.map((r) => [r._id, r.total]));

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
      data,
    };
  } catch (error) {
    throw new Error(`Lỗi lấy revenue: ${error.message}`);
  }
};

// Lấy danh sách bệnh nhân cần chú ý
const getPatientsAttention = async (firebaseUid) => {
  try {
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) throw new Error("Không tìm thấy user.");

    const doctor = await Doctor.findOne({ userId: user._id });
    if (!doctor) throw new Error("Không tìm thấy bác sĩ.");
    const patients = await Patient.find({
      status: { $ne: "Ổn định" },
      userId: { $exists: true, $ne: null },
    }).populate("userId", "username phone avatar");
    const validPatients = patients.filter((p) => p.userId !== null);
    const formattedPatients = validPatients.map((p) => {
      const lastHealthRecord =
        p.healthRecords[p.healthRecords.length - 1] || {};
      return {
        _id: p._id,
        userId: p.userId._id,
        name: p.userId?.username || "Chưa có tên",
        age: p.age,
        bloodPressure: lastHealthRecord.bloodPressure || "N/A",
        heartRate: lastHealthRecord.heartRate || 0,
        warning:
          p.status === "Cần theo dõi"
            ? "Cần theo dõi"
            : p.status === "Đang điều trị"
              ? "Đang điều trị"
              : "Theo dõi",
        disease: p.disease || "Chưa có thông tin",
        image: p.userId?.avatar || "default-avatar.jpg",
        phone: p.userId?.phone || p.phone || "N/A",
      };
    });

    return formattedPatients;
  } catch (error) {
    throw new Error(`Lỗi lấy patients: ${error.message}`);
  }
};

const getPatientHealth = async (patientId, period) => {
  try {
    let startDate;
    if (period === "week") startDate = moment().subtract(7, "days");
    else if (period === "month") startDate = moment().subtract(30, "days");
    else if (period === "year") startDate = moment().subtract(1, "year");
    else throw new Error("Period không hợp lệ");

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Không tìm thấy bệnh nhân");

    // Lọc các record theo startDate
    const records = patient.healthRecords.filter(
      (r) => new Date(r.recordedAt) >= startDate.toDate()
    );

    // Nhóm record theo ngày (YYYY-MM-DD) hoặc tháng (YYYY-MM) nếu period = year
    const grouped = {};
    records.forEach((r) => {
      const day =
        period === "year"
          ? moment(r.recordedAt).format("YYYY-MM")
          : moment(r.recordedAt).format("YYYY-MM-DD");

      if (!grouped[day]) {
        grouped[day] = { bloodPressure: [], heartRate: [], bloodSugar: [] };
      }

      if (r.bloodPressure) {
        const systolic = parseInt(r.bloodPressure.split("/")[0]) || 0;
        grouped[day].bloodPressure.push(systolic);
      }
      if (r.heartRate !== undefined) grouped[day].heartRate.push(r.heartRate);
      if (r.bloodSugar !== undefined) grouped[day].bloodSugar.push(r.bloodSugar);
    });

    // Tính trung bình các chỉ số
    const xAxisData = [];
    const bloodPressureData = [];
    const heartRateData = [];
    const bloodSugarData = [];

    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    Object.keys(grouped)
      .sort()
      .forEach((day) => {
        xAxisData.push(day);
        bloodPressureData.push(Math.round(avg(grouped[day].bloodPressure)));
        heartRateData.push(Math.round(avg(grouped[day].heartRate)));
        bloodSugarData.push(Number(avg(grouped[day].bloodSugar).toFixed(1)));
      });

    return { xAxisData, bloodPressureData, heartRateData, bloodSugarData };
  } catch (error) {
    throw new Error(`Lỗi lấy health data: ${error.message}`);
  }
};


const updatePatientHealthInfo = async (patientId, healthData) => {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Không tìm thấy bệnh nhân.");
    const { disease, status, allergies, notes, bloodPressure, heartRate, bloodSugar } = healthData;

    if (disease !== undefined) patient.disease = disease;
    if (status !== undefined) {
      const validStatuses = [
        "Cần theo dõi",
        "Ổn định",
        "Đang điều trị",
        "Theo dõi",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error("Tình trạng không hợp lệ.");
      }
      patient.status = status;
    }
    if (allergies !== undefined) patient.allergies = allergies;
    if (notes !== undefined) patient.notes = notes;

    if (bloodPressure || heartRate || bloodSugar) {
      const newRecord = {
        bloodPressure,
        heartRate,
        bloodSugar,
        recordedAt: new Date(),
      };

      patient.healthRecords.push(newRecord);
    }

    await patient.save();
    return patient;
  } catch (error) {
    throw new Error(`Lỗi cập nhật thông tin y tế: ${error.message}`);
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Không tìm thấy lịch hẹn.");
    appointment.status = status;
    await appointment.save();
    return appointment;
  } catch (error) {
    throw new Error(`Lỗi cập nhật trạng thái lịch hẹn: ${error.message}`);
  }
};

const getRevenueByPeriod = async (period = "week") => {
  let startDate, dateFormat, increment, totalDays;

  if (period === "week") {
    startDate = moment().startOf("week");
    dateFormat = "YYYY-MM-DD";
    increment = "days";
    totalDays = 7;
  } else if (period === "month") {
    startDate = moment().startOf("month");
    dateFormat = "YYYY-MM-DD";
    increment = "days";
  } else if (period === "year") {
    startDate = moment().startOf("year");
    dateFormat = "YYYY-MM";
    increment = "months";
  } else {
    throw new Error("Period không hợp lệ");
  }

  const wallets = await Wallet.find({ "history.0": { $exists: true } });
  const grouped = {};
  wallets.forEach(wallet => {
    wallet.history.forEach(h => {
      if (moment(h.createdAt).isBefore(startDate)) return;

      const key = moment(h.createdAt).format(dateFormat);
      grouped[key] = (grouped[key] || 0) + h.amount;
    });
  });

  const labels = [];
  const data = [];
  let current = startDate.clone();

  if (period === "week") {
    for (let i = 0; i < totalDays; i++) {
      const key = current.format(dateFormat);
      labels.push(key);
      data.push(grouped[key] || 0);
      current.add(1, increment);
    }
  } else {
    const end = moment();
    while (current.isSameOrBefore(end, increment === "months" ? "month" : "day")) {
      const key = current.format(dateFormat);
      labels.push(key);
      data.push(grouped[key] || 0);
      current.add(1, increment);
    }
  }

  const total = data.reduce((a, b) => a + b, 0);

  return { xAxisData: labels, seriesData: data, totalRevenue: total, currency: "VND" };
};



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
  updatePatientHealthInfo,
  updateAppointmentStatus,
  getRevenueByPeriod
};
