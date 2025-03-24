import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/config';

// Super admin credentials - CHANGE THESE TO YOUR DESIRED VALUES
const SUPER_ADMIN_EMAIL = 'superadmin@example.com';
const SUPER_ADMIN_PASSWORD = 'superadmin123';

export const setupSuperAdmin = async () => {
  try {
    // Create super admin account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD
    );

    // Set up super admin data in the database
    await set(ref(database, `users/${userCredential.user.uid}`), {
      email: SUPER_ADMIN_EMAIL,
      isAdmin: true,
      isSuperAdmin: true,
      approved: true,
      createdAt: new Date().toISOString()
    });

    console.log('Super admin account created successfully');
    return true;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Super admin account already exists');
      return true;
    }
    console.error('Error creating super admin account:', error);
    return false;
  }
}; 