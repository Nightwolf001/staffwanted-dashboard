import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Table, Divider, TableRow, TableBody, TableHead, TableCell, Typography, TableContainer, Avatar, Chip, Stack } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Markdown from '../../../../components/Markdown';
import Scrollbar from '../../../../components/Scrollbar';
import LoadingScreen from '../../../../components/LoadingScreen';

// ----------------------------------------------------------------------

const ItemBlockStyle = styled((props) => <Stack direction="row" alignItems="flex-start" {...props} />)({
  minWidth: 72,
  flex: '1 1',
});

const ItemIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginTop: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  color: theme.palette.text.disabled,
}));

// ----------------------------------------------------------------------

JobDetails.propTypes = {
  job: PropTypes.object.isRequired,
};

export default function JobDetails({ job }) {
  const theme = useTheme();
  if(!job) return (<LoadingScreen />);
  return (
    <Grid container spacing={3}>

        <Grid item xs={12} md={8}>
            <Card>
              <Box sx={{ p: { xs: 3, md: 5} }}>
                <Typography variant="h3" sx={{ mb: 4 }}>{job?.attributes.title}</Typography>
                <Typography variant="h6" sx={{ mb: 2}}>Job Description</Typography>
                <pre style={{textWrap: 'pretty'}}><Typography variant="body1" sx={{ mb: 2}}>{job?.attributes.description}</Typography></pre>
                
                <Divider sx={{ mb: 2}} />
                <Typography sx={{ mb: 2}} variant="h6">Job Roles</Typography>
                <Box sx={{ml: -1}}>
                  {job?.attributes.job_roles.data.map((item) => (
                    <Chip key={item.id} label={item.attributes.role} sx={{ m: 0.5 }} />
                  ))}
                </Box>
                
                
              </Box>
            </Card>
        </Grid>

        <Grid item xs={12} md={4}>
            <Card sx={{mb: 2}}>
              <Box sx={{ p: { xs: 3, md: 3 } }}>
                  
                    {!!job.attributes.published && (
                    <>
                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:file'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Job</Typography>
                        <Typography variant="subtitle2" noWrap>Published</Typography>
                      </Stack>  
                    </ItemBlockStyle>

                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:calendar'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Active Date</Typography>
                        <Typography variant="subtitle2" noWrap>{job.attributes.active_date}</Typography>
                      </Stack>  
                    </ItemBlockStyle>

                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:calendar'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Expiration Date</Typography>
                        <Typography variant="subtitle2" noWrap>{job.attributes.expiry_date}</Typography>
                      </Stack>  
                    </ItemBlockStyle>
                    </>
                    )}

                    {!job.attributes.published && (
                    <>
                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:file'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Job</Typography>
                        <Typography variant="subtitle2" noWrap>Draft</Typography>
                      </Stack>  
                    </ItemBlockStyle>
                    </>
                    )}

                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:clock'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Employment Type</Typography>
                        {job.attributes.preferred_hours.data.map((item, i) => ( 
                          <Typography variant="subtitle2" noWrap>{item.attributes.name}, </Typography>
                        ))}
                      </Stack>  
                    </ItemBlockStyle>

                    <ItemBlockStyle sx={{mb: 2}}>
                      <ItemIconStyle icon={'mdi:cash'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Offered salary</Typography>
                        <Typography variant="subtitle2" noWrap>{job.attributes.salary_currency} {job.attributes.salary_value} {job.attributes.salary_type}</Typography>
                      </Stack>  
                    </ItemBlockStyle>

                    <ItemBlockStyle>
                      <ItemIconStyle icon={'mdi:cash'} />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Experience</Typography>
                        <Typography variant="subtitle2" noWrap>{job.attributes.experience.data.attributes.name}</Typography>
                      </Stack>  
                    </ItemBlockStyle>
                    

              </Box>
            </Card>
            <Card>
              <Box sx={{ p: { xs: 3, md: 3 } }}>
                <Grid container spacing={2}>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Avatar
                            alt={job?.attributes.title}
                            src={job?.attributes.job_avatar_uri}
                            sx={{ width: 60, height: 60, borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>{job?.attributes.contact_person}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{job?.attributes.contact_number}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{job?.attributes.contact_email}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{job?.attributes.location}</Typography>
                    </Grid>
                </Grid>
              </Box>
            </Card>
        </Grid>

    </Grid>
  );
}


