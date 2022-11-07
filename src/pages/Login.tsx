import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
  useIonRouter,
} from '@ionic/react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/auth'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../providers/AuthProvider'

const Login: React.FC = () => {
  const { register, handleSubmit, getValues } = useForm()

  const [present, dismiss] = useIonLoading()
  const [showAlert] = useIonAlert()

  const { sendMagicLink, createAccount, logIn } = useAuth()
  const { authUser, loadUser } = useContext(AuthContext)
  const navigation = useIonRouter()

  const triggerMagicLink = async () => {
    present()
    const data = getValues()
    await sendMagicLink(data.email)
    dismiss()
    showAlert('Check your emails for the magic link!')
  }

  useEffect(() => {
    if (authUser) {
      navigation.push('/notes', 'root')
    }
  }, [authUser])

  const signUp = async () => {
    await present()
    const data = getValues()
    try {
      await createAccount!(data.email, data.password)
      dismiss()
      showAlert('Please check your inbox to confirm your account!')
    } catch (e) {
      dismiss()
      showAlert('Login failed, invalid credentials')
    }
  }

  const signIn = async (data: any) => {
    await present()
    try {
      console.log('try login...')

      await logIn!(data.email, data.password)
      dismiss()
      await loadUser!()
    } catch (e) {
      dismiss()
      showAlert('Login failed, invalid credentials')
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <form onSubmit={handleSubmit(signIn)}>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  placeholder="john@doe.com"
                  {...register('email', {
                    value: 'isaacout@gmail.com',
                    required: true,
                  })}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  placeholder="password"
                  {...register('password', {
                    value: '12345678',
                    required: true,
                  })}
                ></IonInput>
              </IonItem>
              <IonButton
                expand="full"
                type="submit"
                strong={true}
                className="ion-margin-top"
              >
                Sign in
              </IonButton>

              <IonButton
                expand="full"
                type="button"
                color="secondary"
                onClick={signUp}
              >
                Create account
              </IonButton>
            </form>
            <IonButton
              expand="full"
              type="submit"
              color="tertiary"
              onClick={triggerMagicLink}
            >
              Send Magic Link
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Login
