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
  IonItem,
  IonLabel,
  IonBackButton,
  IonInput,
  IonTextarea,
  useIonToast,
} from '@ionic/react'
import { useData } from '../hooks/data'
import { useState } from 'react'
import { saveOutline } from 'ionicons/icons'

const Details: React.FC<any> = ({ match }) => {
  const navigation = useIonRouter()
  const { getNoteById, updateNoteById, deleteNoteById } = useData()
  const [note, setNote] = useState<any>(null)
  const [showToast] = useIonToast()

  useIonViewWillEnter(async () => {
    const id = match.params.id
    const note = await getNoteById(id)
    setNote(note)
  })

  const updateNote = async () => {
    try {
      await updateNoteById(note.$id, {
        text: note.text,
        title: note.title,
      })
      showToast('Saved', 3000)
    } catch (e) {
      showToast('You are note allowed to update this note', 3000)
    }
  }

  const deleteNote = async () => {
    try {
      await deleteNoteById(note.$id)
      navigation.push('/notes', 'back')
      showToast('Deleted', 3000)
    } catch (e) {
      showToast('You are note allowed to delete this note', 3000)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes"></IonBackButton>
          </IonButtons>
          <IonTitle>Note</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={updateNote}>
              <IonIcon icon={saveOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput
            value={note?.title}
            onIonChange={(e: CustomEvent) =>
              setNote({ ...note, title: e.detail.value })
            }
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Text</IonLabel>
          <IonTextarea
            autoGrow
            value={note?.text}
            onIonChange={(e: CustomEvent) =>
              setNote({ ...note, text: e.detail.value })
            }
          ></IonTextarea>
        </IonItem>

        <IonButton onClick={deleteNote} expand="full" color="danger">
          Delete
        </IonButton>
      </IonContent>
    </IonPage>
  )
}
export default Details
