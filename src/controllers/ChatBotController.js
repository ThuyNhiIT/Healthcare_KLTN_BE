const { OpenAI } = require("openai");
const { getNewFoods } = require("../services/chatbotService");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const trendFoodGPTResponse = async (req, res) => {
  try {
    const { min, max, mean, currentCalo, menuFoodId } = req.body;

    if (!currentCalo && !stdDev) {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Bạn là trợ lý dược sĩ chuyên về dinh dưỡng cho bệnh nhân tiểu đường.
            Quy tắc điều chỉnh calo:
            - Nếu mean < 5 → tăng currentCalo thêm 5%.
            - Nếu mean > 7.5 → giảm currentCalo đi 5%.
            - Nếu 5 <= mean <= 7.5 → giữ nguyên currentCalo.
            Luôn trả về duy nhất 1 số (integer) = calo mới, không kèm giải thích.
          `,
        },
        {
          role: "user",
          content: `min=${min}, max=${max}, mean=${mean}, currentCalo=${currentCalo}`,
        },
      ],
      temperature: 0,
    });

    const newCalo = parseInt(response.choices[0].message.content.trim(), 10);

    // lấy mảng món ăn từ service mới
    let result = await getNewFoods(menuFoodId, newCalo);

    res.json({ result });
  } catch (err) {
    console.error("Error in chatGPTResponse controller:", err);
    return res.status(500).json({
      EM: "Error chatGPTResponse",
      EC: -1,
      DT: "",
    });
  }
};

const trendMedicineGPTResponse = async (req, res) => {
  try {
    const { age, gender, BMI, HbA1c, bloodSugar } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Bạn là trợ lý dược sĩ chuyên về dinh dưỡng cho bệnh nhân tiểu đường.
            Hãy gợi ý lịch dùng thuốc theo 3 bữa trong ngày.
            Output BẮT BUỘC phải là JSON đúng cấu trúc:
            {
              "sang": [],
              "trua": [],
              "toi": []
            }
            Không được trả lời gì thêm ngoài JSON.
          `,
        },
        {
          role: "user",
          content: `age=${age}, gender=${gender}, BMI=${BMI}, HbA1c=${HbA1c}, bloodSugar=${bloodSugar}`,
        },
      ],
      temperature: 0,
    });
    // lấy nội dung GPT trả về
    const message = response.choices[0].message.content;

    // parse string JSON thành object
    let result;
    try {
      result = JSON.parse(message);
    } catch (e) {
      // fallback nếu GPT không trả đúng JSON
      result = { sang: [], trua: [], toi: [] };
    }

    res.json({ result });
  } catch (err) {
    console.error("Error in trendMedicineGPTResponse controller:", err);
    return res.status(500).json({
      EM: "Error trendMedicineGPTResponse",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  trendFoodGPTResponse,
  trendMedicineGPTResponse
};
