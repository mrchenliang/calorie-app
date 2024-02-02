import axios from "axios";
import { authToken } from "../../utils/users";

export const sendInvite = async ({
  name,
  email,
}) => {

  try {
    const url = "http://localhost:8080/invites";

    const postData = {
      name,
      email,
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
    console.error("Error sending invite:", error.message);
    throw error; 
  }

};