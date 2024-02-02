import moment from "moment";
import { getCaloriesFromRepository } from "../repositories/calorie.repository.js";

export const getThisAndLastWeekReport = async function (req, res, next) {
  try {
    const thisWeeksQuery = {};
    thisWeeksQuery["time"] = {
      $gte: moment().subtract(6, 'days').startOf('day').toDate(),
      $lte: moment().endOf('day').toDate()
    };
    const thisWeekCalories = await getCaloriesFromRepository(thisWeeksQuery);
    const nextWeeksQuery = {};
    nextWeeksQuery["time"] = {
      $gte: moment().subtract(13, 'days').startOf('day').toDate(),
      $lte: moment().subtract(7, 'days').endOf('day').toDate()
    };
    const lastWeekCalories = await getCaloriesFromRepository(nextWeeksQuery);
    return res.status(200).json({
      status: 200,
      data: { thisWeekCalories, lastWeekCalories },
      message: "Calories retrieved successfully",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};