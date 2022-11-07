import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
  useIonRouter,
  useIonAlert,
  useIonLoading,
} from '@ionic/react'
import { useContext } from 'react'
import { useAuth } from '../hooks/auth'
import { AuthContext } from '../providers/AuthProvider'

const Verify: React.FC<any> = ({ match }) => {
  const { updateUserVerification, updateMagicVerification } = useAuth()
  const navigate = useIonRouter()
  const [present, dismiss] = useIonLoading()
  const [showAlert] = useIonAlert()
  const { loadUser } = useContext(AuthContext)

  useIonViewWillEnter(async () => {
    await present()
    const queryParams = new URLSearchParams(window.location.search)
    const userId = queryParams.get('userId')
    const secret = queryParams.get('secret')
    await dismiss()

    if (userId && secret) {
      try {
        const type = match.params.type

        if (type === 'magic') {
          await updateMagicVerification(userId, secret)
        } else if (type === 'account') {
          await updateUserVerification(userId, secret)
        }

        // Update our auth context
        await loadUser!()

        navigate.push('/notes', 'root')
      } catch (e) {
        console.log('CATCH: ', e)
        showError()
      }
    } else {
      showError()
    }
  })

  const showError = () => {
    showAlert(
      'We could not verify your session, please get a new magic link!',
      [
        {
          text: 'Open Login',
          handler: () => {
            navigate.push('/', 'root')
          },
        },
      ],
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Verify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  )
}
export default Verify
