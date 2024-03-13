import { useQuery } from '@apollo/client';
import React, { createContext, useReducer, useContext } from 'react'
import { GET_CURRENT_USER } from '../graphql/queries/AuthQueries';

const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null
const initializerArg = { user : currentUser , isLogged : currentUser ? true : false};

const AuthStateContext = createContext(null)
const AuthDispatchContext = createContext(initializerArg)

const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user))
        localStorage.setItem('token', JSON.stringify(action.payload.token))
        localStorage.setItem('refreshToken', JSON.stringify(action.payload.refreshToken))
        return {
          ...state,
          user: action.payload.user,
        }
      case 'LOGOUT':
        localStorage.clear()
        return {
          ...state,
          user: null,
        }
      case 'SET_CURRENT_USER':
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user))
        return {
          ...state,
          user: action.payload.user,
        }
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initializerArg )
  const { data : currentUserData , loading: loadingCurrentuSer } =  useQuery(GET_CURRENT_USER)
  React.useEffect(()=>{
    if(currentUserData?.currentUser) dispatch({ type: 'SET_CURRENT_USER', payload: {user : currentUserData?.currentUser} })
  }, [currentUserData])

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export const useSession= () => useContext(AuthStateContext)
export const useSessionDispatch = () => useContext(AuthDispatchContext)