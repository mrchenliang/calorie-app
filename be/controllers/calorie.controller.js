import moment from "moment";
import { getCaloriesFromRepository, addCalorieToRepository, deleteCalorieFromRepository, updateCalorieInRepository } from "../repositories/calorie.repository.js";

export const getCalories = async function (req, res, next) {
  try {
    const query = {};
    if (req.headers.decodedToken.role === 'user') {
      query["userId"] = req.headers.decodedToken.userId;
    }
    if (req.query.fromDate || req.query.toDate) {
      if (
        (req.query.fromDate && !req.query.toDate) ||
        (!req.query.fromDate && req.query.toDate)
      ) {
        throw Error("both fromDate and toDate are required");
      } else if (new Date(req.query.fromDate) > new Date(req.query.toDate)) {
        throw Error("fromDate should be smaller than or equal to toDate");
      } else if (req.query.fromDate === req.query.toDate) {
        query["time"] = {
          $eq: new Date(req.query.fromDate),
        };
      } else {
        query["time"] = {
          $gte: new Date(req.query.fromDate),
          $lte: new Date(req.query.toDate),
        };
      }
    }

    const calories = await getCaloriesFromRepository({ ...query });
    return res.status(200).json({
      status: 200,
      data: calories,
      message: "Calories retrieved successfully",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const addCalorie = async function (req, res, next) {
  try {
    const userId = req.headers.decodedToken.role === 'admin' ? req.body.userId : req.headers.decodedToken.userId;
    const payload = {
      ...req.body,
      userId,
      time: moment(req.body.time).startOf("day").format("DD MMM YYYY"),
    };

    const calories = await addCalorieToRepository(payload);

    return res.status(200).json({
      status: 200,
      data: calories,
      message: "Calorie added successfully",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const deleteCalorie = async function (req, res, next) {
  try {
    const query = { _id: req.params.id };
    const calories = await deleteCalorieFromRepository({ ...query });
    if (calories) {
      return res.status(200).json({
        status: 200,
        data: calories,
        message: "Calorie deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "No such calorie found",
      });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const updateCalorie = async function (req, res, next) {
  try {
    const query = { _id: req.params.id };
    const payload = { ...req.body };

    if (payload["time"]) {
      payload["time"] = moment(payload.time)
        .startOf("day")
        .format("DD MMM YYYY");
    }
    const calories = await updateCalorieInRepository(
      { ...query },
      { ...payload }
    );
    if (calories) {
      return res.status(200).json({
        status: 200,
        data: calories,
        message: "Calorie updated successfully",
      });
    } else {
      return res.status(404).json({
        status: 404,
          data: calories,
        message: "No such calorie found",
      });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
