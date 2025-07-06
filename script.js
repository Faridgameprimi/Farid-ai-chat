import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
let currentUser = null;
export async function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("chatBox").style.display = "block";
    } catch (error) { alert(error.message); }
}
export async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("chatBox").style.display = "block";
    } catch (error) { alert(error.message); }
}
export async function logout() {
    await signOut(auth);
    currentUser = null;
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("chatBox").style.display = "none";
}
export async function sendMessage() {
    const input = document.getElementById("userInput").value;
    document.getElementById("messages").innerHTML += `<div class="message user">${input}</div>`;
    document.getElementById("userInput").value = "";
    const response = await fetch("https://us-central1-<PROJECT_ID>.cloudfunctions.net/chatWithAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
    });
    const data = await response.json();
    const answer = data.answer;
    document.getElementById("messages").innerHTML += `<div class="message bot">${answer}</div>`;
    await addDoc(collection(db, "chats"), {
        email: currentUser.email,
        question: input,
        answer: answer,
        timestamp: serverTimestamp()
    });
}