import { createContext, useContext, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../hooks/auth'

interface AuthProps {
  authUser?: any
  isLoading?: boolean
  loadUser?: () => Promise<void>
}

export const AuthContext = createContext<AuthProps>({})

export const AuthProvider = ({ children }: any) => {
  const [authUser, setAuthUser] = useState(null as any)
  const [isLoading, setLoading] = useState(true)

  const { getCurrentUser } = useAuth()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const user = await getCurrentUser().catch(() => setLoading(false))
    setAuthUser(user)
    setLoading(false)
  }

  const value = {
    authUser,
    isLoading,
    loadUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

interface PrivateRouteProps extends RouteProps {
  component: any
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { authUser, isLoading } = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) {
          return <></>
        }
        if (!authUser) {
          return <Redirect to={{ pathname: '/' }} />
        }

        return <Component {...props} />
      }}
    />
  )
}
