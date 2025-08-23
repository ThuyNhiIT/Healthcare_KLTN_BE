const { OpenAI } = require("openai");
const Food = require("../models/Food");
const chatbotService = require("../services/chatbotService"); 
require("dotenv").config();

const getAllCalories = async () => {
  try {
    const foods = await Food.find({}); // lấy toàn bộ object
    if (!foods || foods.length === 0) {
      return [];
    }
    return foods; // mảng object đầy đủ
  } catch (error) {
    console.error("Error in getAllFoods:", error);
    return [];
  }
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const trendFoodGPTResponse = async (req, res) => {
  try {
    const { min, max, trend, stdDev, currentCalo } = req.body;

    if (!currentCalo && !stdDev) {
      return res.status(400).json({ error: "Missing message" });
    }

    let AllCalories = await getAllCalories();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Bạn là 1 máy phân tích dữ liệu dinh dưỡng sao cho kết quả trả về nằm trong khoảng (min) và (max).
            - Nếu stdDev < 0.3 thì giữ nguyên calo (currentCalo).
            - Nếu stdDev >= 0.3 và trend > 0.3 thì giảm calo (currentCalo).
            - Nếu stdDev >= 0.3 và trend < -0.3 thì tăng calo (currentCalo).
            Danh sách calo tham chiếu: ${JSON.stringify(AllCalories)}.
            bạn chỉ cần trả lời là "tăng" hay "giảm" calo.
          `,
        },
        {
          role: "user",
          content: `Phân tích với input: min=${min}, max=${max}, trend=${trend}, stdDev=${stdDev}, currentCalo=${currentCalo}`,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    // lấy mảng món ăn
    let result;
    if (reply.includes("tăng")) {
      result = await chatbotService.getNewFoods(currentCalo, true);
    } else if (reply.includes("giảm")) {
      result = await chatbotService.getNewFoods(currentCalo, false);
    } else {
      result = await chatbotService.getNewFoods(currentCalo);
    }

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

module.exports = {
  trendFoodGPTResponse,
};
