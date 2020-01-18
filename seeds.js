const mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

/* var data = [
  {
    name: "Camp Ice Owl",
    image:
      "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:
      "Silent branches dangled from many a tree. In Hinia, magic comes from a reincarnation cycle. All the power and knowledge one gains in life is passed onto new life through reincarnation, those with the most powerful lives in older generations wield the most power today. There is some balance as a result of great education systems, but there will always be fortunate ones who inherited secrets they prefer to keep to themselves.There are those who seek to break this cycle of inheritance to protect the world against the spread of misinformation, but some claim theyre doing it to prevent their secrets from falling into the wrong hands."
  },
  {
    name: "Camp Nighttide",
    image:
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:
      "Swooping branches clung to most trees, and a variety of flowers"
  },
  {
    name: "Camp Eagle Eye",
    image:
      "https://images.unsplash.com/photo-1477574901123-6b1db202feff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "A mixture of beastly sounds, predominantly those of birds and insects"
  },
  {
    name: "Camp Willow",
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Tremendous, gloomy, and ancient."
  }
];
 */
function seedDB() {
  //Remove all campgrounds
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds!");
    /* Comment.remove({}, err => {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      //add a few cmpgrounds
      data.forEach(seed => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            //create a comment
            Comment.create(
              {
                text: "This place is great, but I wish there was internet",
                author: "Homer"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
    });*/
  });
  //add a few comments
}

module.exports = seedDB;
//to be updated
