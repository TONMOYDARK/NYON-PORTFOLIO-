const { createClient } = window.supabase;
const sb=createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const defaults={name:'YOUR NAME',title:'Tech Enthusiast & Digital Creator',bio:'Welcome to my personal space. Find my profile, skills and ways to connect with me.',about:'Add your personal introduction from the Admin Dashboard.',location:'Bangladesh',focus:'Technology & Digital Work',phone:'+880 0000-000000',email:'your@email.com',facebook:'',instagram:'',whatsapp:'',linkedin:'',photo:'assets/profile-placeholder.svg',cv:'',skills:['Computer Software & Hardware','Electrical','Social Media','Technology','Outdoor Work','Digital Projects']};
const $=id=>document.getElementById(id);
async function load(){
 let data={...defaults};
 const {data:row}=await sb.from('profiles').select('*').eq('role','admin').limit(1).maybeSingle();
 if(row)data={...data,name:row.display_name||defaults.name,title:row.title||defaults.title,bio:row.bio||defaults.bio,about:row.about||defaults.about,location:row.location||defaults.location,focus:row.focus||defaults.focus,phone:row.phone||'',email:row.email||'',facebook:row.facebook||'',instagram:row.instagram||'',whatsapp:row.whatsapp||'',linkedin:row.linkedin||'',photo:row.photo_url||defaults.photo,cv:row.cv_url||'',skills:Array.isArray(row.skills)?row.skills:defaults.skills};
 ['brandName','footerName'].forEach(id=>$(id).textContent=data.name);$('heroName').textContent=data.name;$('heroTitle').textContent=data.title;$('heroBio').textContent=data.bio;$('aboutText').textContent=data.about;$('location').textContent=data.location;$('focus').textContent=data.focus;$('phone').textContent=data.phone;$('email').textContent=data.email;$('emailShort').textContent=data.email;$('profilePhoto').src=data.photo;
 $('phoneCard').href='tel:'+data.phone.replace(/[^+\d]/g,'');$('emailCard').href='mailto:'+data.email;
 const setLink=(id,url)=>{const el=$(id);if(url){el.href=url;el.style.opacity='1'}else{el.href='#';el.style.opacity='.55'}};
 setLink('facebookCard',data.facebook);setLink('instagramCard',data.instagram);setLink('linkedinCard',data.linkedin);setLink('whatsappCard',data.whatsapp?('https://wa.me/'+data.whatsapp.replace(/\D/g,'')):'');
 $('facebook').textContent=data.facebook?'Facebook profile':'Add Facebook';$('instagram').textContent=data.instagram?'Instagram profile':'Add Instagram';$('linkedin').textContent=data.linkedin?'LinkedIn profile':'Add LinkedIn';
 if(data.cv){$('cvLink').href=data.cv;$('cvLink').style.display='inline-block'}else $('cvLink').style.display='none';
 $('skillsList').innerHTML=data.skills.filter(Boolean).map(x=>`<span class="chip">${escapeHtml(x)}</span>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open')}
load();
