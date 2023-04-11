import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, User, deleteUser } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase ,ref, set, onValue, push, remove, orderByKey,query, orderByChild, equalTo  } from 'firebase/database';
import { displayAllUsers, displayVisitedUserPosts,showMembersButton} from './display-user';
import { directLogin } from './directLogin/directLogin';

const firebaseConfig = {
    apiKey: 'AIzaSyBlVl5sNWPAiaf47u4vMIC908iEf4J5vzk',
    authDomain: 'funplanet-dd2ae.firebaseapp.com',
    databaseURL: 'https://funplanet-dd2ae-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'funplanet-dd2ae',
    storageBucket: 'funplanet-dd2ae.appspot.com',
    messagingSenderId: '697894675281',
    appId: '1:697894675281:web:e7ce9d551928606a6b6970',
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
let user: User;

let form: HTMLFormElement = document.querySelector('form') as HTMLFormElement;
let button: HTMLButtonElement = document.getElementById('createuser') as HTMLButtonElement;
let loginbutton: HTMLButtonElement = document.getElementById('login') as HTMLButtonElement;
const imagesDiv: HTMLDivElement = document.getElementById('images') as HTMLDivElement;
let cloneButton: HTMLButtonElement = button.cloneNode(true) as HTMLButtonElement;
let input: NodeListOf<HTMLInputElement> = document.querySelectorAll('input');
let logoutButton: HTMLButtonElement = document.getElementById('logout') as HTMLButtonElement;
let removeButton: HTMLButtonElement = document.getElementById('remove') as HTMLButtonElement;
let userInfoDiv = document.getElementById('userInfoDiv') as HTMLElement;

let selectedPicture: any;

cloneButton.addEventListener('click', (e) => {
    e.preventDefault();
    showMembersButton.style.display = "block";

    let userName: string = input[0].value;
    console.log(userName)
    let password: string = input[1].value;
    selectedPicture = input[2].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultman.jpg?alt=media&token=8c01309e-d3cf-4b07-b50a-d23f26f0fcbc'
        : input[3].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/deafultwoman.jpg?alt=media&token=6b5efde5-cf4a-4b6c-a81e-625fdc93aac2'
        : input[4].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultrandom.jpg?alt=media&token=ef6a6ffb-28a7-43f7-8b48-68303f6c05c3'
        : '';

    console.log(selectedPicture);

    createUserWithEmailAndPassword(auth, `${userName}`, `${password}`)
        .then((userCredential) => {
            // Loggat in
            user = userCredential.user;

            // Lagrar username och profilepicture i databasen
            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            set(userRef, {
                name: userName,
                profilePicture: selectedPicture,
            });
            directLogin()
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});

button.addEventListener('click', (e) => {
    e.preventDefault();

    imagesDiv.style.display = 'block';

    loginbutton.style.display = 'none';

    form.replaceChild(cloneButton, button);
});

loginbutton.addEventListener('click', (e) => {
    showMembersButton.style.display = 'block';
    console.log(123)
    e.preventDefault();
    directLogin()
});

logoutButton.addEventListener('click', (e) => {
    showMembersButton.style.display = 'none';
    const userpostDOM = document.getElementById('user-posts') as HTMLDivElement;
    userpostDOM.innerHTML = '' 
    console.log( userpostDOM );

    signOut(auth)
        .then(() => {
            // Dölj användarsektionen
            const userSection = document.getElementById('user-section') as HTMLElement;
            userSection.style.display = 'none';

            // Dölj användarlistan
            const userList = document.getElementById('user-list') as HTMLElement;
            userList.style.display = 'none';

            // Dölj den besökta användarens information när du loggar ut
            const visitedUserInfoDiv = document.getElementById('visited-user-info') as HTMLDivElement;
            visitedUserInfoDiv.style.display = 'none';

            // Visa inloggningsformuläret
            const loginForm = document.querySelector('form') as HTMLFormElement;
            loginForm.style.display = 'flex';

            // Rensa input-fält
            input[0].value = '';
            input[1].value = '';

            // Återställ knapparna och bildväljaren till deras ursprungliga tillstånd
            imagesDiv.style.display = 'none';
            loginbutton.style.display = 'flex';
            form.replaceChild(button, cloneButton);

            let picture: string = input[2].checked
                ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultman.jpg?alt=media&token=8c01309e-d3cf-4b07-b50a-d23f26f0fcbc'
                : input[3].checked
                ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/deafultwoman.jpg?alt=media&token=6b5efde5-cf4a-4b6c-a81e-625fdc93aac2'
                : input[4].checked
                ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultrandom.jpg?alt=media&token=ef6a6ffb-28a7-43f7-8b48-68303f6c05c3'
                : 'ingen bild';

    
        })
        .catch((error) => {
            console.error(error);
        });
});

removeButton.addEventListener('click', (e) => {
    // showMembersButton.style.display = 'none';
    if (confirm('är du säker?')) {
        const currentUser = auth.currentUser; // Hämta den nuvarande inloggade användaren
        const db = getDatabase();
        remove(ref(db, `users/${currentUser?.uid}`));
        

        currentUser?.delete()
            .then(() => {
                // Dölj användarsektionen
                const userSection = document.getElementById('user-section') as HTMLElement;
                userSection.style.display = 'none';

                // Dölj användarlistan
                const userList = document.getElementById('user-list') as HTMLElement;
                userList.style.display = 'none';

                // Visa inloggningsformuläret
                const loginForm = document.querySelector('form') as HTMLFormElement;
                loginForm.style.display = 'flex';

                // Rensa input-fält
                input[0].value = '';
                input[1].value = '';

                // Återställ knapparna och bildväljaren till deras ursprungliga tillstånd
                imagesDiv.style.display = 'none';
                loginbutton.style.display = 'flex';
                form.replaceChild(button, cloneButton);

                window.location.reload();
                // User deleted.
            })
            .catch((error) => {
                console.log("FUNKAR EJ", error)
                // ...
            });
    } else return;
});

export {input , signInWithEmailAndPassword , getDatabase, ref, onValue, userInfoDiv, push, displayVisitedUserPosts,query,orderByKey,displayAllUsers,orderByChild,equalTo}