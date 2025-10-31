import React, { useMemo, useState } from 'react'

/**
 * HISOM — Main Dashboard (Etalon v1)
 * Брендинг: HISOM (all caps), подзаголовок: Health Intelligence System for Optimization Metrics • MVP
 * Тема: Sea Green Core (Ocean Blue + Marine Teal)
 * Замечания: выравнивание текста в кнопках хедера, тёмнее FAB ИИ-Биохакер.
 */

const t = {
  primary: '#015E68',   // Marine Teal
  secondary: '#00656F', // Darker Ocean Blue for AI button
  sea: '#2AC6A5',
  text: '#0F172A',
  muted: '#6B7280',
  bg: 'linear-gradient(180deg, #FFFFFF 0%, #F4FAFA 45%, #E9F8F5 100%)',
  card: '#FFFFFF',
  cardTint: 'linear-gradient(135deg, #F8FBFB 0%, #F2FAF7 100%)',
  shadow: '0 10px 32px rgba(0,0,0,0.08)',
  border: '#E6EEF0',
}

const ROLES = ['Guest','FREE','PRO_USER','PRO_BIOHACKER']

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function computeBA(p){
  const KV=clamp(+p.calendar_age||0,0.1,120),h=clamp(+p.height_m||0,0.5,2.5),w=clamp(+p.weight_kg||0,20,400);
  const BMI=w/(h*h), WHR=clamp(+p.waist_cm||0,30,200)/clamp(+p.hips_cm||0,30,200);
  let d=0; d+=0.35*(BMI-22); d+=10*Math.max(0, WHR - (p.gender==='Муж'?0.9:0.8)); d+=0.6*((p.stress_level||3)-3);
  const BA=+(KV+d).toFixed(1); return {BA,BMI:+BMI.toFixed(1),WHR:+WHR.toFixed(2),diff:+(BA-KV).toFixed(1)};
}

const initialProfile={gender:'Жен',calendar_age:35.4,height_m:1.68,weight_kg:60.5,waist_cm:68,hips_cm:94,stress_level:3,activity_level:'умеренная'};
const mockSummary={
  Guest:{plan:'Guest'},
  FREE:{plan:'FREE',bio_age:null,aging_velocity:null,wearables:{connected:false},formula:{available:false}},
  PRO_USER:{plan:'PRO_USER',bio_age:{value:32.4, measured_at:'2025-10-20'},aging_velocity:{index:0.91,trend:'down'},wearables:{connected:true,summary_7d:{sleepScore:82,hrv:54,rhr:60}},formula:{available:true,id:'frm_123'}},
  PRO_BIOHACKER:{plan:'PRO_BIOHACKER',bio_age:{value:31.8, measured_at:'2025-10-19'},aging_velocity:{index:0.88,trend:'down'},wearables:{connected:true,summary_7d:{sleepScore:85,hrv:58,rhr:58}},formula:{available:true,id:'frm_777'}},
};

