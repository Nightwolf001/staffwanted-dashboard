import axiosAuthInstance from "../utils/axiosAuth";

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export const getEmployer = async (id) => {
  try {
    const url = `${baseUrl}/api/employers/${id}`;
    const { data } = await axiosAuthInstance.get(url);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const updateEmployer = async (id, post) => {
  try {
    const url = `${baseUrl}/api/employers/${id}?populate=*`;
    const { data } = await axiosAuthInstance.put(url, { data: post});
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getEmployerJobs = async (id) => {
  try {
    const url = `${baseUrl}/api/jobs/employer/${id}`;
    const { data } = await axiosAuthInstance.get(url);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getEmployerJob = async (id) => {
  try {
    const url = `${baseUrl}/api/jobs/${id}?populate=*`;
    const { data } = await axiosAuthInstance.get(url);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const updateEmployerJob = async (id, post) => {
  try {
    const { data } = await axiosAuthInstance.put(`${baseUrl}/api/jobs/${id}?populate=*`, { data: post});
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const createEmployerJob = async (post) => {
  try {
    const { data } = await axiosAuthInstance.post(`${baseUrl}/api/jobs/?populate=*`, { data: post});
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

export const fetchLocationDetials = async (placeId) => {
  try {
      const data = await axiosAuthInstance.get(`${baseUrl}/api/jobs/google/places/details?place_id=${placeId}`);
      return data;
  } catch (ex) {
    console.log('fetchLocationDetials ex', JSON.stringify(ex));
  }
}

export const fetchFilteredEmployees = async (search, job_roles, experience, preferred_hours, lat, lng, distance, metric) => {
    try {
        const { data } = await axiosAuthInstance.get(`${baseUrl}/api/employer/filter/employees?search=${search}&job_roles=${job_roles}&experience=${experience}&preferred_hours=${preferred_hours}&lat=${lat}&lng=${lng}&distance=${distance}&metric=${metric}`);
        return data;
    } catch (ex) {
        console.log('fetchFilteredEmployees ex', JSON.stringify(ex));
    }
}

export const getEmployee = async (id) => {
  console.log("getEmployee");
  try {
    const url = `${baseUrl}/api/employees/${id}?populate=*`;
    const { data } = await axiosAuthInstance.get(url);
    console.log("getEmployee", data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getApplicantsByJobs = async (ids) => {
  try {
    const url = `${baseUrl}/api/employee-job-matches/job/applicants`;
    const { data } = await axiosAuthInstance.post(url, { ids });
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getApplicationsByJobs = async (ids) => {
  try {
    const url = `${baseUrl}/api/employee-job-matches/job/applications`;
    const { data } = await axiosAuthInstance.post(url, { ids });
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getApplicationAnalytics = async (ids) => {
  try {
    const url = `${baseUrl}/api/employee-job-matches/applications/analytics`;
    const { data } = await axiosAuthInstance.post(url, { ids });
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const updateApplicationStatus = async (id, application_status, status_description) => {
  try {
    const url = `${baseUrl}/api/employee-job-matches/${id}`;
    const { data } = await axiosAuthInstance.put(url, { data: {application_status, status_description} });
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getCalendarEvent = async (id) => {
  try {
    const { data } = await axiosAuthInstance.get(`${baseUrl}/api/calendars/${id}/?populate=*`);
    console.log('getCalendarEvent', data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const getCalendarEvents = async (id) => {
  try {
    const { data } = await axiosAuthInstance.get(`${baseUrl}/api/calendars/${id}/employer/?populate=*`);
    console.log('getCalendarEvents', data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};

export const createCalendarEvents = async (event) => {
  try {
    const { data } = await axiosAuthInstance.post(`${baseUrl}/api/calendars/?populate=*`, { data: event });
    console.log('createCalendarEvents', data);
    return data;
  } catch (ex) {
    console.error(ex);
    console.error(ex.message);
  }
};
//
