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
            Bạn là 1 máy phân tích dữ liệu dinh dưỡng sao cho kết quả trả về nằm trong khoảng (min) và (max).
            - Nếu mean < 5 thì tăng calo (currentCalo).
            - Nếu mean > 7.5 thì giảm calo (currentCalo).
            bạn chỉ cần trả lời là "tăng" hay "giảm" hoặc "giữ nguyên" calo.
          `,
        },
        {
          role: "user",
          content: `Phân tích với input: min=${min}, max=${max}, mean=${mean}, currentCalo=${currentCalo}`,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    // lấy mảng món ăn từ service mới
    let result;
    if (reply.includes("tăng")) {
      result = await getNewFoods(menuFoodId, currentCalo, true);
    } else if (reply.includes("giảm")) {
      result = await getNewFoods(menuFoodId, currentCalo, false);
    } else {
      result = await getNewFoods(menuFoodId, currentCalo);
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
