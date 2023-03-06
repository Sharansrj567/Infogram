import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '5%'
        }}
      >
        <img
          src={
            'https://res.cloudinary.com/teleopdassets/image/upload/v1678091668/undraw_Folder_re_apfp_b8ofym.png'
          }
          className="img-fluid"
        />
      </div>
    )
  }
}
