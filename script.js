// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7xQOops2rDSEJPzj1ZQ--qCymuy1z9Fg",
  authDomain: "amaanah-portal.firebaseapp.com",
  projectId: "amaanah-portal",
  storageBucket: "amaanah-portal.firebasestorage.app",
  messagingSenderId: "1048011973733",
  appId: "1:1048011973733:web:59cca10f2b1b706579928c",
  measurementId: "G-9CJNY3FX29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Translations
const translations = {
    en: {
        title: "Amaanah International University",
        subtitle: "Deanship of Graduate Studies and Scientific Research",
        teacherPortal: "Lecturers Portal",
        studentPortal: "Students Portal",
        studentId: "Student ID",
        fileName: "PDF File Name",
        search: "Search",
        linkDoc: "Link Document",
        download: "Download",
        processing: "Processing...",
        successLink: "Filename optimized and linked!",
        errorLink: "Failed to link document.",
        found: "Document Ready:",
        notFound: "Document not found.",
        login: "Login",
        logout: "Logout",
        email: "Email",
        teacherLogin: "Teacher Login",
        teacherSignup: "Teacher Sign Up",
        password: "Password",
        fullName: "Full Name",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        signUp: "Sign Up",
        successSignup: "Registration successful! Please login.",
        errorSignup: "Registration failed or user exists.",
        errorLogin: "Invalid credentials.",
        home: "Home",
        enterId: "Enter Student ID",
        enterFile: "e.g. schedule.pdf",
        connectionError: "Connection Error.",
        noDocFound: "No document found for this ID.",
        downloadDoc: "Download Document",
        searching: "Searching database...",
        fileError: "File error - please contact admin",
        footerCopyright: "© 2026 Amaanah International University",
        forgotPassword: "Forgot Password?",
        enterEmailFirst: "Please enter your email first",
        resetSent: "Reset email sent! Please check your inbox",
        resetError: "Failed to send reset email."
    },
    ar: {
        title: "جامعة الأمانة العالمية",
        subtitle: "عمادة الدراسات العليا والبحث العلمي",
        studentPortal: "بوابة الطلبة",
        teacherPortal: "بوابة المحاضرين",
        studentId: "رقم الطالب",
        fileName: "اسم ملف PDF",
        search: "بحث",
        linkDoc: "ربط المستند",
        download: "تحميل",
        processing: "جاري المعالجة...",
        successLink: "تم تحسين اسم الملف وربطه بنجاح!",
        errorLink: "فشل ربط المستند.",
        found: "المستند جاهز:",
        notFound: "المستند غير موجود.",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        email: "البريد الإلكتروني",
        teacherLogin: "تسجيل دخول المعلم",
        teacherSignup: "تسجيل معلم جديد",
        password: "كلمة المرور",
        fullName: "الاسم الكامل",
        noAccount: "ليس لديك حساب؟",
        haveAccount: "لديك حساب بالفعل؟",
        signUp: "تسجيل",
        successSignup: "تم التسجيل بنجاح! الرجاء تسجيل الدخول.",
        errorSignup: "فشل التسجيل أو المستخدم موجود بالفعل.",
        errorLogin: "بيانات الاعتماد غير صالحة.",
        home: "الرئيسية",
        enterId: "أدخل رقم الطالب",
        enterFile: "مثلاً: schedule.pdf",
        connectionError: "خطأ في الاتصال.",
        noDocFound: "لا يوجد مستند لهذا الرقم.",
        downloadDoc: "تحميل المستند",
        searching: "جاري البحث في قاعدة البيانات...",
        fileError: "خطأ في الملف - يرجى الاتصال بالمسؤول",
        footerCopyright: "© 2026 جامعة الأمانة العالمية",
        forgotPassword: "هل نسيت كلمة السر؟",
        enterEmailFirst: "يرجى إدخال بريدك الإلكتروني أولاً",
        resetSent: "تم إرسال بريد إعادة التعيين! يرجى التحقق من بريدك",
        resetError: "فشل إرسال بريد إعادة التعيين."
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
    
    // ----------- Language Toggle -----------
    const langBtn = document.getElementById('langToggle');
    if(langBtn) {
        langBtn.onclick = () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('lang', currentLang);
            updateLanguage(currentLang);
        };
    }

    // ----------- Auth Logic (Firebase Auth) -----------
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.onclick = () => {
            signOut(auth).then(() => {
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error("Sign Out Error", error);
            });
        };
    }

    // Teacher Login
    const teacherLoginForm = document.getElementById('teacherLoginForm');
    if(teacherLoginForm) {
        teacherLoginForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('teacherEmail').value;
            const password = document.getElementById('teacherPassword').value;
            const msgBox = document.getElementById('message');

            showMessage(msgBox, translations[currentLang].processing, 'message-box');

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                     window.location.href = 'teacher-portal.html';
                })
                .catch((error) => {
                    const errorMsg = "Access denied. Please contact the administrator / تم رفض الدخول. يرجى الاتصال بالمسؤول";
                    showMessage(msgBox, errorMsg, 'error-box', true);
                    console.error("Login Error:", error.code, error.message);
                });
        };
    }

    // Forgot Password Logic
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.onclick = (e) => {
            e.preventDefault();
            const email = document.getElementById('teacherEmail').value;
            const msgBox = document.getElementById('message');

            if (!email) {
                showMessage(msgBox, translations[currentLang].enterEmailFirst, 'error-box', true);
                return;
            }

            showMessage(msgBox, translations[currentLang].processing, 'message-box');

            sendPasswordResetEmail(auth, email)
                .then(() => {
                    showMessage(msgBox, translations[currentLang].resetSent, 'success-box', true);
                })
                .catch((error) => {
                    console.error(error);
                    showMessage(msgBox, translations[currentLang].resetError + " (" + error.message + ")", 'error-box', true);
                });
        };
    }

    // ----------- Teacher Upload Logic (Firestore) -----------
    const teacherForm = document.getElementById('teacherForm');
    if(teacherForm) {
        // Protected Route
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = 'teacher-login.html';
            }
        });

        teacherForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('t_studentId').value.trim();
            let rawName = document.getElementById('t_fileName').value.trim();
            const msgBox = document.getElementById('msgBox');

            showMessage(msgBox, translations[currentLang].processing, 'success-box', false);
            // Show loader
            msgBox.innerHTML = '<div class="loader"></div>';
            msgBox.className = 'message-box';
            msgBox.style.display = 'block';

            try {
                // Sanitization using the helper function
                let fName = sanitizeFileName(rawName);

                // Ensure filename has .pdf extension
                if (!fName.toLowerCase().endsWith('.pdf')) {
                    fName += '.pdf';
                }

                // Add a new document with generated id.
                await addDoc(collection(db, "links"), {
                    studentId: id,
                    fileName: fName,
                    timestamp: serverTimestamp()
                });
                
                showMessage(msgBox, translations[currentLang].successLink, 'success-box', true);
                teacherForm.reset();
            } catch (err) {
                console.error(err);
                showMessage(msgBox, translations[currentLang].errorLink + " (" + err.message + ")", 'error-box', true);
            }
        };
    }

    // ----------- Student Search Logic (Firestore) -----------
    const studentForm = document.getElementById('studentForm');
    if(studentForm) {
        studentForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('studentIdInput').value.trim();
            const resultBox = document.getElementById('resultBox');
            
            // Hide previous
            resultBox.style.display = 'none';
            resultBox.className = 'message-box';

            // Show Loader
            resultBox.innerHTML = `<div class="loader"></div><p style="text-align:center">${translations[currentLang].searching}</p>`;
            resultBox.style.display = 'block';

            try {
                // Create a query against the collection.
                const linksRef = collection(db, "links");
                const q = query(linksRef, where("studentId", "==", id));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Sort by timestamp descending (Client-side to avoid index requirement)
                    // We want the LATEST file uploaded by the teacher
                    const docs = querySnapshot.docs.map(doc => doc.data());
                    docs.sort((a, b) => {
                        const timeA = a.timestamp ? a.timestamp.seconds : 0;
                        const timeB = b.timestamp ? b.timestamp.seconds : 0;
                        return timeB - timeA;
                    });

                    const docData = docs[0];
                    
                    // Decode the filename to ensure clean text for display and logic
                    let cleanFileName;
                    try {
                        cleanFileName = decodeURIComponent(docData.fileName);
                    } catch (e) {
                         // Fallback if it wasn't encoded or decoding fails
                         cleanFileName = docData.fileName;
                         console.warn("Decoding failed, using original:", e);
                    }

                    if (!cleanFileName) {
                        showMessage(resultBox, translations[currentLang].fileError, 'error-box', true);
                        return;
                    }

                    // Ensure .pdf extension exists for the link
                    let linkFileName = cleanFileName;
                    if (!linkFileName.toLowerCase().endsWith('.pdf')) {
                        linkFileName += '.pdf';
                    }

                    // Encode for URL safely
                    const fileUrl = 'letters/' + encodeURIComponent(linkFileName);

                    // Success Match
                    resultBox.className = 'message-box success-box';
                    resultBox.style.display = 'block';
                    resultBox.innerHTML = `
                        <div style="text-align:center; padding:10px;">
                            <h3 style="margin-bottom:10px; color:var(--primary-green)">${translations[currentLang].found}</h3>
                            <!-- Display clean name -->
                            <p style="font-size:1.1em; margin-bottom:15px; font-weight:bold;">${linkFileName}</p>
                            
                            <!-- Use template literal with clean name -->
                            <a href="${fileUrl}" target="_blank" class="btn-primary"  
                               style="background-color: var(--accent-gold); 
                                      color: var(--primary-green);
                                      text-decoration:none; 
                                      display:inline-block; 
                                      padding: 12px 30px; 
                                      border-radius:25px;
                                      font-weight:bold;
                                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                ${translations[currentLang].downloadDoc} ⬇
                            </a>
                        </div>
                    `;
                } else {
                    showMessage(resultBox, translations[currentLang].noDocFound, 'error-box', true);
                }

            } catch (err) {
                console.error("Firebase Error:", err);
                showMessage(resultBox, translations[currentLang].connectionError + " " + err.message, 'error-box', true);
            }
        };
    }
});

// Helper Functions
function sanitizeFileName(fileName) {
    // 1. Trim only (Do NOT replace spaces with hyphens, as files on disk have spaces)
    let sanitized = fileName.trim();
    // 2. Remove special characters but ALLOW spaces
    // keep alphanumeric [ar/en], hyphens, dots, underscores, spaces
    sanitized = sanitized.replace(/[^\w\-\.\s\u0600-\u06FF]/g, '');
    return sanitized;
}

function updateLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update Text
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(translations[lang][key]) el.textContent = translations[lang][key];
    });

    // Update Placeholders
    document.querySelectorAll('[data-ph]').forEach(el => {
        const key = el.getAttribute('data-ph');
        if(translations[lang][key]) el.placeholder = translations[lang][key];
    });

    // Toggle Button Text
    const btn = document.getElementById('langToggle');
    if(btn) btn.textContent = lang === 'en' ? 'العربية' : 'English';

    // Update Doc Title (Browser Tab)
    document.title = translations[lang].title; 
}

function showMessage(el, text, className, showBlock = true) {
    el.className = 'message-box ' + className;
    el.innerHTML = text;
    if(showBlock) el.style.display = 'block';
}