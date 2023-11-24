import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Grid,  MenuItem, IconButton, Typography, Stack, Divider } from '@mui/material';
import moment from 'moment';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
import { CarouselDots } from '../../../../components/carousel';
//
import ShopProductCard from '../../e-commerce/shop/ShopProductCard';


// ----------------------------------------------------------------------

JobItemList.propTypes = {
  jobs: PropTypes.array.isRequired,
};

const ItemBlockStyle = styled((props) => <Stack direction="row" alignItems="center" {...props} />)({
  minWidth: 72,
  flex: '1 1',
});

const ItemIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));

export default function JobItemList({ jobs }) {

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)',}}}>
     {jobs.length !== 0 && jobs.map((job, i) => (
        <Card key={i} sx={{cursor: "pointer"}} onClick={() => navigate(PATH_DASHBOARD.job.view(job.id))}>
            <Box sx={{ position: 'relative', p: 2.5 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Avatar
                            alt={job.attributes.title}
                            src={job.attributes.job_avatar_uri}
                            sx={{ width: 60, height: 60, borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="subtitle1">{job.attributes.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }} noWrap>{job.attributes.location}</Typography>
                        {job.attributes.published ? 
                        <>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Published</Typography>
                        </>
                        :
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>Draft</Typography>
                        }

                        <ItemBlockStyle sx={{mt: 1}}>
                          <ItemIconStyle sx={{ color: 'primary.main' }} icon={'mdi:account-multiple'} />
                          <Typography variant="body2" sx={{ color: 'primary.main' }} noWrap> {job.attributes.employee_job_matches.data.length} Candidates</Typography>
                        </ItemBlockStyle>
                        
                    </Grid>
                </Grid>
            </Box>
            <Divider/>   
            <Box sx={{ position: 'relative', p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ItemBlockStyle>
                    <ItemIconStyle icon={'mdi:poll'} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{job.attributes.experience.data.attributes.name}</Typography>
                  </ItemBlockStyle>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ItemBlockStyle>
                    <ItemIconStyle icon={'mdi:clock'} />
                    {job.attributes.preferred_hours.data.map((item, i) => ( 
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{item.attributes.name}, </Typography>
                    ))}
                  </ItemBlockStyle>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ItemBlockStyle>
                    <ItemIconStyle icon={'mdi:cash'} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{job.attributes.salary_currency} {job.attributes.salary_value} {job.attributes.salary_type}</Typography>
                  </ItemBlockStyle>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ItemBlockStyle>
                    <ItemIconStyle icon={'mdi:account'} />
                    {job.attributes.job_roles.data.map((item, i) => ( 
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{item.attributes.role}, </Typography>
                    ))}
                  </ItemBlockStyle>
                </Grid>
              </Grid>
            </Box>     
        </Card>
     ))}
    </Box>
  );
}
