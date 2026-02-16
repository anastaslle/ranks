let data = [];
let pool = [];
let current = null;
let mode = 'army';
let correct = 0;
let total = 0;

const img = document.getElementById('rank-img');
const feedback = document.getElementById('feedback');
const answerInput = document.getElementById('answer');
const form = document.getElementById('answer-form');
const nextBtn = document.getElementById('next');
const modeArmyBtn = document.getElementById('mode-army');
const modeNavyBtn = document.getElementById('mode-navy');
const modal = document.getElementById('modal');
const modalRetry = document.getElementById('modal-retry');

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
  total = pool.length;
  shuffle(pool);
  correct = 0;
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
  answerInput.disabled = false;
  document.querySelector('button[type="submit"]').disabled = false;
  if(pool.length===0){
    showResults();
    return;
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
modalRetry.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  setMode(mode);
});

function checkAnswer(){
  if(!current) return;
  const user = normalize(answerInput.value||'');
  const correct_rank = normalize(current.rank);
  if(user===correct_rank && user.length>0){
    correct++;
    feedback.textContent='Правильно!';
    feedback.className='feedback ok';
    answerInput.disabled = false;
    document.querySelector('button[type="submit"]').disabled = false;
    setTimeout(()=>nextItem(),1200);
  }else{
    feedback.textContent = 'Неправильно. Правильный ответ: '+current.rank;
    feedback.className='feedback wrong';
    answerInput.disabled = true;
    document.querySelector('button[type="submit"]').disabled = true;
  }
}

function showResults(){
  const percentage = Math.round((correct / total) * 100);
  document.getElementById('correct-count').textContent = correct;
  document.getElementById('percentage').textContent = percentage + '%';
  modal.classList.remove('hidden');
  img.src = 'assets/placeholder.jpg';
  current = null;
}

loadData();
