import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 720,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}));

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh',
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  return (
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle alt="overlay" src="/assets/staff-wanted-homepage-banner.jpg" variants={varFade().in} />



        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Get a new gig <br /> with
                <Typography component="span" variant="h1" sx={{ color: 'primary.light' }}>
                  &nbsp;Staff Wanted
                </Typography>
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography sx={{ color: 'common.white' }}>
                The starting point for your next project based on easy-to-customize MUI helps you build apps faster and
                better.
              </Typography>
            </m.div>


            <Stack spacing={2.5} direction={"row"}>
              <m.div variants={varFade().inRight}>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={PATH_AUTH.register}
                  startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                >
                  Im looking for work
                </Button>
              </m.div>
              <m.div variants={varFade().inRight}>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={PATH_AUTH.register}
                  startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                >
                  Im looking for staff
                </Button>
              </m.div>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
