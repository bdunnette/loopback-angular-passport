function logMilestone(message) {
  console.log(" ================== " + message + " ================== ")
}

var app = angular.module('app', ['ngCookies', 'ui.router', 'ui.bootstrap', 'lbServices']);

app.run(RunBlock);

RunBlock.$inject = ['$state', '$rootScope'];

function RunBlock($state, $rootScope) {
  // $state.go('home');
  $rootScope.$on('$stateChangeError', function $stateChangeError(event, toState,
    toParams, fromState, fromParams, error) {
    console.group();
    console.error('$stateChangeError', error);
    console.error(error.stack);
    console.info('event', event);
    console.info('toState', toState);
    console.info('toParams', toParams);
    console.info('fromState', fromState);
    console.info('fromParams', fromParams);
    console.groupEnd();
  });
}

app.config(ConfigBlock);

ConfigBlock.$inject = ['$stateProvider', '$urlRouterProvider'];

function ConfigBlock($stateProvider, $urlRouterProvider) {

  logMilestone("Config");

  var HomeState = {
    name: 'home',
    url: '/',
    template: '<ui-view></ui-view>'
  };

  var AccountState = {
    parent: 'home',
    url: 'account',
    controller: 'AccountController as ctrl',
    templateUrl: 'views/account.html'
  };

  $stateProvider.state('home', HomeState);
  $stateProvider.state('account', AccountState);
  $urlRouterProvider.otherwise('/');
}

function AccountController($stateParams, $state, $cookies, LoopBackAuth, User, UserIdentity) {
  logMilestone("Account Controller");
  var ctrl = this;
  LoopBackAuth.rememberMe = false;
  LoopBackAuth.currentUserId = $cookies.get('userId');
  LoopBackAuth.accessTokenId = $cookies.get('access_token');
  console.log(LoopBackAuth);
  LoopBackAuth.save();
  console.log(LoopBackAuth);
  console.log(User.isAuthenticated());
  User.getCurrent().$promise.then(function(user) {
    console.log('Got user data: ' + JSON.stringify(user));
    ctrl.user = user;
    UserIdentity.findOne({userId:ctrl.user.id}).$promise.then(function(identity){
      console.log(identity)
    })
  });

  ctrl.logMeOut = function() {
    console.log(LoopBackAuth);
    LoopBackAuth.clearUser();
    console.log(LoopBackAuth);
    // LoopBackAuth.save();
    // LoopBackAuth.clearStorage();
    // console.log(LoopBackAuth);
    ctrl.user = {};
    $cookies.remove('access_token');
  }
}

app.controller('AccountController', AccountController);
