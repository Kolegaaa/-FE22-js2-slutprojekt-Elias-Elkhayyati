import { getDatabase, ref, onValue, query, orderByKey, orderByChild, equalTo, get } from 'firebase/database';
// import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, User } from 'firebase/auth';
import { auth } from './create-user';

const allPostsFromClickedUserDiv = document.getElementById('allPostsFromClickedUser') as HTMLDivElement;
const showMembersButton = document.getElementById('show-members') as HTMLButtonElement;


// let imgContainer = document.createElement('img')

export function displayAllUsers(userId: string) {
    const database = getDatabase();
    const usersRef = ref(database, 'users');
    const allUsersQuery = query(usersRef, orderByKey());

    const usersList = document.getElementById('users') as HTMLUListElement;
    const userListContainer = document.getElementById('user-list') as HTMLDivElement;
    

    showMembersButton.addEventListener('click',() => {
        usersList.classList.toggle('hidden');
        console.log('click');
    
        
    })

    onValue(allUsersQuery, (snapshot) => {
        const data = snapshot.val();
        console.log('All users:', data);
        console.log('testing: ', Object.values(data))
        const visitedUser = document.getElementById('visited-user-name') as HTMLElement;
        const visitedUserEmail = visitedUser.textContent
        console.log('who is the visited user?: ', visitedUserEmail)
    

        usersList.innerHTML = '';

        for (const userId in data) {
            const user = data[userId];
            console.log(user)
            console.log(user.profilePicture)
            // imgContainer.src = `${user.profilePicture}`
            // document.body.append(imgContainer)
            
            const listItem = document.createElement('li');
            listItem.textContent = user.name;
            listItem.style.cursor = 'pointer';

            listItem.addEventListener('click', () => {
                if (userId) {
                    // Call the displayVisitedUserPosts function with the ID of the clicked user
                    displayVisitedUserPosts(userId);
                }
            });

            usersList.appendChild(listItem);
        }

        // Visa användarlistan när någon har loggat in
        userListContainer.style.display = 'block';
    });
}

export async function displayVisitedUserPosts(userId: string) {
    console.log('in displayer visited user posts')
  
    allPostsFromClickedUserDiv.innerHTML = ''; 

    const database = getDatabase(); // get user stuff
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    const visitedUserName = document.getElementById('visited-user-name') as HTMLElement; 
    visitedUserName.textContent = userData.name;
    console.log('who is the visited user?: ', visitedUserName.textContent)

    const visitedUserPicture = document.getElementById('visited-user-picture') as HTMLImageElement;
    visitedUserPicture.src = userData.profilePicture;

    const visitedUserPostsRef = ref(database, `statusupdate`);
    const visitedUserPostsQuery = query(visitedUserPostsRef, orderByChild('userId'), equalTo(userId));

    onValue(visitedUserPostsQuery, (snapshot) => {
        const data = snapshot.val();
        const allPostsFromClickedUserDiv = document.getElementById('allPostsFromClickedUser') as HTMLDivElement;

        if (!data) {
            allPostsFromClickedUserDiv.innerHTML = '<p>No posts yet</p>';
            return;
        }

        for (const postId in data) {
            const post = data[postId];

            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            const postText = document.createElement('p');
            postText.textContent = post.statusUpdate;
            postCard.appendChild(postText);
            allPostsFromClickedUserDiv.appendChild(postCard); // add post to the new div element
            
        }
    });

    const visitedUserInfoDiv = document.getElementById('visited-user-info') as HTMLDivElement;
    visitedUserInfoDiv.style.display = 'block';
}


export {showMembersButton}







