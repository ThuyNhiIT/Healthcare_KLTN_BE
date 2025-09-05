const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const MenuFood = require("../models/MenuFood");
const { getFromSheet } = require("../config/sheet.config");

// tìm tổ hợp calo gần nhất hoặc bằng newCalo
function findClosestSum(foods, newCalo) {
  // chuẩn hóa dữ liệu
  const arr = foods
    .map((o, i) => ({
      ...(o.toObject?.() ?? o),
      calo: Math.round(Number(o.calo) || 0),
      idx: i,
    }))
    .filter((o) => o.calo > 0);

  if (arr.length === 0) return { chosen: [], sum: 0 };

  // tổng tất cả calo
  const total = arr.reduce((a, b) => a + b.calo, 0);

  // nếu newCalo <= 0 thì vô nghĩa
  if (newCalo <= 0) return { chosen: [], sum: 0 };

  // nếu newCalo > total thì chọn tất cả
  if (newCalo >= total) return { chosen: arr, sum: total };

  // DP subset sum
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

  // tìm giá trị gần newCalo nhất
  let best = -1;
  let diff = Infinity;
  for (let s = 0; s <= total; s++) {
    if (dp[s]) {
      const d = Math.abs(s - newCalo);
      if (d < diff) {
        diff = d;
        best = s;
      }
    }
  }

  if (best === -1) return { chosen: [], sum: 0 };

  // reconstruct tập món ăn
  const chosen = [];
  let s = best;
  while (s > 0) {
    const idx = used[s];
    chosen.push(arr[idx]);
    s = prev[s];
  }

  return { chosen, sum: best };
}

const getNewFoods = async (menuFoodId, newCalo) => {
  try {
    const foods = await getFromSheet(
      "1aYKdjvPqjRaQEzoE46X3qpGVbsV5Uq5sdlHsjBSb7sg",
      "pred_food!A:O"
    );

    if (!foods || foods.length === 0) {
      return { chosen: [], sum: 0 };
    }
    let data = findClosestSum(foods, newCalo);
    const updated = await MenuFood.findByIdAndUpdate(
      menuFoodId,
      { caloCurrent: data.sum },
      { new: true }
    );
    
    console.log("ssssssssssssssssssssssss: ", data);
    return data;
  } catch (error) {
    console.error("Error in getNewFoods:", error);
    return { chosen: [], sum: 0 };
  }
};

module.exports = {
  findClosestSum,
  getNewFoods,
};
