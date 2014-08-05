mocha.setup('bdd');
mocha.slow("5s");
mocha.timeout("30s"); //so that tests don't fail with a false positive while waiting for e.g a heroku dyno to spin up
window.expect = chai.expect;

// global for auth
window.token = null;


function loadTargetRootFromInput(){
  var targetRoot = $('#target-root-url').val();
  var queryString = 'targetRootUrl=' + encodeURIComponent(targetRoot);

  var includeAuth = $('#include-authentication').prop('checked');
  if (includeAuth) {
    queryString += '&auth=true';
  }

  window.location.search = queryString;
}

$('#target-chooser button').on('click',loadTargetRootFromInput);
$('#target-chooser input').on('keyup',function(){
  if(event.keyCode == 13){
    loadTargetRootFromInput();
  }
});


function parseQueryString(){
  var queryString = window.location.search.substr(1);
  return queryString.split('&').reduce(function(params, param) {
    var keyValue = param.split('=');
    params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1] || 'true');
    return params;
  }, {});
}

function initWithParams(params) {
  var targetRootUrl = params.targetRootUrl;

  if( targetRootUrl ){
    $("#target-info .target-url").text(targetRootUrl);
    $("#target-chooser").hide();

    if( params.auth ){
      defineAuthSpecsFor(targetRootUrl);
    }

    defineSpecsFor(targetRootUrl);

    mocha.checkLeaks();
    var runner = mocha.run();
  }else{
    $("#target-info").hide();
  }
}

initWithParams(parseQueryString());
