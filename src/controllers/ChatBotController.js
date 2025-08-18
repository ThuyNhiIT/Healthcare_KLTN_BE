const { OpenAI } = require("openai");
const Food = require("../models/Food");
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

// lấy calo tiệm cận
function findClosestSum(objs, target, mode = "gte") {
  const arr = objs
    .map((o, i) => ({ ...o.toObject?.() ?? o, calo: Math.round(Number(o.calo) || 0), idx: i }))
    .filter(o => o.calo > 0);

  if (arr.length === 0) return { chosen: [], sum: 0 };
  if (target <= 0 && mode === "gte") return { chosen: [], sum: 0 };

  const total = arr.reduce((a, b) => a + b.calo, 0);

  if (mode === "gte") {
    if (total < target) return { chosen: arr, sum: total };
  } else {
    if (total <= target) return { chosen: arr, sum: total };
  }

  const dp = Array(total + 1).fill(false);
  const prev = Array(total + 1).fill(-1);
  const used = Array(total + 1).fill(-1);

  dp[0] = true;

  for (let i = 0; i < arr.length; i++) {
    const v = arr[i].calo;
    for (let s = total; s >= v; s--) {
      if (!dp[s] && dp[s - v]) {
        dp[s] = true;
        prev[s] = s - v;
        used[s] = i;
      }
    }
  }

  let best = -1;
  if (mode === "gte") {
    for (let s = target; s <= total; s++) {
      if (dp[s]) {
        best = s;
        break;
      }
    }
  } else {
    for (let s = target; s >= 0; s--) {
      if (dp[s]) {
        best = s;
        break;
      }
    }
  }

  if (best === -1) return { chosen: [], sum: 0 };

  const chosen = [];
  let s = best;
  while (s > 0) {
    const idx = used[s];
    chosen.push(arr[idx]); // push nguyên object
    s = prev[s];
  }

  return { chosen, sum: best };
}

const getNewFoods = async (currentCalo, check) => {
  try {
    const foods = await Food.find({}); // lấy full object
    if (!foods || foods.length === 0) {
      return { chosen: [], sum: 0 };
    }

    const mode = check ? "gte" : "lte"; // true → >= , false → <=
    return findClosestSum(foods, currentCalo, mode);
  } catch (error) {
    console.error("Error in getNewFoods:", error);
    return { chosen: [], sum: 0 };
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
      result = await getNewFoods(currentCalo, true);
    } else if (reply.includes("giảm")) {
      result = await getNewFoods(currentCalo, false);
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
