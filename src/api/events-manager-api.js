import axiosAuthInstance from "../utils/axiosAuth";

const baseUrl = process.env.REACT_APP_EVENT_API_ENDPOINT;

export const broadcastMessage = async (topic, message) => {
  try {

    const { data } = await axiosAuthInstance.post(`http://0.0.0.0:3333/api/on-message`, { 
      topic, 
      message 
    });
    console.log('broadcastMessage', data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

//
