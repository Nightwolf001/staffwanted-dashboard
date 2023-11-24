// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
// redux
import { useDispatch, useSelector } from '../redux/store';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { employer, user } = useSelector((state) => state.user);
  return (
    <Avatar
      src={employer?.company_avatar_url}
      alt={employer?.company_name}
      color={employer?.company_avatar_url ? 'default' : createAvatar(employer?.company_name).color}
      {...other}
    >
      {createAvatar(employer?.company_name).name}
    </Avatar>
  );
}
