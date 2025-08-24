const { OpenAI } = require("openai");
const { getNewFoods } = require("../services/chatbotService");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const trendFoodGPTResponse = async (req, res) => {
  try {
    const { min, max, trend, stdDev, currentCalo } = req.body;

    if (!currentCalo && !stdDev) {
      return res.status(400).json({ error: "Missing message" });
    }

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
            bạn chỉ cần trả lời là "tăng" hay "giảm" hoặc "giữ nguyên" calo.
          `,
        },
        {
          role: "user",
          content: `Phân tích với input: min=${min}, max=${max}, trend=${trend}, stdDev=${stdDev}, currentCalo=${currentCalo}`,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    // lấy mảng món ăn từ service mới
    let result;
    if (reply.includes("tăng")) {
      result = await getNewFoods(currentCalo, true);
    } else if (reply.includes("giảm")) {
      result = await getNewFoods(currentCalo, false);
    } else {
      result = await getNewFoods(currentCalo);
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
