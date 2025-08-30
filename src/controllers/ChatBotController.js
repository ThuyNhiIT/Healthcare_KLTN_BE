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

module.exports = {
  trendFoodGPTResponse,
};
