const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("../models/Food");
const { getFromSheet } = require("../config/sheet.config");

// 🔹 tìm tổ hợp calo gần nhất
function findClosestSum(objs, target, mode = "gte") {
    // lấy toàn bộ món ăn
    const arr = objs
        .map((o, i) => ({
            ...(o.toObject?.() ?? o),
            calo: Math.round(Number(o.calo) || 0),
            idx: i,
        }))
        .filter((o) => o.calo > 0);

    if (arr.length === 0) return { chosen: [], sum: 0 };

    // tính tổng calo
    const total = arr.reduce((a, b) => a + b.calo, 0);

    // trường hợp keep mà target <= 0 hoặc target > total thì ko thể đạt
    if (mode === "keep") {
        if (target <= 0 || target > total) return { chosen: [], sum: 0 };
    }

    if (mode === "gte" && target <= 0) return { chosen: [], sum: 0 };
    if (mode === "gte" && total < target) return { chosen: arr, sum: total };
    if (mode === "lte" && total <= target) return { chosen: arr, sum: total };

    // tìm calo gần với target
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

    // xử lý trường hợp tăng, giảm, giữ nguyên
    let best = -1;
    if (mode === "gte") {
        for (let s = target; s <= total; s++) {
            if (dp[s]) {
                best = s;
                break;
            }
        }
    } else if (mode === "lte") {
        for (let s = target; s >= 0; s--) {
            if (dp[s]) {
                best = s;
                break;
            }
        }
    } else if (mode === "keep") {
        if (dp[target]) best = target; // chỉ chấp nhận đúng target
    }

    if (best === -1) return { chosen: [], sum: 0 };

    // tìm món ăn ứng với các trường hợp
    const chosen = [];
    let s = best;
    while (s > 0) {
        const idx = used[s];
        chosen.push(arr[idx]);
        s = prev[s];
    }

    return { chosen, sum: best };
}


const getNewFoods = async (currentCalo, check) => {
    try {
        const foods = await getFromSheet(
            "1aYKdjvPqjRaQEzoE46X3qpGVbsV5Uq5sdlHsjBSb7sg",
            "pred_food!A:O"
        );

        if (!foods || foods.length === 0) {
            return { chosen: [], sum: 0 };
        }

        let mode = "keep";
        if (check === true) mode = "gte";
        else if (check === false) mode = "lte";

        return findClosestSum(foods, currentCalo, mode);
    } catch (error) {
        console.error("Error in getNewFoods:", error);
        return { chosen: [], sum: 0 };
    }
};

module.exports = {
    findClosestSum,
    getNewFoods,
};
