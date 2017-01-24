window.all_seeing_eye = (function(){
  var super_secret = {};
  var last_mask_field;
  var is_setting_up = false;
  const mask_length = 10;
  const STYLE_ID = 'all-seeing-eye-css';

function check_if_should_mask(evnt){
  let n = evnt.target;
  if(last_mask_field && (last_mask_field.value !== '' || last_mask_field.nodeName !== 'INPUT') && last_mask_field.id  != n.id){
    if(!n.id || !super_secret[n.id]){
      let current = current_secret(last_mask_field);
      console.debug('check_if_should_mask ', 'check masking ', current);
      current.base_mask_shown = false;
      if(current.mask){
        last_mask_field.nodeName === 'INPUT' ? last_mask_field.value = maskit(mask_length) : last_mask_field.innerHTML = maskit(mask_length);  
        current.base_mask_shown = true;
      }
      last_mask_field = null;
    }
  }
}

function click_check_if_should_mask(evnt){
  let n = evnt.target;
  if(last_mask_field && last_mask_field.value !== '' && last_mask_field.id  != n.id){
    console.debug('click_check_if_should_mask ',last_mask_field);
    if(!n.id || !super_secret[n.id]){
      last_mask_field.value = maskit(mask_length);
    }
  }
}

function maskit(len){
  len = len || 10;
  let masked='';
  for(let i=0;i<len;i++){
    masked += '\u25CF';
  }
  return masked;
}

function genid(){
  let letters = ['a','b','c','d','e','f','h','i','j','k','l'];
  let l = letters[Math.floor(Math.random() * 10)];
  return l + '-' + Date.now();
}

function setup_all_seeing_eye(eye, input_setup){
  let maskid = genid();
  while(super_secret[maskid]){
    maskid = genid();
  }
  eye.setAttribute('id', maskid);
  let box = input_setup.getBoundingClientRect();
  if(input_setup.nodeName.toLowerCase() === 'input'){
    let clone_input = input_setup.cloneNode();
    clone_input.classList.remove('all-seeing-text');
    clone_input.classList.add('all-seeing-clone');
    let p =  input_setup.parentNode;
    input_setup.setAttribute('maskid', maskid);
    clone_input.setAttribute('maskid', maskid);
    clone_input.setAttribute('id', 'input-'+maskid);
    clone_input.removeAttribute('name');
    p.insertBefore(clone_input, eye);
    input_setup.setAttribute('style', 'display:none');
    if(!input_setup.id){
      input_setup.setAttribute('id', 'org-input-'+maskid);
    }
    clone_input.setAttribute('autocomplete', 'off');
    let cs = window.getComputedStyle(clone_input, null);
    let ps = Number.parseFloat(cs.getPropertyValue('padding-top')) + Number.parseFloat(cs.getPropertyValue('padding-bottom'));
    let bs = Number.parseFloat(cs.getPropertyValue('border-top-width')) + Number.parseFloat(cs.getPropertyValue('border-bottom-width'));
    let ih = Number.parseFloat(cs.getPropertyValue('height'));
    console.debug('button height: ', ps + bs + ih);
    eye.style.height = ps + bs + ih + 'px';
    super_secret[maskid] = {
      input: clone_input.id,
      org_input: input_setup.id,
      value: clone_input.value || '',
      mask: true
    };
    if(input_setup.value){
      clone_input.setAttribute('value', maskit());
    }
    addListeners(clone_input);
  }else if (input_setup.textContent !== ''){
    input_setup.setAttribute('maskid', maskid);
    if(!input_setup.id){
      input_setup.setAttribute('id', 'input-'+maskid);
    }
    eye.style.height = box.height + 'px';
    eye.style.marginLeft = '10px';
    eye.style.top = '0px';
    eye.style.left = '0px';
    eye.style.verticalAlign = 'text-top';
    super_secret[maskid] = {
      input: input_setup.id,
      value: input_setup.innerHTML,
      mask: true
    };
    input_setup.innerHTML = maskit(mask_length)
  }
  eye.addEventListener('click', function(evnt){
    let eye = evnt.target;
    while(eye.tagName.toLowerCase() != 'button'){
      eye = eye.parentNode;
    }
    let current = super_secret[eye.id];
    let input = document.getElementById(current.input);
    if(eye.classList.contains('off')){
      eye.classList.remove('off');
      current.mask = true;
      input_setup.nodeName === 'INPUT' ? input.value = maskit(input.value.length) : input.innerHTML = maskit(mask_length);
    }else{
      eye.classList.add('off');
      current.mask = false;
      input_setup.nodeName === 'INPUT' ? input.value = current.value : input.innerHTML = current.value;
    }
    input.focus();
    evnt.preventDefault();
    evnt.stopPropagation();
  });
}


function check_if_done(node){
  return (node.hasAttribute('maskid'));
}

function current_secret(n){
  let eyeid = n.getAttribute('maskid');
  return super_secret[eyeid];
}


function checkInput(evnt){
  let current = current_secret(evnt.target);
  if(!current.mask){
    current.value = evnt.target.value;
    return;
  }
  let existing = evnt.target.value;
  let code = existing.slice(-1);
  if(existing.length < current.value.length){
    //TODO get direction no what happens here
    // if(current.base_mask_shown === true){
    //   current.value = current.value.slice(0,existing.length);  
    // }else{
    current.value = current.value.slice(0,existing.length);
    // }
  }else{
    current.base_mask_shown = false;
    if(current.value.length === 0){
      current.value = existing;
    }else{
      current.value +=code;  
    }
    if(current.mask){
      evnt.target.value = maskit(existing.length);
      evnt.preventDefault();
      evnt.stopPropagation();
    }
  }
  let org = document.getElementById(current.org_input);
  org.value = current.value;
}

function checkBlur(evnt){
  let current = current_secret(evnt.target);
  last_mask_field = null;
  if(current.mask){
    last_mask_field = evnt.target;
  }
}

function addListeners(node){
  if( /Android|iPhone|iPad|iPod|IEMobile/i.test(navigator.userAgent) ) {
    node.addEventListener('input', checkInput);
  }else{
    node.addEventListener('input', checkInput);
  }
  node.addEventListener('blur', checkBlur);
}

function removeListeners(node){
  node.removeEventListener('input', checkInput);
  node.removeEventListener('blur', checkBlur);
}

function createEye(){
  let btn = document.createElement('button');
  btn.setAttribute('class', 'all-seeing-eye-btn');
  let svg_eye = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg_eye.setAttributeNS(null, 'class', 'all-seeing-eye');
  svg_eye.setAttributeNS(null, 'x', '0px');
  svg_eye.setAttributeNS(null, 'y', '0px');
  svg_eye.setAttributeNS(null, 'viewBox', '-1 -1 20 14');
  let svg_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let svg_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  svg_circle.setAttributeNS(null, 'cx','9');
  svg_circle.setAttributeNS(null, 'cy', '6');
  svg_circle.setAttributeNS(null, 'r', '1.5');
  let svg_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg_path.setAttributeNS(null, 'd', 'M9,0C4,0,0,6,0,6s4,6,9,6c5,0,9-6,9-6S14,0,9,0z M9,9.8C6.9,9.8,5.2,8.1,5.2,6c0-2.1,1.7-3.8,3.8-3.8 c2.1,0,3.8,1.7,3.8,3.8C12.8,8.1,11.1,9.8,9,9.8z');
  svg_g.appendChild(svg_circle);
  svg_g.appendChild(svg_path);
  svg_eye.appendChild(svg_g);
  btn.appendChild(svg_eye);
  return btn;
}

function setup(){
  if(is_setting_up){
    console.debug('setup: ', is_setting_up);
    return;
  }
  is_setting_up = true;
  if(observer){
    try{
      observer.disconnect();
    }catch(e){
      console.error('setup: ', e);
    }
  }
  let styles = document.getElementsByTagName('style');
  let existing_style = false;
  for(let i=0;i< styles.length; i++){
    console.debug(i);
    if(styles[i].id === STYLE_ID){
      existing_style = true;
      continue;
    }
  }
  if(!existing_style){  
    let style = document.createElement('style');
    style.type='text/css';
    style.id = STYLE_ID;
    style.innerHTML = [
      '.all-seeing-clone{padding-right:30px;}',
      '.all-seeing-eye-btn > svg{ align-self: center;height: 12px; width:18px; stroke: #c7cbce;fill: transparent;}',
      '.all-seeing-eye-btn.off > svg{ height: 12px; width: 18px; stroke:none; fill: #3b6980;}',
      '.all-seeing-eye-btn{ display:inline-flex;justify-content:center;padding: 0; position: relative; cursor: pointer; background: transparent; border: none;}',
      'input + .all-seeing-eye-btn{margin-left: -21px;position: absolute}',
      '.all-seeing-eye-btn:hover{ background: transparent}',
      '.all-seeing-eye-btn:focus{outline: none}'].join(' ');
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  let targets = document.getElementsByClassName('all-seeing-text');
  for(let i=0;i< targets.length; i++){
    if(!check_if_done(targets[i])){
      let eye = createEye();
      let t = targets[i];
      let p = t.parentNode;
      if(t.nodeName === 'INPUT' || t.nodeName !== 'INPUT' && t.textContent !== ''){
        p.appendChild(eye);
      }
      setup_all_seeing_eye(eye,t);
    }
  }
  document.body.addEventListener('focusin', check_if_should_mask);
  document.addEventListener('click', check_if_should_mask);
  document.addEventListener('touch', check_if_should_mask);
  // configuration of the observer:
  var config = { attributes: true, childList: true, subtree: true, characterData: true };
  // pass in the target node, as well as the observer options
  let body = document.getElementsByTagName('body')[0];
  observer.observe(body, config);
  is_setting_up = false;
}
  
function cleanup(){
  super_secret = {};
  document.body.removeListener('focusin', check_if_should_mask);
  document.body.removeListener('click', check_if_should_mask);
  document.body.removeListener('touch', check_if_should_mask);
}

//mutation check
var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.target);
        setup();
      });    
    });


//run setup since we can't be sure the dom hasn't rendered before hand
setup();

return {
  super_secrets: super_secret,
  setup: setup,
  cleanup: cleanup
};


})();
