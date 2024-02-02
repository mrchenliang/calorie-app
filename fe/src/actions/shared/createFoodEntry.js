import axios from "axios";
import { authToken } from "../../utils/users";
import { USER_ID } from "../../utils/users";

export const createFoodEntry = async ({ name, calories, consumedAt }) => {
  try {
    const url = "http://localhost:8080/calories";

    const postData = {
      userId: USER_ID,
      name,
      calories,
      time: consumedAt,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    };

    const { data } = await axios.post(url, postData, config);
    return data.data;
  } catch (error) {
    console.error("Error creating food entry:", error);
    throw error; 
  }
};