const H = {
  Shell: ({children}) => (
    <div className='min-h-screen' style={{background:t.bg}}>
      {children}
      <style>{`
        .btn-pill{padding:8px 14px;border-radius:9999px;font-size:12px;font-weight:600;text-align:center;display:flex;align-items:center;justify-content:center;}
        .btn-primary{background:${t.primary};color:white;box-shadow:0 6px 18px rgba(1,94,104,.25)}
        .btn-secondary{background:transparent;color:${t.text};border:1px solid ${t.border}}
        .btn-ghost{background:white;color:${t.text};border:1px solid ${t.border}}
        .navbtn{padding:8px 12px;border-radius:9999px;border:1px solid ${t.border};font-size:12px;color:${t.text};background:rgba(255,255,255,.85);text-align:center;display:flex;align-items:center;justify-content:center;}
        .card{background:${t.card};border-radius:24px;box-shadow:${t.shadow};border:1px solid ${t.border}}
        .cardTint{background:${t.cardTint};border-radius:24px;box-shadow:${t.shadow};border:1px solid ${t.border}}
        .metric{border-radius:18px;background:white;border:1px solid ${t.border};padding:10px 12px}
        .title{font-size:18px;font-weight:700;color:${t.text}}
        .subtitle{font-size:12px;color:${t.muted}}
        .h1{font-size:44px;letter-spacing:-.02em;font-weight:800;color:${t.text}}
      `}</style>
    </div>
  ),
  Header: ({role,setRole}) => (
    <div className='mx-auto max-w-6xl px-4 pt-10'>
      <div className='rounded-[28px] px-4 md:px-6 py-3 flex items-center gap-3 md:gap-4 justify-between'
           style={{background:`linear-gradient(90deg, ${t.primary} 0%, ${t.sea} 100%)`, boxShadow:'0 12px 36px rgba(0,0,0,.12)'}}>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-2xl' style={{background:'radial-gradient(circle at 30% 30%, #fff8, #ffffff22)', boxShadow:'inset 0 0 0 1px #ffffff33'}}/>
          <div>
            <div className='text-white font-extrabold tracking-tight' style={{fontSize:22}}>HISOM</div>
            <div className='text-white/85' style={{fontSize:11}}>Health Intelligence System for Optimization Metrics • MVP</div>
          </div>
        </div>
        <nav className='hidden lg:flex items-center gap-1'>
          {[
            ['/biomarkers','Биомаркеры'],
            ['/library','Библиотека Здоровья'],
            ['/profile','Мой профиль'],
            ['/biohacker','Кабинет Биохакера'],
            ['/about','О продукте'],
          ].map(([href,label])=> (
            <a key={href} className='navbtn' href={`#${href}`}>{label}</a>
          ))}
        </nav>
        <div className='flex items-center gap-2'>
          <select className='navbtn' value={role} onChange={(e)=>setRole(e.target.value)}>
            {ROLES.map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className='mt-3 rounded-full px-4 py-2 text-center mx-auto max-w-xl'
           style={{background:'#F1FBF9', border:`1px solid ${t.border}`, color:t.text, fontSize:13}}>
        Твой цифровой двойник управления здоровьем
      </div>
    </div>
  )
};

export default function App(){
  const [role,setRole]=useState('Guest');
  const [profile]=useState(initialProfile);
  const summary = mockSummary[role];
  const res = useMemo(()=>computeBA(profile),[profile]);
  const onCTABioAge=()=>{role==='Guest'?alert('Модалка авторизации → после входа /age (шаг 1)'):alert('Переход к /age (шаг 1)');};

  return (
    <H.Shell>
      <H.Header role={role} setRole={setRole} />
      <main className='max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
        <section className='space-y-4'>
          <div className='rounded-[28px] overflow-hidden cardTint'><img src='/hero.jpg' className='w-full h-auto object-cover' alt='Hero'/></div>
          <div className='card p-6'>
            <div className='title mb-1'>Добро пожаловать в HISOM</div>
            <div className='subtitle mb-3'>HISOM — твой цифровой двойник управления здоровьем!</div>
            <div className='text-[13px] leading-6' style={{color:t.text}}>HISOM объединяет данные тела, образ жизни и биомаркеры в единую систему, чтобы показать, как живёт твой организм здесь и сейчас. Это не диагностика и не лечение — а инструмент предиктивного управления здоровьем.</div>
            <div className='mt-4 flex gap-2'><button className='btn-pill btn-primary' onClick={onCTABioAge}>Рассчитать свой Био-возраст</button><button className='btn-pill btn-ghost' onClick={()=>alert('Как это работает — /age')}>Как это работает</button></div>
          </div>
        </section>
        <section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='card p-5'><div className='title mb-1'>Биологический возраст</div>{summary.bio_age?(<div className='flex items-end justify-between'><div><div className='h1'>{summary.bio_age.value.toFixed(1)}<span style={{fontSize:16}}> лет</span></div><div className='subtitle'>календарный: {profile.calendar_age}</div></div><div className='metric'><span className='subtitle'>Δ</span><div style={{fontWeight:700,color:t.text,fontSize:14}}>{res.diff>0?`+${res.diff}`:res.diff}</div></div></div>):(<div className='rounded-2xl p-4 text-center' style={{background:'#F9FBFC',border:`1px dashed ${t.border}`}}>Нет данных — рассчитай свой био-возраст</div>)}
          </div>
          <div className='card p-5'><div className='title mb-1'>Скорость старения</div>{summary.aging_velocity?(<><div className='flex items-center justify-between mb-1'><div className='text-[22px] font-semibold' style={{color:t.text}}>{summary.aging_velocity.index.toFixed(2)}</div><div className='metric' style={{padding:'6px 10px'}}>{summary.aging_velocity.trend==='down'?'↓ Улучшение':summary.aging_velocity.trend==='up'?'↑ Ухудшение':'→ Стабильно'}</div></div><svg width='100%' height='44' viewBox='0 0 120 40' fill='none'><path d='M0 30 C 20 35, 40 15, 60 22 S 100 35, 120 18' stroke={t.primary} strokeWidth='2'/></svg></>):(<div className='rounded-2xl p-4 text-center' style={{background:'#F9FBFC',border:`1px dashed ${t.border}`}}>Подключи данные, чтобы видеть динамику</div>)}
          </div>
          <div className='card p-5'><div className='title mb-1'>Сон / Стресс / Пульс</div>{summary.wearables?.connected?(<div className='grid grid-cols-3 gap-3'><div className='metric'><div className='subtitle mb-1'>Сон</div><div style={{fontWeight:700,color:t.text}}>{summary.wearables.summary_7d.sleepScore}/100</div></div><div className='metric'><div className='subtitle mb-1'>HRV</div><div style={{fontWeight:700,color:t.text}}>{summary.wearables.summary_7d.hrv} ms</div></div><div className='metric'><div className='subtitle mb-1'>RHR</div><div style={{fontWeight:700,color:t.text}}>{summary.wearables.summary_7d.rhr} bpm</div></div></div>):(<div className='rounded-2xl p-4 text-center' style={{background:'#F9FBFC',border:`1px dashed ${t.border}`}}>Подключи носимое устройство</div>)}
          </div>
          <div className='card p-5'><div className='title mb-1'>Моя Формула</div>{summary.formula?.available?(<div className='text-[13px]' style={{color:t.text}}>Отчёт готов: <b>{summary.formula.id}</b>. Подбор нутриентов по вашим данным.</div>):(<div className='rounded-2xl p-4 text-center' style={{background:'#F9FBFC',border:`1px dashed ${t.border}`}}>Доступно в PRO</div>)}
          </div>
        </section>
      </main>
      <button className='fixed right-4 bottom-4 btn-pill' style={{background:t.secondary,color:'#fff',boxShadow:'0 16px 40px rgba(0,101,111,.5)'}} onClick={()=>alert('ИИ-Биохакер — скоро')}>ИИ-Биохакер</button>
      <footer className='mt-10'><div className='max-w-6xl mx-auto px-4 py-6 rounded-[24px] cardTint' style={{border:`1px solid ${t.border}`}}><div className='text-[12px]' style={{color:t.text}}>Рекомендации HISOM не являются медицинскими советами и не заменяют консультацию врача.</div><div className='mt-2 flex flex-wrap gap-4 text-[12px]' style={{color:t.muted}}><a href='#/contacts'>Контакты</a><a href='#/legal/privacy'>Политика персональных данных</a><a href='#/legal/terms'>Пользовательское соглашение</a><span>Серверы РФ • 152-ФЗ • ISO/IEC 27001</span></div></div></footer>
    </H.Shell>
  )
}
