import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
// utils
import { useDispatch, useSelector } from '../redux/store';
import { setUser, setEmployer } from '../redux/slices/user';
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

const BASE_API = process.env.REACT_APP_API_ENDPOINT;

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {

  const storeDispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('initialize');
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const { data } = await axios.get(`${BASE_API}/api/users/me`);
          storeDispatch(setUser(data));
      
          if(data.user_type === 'employer') {
             await employer(data.profile_id);
          }
          
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: data,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (identifier, password) => {

    const { data } = await axios.post(`${BASE_API}/api/auth/local`, {
      identifier,
      password,
    });

    console.log('login', data);
    const { jwt, user } = data;

    setSession(jwt);
    storeDispatch(setUser(user));
    dispatch({
      type: 'LOGIN',
      payload: {
        isAuthenticated: true,
        user,
      },
    });
  };

  const register = async (companyEmail, password, companyName) => {

    const response = await axios.post(`${BASE_API}/api/employer/register`, {
      company_email: companyEmail,
      password,
      company_name: companyName,
    });
    
    if(response) {
      const { data } = await axios.post(`${BASE_API}/api/auth/local`, {
        identifier : companyEmail,
        password,
      });

      console.log('register', data);
      const { jwt, user } = data;
      setSession(jwt);
      storeDispatch(setUser(user));

      dispatch({
        type: 'REGISTER',
        payload: {
          isAuthenticated: true,
          user,
        },
      });
     }
  };

  const employer = async (profileId) => {
      const {data} = await axios.get(`${BASE_API}/api/employers/${profileId}`);
      storeDispatch(setEmployer(data.data.attributes));
  };

  const logout = async () => {
    setSession(null);
    storeDispatch(setUser({}));
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
