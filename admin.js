const { createClient } = window.supabase;
const sb=createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);const msg=t=>{$('notice').textContent=t};
let profile;
async function guard(){
 const {data:{user}}=await sb.auth.getUser();
 if(!user){location.href='auth.html';return null}
 const {data:p,error}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 if(error||!p||p.role!=='admin'){await sb.auth.signOut();document.body.innerHTML='<main class="admin"><div class="panel"><h1>Access denied</h1><p>This account is not an admin.</p><a class="save" href="auth.html">Back to login</a></div></main>';return null}
 profile=p;fill(p,user);return user;
}
function fill(p,user){
 $('username').value=p.username||'';$('name').value=p.display_name||'';$('title').value=p.title||'';$('bio').value=p.bio||'';$('about').value=p.about||'';$('location').value=p.location||'';$('focus').value=p.focus||'';$('phone').value=p.phone||'';$('email').value=user.email||p.email||'';$('facebook').value=p.facebook||'';$('instagram').value=p.instagram||'';$('whatsapp').value=p.whatsapp||'';$('linkedin').value=p.linkedin||'';$('skills').value=(p.skills||[]).join('\n');$('preview').src=p.photo_url||'assets/profile-placeholder.svg';
}
async function upload(file,type,user){
 if(!file)return profile[type==='photo'?'photo_url':'cv_url']||'';
 const max=type==='photo'?4:8;if(file.size>max*1024*1024)throw Error(`File must be under ${max} MB.`);
 const ext=(file.name.split('.').pop()||'bin').toLowerCase();const path=`${user.id}/${type}-${Date.now()}.${ext}`;
 const {error}=await sb.storage.from('portfolio').upload(path,file,{upsert:true});if(error)throw error;
 return sb.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
}
$('photoFile').addEventListener('change',e=>{const f=e.target.files[0];if(f)$('preview').src=URL.createObjectURL(f)});
$('form').addEventListener('submit',async e=>{e.preventDefault();const {data:{user}}=await sb.auth.getUser();if(!user)return location.href='auth.html';try{
 const photo=await upload($('photoFile').files[0],'photo',user);const cv=await upload($('cvFile').files[0],'cv',user);
 const updates={username:$('username').value.trim(),display_name:$('name').value.trim(),title:$('title').value.trim(),bio:$('bio').value.trim(),about:$('about').value.trim(),location:$('location').value.trim(),focus:$('focus').value.trim(),phone:$('phone').value.trim(),email:$('email').value.trim(),facebook:$('facebook').value.trim(),instagram:$('instagram').value.trim(),whatsapp:$('whatsapp').value.trim(),linkedin:$('linkedin').value.trim(),skills:$('skills').value.split('\n').map(x=>x.trim()).filter(Boolean),photo_url:photo,cv_url:cv,updated_at:new Date().toISOString()};
 const {error}=await sb.from('profiles').update(updates).eq('id',user.id);if(error)throw error;
 if($('email').value.trim() && $('email').value.trim()!==user.email){const {error:e2}=await sb.auth.updateUser({email:$('email').value.trim()});if(e2)throw e2;msg('Profile saved. Check the confirmation email if you changed the login email.')}else msg('✓ Profile saved for everyone.');profile={...profile,...updates};
 }catch(err){msg(err.message||'Could not save.');}});
$('passwordForm').addEventListener('submit',async e=>{e.preventDefault();const p=$('newPassword').value;if(p.length<6)return msg('Password must be at least 6 characters.');const {error}=await sb.auth.updateUser({password:p});if(error)return msg(error.message);$('newPassword').value='';msg('✓ Password changed.');});
$('logout').onclick=async()=>{await sb.auth.signOut();location.href='auth.html'};
guard();
