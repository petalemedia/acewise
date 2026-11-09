import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6af0b4e6000f77df6a31'

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '6af0b6e400166acab0b4'
export const COLLECTION_PROFILES_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || '6af0b6f40036fc2244f0'

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

export const account = new Account(client)
export const databases = new Databases(client)
export { client, ID, Query, Permission, Role }

let pingPromise

export function pingAppwrite() {
  if (!pingPromise) {
    pingPromise = client.ping()
      .then(() => {
        console.info('Appwrite connection established.')
      })
      .catch(error => {
        console.error('Appwrite connection failed.', error)
      })
  }
  return pingPromise
}
