import { Account, Avatars, Client, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('http://localhost:7000/v1')
    .setProject('635ea5a7c4cf314b2b29');
    
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { client, account, databases, storage, avatars};