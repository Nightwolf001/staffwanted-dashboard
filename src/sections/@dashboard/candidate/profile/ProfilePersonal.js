import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Box } from '@mui/material';
// api
import { fetchLocationDetials } from '../../../../api/staffwanted-api';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfilePersonal.propTypes = {
  employee: PropTypes.object,
};

export default function ProfilePersonal({ employee }) {
  const { first_name, last_name, email, phone_number, date_of_birth, gender, place_id } = employee.attributes;

  const [location, setLocation] = useState([]);

  useEffect(() => {
    (async () => {
      if(place_id) {
        const {data} = await fetchLocationDetials(place_id);
        setLocation(data.result.address_components);
      }
    })();
  }, [place_id]);

  return (
    <Box>
    <Card sx={{ mb: 3 }} >
      <CardHeader title="Personl Details" />

      <Stack spacing={2} sx={{ p: 3 }}>
    
        <Stack direction="row">
          <IconStyle icon={'mdi:account'} />
          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {first_name} {last_name}
            </Link>
          </Typography>
        </Stack>

        {/* <Stack direction="row">
          <IconStyle icon={'mdi:calendar-range'} />
          <Typography variant="body2">
            DOB: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {date_of_birth}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'mdi:gender-male-female-variant'} />
          <Typography variant="body2">
            Gender: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {gender.data.attributes.name}
            </Link>
          </Typography>
        </Stack> */}

        <Stack direction="row">
          <IconStyle icon={'mdi:city-variant-outline'} />
          <Typography variant="body2">
            City: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {location[1]?.long_name}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'mdi:map-marker-outline'} />
          <Typography variant="body2">
            Country: &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {location[4]?.long_name}
            </Link>
          </Typography>
        </Stack>

      </Stack>
    </Card>

    <Card>
      <CardHeader title="Contact Details" />

      <Stack spacing={2} sx={{ p: 3 }}>
    
        <Stack direction="row">
          <IconStyle icon={'mdi:mail'} />
          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {email}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'mdi:phone'} />
          <Typography variant="body2">
            <Link component="span" variant="subtitle2" color="text.primary">
              {phone_number}
            </Link>
          </Typography>
        </Stack>

      </Stack>
    </Card>
    </Box>
  );
}
