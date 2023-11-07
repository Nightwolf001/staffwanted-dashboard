import axiosAuthInstance from "../utils/axiosAuth";

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export const getEmployerJobs = async (id) => {
  console.log("getEmployerJobs");
  try {
    const url = `${baseUrl}/api/jobs/employer/${id}`;
    const { data } = await axiosAuthInstance.get(url);
    console.log("getEmployerJobs", data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getEmployerJob = async (id) => {
  console.log("getEmployerJob");
  try {
    const url = `${baseUrl}/api/jobs/${id}?populate=*`;
    const { data } = await axiosAuthInstance.get(url);
    console.log("getEmployerJob", data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const updateEmployerJob = async (id, post) => {
  console.log("updateEmployerJob");
  try {
    console.log("updateEmployerJob", post);
    const { data } = await axiosAuthInstance.put(`${baseUrl}/api/jobs/${id}?populate=*`, { data: post});
    console.log("updateEmployerJob", data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const createEmployerJob = async (post) => {
  console.log("createEmployerJob");
  try {
    console.log("createEmployerJob", post);
    const { data } = await axiosAuthInstance.post(`${baseUrl}/api/jobs/?populate=*`, { data: post});
    console.log("createEmployerJob", data);    
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const uploadAvatarFile = async (file) => {
    console.log('uploadAvatarFile', file);
    try {

        let formData = new FormData();
        formData.append("files", file);
        const { data } = await axiosAuthInstance.post(`${baseUrl}/api/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        console.log('uploadAvatarFile response', data);
        return data;

    } catch (ex) {
        console.log('uploadAvatarFile ex', JSON.stringify(ex));
    }
}

export const fetchJobRoles = async () => {
    try {
        const { data } = await axiosAuthInstance.get(`${baseUrl}/api/job-roles`);
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}

export const fetchPreviousExperiences = async () => {
    try {
        const { data } = await axiosAuthInstance.get(`${baseUrl}/api/experiences`);
        return data;
    } catch (ex) {
        console.log('fetchPreviousExperiences ex', JSON.stringify(ex));
    }
}

export const fetchPreferredHours = async () => {
    try {
        const { data } = await axiosAuthInstance.get(`${baseUrl}/api/preferred-hours`);
        return data;
    } catch (ex) {
        console.log('fetchPreferredHours ex', JSON.stringify(ex));
    }
}

export const findLocationPredictions = async (search) => {
  try {
      const predictions = await axiosAuthInstance.get(`${baseUrl}/api/jobs/google/places/predictions?search=${search}`);
      return predictions;
  } catch (ex) {
    console.log('findJobLocation ex', JSON.stringify(ex));
  }
}

export const fetchJobLocationDetials = async (placeId) => {
  try {
      const data = await axiosAuthInstance.get(`${baseUrl}/api/jobs/google/places/details?place_id=${placeId}`);
      return data;
  } catch (ex) {
    console.log('fetchPreffetchJobLocationDetialserredHours ex', JSON.stringify(ex));
  }
}

