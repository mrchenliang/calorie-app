import axios from "axios";
import { authToken } from "../../utils/users";

export const deleteFoodEntry = async (id) => {
  try {
    const url = `http://localhost:8080/calories/${id}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    };

    const { data } = await axios.delete(url, config);
    return data.data;
  } catch (error) {
    console.error("Error deleting food entry:", error);
    throw error; 
  }
};
