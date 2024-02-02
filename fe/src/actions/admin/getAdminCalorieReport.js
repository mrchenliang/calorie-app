import axios from "axios";
import { authToken } from "../../utils/users";

export const getAdminCalorieReport = async () => {

  try {
    const url = "http://localhost:8080/reports";

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    };

    const { data } = await axios.get(url, config);
    return data.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error; 
  }
};
