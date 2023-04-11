import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, User, deleteUser } from 'firebase/auth';
import { input,auth,getDatabase,ref,onValue,userInfoDiv,push,displayVisitedUserPosts,query,orderByKey,displayAllUsers,orderByChild,equalTo} from "../create-user";
import { addStatusUpdateToDOM } from '../addStatusUpdateDOM/addStatusUpdateToDOM';
import { showMembersButton } from '../display-user';


let user: User;

function directLogin(){
    
    const email: string = input[0].value;
    const password: string = input[1].value;
    let picture: string = input[2].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultman.jpg?alt=media&token=8c01309e-d3cf-4b07-b50a-d23f26f0fcbc'
        : input[3].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/deafultwoman.jpg?alt=media&token=6b5efde5-cf4a-4b6c-a81e-625fdc93aac2'
        : input[4].checked
        ? 'https://firebasestorage.googleapis.com/v0/b/funplanet-dd2ae.appspot.com/o/defaultrandom.jpg?alt=media&token=ef6a6ffb-28a7-43f7-8b48-68303f6c05c3'
        : 'ingen bild';

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential: any) => {
            user = userCredential.user;
            console.log(auth);
            console.log("!!!!",user);

            // 1. Visa användarsektionen och dölj inloggningsformuläret
            const userSection = document.getElementById('user-section') as HTMLElement;
            const loginForm = document.querySelector('form') as HTMLFormElement;
            userSection.style.display = 'block';
            loginForm.style.display = 'none';

            // 2. Hämta referenser till de nya HTML-elementen
            const welcomeMessage = document.getElementById('welcome-message') as HTMLElement;
            // const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
            const statusUpdateInput = document.getElementById('status-update') as HTMLInputElement;
            const submitStatusButton = document.getElementById('submit-status') as HTMLButtonElement;
            
            const userPosts = document.getElementById('user-posts') as HTMLDivElement;
          

            // 3. Uppdatera välkomstmeddelandet och användaravataren med användarinformationen
            welcomeMessage.textContent = `Welcome, ${user.email}`;
            console.log(user);
            // userAvatar['src'] = user.photoURL;

            // 4. Lägg till en eventlistener för att hantera statusuppdateringar
            const database = getDatabase();
            const statusUpdatesRef = ref(database, 'statusupdate');
            const currentUser = auth.currentUser;
            const userId = currentUser?.uid;
            console.log(userId);
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);

            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                console.log('userData:', userData);
                userInfoDiv.innerHTML = `Logged in: ${userData.name} <img src="${userData.profilePicture}"/>`;

                const userNameDisplay = document.getElementById('username');
            });

            const profilePicture = currentUser?.photoURL;

            submitStatusButton.addEventListener('click', (e) => {
                e.preventDefault();

                const statusText = statusUpdateInput.value;
                if (statusText.trim() !== '') {
                    // Skicka statusuppdateringen till Firebase
                    const database = getDatabase();
                    const statusUpdatesRef = ref(database, 'statusupdate');
                    const currentUser = auth.currentUser;
                    const userId = currentUser?.uid;
                    console.log(userId);
                    const profilePicture = currentUser?.photoURL;

                    const newStatusUpdate = {
                        userId: userId,
                        profilePicture: profilePicture,
                        statusUpdate: statusText,
                        time: Date.now(),
                    };
                    console.log(profilePicture);
                    push(statusUpdatesRef, newStatusUpdate);

                    // Rensa statusuppdateringsfältet
                    statusUpdateInput.value = '';

                    // Lägg till den nya statusuppdateringen till userPosts-diven
                    const userPostsElement = document.getElementById('user-posts') as HTMLElement;
                    const visitedUserName = document.getElementById('visited-user-name') as HTMLElement;

                    visitedUserName.textContent;
                    if (auth.currentUser?.email === visitedUserName.textContent) {
                        displayVisitedUserPosts(auth.currentUser?.uid);
                    } else {
                        const database = getDatabase();
                        const usersRef = ref(database, 'users');
                        const allUsersQuery = query(usersRef, orderByKey());

                        onValue(allUsersQuery, (snapshot) => {
                            const data = snapshot.val();
                            console.log('All users:', data);
                            let selectedUserId = '';
                            for (const user in data) {
                                console.log(user, data[user].name);

                                if (data[user].name === visitedUserName.textContent) {
                                    selectedUserId = user;
                                }
                            }
                            if (selectedUserId) {
                                displayVisitedUserPosts(selectedUserId);
                            }
                        });

                        const allPostsFromClickedUserDiv = document.getElementById('allPostsFromClickedUser') as HTMLDivElement;
                        allPostsFromClickedUserDiv.innerHTML = '';
                    }
                    console.log("!!!!!!!!!!!",statusText, userPostsElement, auth.currentUser?.displayName || '', newStatusUpdate.time);
                    addStatusUpdateToDOM(statusText, userPostsElement, auth.currentUser?.displayName || '', newStatusUpdate.time);
                    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                }
            });

            // Anropa funktionen för att hämta och visa statusuppdateringar

            // getStatusUpdatesAndDisplay(user.uid);
            displayAllUsers(user.uid);
        })
        .catch((error: any) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });

    function getCurrentUserIdFromUrl(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        return userId;
    }

    function getStatusUpdatesAndDisplay() {
        const currentUserId = getCurrentUserIdFromUrl();
        if (!currentUserId) {
            return;
        }

        const database = getDatabase();
        const statusUpdatesRef = ref(database, 'statusupdate');
        const userStatusUpdatesQuery = query(statusUpdatesRef, orderByChild('userId'), equalTo(currentUserId));

        onValue(userStatusUpdatesQuery, (snapshot) => {
            const data = snapshot.val();
            const userPostsElement = document.getElementById('user-posts') as HTMLElement;

            // Rensa allt innehåll i userPostsElement innan du börjar lägga till nya statusuppdateringar
            userPostsElement.innerHTML = '';

            // Loopa igenom alla statusuppdateringar som hämtats från databasen
            for (const key in data) {
                const statusUpdate = data[key];

                // Annars, lägg till statusuppdateringen till userPostsElement
                addStatusUpdateToDOM(statusUpdate.statusUpdate, userPostsElement, statusUpdate.userName, statusUpdate.time);
            }
        });
    }
}

export { directLogin };