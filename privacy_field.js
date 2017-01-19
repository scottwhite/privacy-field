all_seeing_eye = (function(){
  var super_secret = {};
  var last_mask_field;

function check_if_should_mask(evnt){
  let n = evnt.target;
  if(last_mask_field && last_mask_field.value !== '' && last_mask_field.id  != n.id){
    if(!n.id || !super_secret[n.id]){
      let current = current_secret(last_mask_field);
      console.debug('check_if_should_mask ', 'check masking ', current);
      current.base_mask_shown = false;
      if(current.mask){
        last_mask_field.value = maskit(10);  
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
      last_mask_field.value = maskit(10);
    }
  }
}

function maskit(len){
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
  eye.setAttribute('id', maskid);
  eye.setAttribute('style', 'display:inline;');
  input_setup.setAttribute('maskid', maskid);
  if(!input_setup.id){
    input_setup.setAttribute('id', 'input-'+maskid);
  }
  input_setup.setAttribute('autocomplete', 'off');
  super_secret[maskid] = {
    input: input_setup.id,
    value: input_setup.value || '',
    mask: true
  };
  addListeners(input_setup);
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
      input.value = maskit(input.value.length);
    }else{
      eye.classList.add('off');
      current.mask = false;
      input.value = current.value;
    }
    input.focus();
    evnt.preventDefault();
    evnt.stopPropagation();
  });
}

function current_secret(n){
  let eyeid = n.getAttribute('maskid');
  return super_secret[eyeid];
}

// function XcheckBack(evnt){
//   console.debug('checkBack ', evnt.target.value);
//   console.debug(evnt.charCode);
//   let current = current_secret(evnt.target);
//   let temp = current.value || '';
//   function updateBackspace(){
//     if(evnt.target.value == ''){
//       temp = '';
//     }else{
//       temp = temp.substring(0, temp.length - 1);  
//     }
//     console.debug('temp up ', temp);
//     current.value = temp;
//   }
//   let code = evnt.keyCode;
//   if("Backspace" === evnt.key){
//     console.debug('value ', evnt.target.value);
//     updateBackspace();
//   }else if(code && code == 8 || code == 46){
//     updateBackspace();
//   }
// }


// function XcheckKeypress(evnt){
//   console.debug('checkKeypress ', evnt.target.value);
//   let code;
//   console.debug(evnt.charCode);
//   if(evnt.key && /^[ a-z0-9]{1,1}$/i.test(evnt.key)){
//     code = evnt.key
//     console.debug('is space', /\s/.test(code));
//   }else if(evnt.keyCode){
//     code = String.fromCharCode(evnt.keyCode);
//     if(!/^[ a-z0-9]{1,1}$/i.test(code)){
//       code = null;
//     }
//   }
//   if(code){
//     let current = current_secret(evnt.target);
//     let temp = current.value || '';
//     temp += code;
//     if(current.mask){
//       evnt.target.value = maskit(temp.length);      
//       evnt.preventDefault();
//       evnt.stopPropagation();
//     }
//     current.value = temp;
//     console.debug('temp press ', temp); 
//   }
// }


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
  svg_eye.setAttributeNS(null, 'viewBox', '0 0 18 12');
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
  let style = document.createElement('style');
  style.type='text/css';
  style.innerHTML = ['.all-seeing-text{padding-right:40px;}',
  '.all-seeing-eye-btn > svg{ height: 18px; fill: #3b6980;}',
  '.all-seeing-eye-btn.off > svg{ fill: #c7cbce;}',
  '.all-seeing-eye-btn{ padding: 0; position: relative; top:5px; margin-left: -40px; cursor: pointer; background: transparent; border: none;}',
  '.all-seeing-eye-btn:focus{outline: none}'].join(' ');
  document.getElementsByTagName('head')[0].appendChild(style);
  let targets = document.getElementsByClassName('all-seeing-text');
  for(let i=0;i< targets.length; i++){
    let eye = createEye();
    let t = targets[i];
    let p = t.parentNode;
    p.appendChild(eye);
    setup_all_seeing_eye(eye,t);
  }
  document.body.addEventListener('focusin', check_if_should_mask);
  document.addEventListener('click', check_if_should_mask);
  document.addEventListener('touch', check_if_should_mask);
}
  
function cleanup(){
  super_secret = {};
  document.body.removeListener('focusin', check_if_should_mask);
  document.body.removeListener('click', check_if_should_mask);
  document.body.removeListener('touch', check_if_should_mask);
}

return {
  super_secrets: super_secret,
  setup: setup,
  cleanup: cleanup
};
  
})();

document.addEventListener('DOMContentLoaded', function(){
  all_seeing_eye.setup();
})
