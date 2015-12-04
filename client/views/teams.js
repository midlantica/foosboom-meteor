Template.teams.helpers({
    isCreatingTeam: function() {
        return Session.get('isCreatingTeam');
    },
    teams: function() {
        return Teams.find();
    }
});

Template.teams.events({
  'click a.create': function(e, tpl){
      e.preventDefault();
      Session.set('isCreatingTeam', true);
  },
  'click a.cancel': function(e, tpl) {
      e.preventDefault();
      Session.set('isCreatingTeam', false);
  },
  'submit form.create-team': function(e, tpl){
    e.preventDefault();

    var team = {
      name: tpl.$('input[name=name]').val(),
      ownerId: Meteor.userId()
    };

    Teams.insert(team, function(error, _id){
      if(error){
        alert(error);
        Session.set('isCreatingTeam', true);
        Tracker.afterFlush(function(){
          tpl.$('input[name-name]').val(teamName);
        });
      }
    });

    Session.set('isCreatingTeam', false);
  }

});

Meteor.methods({
  teamUpdate: function(teamId, newName){
    check(Meteor.userId(), String);
    check(teamId, String);
    check(newName, String);

    var team = Teams.findOne(teamId);
    if(team){
      Teams.update(teamId, {$set: {name: newName}}, function(error){
        if(!error){
          if(team.gameIds){
            var games = Games.find({_id: {$in: team.gameIds}});

            games.fetch().forEach(function(game){
              game.teams.map(function(team){
                if(team._id == teamId){
                  team.name = newName;
                }

                Games.update({_id: game._id}, {$set: {teams: game.teams}});
              })
            });
          }

          return teamId;
        }
      });
    } else {
      throw new Meteor.Error("team-does-not-exist", "This team doesn't exist in the database");
    };
  }
});