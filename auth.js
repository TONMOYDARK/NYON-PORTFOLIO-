const { createClient } = window.supabase;
const sb = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
const $ = id => document.getElementById(id);

function msg(text, ok=false){ const el=$('msg'); if(el){el.textContent=text; el.className=ok?'msg ok':'msg';} }

$('signupForm')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const username=$('signupUsername').value.trim();
  const email=$('signupEmail').value.trim();
  const password=$('signupPassword').value;
  if(username.length<3) return msg('Username must be at least 3 characters.');
  if(password.length<6) return msg('Password must be at least 6 characters.');
  const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:username}}});
  if(error) return msg(error.message);
  msg(data.session ? 'Account created. Redirecting…' : 'Account created. Check your email to confirm, then log in.', true);
  if(data.session) setTimeout(()=>location.href='index.html',700);
});

$('loginForm')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const identity=$('loginIdentity').value.trim();
  const password=$('loginPassword').value;
  let email=identity;
  if(!identity.includes('@')){
    const {data,error}=await sb.rpc('login_email_for_username',{p_username:identity});
    if(error || !data) return msg('Username not found.');
    email=data;
  }
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error) return msg(error.message);
  location.href='admin.html';
});

$('forgotForm')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const email=$('forgotEmail').value.trim();
  const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/admin.html'});
  if(error) return msg(error.message);
  msg('Password reset email sent.', true);
});
