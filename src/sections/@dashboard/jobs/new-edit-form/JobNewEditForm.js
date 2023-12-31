import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Autocomplete, Chip, TextField } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../../redux/store';
// api
import { fetchPreferredHours, fetchPreviousExperiences, fetchJobRoles, updateEmployerJob, createEmployerJob, uploadAvatarFile, fetchLocationDetials } from '../../../../api/staffwanted-api';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar, RHFMultiCheckbox, RHFRadioGroup, RHFAutocomplete } from '../../../../components/hook-form';
import RHFAddressAutoComplete from "../../../../components/hook-form/RHFAddressAutoComplete";
import RHFDatePicker from '../../../../components/hook-form/RHFDatePicker';
// ----------------------------------------------------------------------

JobNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentJob: PropTypes.object,
};

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export default function JobNewEditForm({ isEdit, currentJob }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const {user, employer} = useSelector((state) => state.user);

  const [preferredHours, setPreferredHours] = useState([]);
  const [previousExperiences, setPreviousExperiences] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [salaryType, setSalaryType] = useState([
    { label: 'Hourly', value: 'ph' },
    { label: 'Annually', value: 'pa' },
  ]);
  const [salaryCurrency, setSalaryCurrency] = useState([
    { label: '$', value: "$" },
    { label: '£', value: "£" },
  ]);

  const NewJobSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    preferred_hours: Yup.array().required('Employment type is required'),
    experience: Yup.number().required('Experience is required'),
    job_roles: Yup.array(
      Yup.object().shape({ label: Yup.string().required('Label is required'), value: Yup.string().required('Value is required')})
    ).required('Role is required'),
    salary_type: Yup.string().required('Salary type is required'),
    salary_currency: Yup.object().shape({ label: Yup.string().required('Label is required'), value: Yup.string().required('Value is required')}).required('Currency is required'),
    salary_value: Yup.string().required('Salary value is required'),
    job_avatar_uri: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    location: Yup.object().shape({ label: Yup.string().required('Label is required'), value: Yup.string().required('Value is required')}).required('Location is required'),
    place_id: Yup.string().required('Place Id is required'),
    coord: Yup.object().shape({ lat: Yup.string().required('lat is required'), lng: Yup.string().required('Lng is required')}).required('Coord is required'),
    published: Yup.boolean().required('Publish is required'),
    active_date: Yup.string().required('Active date is required'),
    expiry_date: Yup.string().required('Expiry date is required'),
    contact_person: Yup.string().required('Contact person is required'),
    contact_number: Yup.string().required('Contact number is required'),
    contact_email: Yup.string().required('Contact email is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentJob?.attributes.title || '',
      description: currentJob?.attributes.description || '',
      preferred_hours: _.map(currentJob?.attributes.preferred_hours.data, item => (item.id)) || '',
      experience: currentJob?.attributes?.experience.data?.id || '',
      job_roles:  _.map(currentJob?.attributes.job_roles.data, item => ({label: item.attributes.role, value: item.id})) || '',
      salary_type: currentJob?.attributes.salary_type || '',
      salary_currency: {label: currentJob?.attributes.salary_currency, value: currentJob?.attributes.salary_currency } || '',
      salary_value: currentJob?.attributes.salary_value || '',
      employer: [user.profile_id],
      job_avatar_uri: currentJob?.attributes.job_avatar_uri || '',
      published: currentJob?.attributes.published,
      location: {label: currentJob?.attributes.location, value: currentJob?.attributes.place_id} || "",
      place_id: currentJob?.attributes.place_id || '',
      contact_person: currentJob?.attributes.contact_person || '',
      contact_number: currentJob?.attributes.contact_number || '',
      contact_email: currentJob?.attributes.contact_email || '',
      coord: currentJob?.attributes.coord || '',
      active_date: currentJob?.attributes.active_date || moment().format('YYYY-MM-DD'),
      expiry_date: currentJob?.attributes.expiry_date || moment().add(30, 'days').format('YYYY-MM-DD'),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentJob]
  );

  const methods = useForm({ 
    resolver: yupResolver(NewJobSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit, formState: { isSubmitting, errors }} = methods;
  const values = watch();

  useEffect(() => {
    if (isEdit && currentJob) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentJob]);

  useEffect(() => {
    (async () => {
        
        const hours = await fetchPreferredHours();
        const preferredHours = _.map(hours.data, item => ({ label: item.attributes.name, value: item.id, }));
        setPreferredHours(preferredHours);

        const experience = await fetchPreviousExperiences();
        const previousExperiences = _.map(experience.data, item => ({ label: item.attributes.name, value: item.id, }));
        setPreviousExperiences(previousExperiences);

        const roles = await fetchJobRoles();
        const jobRoles = _.map(roles.data, item => ({ label: item.attributes.role, value: item.id, }));
        setJobRoles(jobRoles);
        

    })();
  }, []);

  useEffect(() => {
    (async () => {

      if(values.location.value) {
        methods.setValue('place_id', values.location.value);
        const {data} = await fetchLocationDetials(values.location.value);
        methods.setValue('coord', data.result.geometry.location);
      }

      // if(values.active_date) {
      //   console.log('active_date', values.active_date);
      //  
      // }
        
    })();
  }, [values.location]);

    useEffect(() => {
    (async () => {
      if(values.active_date) {
        const expiryDate = moment(values.active_date).add(30, 'days').format('YYYY-MM-DD');
        methods.setValue('expiry_date', expiryDate);
      }
    })();
  }, [values.active_date]);

  
  const onSubmit = async (values) => {
    try {
      
      values.location = values.location.label;
      values.salary_currency = values.salary_currency.value;
      values.job_roles = _.map(values.job_roles, item => ( item.value ));
      values.preferred_hours = _.map(values.preferred_hours, item => ({ id: item }));
      

      if (isEdit) {
       let {data} = await updateEmployerJob(currentJob.id, values);
       console.log('updateEmployerJob', data);
      } else {
        let {data} = await createEmployerJob(values);
        console.log('createEmployerJob', data);
      }
      
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.job.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles)  => {
      (async () => {
        const file = acceptedFiles[0];
        if (file) {
          let jobAvatarUri = await uploadAvatarFile(file);
          setValue('job_avatar_uri', `${baseUrl}${jobAvatarUri[0].url}`);
        }
      })();
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(() => onSubmit(values))}>
      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 2 }}>
              <RHFUploadAvatar
                name="job_avatar_uri"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>

           <Card sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'grid', columnGap: 2, rowGap: 3, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}}>
              <RHFDatePicker
                  name="active_date"
                  label="Ad will display from" 
                  disabled={!!currentJob?.attributes?.published}
              />
              <RHFDatePicker
                  name="expiry_date"
                  label="Ad will expire on" 
                  disabled
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'grid', columnGap: 2, rowGap: 3, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}}>
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="description" label="Description" multiline rows={9}/>
            </Box>
          </Card>

          <Card sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'grid', columnGap: 2, rowGap: 3, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}}>

                <Typography variant="subtitle2">Roles</Typography>
                <RHFAutocomplete
                  name="job_roles"
                  label="Roles"
                  multiple
                  freeSolo
                  options={jobRoles.map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Employment type</Typography>
                  {preferredHours.length !== 0 && (<RHFMultiCheckbox name="preferred_hours" options={preferredHours} sx={{ width: 1 }} />)}
                </Stack>

                <Stack spacing={1} row>
                  <Typography variant="subtitle2">Experience</Typography>
                  {previousExperiences.length !== 0 && (
                  <RHFRadioGroup
                      name="experience"
                      options={previousExperiences}
                      sx={{
                        '& .MuiFormControlLabel-root': { mr: 4 },
                      }}
                    />
                  )}
                </Stack>
                
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Salary</Typography>
                    <Stack spacing={1} row>
                      {salaryType.length !== 0 && (
                      <RHFRadioGroup
                          name="salary_type"
                          options={salaryType}
                          sx={{
                            '& .MuiFormControlLabel-root': { mr: 4 },
                          }}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {salaryCurrency.length !== 0 && (
                    <RHFAutocomplete
                      name="salary_currency"
                      label="Currency"
                      placeholder="Currency"
                      options={salaryCurrency}
                    />
                    )}
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <RHFTextField name="salary_value" label="Salary" />
                  </Grid>
                </Grid>

            </Box>
          </Card>

          <Card sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'grid', columnGap: 2, rowGap: 3, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}}>
                <RHFTextField name="contact_person" label="Contact Person" />
                <RHFTextField name="contact_number" label="Phone Number" />
                <RHFTextField name="contact_email" label="Email" />
                <RHFAddressAutoComplete
                  name="location"
                  label="Location"
                  placeholder="Location"
                />
            </Box>
            <Grid container spacing={2} sx={{pt:3}}>
              <Grid item xs={12} md={6} >
                <RHFSwitch
                    name="published"
                    labelPlacement="end"
                    label={ <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Publish</Typography>}
                    sx={{ mx: 0, width: 1, justifyContent: 'flex-start' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack alignItems="flex-end">
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Job' : 'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

      </Grid>
    </FormProvider>
  );
}
