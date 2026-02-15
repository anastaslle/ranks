let data = [];
let pool = [];
let current = null;
let mode = 'army';

const img = document.getElementById('rank-img');
const feedback = document.getElementById('feedback');
const answerInput = document.getElementById('answer');
const form = document.getElementById('answer-form');
const nextBtn = document.getElementById('next');
const modeArmyBtn = document.getElementById('mode-army');
const modeNavyBtn = document.getElementById('mode-navy');

function normalize(s){
  return s.trim().toLowerCase().replace(/\s+/g,' ');
}

async function loadData(){
  try{
    const res = await fetch('data/ranks.json');
    data = await res.json();
    setMode(mode);
  }catch(e){
    feedback.textContent = 'Ошибка загрузки данных — проверьте data/ranks.json';
  }
}

function setMode(m){
  mode = m;
  modeArmyBtn.classList.toggle('active', m==='army');
  modeNavyBtn.classList.toggle('active', m==='navy');
  pool = data.filter(x=>x.mode===mode);
  shuffle(pool);
  nextItem();
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
  }
}

function nextItem(){
  feedback.textContent='';
  answerInput.value='';
  if(pool.length===0){
    feedback.textContent='Список пуст — добавьте записи в data/ranks.json';
    img.src='assets/placeholder.jpg';
    current=null;return;
  }
  current = pool.pop();
  img.src = current.image;
  img.alt = 'погоны: '+current.rank;
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  checkAnswer();
});

nextBtn.addEventListener('click', ()=>nextItem());
modeArmyBtn.addEventListener('click', ()=>setMode('army'));
modeNavyBtn.addEventListener('click', ()=>setMode('navy'));

function checkAnswer(){
  if(!current) return;
  const user = normalize(answerInput.value||'');
  const correct = normalize(current.rank);
  if(user===correct && user.length>0){
    feedback.textContent='Правильно!';
    feedback.className='feedback ok';
    setTimeout(()=>nextItem(),1200);
  }else{
    feedback.textContent = 'Неправильно. Правильный ответ: '+current.rank;
    feedback.className='feedback wrong';
  }
}

loadData();
