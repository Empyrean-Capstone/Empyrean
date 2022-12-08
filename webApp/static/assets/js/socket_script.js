console.log('socket_script.js');
console.log("opening connection to solar server");
const socket = io('http://0.0.0.0:8081');
console.log('connected to solar server');

socket.on('update', function(data) {
  for (const [key, value] of Object.entries(data)) {
    if (key == 'spectrograph') {
      // Update the spectrograph status
      const on = "fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success";
      const off = "fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning";
      if (data['spectrograph'][0] == 0) {
        document.getElementById('mirror_status').innerHTML = 'Object';
      } else {
        document.getElementById('mirror_status').innerHTML = 'Calibration';
      }
      if (data['spectrograph'][1] == 0) {
        document.getElementById('led_status').innerHTML = 'Off';
        document.getElementById('led_status').className = off;
        
      } else {
        document.getElementById('led_status').innerHTML = 'On';
        document.getElementById('led_status').className = on;
      }  
      if (data['spectrograph'][2] == 0) {
        document.getElementById('thar_status').innerHTML = 'Off';
        document.getElementById('thar_status').className = off;
      } else {
        document.getElementById('thar_status').innerHTML = 'On';
        document.getElementById('thar_status').className = on;
      }  
      if (data['spectrograph'][3] == 0) {
        document.getElementById('tung_status').innerHTML = 'Off';
        document.getElementById('tung_status').className = off;
      } else {
        document.getElementById('tung_status').innerHTML = 'On';
        document.getElementById('tung_status').className = on;
      }                  
      
    } else if (key == 'current_exposure') {      
      const itime_total =  data['current_exposure']['itime_total'];
      const itime_elapsed =  1+data['current_exposure']['itime_elapsed'];
      const exp_total =  data['current_exposure']['nexp_total'];
      const exp_number = 1+ data['current_exposure']['exp_number'];  
      const itime_percentage = Math.round(100*itime_elapsed/itime_total);
      const exp_percentage = Math.round(100*exp_number/exp_total)
      document.getElementById('itime_progress').setAttribute("style", `width: ${itime_percentage}%`);
      document.getElementById('nexp_progress').setAttribute("style", `width: ${exp_percentage}%`);      
    } else if (key == 'camera') {
      const camera_status = data['camera'];
      document.getElementById('camera_status').innerHTML = camera_status;
      if (camera_status == 'Busy') {
        document.getElementById('start_button').disabled = true;
        document.getElementById('stop_button').disabled = false;
        document.getElementById('camera_status').className = "fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-danger-light text-danger"
      } else {
        document.getElementById('camera_status').className = "fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success"
        document.getElementById('start_button').disabled = false;
        document.getElementById('stop_button').disabled = true;
      }
      
      
    } else {
      for (const [key2, value2] of Object.entries(data[key])) {

        const el = document.getElementById(key2);
        if (el !== null) {
          el.placeholder = value2;
          // 👉️ safe to work with element here
        } else {
          console.log(`${key2} Element does NOT exist in DOM`);
        }
      }
    }
    
  }    
  });
 
function start_observation() {
  const nexp = document.getElementById('nexp').value;
  const texp = document.getElementById('texp').value;
  const obs_type = document.getElementsByClassName("btn btn-dark me-2")[0].id;
  console.log(obs_type);
  socket.emit('start_observation', [obs_type, nexp, texp])
}

function stop_observation() {
  socket.emit('stop_observation');
}
 
function set_obs_type(type) {
  var obs_types = ["obj", "dark", "flat", "thar"];
  var arrayLength = obs_types.length;
  for (var i = 0; i < 4; i++) {
    if (obs_types[i] == type) {
        document.getElementById(obs_types[i]).className = "btn btn-dark me-2";
        var selected_obs = obs_types[i];
      }  else {
        document.getElementById(obs_types[i]).className = "btn btn-light me-2";
      }
  }  
  if (selected_obs == 'obj') {
    document.getElementById('target_name').disabled = false;
    document.getElementById('resolve_btn').disabled = false;
    document.getElementById('target_name').value = 'Object';    
  } else {
    document.getElementById('target_name').disabled = true;
    document.getElementById('resolve_btn').disabled = true;
    document.getElementById('target_name').value = selected_obs.charAt(0).toUpperCase() + selected_obs.slice(1);
  } 
};

function resolve() {
  const target = document.getElementById('target_name').value;
  socket.emit('resolve_target', target);
}

function ISODateString(d) {
    function pad(n) {
        return n < 10 ? '0' + n : n
    }
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
}



document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    socket.emit('newWebClient', 'hello');
    socket.emit('get_all_variables');
  }
};