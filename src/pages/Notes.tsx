import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
  IonButtons,
  IonButton,
  IonIcon,
  useIonRouter,
  IonFab,
  IonFabButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react'
import { useAuth } from '../hooks/auth'
import { logOutOutline, addOutline, personCircleOutline } from 'ionicons/icons'
import { RealtimeUpdate, useData, Action } from '../hooks/data'
import useState from 'react-usestateref'
import Profile from './Profile'

const Notes: React.FC = () => {
  const { signOutUser } = useAuth()
  const navigation = useIonRouter()
  const { getNotes, addNote, getNotesRealtime } = useData()
  const [notes, setNotes, notesRef] = useState<any[]>([])

  useIonViewWillEnter(async () => {
    const notes = await getNotes()

    setNotes(notes)
    getNotesRealtime((result: RealtimeUpdate) => {
      if (result.type === Action.add) {
        setNotes([...notesRef.current, result.data])
      } else {
        const filtered = notesRef.current.filter(
          (note) => note.$id !== result.data.$id,
        )
        setNotes(filtered)
      }
    })
  })

  const signOut = async () => {
    await signOutUser()
    navigation.push('/', 'back')
  }

  const createNote = async () => {
    const newNote = await addNote('My new note')

    if (newNote) {
      navigation.push(`/notes/${newNote.$id}`, 'forward')
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonButton id="open-modal">
              <IonIcon icon={personCircleOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>My Notes</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={signOut}>
              <IonIcon icon={logOutOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {notes.map((note) => (
            <IonItem
              button
              key={note.$id}
              routerLink={`/notes/${note.$id}`}
              routerDirection="forward"
            >
              <IonLabel>{note.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={createNote}>
            <IonIcon icon={addOutline}></IonIcon>
          </IonFabButton>
        </IonFab>

        <Profile trigger="open-modal" />
      </IonContent>
    </IonPage>
  )
}
export default Notes
