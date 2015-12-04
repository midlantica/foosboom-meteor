Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'games',
  waitOn: function(){
    return [Meteor.subscribe('games'), Meteor.subscribe('teams')];
  }
});


Router.route('/teams', {
  name: 'teams',
  waitOn: function(){
    return Meteor.subscribe("teams");
  }
});

var requireLogin = function(){
  if(!Meteor.user()){
    if(Meteor.loggingIn()){
      this.render("accessDenied");
    } else {
      this.next();
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin);

// Router.onBeforeAction(myAdminHookFunction, {
//   only: ['admin']
//   // or except: ['routeOne', 'routeTwo']
// });
