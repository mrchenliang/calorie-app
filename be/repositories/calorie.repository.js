import Calorie from "../models/calorie.model.js";

export const getCaloriesFromRepository = async function (query) {
  try {
    const calories = await Calorie.find(query).sort({ time: -1 });;
    return calories;
  } catch (e) {
    throw Error("Error while fetching calories");
  }
};

export const addCalorieToRepository = async function (payload) {
  try {
    const addedCalorie = new Calorie(payload);
    const savedCalorie = await addedCalorie.save();
    return savedCalorie;
  } catch (e) {
    throw Error("Error while adding calories");
  }
};

export const deleteCalorieFromRepository = async function (query) {
  try {
    const deletedCalorie = await Calorie.findOneAndDelete({ ...query });
    return deletedCalorie;
  } catch (e) {
    throw Error("Error while deleting calories");
  }
};

export const updateCalorieInRepository = async function (query, payload) {
  try {
    const updatedCalorie = await Calorie.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    ).lean();
    return updatedCalorie;
  } catch (e) {
    throw Error("Error while updating calories");
  }
};
