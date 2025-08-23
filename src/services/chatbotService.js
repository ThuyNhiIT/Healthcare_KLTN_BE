const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("../models/Food");
const { getFromSheet } = require("../config/sheet.config");

// lấy calo tiệm cận
function findClosestSum(objs, target, mode = "gte") {
    const arr = objs
        .map((o, i) => ({
            ...(o.toObject?.() ?? o),
            Calories: Math.round(Number(o.Calories) || 0),
            idx: i,
        }))
        .filter((o) => o.Calories > 0);

    if (arr.length === 0) return { chosen: [], sum: 0 };
    if (target <= 0 && mode === "gte") return { chosen: [], sum: 0 };

    const total = arr.reduce((a, b) => a + b.Calories, 0);

    // 🔹 thêm case all
    if (mode === "all") {
        return { chosen: arr, sum: total };
    }

    if (mode === "gte") {
        if (total < target) return { chosen: arr, sum: total };
    } else if (mode === "lte") {
        if (total <= target) return { chosen: arr, sum: total };
    }

    const dp = Array(total + 1).fill(false);
    const prev = Array(total + 1).fill(-1);
    const used = Array(total + 1).fill(-1);

    dp[0] = true;

    for (let i = 0; i < arr.length; i++) {
        const v = arr[i].Calories;
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
    } else if (mode === "lte") {
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
        chosen.push(arr[idx]);
        s = prev[s];
    }

    return { chosen, sum: best };
}

const getNewFoods = async (currentCalo, check) => {
    try {
        const foods = await Food.find({});
        let a = await getFromSheet('1aYKdjvPqjRaQEzoE46X3qpGVbsV5Uq5sdlHsjBSb7sg', "pred_food!A:O")
        if (!foods || foods.length === 0) {
            return { chosen: [], sum: 0 };
        }


        let mode = "all";
        if (check === true) mode = "gte";
        else if (check === false) mode = "lte";

        return findClosestSum(foods, currentCalo, mode);
    } catch (error) {
        console.error("Error in getNewFoods:", error);
        return { chosen: [], sum: 0 };
    }
};

module.exports = {
    findClosestSum, getNewFoods
};
