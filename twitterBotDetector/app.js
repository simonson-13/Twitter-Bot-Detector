const apiKey = "...";
const apiKeySecret = "...";
const accessToken = "...";
const accessTokenSecret = "...";

var Twit = require('twit');

var T = new Twit({
  consumer_key:         apiKey,
  consumer_secret:      apiKeySecret,
  access_token:         accessToken,
  access_token_secret:  accessTokenSecret
});


const prompt = require('prompt');
prompt.start();
prompt.get(['Please enter the user ID', 'Please enter the screen name'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received, analyzing user ' + result['Please enter the screen name'] + ':\n');

    T.get('users/show',
          { user_id: result['Please enter the user ID'], screen_name: result['Please enter the screen name'] },
          function(err, data, response)
          {
              // processing information ...
              var redFlags = 0;

              // 1. is the followers to following ratio less than or equal to one percent
              var followersToFollowingRatio = (data.followers_count / data.friends_count) * 100;
              if(followersToFollowingRatio < 1) redFlags++;
              console.log("followers to following ratio is: " + followersToFollowingRatio + "%");

              // 2. has the theme or background never been altered?
              var usesDefaultTheme = data.default_profile;
              if(usesDefaultTheme) redFlags++;
              console.log("this user is using a default theme/background: " + usesDefaultTheme);

              // 3. is default profile pic true?
              var usesDefaultPic = data.default_profile_image;
              if(usesDefaultPic) redFlags++;
              console.log("this user is using a default profile picture: " + usesDefaultPic);

              // 4. is the number of posts less than or equal to 1?
              var numOfPosts = data.statuses_count;
              if(numOfPosts <= 1) redFlags++;
              console.log("this user has tweeted " + numOfPosts + " times");
              console.log(" ");

              if(redFlags >= 4) {
                console.log("Based on the collected data, its predicted that this... IS a fake/bot account");
              } else {
                console.log("Based on the collected data, its predicted that this... IS NOT a fake/bot account\n");
              }
          }
        );

});
