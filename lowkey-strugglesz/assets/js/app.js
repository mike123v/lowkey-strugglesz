// Firebase Config (Replace with your own)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "lowkey-strugglesz.firebaseapp.com",
    projectId: "lowkey-strugglesz",
    storageBucket: "lowkey-strugglesz.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load Posts
function loadPosts() {
    const postContainer = document.getElementById("postContainer");
    db.collection("posts").orderBy("timestamp", "desc").limit(10).get()
        .then((querySnapshot) => {
            postContainer.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                postContainer.innerHTML += `
                    <div class="post-card bg-white p-6 rounded-lg shadow-md">
                        <p class="text-gray-700 mb-4">${post.text}</p>
                        <div class="flex items-center text-sm text-gray-500">
                            <span>Anonymous • ${new Date(post.timestamp?.toDate()).toLocaleString()}</span>
                            <div class="ml-auto flex space-x-2">
                                <button class="emoji-reaction" data-postid="${doc.id}" data-emoji="❤️">❤️ ${post.reactions?.heart || 0}</button>
                                <button class="emoji-reaction" data-postid="${doc.id}" data-emoji="🤗">🤗 ${post.reactions?.hug || 0}</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
}

// Handle Emoji Reactions
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("emoji-reaction")) {
        const postId = e.target.getAttribute("data-postid");
        const emoji = e.target.getAttribute("data-emoji");
        const emojiKey = emoji === "❤️" ? "heart" : "hug";
        
        db.collection("posts").doc(postId).update({
            [`reactions.${emojiKey}`]: firebase.firestore.FieldValue.increment(1)
        }).then(() => {
            loadPosts();
        });
    }
});

// Initial Load
window.onload = loadPosts;