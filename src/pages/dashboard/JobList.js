import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';
// api
import { getEmployerJobs } from '../../api/staffwanted-api';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import  JobItemList from '../../sections/@dashboard/jobs/list';


// ----------------------------------------------------------------------

export default function JobList() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      const {data} = await getEmployerJobs(user.profile_id);
      setJobs(data);
    })();
  }, []);


  return (
    <Page title="Jobs">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Job"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Job',
              href: PATH_DASHBOARD.job.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.job.new}
                startIcon={<Iconify icon={'eva:plus-fill'}/>}
            >
                New Job
            </Button>
          }
        />
        <JobItemList jobs={jobs}/>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = products.filter((product) => filters.gender.includes(product.gender));
  }
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) => product.colors.some((color) => filters.colors.includes(color)));
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === 'below') {
        return product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
