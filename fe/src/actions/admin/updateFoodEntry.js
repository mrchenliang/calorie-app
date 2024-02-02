import axios from "axios";
import { authToken } from "../../utils/users";

export const updateFoodEntry = async ({ id, name, calories, consumedAt }) => {
  try {
    const url = `http://localhost:8080/calories/${id}`;

    const postData = {
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

    const { data } = await axios.patch(url, postData, config);
    return data.data;
  } catch (error) {
    console.error("Error updating food entry:", error);
    throw error; 
  }
};
