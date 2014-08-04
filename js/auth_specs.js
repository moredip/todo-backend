function defineAuthSpecsFor(apiRoot){

  var api = createAPI(apiRoot);

  describe( 'Todo-Backend API - authentication', function(){
    function randomString(len){
      var str = '';
      while (str.length < len){
        str += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26));
      }
      return str;
    }

    function getHost(url){
      return url.match(/^https?:\/\/[^\/]+/)[0];
    }

    it( 'supports user registration via /register', function(){
      var name = randomString(10),
          password = randomString(10);

      var postRegister = api.postJson(getHost(apiRoot) + '/register', {
        name: name,
        password: password,
        passwordConfirmation: password
      });

      window.user.name = name;
      window.user.password = password;

      return expect(postRegister).to.eventually.have.property('name');
    });

    it( 'provides an authentication token in exchange for name & password', function(){
      var postAuth = api.postJson(getHost(apiRoot) + '/login', {
        name: user.name,
        password: user.password
      });

      postAuth = postAuth.then(function(data) {
        window.token = data.token;
        return data;
      });

      return expect(postAuth).to.eventually.have.property('token');
    });
  });

}
