(() => {
  const run = document.getElementById('run-demo');
  if (!run) return;
  const reset = document.getElementById('reset-demo');
  const task = document.getElementById('task');
  const status = document.getElementById('run-status');
  const output = document.getElementById('demo-output');
  const steps = [...document.querySelectorAll('#execution-steps li')];
  let timers = [];
  function clearTimers(){timers.forEach(clearTimeout);timers=[];}
  function setStep(i,state){const el=steps[i];el.classList.toggle('done',state==='Complete');el.classList.toggle('current',state==='Working');el.querySelector('.step-state').textContent=state;}
  function resetAll(){clearTimers();run.disabled=false;run.textContent='Run demo ↗';status.textContent='IDLE';status.className='chip muted';steps.forEach((_,i)=>setStep(i,'Waiting'));output.innerHTML='<span class="placeholder">Run the demo to preview a structured workflow.</span>';}
  reset.addEventListener('click',resetAll);
  run.addEventListener('click',()=>{
    const prompt=task.value.trim();
    if(!prompt){task.focus();output.textContent='Enter a task to preview the workflow.';return;}
    clearTimers();run.disabled=true;run.textContent='Preview running…';status.textContent='RUNNING';status.className='chip';steps.forEach((_,i)=>setStep(i,'Waiting'));output.innerHTML='<span class="placeholder">Simulating the workflow stages locally…</span>';
    const sequence=[()=>setStep(0,'Working'),()=>{setStep(0,'Complete');setStep(1,'Working');},()=>{setStep(1,'Complete');setStep(2,'Working');},()=>{
      setStep(2,'Complete');status.textContent='DEMO COMPLETE';run.disabled=false;run.textContent='Run again ↗';
      output.replaceChildren();
      const heading=document.createElement('strong');heading.textContent='Workflow outline (not AI-generated)';output.appendChild(heading);
      const brief=document.createElement('p');brief.textContent='Task: '+prompt;output.appendChild(brief);
      const list=document.createElement('ul');['Research: identify sources and key facts to verify.','Analysis: separate evidence, assumptions, and open questions.','Report: organise findings into a concise review.'].forEach(t=>{const li=document.createElement('li');li.textContent=t;list.appendChild(li);});output.appendChild(list);
    }];
    sequence.forEach((fn,i)=>timers.push(setTimeout(fn,i*600+150)));
  });
})();
