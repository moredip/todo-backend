function defineAuthSpecsFor(api){

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

    function getAbsUrl(route) {
      return getHost(api.root()) + route;
    }

    var name = randomString(10),
        password = randomString(10);

    it( 'supports user registration via /register', function(){
      var postRegister = api.postJson(getAbsUrl('/register'), {
        name: name,
        password: password,
        passwordConfirmation: password
      });

      return expect(postRegister).to.be.fulfilled;
    });

    describe( 'logging in', function(){
      function expectErrorWithHttpStatus(status, route, data) {
        var request = api.postJson(getAbsUrl(route), data),
            statusPattern = new RegExp(String(status));
        return expect(request).to.be.rejectedWith(Error, statusPattern);
      }

      it( 'responds with a 401 if the password is incorrect', function(){
        return expectErrorWithHttpStatus(401, '/login', {
          name: name,
          password: 'blah'
        });
      });

      it( 'responds with a 401 if the user does not exist', function(){
        return expectErrorWithHttpStatus(401, '/login', {
          name: randomString(10),
          password: password
        });
      });

      it( 'responds with a 401 if the "name" field is missing', function(){
        return expectErrorWithHttpStatus(401, '/login', {
          password: password
        });
      });

      it( 'responds with a 401 if the "password" field is missing', function(){
        return expectErrorWithHttpStatus(401, '/login', {
          name: name
        });
      });

      it( 'provides an authentication token in exchange for name & password', function(){
        var goodLogin = api.postJson(getAbsUrl('/login'), {
          name: name,
          password: password
        });

        goodLogin = goodLogin.then(function(data) {
          window.token = data.token;
          return data;
        });

        return expect(goodLogin).to.eventually.have.property('token');
      });
    });
  });

}
