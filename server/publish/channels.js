Meteor.publish('Channels', function (searchText) {
  if (_.isEmpty(searchText)) {
    return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}});
  }
  check(searchText, String);

  var regex = '.*' + searchText + '.*';

  return Channels.find({$or : [
    {title: {$regex: regex, $options: 'i'}},
    {language: {$regex: regex, $options: 'i'}}
  ]}, {
    sort: {finishedAt: 1, createdAt: 1}
  });
});

Meteor.publishComposite('FeaturedChannelWithUser', function () {
  return {
    find: function () {
      return Channels.find({
      }, {sort: {finishedAt: 1, createdAt: 1}});
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({ _id: channel.owner }, {
          superchat: 1,
          profile: 1
        });
      }
    }]
  };
});

Meteor.publishComposite('ChannelsWithUsers', function (limit) {
  return {
    find: function () {
      return Channels.find({}, {sort: {finishedAt: 1, createdAt: 1}, limit: limit || 0});
    },
    children: [{
      find: function (channel) {
        return Meteor.users.find({ _id: channel.owner }, {
          superchat: 1,
          profile: 1
        });
      }
    }]
  };
});
