import axios from "axios";

export const getFoodSearch = async (query) => {
  try {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const body = {
      query
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': process.env.REACT_APP_NUTRITIONIX_API_APP_ID, 
        'x-app-key': process.env.REACT_APP_NUTRITIONIX_API_APP_KEY,
      }
    };

    const { data } = await axios.post(url, body, config);
    return data.foods;
  } catch (error) {
    console.error("Error fetching food search items:", error);
    throw error; 
  }
};