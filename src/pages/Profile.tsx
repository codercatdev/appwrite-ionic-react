import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
  IonLabel,
} from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import React, { useContext, useRef, useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useData } from '../hooks/data'
import { AuthContext } from '../providers/AuthProvider'

interface ProfilePageProps {
  trigger: string
}

const Profile: React.FC<ProfilePageProps> = ({ trigger }) => {
  const modal = useRef<HTMLIonModalElement>(null)
  const [avatar, setAvatar] = useState<any>(null)
  const [initials, setInitials] = useState<any>(null)

  const { uploadImage, hasUserAvatar, getUserAvatar, getInitials } = useData()
  const { authUser } = useContext(AuthContext)

  useIonViewWillEnter(async () => {
    try {
      const file = await hasUserAvatar()

      if (file) {
        const img = await getUserAvatar()

        if (img) {
          setAvatar(`${img.href}&date=${Date.now()}`)
        }
      }
    } catch (e) {
      console.log('CATCH: ', e)
      // User has no image yet!
    }

    const initials = await getInitials()
    setInitials(initials.href)
  }, [authUser])

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    })
    const file = await dataUrlToFile(
      `data:image/jpeg;base64,${image.base64String!}`,
      `${authUser.$id}.jpg`,
    )
    await uploadImage(file)

    setAvatar(`data:image/jpeg;base64,${image.base64String!}`)
  }

  async function dataUrlToFile(
    dataUrl: string,
    fileName: string,
  ): Promise<File> {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  return (
    <IonModal ref={modal} trigger={trigger}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-center">
        <div style={{ display: 'block' }}>
          {avatar ? (
            <img
              src={avatar}
              onClick={() => takePicture()}
              alt="Task"
              style={{ width: 'auto', height: 'auto' }}
            />
          ) : (
            <IonButton
              shape="round"
              color="primary"
              onClick={() => takePicture()}
            >
              Select Avatar image
            </IonButton>
          )}
        </div>
        <div style={{ display: 'block' }}>
          <img src={initials} alt="initials"></img>
        </div>

        <IonLabel>
          {authUser?.email}
          <p>{authUser?.$id}</p>
        </IonLabel>
      </IonContent>
    </IonModal>
  )
}

export default Profile
