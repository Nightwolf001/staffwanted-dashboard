import * as Yup from 'yup';
import {useRef, useEffect, useState} from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Button, TextField, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// api
import { getEmployerJobs } from '../../../../api/staffwanted-api';
// redux
import { useSelector } from '../../../../redux/store';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ProfileSendRequest() {
  
  const {user} = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
      (async () => {

          const {data} = await getEmployerJobs(user.profile_id);
          setJobs(data);

      })();
  }, []);

  const InviteEmployeeSchema = Yup.object().shape({
    job: Yup.string().required(''),
    request_description: Yup.string().required(''),
  });

  const defaultValues = {
    job: '',
    request_description:  '',
  };

  const methods = useForm({
    resolver: yupResolver(InviteEmployeeSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit, formState: { isSubmitting, errors }} = methods;
  const values = watch();
  
  useEffect(() => {
      (async () => {

        console.log(values); 

      })();
  }, [values]);
  
  const onSubmit = async () => {
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(() => onSubmit())}>
    <Card sx={{ p: 3 }}>
      <RHFSelect sx={{mb: 2}} name="job" label="Job" placeholder="Job">
        <option value="" />
        {jobs.map((option) => (
          <option key={option.id} value={option.id}>
            {option.attributes.title}
          </option>
        ))}
      </RHFSelect>
      <RHFTextField fullWidth name="request_description" multiline rows={4} label="Description" placeholder="Invite this employee to apply to your job..."/>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',}}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Send Invite
        </LoadingButton>
      </Box>
    </Card>
    </FormProvider>
  );
}
