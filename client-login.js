import { getFirebaseServices } from './firebase-client.js';

const nextPath = new URLSearchParams(location.search).get('next') || '/client/portal';
const safeNext = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/client/portal';
const message = document.querySelector('#authMessage');

function showMessage(text, error = false) {
  message.textContent = text || '';
  message.classList.toggle('is-error', error);
}

function friendlyError(error) {
  const code = String(error?.code || '');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'البريد أو كلمة المرور غير صحيحة.';
  if (code.includes('email-already-in-use')) return 'يوجد حساب بهذا البريد. جرّب تسجيل الدخول.';
  if (code.includes('weak-password')) return 'استخدم كلمة مرور من 8 أحرف على الأقل.';
  if (code.includes('popup-closed')) return 'أُغلقت نافذة Google قبل إكمال الدخول.';
  if (code.includes('too-many-requests')) return 'محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.';
  return 'تعذر إكمال تسجيل الدخول الآن. حاول مرة أخرى.';
}

async function establishSession(user) {
  const token = await user.getIdToken(true);
  const response = await fetch('/api/client/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
  if (!response.ok) throw new Error('session');
  location.replace(safeNext);
}

const { auth, authSdk } = await getFirebaseServices();
authSdk.onAuthStateChanged(auth, (user) => {
  if (user) establishSession(user).catch(() => showMessage('تعذر فتح مساحة العميل الآن.', true));
});

document.querySelector('#googleLogin').addEventListener('click', async () => {
  showMessage('جاري فتح Google...');
  try {
    const provider = new authSdk.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await authSdk.signInWithPopup(auth, provider);
    await establishSession(result.user);
  } catch (error) { showMessage(friendlyError(error), true); }
});

document.querySelector('#clientAuthForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('جاري تسجيل الدخول...');
  try {
    const result = await authSdk.signInWithEmailAndPassword(auth, document.querySelector('#clientEmail').value.trim(), document.querySelector('#clientPassword').value);
    await establishSession(result.user);
  } catch (error) { showMessage(friendlyError(error), true); }
});

document.querySelector('#createAccount').addEventListener('click', async () => {
  const email = document.querySelector('#clientEmail').value.trim();
  const password = document.querySelector('#clientPassword').value;
  if (!email || password.length < 8) return showMessage('اكتب البريد وكلمة مرور من 8 أحرف ثم اضغط إنشاء حساب.', true);
  showMessage('جاري إنشاء حساب العميل...');
  try {
    const result = await authSdk.createUserWithEmailAndPassword(auth, email, password);
    await establishSession(result.user);
  } catch (error) { showMessage(friendlyError(error), true); }
});

document.querySelector('#resetPassword').addEventListener('click', async () => {
  const email = document.querySelector('#clientEmail').value.trim();
  if (!email) return showMessage('اكتب بريدك أولًا لإرسال رابط الاستعادة.', true);
  try { await authSdk.sendPasswordResetEmail(auth, email); showMessage('أرسلنا رابط استعادة كلمة المرور إلى بريدك.'); }
  catch (error) { showMessage(friendlyError(error), true); }
});
