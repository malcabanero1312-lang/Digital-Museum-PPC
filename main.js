fresh();layout();ld(1);
try{init2()}catch(e){$('hint').textContent='Failed to start: '+e.message}
try{netInit()}catch(e){console.error(e)}
