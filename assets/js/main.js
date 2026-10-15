(function(){
  var b=document.querySelector('.burger'),n=document.getElementById('nav');
  if(b&&n)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
  function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function parse(v){var p=(v||'').split('-');if(p.length!==3)return new Date();return new Date(+p[0],+p[1]-1,+p[2],12);}
  var DAYS=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  // Calendar simulator
  var cd=document.getElementById('cd');
  function mlen(y,m){return new Date(y,m+1,0).getDate();}
  function cal(){if(!cd)return;var d=parse(cd.value),y=d.getFullYear(),m=d.getMonth(),dd=d.getDate(),L=mlen(y,m),last=dd===L;
    document.getElementById('w-day').textContent=DAYS[d.getDay()];document.getElementById('w-date').textContent=dd;
    var simple=last&&L<31,annual=last&&m===1,rows=[['Simple date / day-date',simple?'Needs correcting tonight: it will show '+(L+1)+' tomorrow.':'No correction needed tonight.',simple],['Annual calendar',annual?'Needs correcting at the end of February.':'No correction needed tonight.',annual],['Perpetual calendar','Handles months and leap years automatically until 2100.',false]];
    document.getElementById('c-r').innerHTML=rows.map(function(r){return '<tr><td>'+r[0]+'</td><td class="'+(r[2]?'warn':'ok')+'">'+r[1]+'</td></tr>';}).join('');
    var x=new Date(d),k=0;while(k<400){x.setDate(x.getDate()+1);k++;var l2=mlen(x.getFullYear(),x.getMonth());if(x.getDate()===l2&&l2<31)break;}
    document.getElementById('c-n').textContent='Next manual correction for a simple date watch: '+x.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})+' ('+k+(k===1?' day':' days')+' away).';}
  if(cd){cd.value=iso(new Date());cd.addEventListener('change',cal);cd.addEventListener('input',cal);cal();}
  // Safe setting checker
  var sh=document.getElementById('hr'),ring=document.getElementById('ring');
  function build(){if(!ring)return;var s='<circle cx="150" cy="150" r="130" fill="#0B1A3A"/>';
    function arc(a1,a2,r,col,w){var p=function(a){var rad=(a-90)*Math.PI/180;return [150+r*Math.cos(rad),150+r*Math.sin(rad)];},A=p(a1),B=p(a2),large=((a2-a1+360)%360)>180?1:0;return '<path d="M'+A[0].toFixed(1)+' '+A[1].toFixed(1)+' A'+r+' '+r+' 0 '+large+' 1 '+B[0].toFixed(1)+' '+B[1].toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'"/>';}
    s+=arc(0,359.9,112,'#2A6E4F',18)+arc(315,45,112,'#D64545',18);
    for(var i=0;i<24;i++){var a=i*15,rad=(a-90)*Math.PI/180;s+='<text x="'+(150+82*Math.cos(rad)).toFixed(1)+'" y="'+(150+82*Math.sin(rad)+5).toFixed(1)+'" text-anchor="middle" font-size="'+(i%6===0?15:11)+'" fill="'+(i%6===0?'#fff':'#9FB0CC')+'" font-family="sans-serif">'+i+'</text>';}
    s+='<g id="hand"><line x1="150" y1="150" x2="150" y2="44" stroke="#F7F8FB" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="150" r="9" fill="#1F4FBF" stroke="#fff" stroke-width="3"/></g>';ring.innerHTML=s;}
  function setchk(){if(!sh)return;var h=+sh.value,danger=(h>=21||h<3);
    document.getElementById('hand').setAttribute('transform','rotate('+(h*15)+' 150 150)');
    document.getElementById('h-o').textContent=String(h).padStart(2,'0')+':00';
    var v=document.getElementById('h-v'),t=document.getElementById('h-t');
    if(danger){v.textContent='Don’t set the date now';v.className='bad';t.textContent='Between roughly 9 pm and 3 am, many mechanical calendars are already engaged in changing the date. Using the quick-set now can damage the mechanism. Move the hands to around 6:30 first, then set the date.';}
    else{v.textContent='Safe to quick-set the date';v.className='good';t.textContent='Outside the change window, the date wheel is free. Still check your watch&rsquo;s manual: some movements have a different safe zone.'.replace('&rsquo;','’');}}
  if(sh){build();sh.addEventListener('input',setchk);setchk();}
  // Moon phase
  var md=document.getElementById('md');
  function moon(){if(!md)return;var d=parse(md.value),syn=29.530588853,ref=Date.UTC(2000,0,6,18,14),age=((d.getTime()-ref)/864e5%syn+syn)%syn,ill=(1-Math.cos(2*Math.PI*age/syn))/2;
    var names=[[1.85,'New moon'],[5.54,'Waxing crescent'],[9.23,'First quarter'],[12.92,'Waxing gibbous'],[16.61,'Full moon'],[20.30,'Waning gibbous'],[23.99,'Last quarter'],[27.68,'Waning crescent'],[30,'New moon']],nm='';
    for(var i=0;i<names.length;i++){if(age<names[i][0]){nm=names[i][1];break;}}
    var r=70,waxing=age<syn/2,k=Math.cos(2*Math.PI*age/syn),rx=Math.abs(k)*r;
    var lit='M100 '+(100-r)+' A'+r+' '+r+' 0 0 '+(waxing?1:0)+' 100 '+(100+r)+' A'+rx.toFixed(1)+' '+r+' 0 0 '+((waxing?(k>0?0:1):(k>0?1:0)))+' 100 '+(100-r)+'Z';
    document.getElementById('moonsvg').innerHTML='<circle cx="100" cy="100" r="'+(r+14)+'" fill="#13285A"/><circle cx="100" cy="100" r="'+r+'" fill="#1E2B4A"/><path d="'+lit+'" fill="#F3EBCF"/>';
    document.getElementById('m-n').textContent=nm;document.getElementById('m-i').textContent=Math.round(ill*100)+'% illuminated';document.getElementById('m-a').textContent='Moon age: '+age.toFixed(1)+' days';}
  if(md){md.value=iso(new Date());md.addEventListener('change',moon);md.addEventListener('input',moon);moon();}
  var cf=document.getElementById('cform');
  if(cf)cf.addEventListener('submit',function(ev){ev.preventDefault();if(cf.website.value)return;
    var body='Name: '+cf.name.value+'\nEmail: '+cf.email.value+'\nTopic: '+cf.topic.value+'\n\n'+cf.message.value;
    window.location.href='mailto:'+cf.dataset.to+'?subject='+encodeURIComponent('Website enquiry: '+cf.topic.value)+'&body='+encodeURIComponent(body);
    var s=document.getElementById('fm');s.hidden=false;s.textContent='Your email app should now open with your message ready to send. If it doesn’t, please email us directly at '+cf.dataset.to+'.';});
  var c=document.getElementById('cookie'),v=null;try{v=localStorage.getItem('dd_cookie');}catch(e){}
  if(c&&!v)c.classList.add('show');
  document.querySelectorAll('[data-cookie]').forEach(function(x){x.addEventListener('click',function(){try{localStorage.setItem('dd_cookie',x.dataset.cookie);}catch(e){}c.classList.remove('show');});});
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
