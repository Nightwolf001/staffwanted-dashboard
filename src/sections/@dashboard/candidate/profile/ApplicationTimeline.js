// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

ApplicationTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function ApplicationTimeline({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list.map((item, index) => (
            <OrderItem key={item.id} item={item.attributes} isLast={index === list.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { action, title, description, date_time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (action === 'application_status_change' && 'success') ||
            (action === 'call' && 'primary') ||
            (action === 'mail' && 'success') ||
            (action === 'chat' && 'info') ||
            (action === 'meeting' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography sx={{textTransform: 'capitalize'}} variant="subtitle2">{title}</Typography>
        {description && <Typography sx={{ mt: .5, color: 'text.secondary' }} variant="body2">{description}</Typography>}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(date_time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
