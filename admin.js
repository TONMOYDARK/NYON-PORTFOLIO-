// QUICK ADMIN LOGIN
// IMPORTANT: This is a client-side gate, not a security system. For real security use Supabase Auth.
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Nyon@2026';

const defaults={name:'YOUR NAME',title:'Tech Enthusiast & Digital Creator',bio:'Welcome to my personal space. Find my profile, skills and ways to connect with me.',about:'Add your personal introduction from the Edit Profile page.',location:'Bangladesh',focus:'Technology & Digital Work',phone:'+880 0000-000000',email:'your@email.com',facebook:'',instagram:'',whatsapp:'',linkedin:'',photo:'assets/profile-placeholder.svg',cv:'',skills:['Computer Software & Hardware','Electrical','Social Media','Technology','Outdoor Work','Digital Projects']};
const loginBox=document.getElementById('loginBox'), editor=document.getElementById('editor');
function showEditor(){loginBox.hidden=true;editor.hidden=false;loadEditor();}
function isLogged(){return sessionStorage.getItem('portfolioAdminLoggedIn')==='1'}
if(isLogged()) showEditor();

document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();const u=document.getElementById('loginUser').value.trim(),p=document.getElementById('loginPass').value;if(u===ADMIN_USER&&p===ADMIN_PASS){sessionStorage.setItem('portfolioAdminLoggedIn','1');document.getElementById('loginError').textContent='';showEditor()}else document.getElementById('loginError').textContent='Incorrect username or password.'});
document.getElementById('logout').onclick=()=>{sessionStorage.removeItem('portfolioAdminLoggedIn');location.reload()};

function loadEditor(){
const data={...defaults,...JSON.parse(localStorage.getItem('portfolioData')||'{}')};
const ids=['name','title','bio','about','location','focus','phone','email','facebook','instagram','whatsapp','linkedin'];ids.forEach(id=>document.getElementById(id).value=data[id]||'');document.getElementById('skills').value=(data.skills||[]).join('\n');document.getElementById('preview').src=data.photo||defaults.photo;
document.getElementById('photoFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>4*1024*1024){alert('Please choose a photo under 4 MB.');e.target.value='';return}const r=new FileReader();r.onload=()=>document.getElementById('preview').src=r.result;r.readAsDataURL(f)};
document.getElementById('form').onsubmit=e=>{e.preventDefault();ids.forEach(id=>data[id]=document.getElementById(id).value.trim());data.skills=document.getElementById('skills').value.split('\n').map(x=>x.trim()).filter(Boolean);const photo=document.getElementById('preview').src;if(photo&&photo!==location.origin+'/assets/profile-placeholder.svg')data.photo=photo;const cv=document.getElementById('cvFile').files[0];if(cv){if(cv.size>5*1024*1024){alert('Please choose a CV under 5 MB.');return}const r=new FileReader();r.onload=()=>{data.cv=r.result;save(data)};r.readAsDataURL(cv)}else save(data)};
document.getElementById('reset').onclick=()=>{if(confirm('Reset all fields?')){localStorage.removeItem('portfolioData');location.reload()}};
}
function save(data){localStorage.setItem('portfolioData',JSON.stringify(data));document.getElementById('notice').textContent='✓ Saved. Open the portfolio to see changes.'}
