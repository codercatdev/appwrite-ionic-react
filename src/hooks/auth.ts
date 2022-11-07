import { ID } from "appwrite";
import { account } from "../config/appwrite";

export const useAuth = () => {

  const createAccount = async (email: string, password: string) => {
    try {     
      // Create user account
      await account.create(ID.unique(), email, password)

      // Create user session
      await account.createEmailSession(email, password);

      // Start email verification
      return account.createVerification(`${window.location.origin}/verify/account`);
    } catch(e) {      
      return (e);
    }
  };

  const logIn = (email: string, password: string) => {
    try {
      return account.createEmailSession(email, password)
    } catch(e) {      
      return (e);
    }
  };

  const sendMagicLink = (email: string) => {
    try {      
      return account.createMagicURLSession(ID.unique(), email, `${window.location.origin}/verify/magic`)
    } catch(e) {
      return (e);
    }
  };

  const updateMagicVerification = async (userId: string, secret: string) => {
    try {
      return account.updateMagicURLSession(userId, secret)
    } catch(e) {
      return (e);
    }
  }

  const updateUserVerification = async (userId: string, secret: string) => {
    try {
      return account.updateVerification(userId, secret)
    } catch(e) {
      return (e);
    }
  }

  const getCurrentUser = () => {
    return account.get();
  }

  const signOutUser = async () => {
    try {
      await account.deleteSession("current");
    } catch (e) {
      return (e);
    }
  };

  return {
    createAccount,
    logIn,
    sendMagicLink,
    updateMagicVerification,
    updateUserVerification,
    getCurrentUser,
    signOutUser
  }
};