import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// api
import { getEmployer, fetchLocationDetials, uploadAvatarFile, updateEmployer } from '../../../../api/staffwanted-api';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import RHFAddressAutoComplete from "../../../../components/hook-form/RHFAddressAutoComplete";

// ----------------------------------------------------------------------
const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const {user} = useSelector((state) => state.user);
  const [employer, setEmployer] = useState({});

  useEffect(() => {
    (async () => { 
      if(user.profile_id) {
        const {data} = await getEmployer(user.profile_id);
        setEmployer(data.attributes);
      } 
    })();
  }, [user]);

  const UpdateCompanySchema = Yup.object().shape({
    company_name: Yup.string().required('Company Name is required'),
  });

  const defaultValues = {
    company_name:  '',
    company_email: '',
    company_number: '',
    company_website: '',
    company_description: '',
    company_location: {},
    place_id: '',
    coords: {},
    company_avatar_url: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateCompanySchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    (async () => { 
      if(employer) {
        setValue('company_name', employer?.company_name);
        setValue('company_email', employer?.company_email);
        setValue('company_number', employer?.company_number);
        setValue('company_website', employer?.company_website);
        setValue('company_description', employer?.company_description);
        setValue('company_location', {label: employer?.company_location, value: employer?.place_id});
        setValue('place_id', employer?.place_id);
        setValue('coords', employer?.coords);
        setValue('company_avatar_url', employer?.company_avatar_url);
      } 
    })();
  }, [employer]);

  useEffect(() => {
    (async () => {

      if(values.company_location.value) {
        methods.setValue('place_id', values.company_location.value);
        const {data} = await fetchLocationDetials(values.company_location.value);
        methods.setValue('coords', data.result.geometry.location);
      }
        
    })();
  }, [values.company_location]);

  const onSubmit = async (values) => {
    try {
      values.company_location = values.company_location.label;

      const {data} = await updateEmployer(user.profile_id, values);
      if(data) {
        setEmployer(data.attributes);
        enqueueSnackbar('Update success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles)  => {
      (async () => {
        const file = acceptedFiles[0];
        if (file) {
          let companyAvatarUri = await uploadAvatarFile(file);
          setValue(
            'company_avatar_url', `${baseUrl}${companyAvatarUri[0].url}`);
        }
      })();
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(() => onSubmit(values))}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="company_avatar_url"
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

            <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },}}>
              <RHFTextField name="company_name" label="Name" />
              <RHFTextField name="company_email" label="Email Address" />
              <RHFTextField name="company_number" label="Phone Number" />
              <RHFTextField name="company_website" label="Website" />
            </Box>

            <Box sx={{ mt: 3}}>
                <RHFAddressAutoComplete
                  name="company_location"
                  label="Location"
                  placeholder="Location"
                />
            </Box>


            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="company_description" multiline rows={4} label="Description" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
