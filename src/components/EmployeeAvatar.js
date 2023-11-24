// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function EmployeeAvatar({ employee, ...other }) {
  return (
    <Avatar
      src={employee?.attributes.avatar_url}
      alt={employee?.attributes.first_name}
      color={employee?.attributes.avatar_url ? 'default' : createAvatar(employee?.attributes.first_name).color}
      {...other}
    >
      {createAvatar(employee?.attributes.first_name).name}
    </Avatar>
  );
}
