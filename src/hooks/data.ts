import { useIonAlert } from "@ionic/react";
import { Permission, Role } from "appwrite";
import { useContext } from "react";
import { avatars, client, databases, storage } from "../config/appwrite";
import { AuthContext } from "../providers/AuthProvider";

const DB_ID = '635fb2b9be68d706f108';
const NOTES_COLLECTION_ID = '635fb2c212541074cd11';
const BUCKET_ID = '635fcf23a2b8d7412c37';

export interface Note {
  title?: string;
  text?: string;
}

export enum Action {
  add = 'add',
  remove = 'remove'
}
export interface RealtimeUpdate {
  type: Action,
  data: any
}

export const useData = () => {
  const { authUser } = useContext(AuthContext)
  const [showAlert] = useIonAlert()


  const getNotes = async () : Promise<any[]> => {
    try {
      return (await databases.listDocuments(DB_ID, NOTES_COLLECTION_ID)).documents;
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return [];
    }
  };

  const getNoteById = async (id: string) => {
    try {
      return databases.getDocument(DB_ID, NOTES_COLLECTION_ID, id);
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  };

  const addNote = (title: string) => {
    const userId = authUser.$id;
    
    try {
      return databases.createDocument(DB_ID, NOTES_COLLECTION_ID, 'unique()', {
        title,
      },     [
        Permission.read(Role.users()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ])
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  };

  const updateNoteById = async (id: string, data: Note) => {
    try {
      return databases.updateDocument(DB_ID, NOTES_COLLECTION_ID, id, data)
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  };

  const deleteNoteById = async (id: string) => {
    try {
      return databases.deleteDocument(DB_ID, NOTES_COLLECTION_ID, id)
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  };

  const uploadImage = async (file: any) => {
    const userId = authUser.$id;

    try {
      return storage.createFile(BUCKET_ID, userId, file, [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ])
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  }

  const hasUserAvatar = async () => {
    const userId = authUser.$id;

    try {
      return storage.getFile(BUCKET_ID, userId)
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  }


  const getUserAvatar = async () => {
    const userId = authUser.$id;

    try {
      return storage.getFilePreview(BUCKET_ID, userId)
    } catch(e) {
      showAlert(`There was an error with your request: ${e}`);
      return null;
    }
  }

  const getNotesRealtime = (func: (data: any) => void) => {    
    client.subscribe(`databases.${DB_ID}.collections.${NOTES_COLLECTION_ID}.documents`, (data) => {      
      if (data.events.includes('databases.*.collections.*.documents.*.delete')) {
        func({type: Action.remove, data: data.payload})
      } else if (data.events.includes('databases.*.collections.*.documents.*.create')) {
        func({type: Action.add, data: data.payload})
      }
    });
  }

  const getInitials = () => {
    return avatars.getInitials(authUser.email, 200, 200);
  }


  return {
    getNotes,
    addNote,
    getNoteById,
    updateNoteById,
    deleteNoteById,
    uploadImage,
    hasUserAvatar,
    getUserAvatar,
    getNotesRealtime,
    getInitials
  }
};