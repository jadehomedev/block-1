// Waiting for jQuery to initialize
$(document).ready(function() {
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  // https://randomuser.me/

  const constrollerView = new ViewController($);
});

class DetailView {
  allUsers;
  jquery;
  index;

  detailPage$;

  constructor(jquery, allUsers) {
    this.index = 0;
    this.jquery = jquery;
    this.allUsers = allUsers;
    this.detailPage$ = $("section.detail-page");
  }

  like = () => {
    this.allUsers[this.index].like = true;
    this.incrementIndex();
    this.render();
  };

  dislike = () => {
    this.allUsers[this.index].like = false;
    this.incrementIndex();
    this.render();
  };

  incrementIndex() {
    this.index++;
  }

  render = () => {
    const currentProfile = new ProfileCard(this.allUsers[this.index]);
    const profileLike = new ProfileLike(
      this.like,
      this.dislike,
      this.detailPage$
    );
    
    return `
    ${currentProfile.render()}
    ${profileLike.render()}
    `;
  }
}

class ProfileCard {
  user;

  constructor(user) {
    this.user = user;
    console.log("ProfileCard User", this.user);
  }

  render = () => {
    return ` 
    <div id="profile-view">
    <div class="card">
      <div class="card-header">
      ${this.user.name.title} ${this.user.name.first} ${this.user.name.last} 
      </div>
      <img class="card-img-top" src="${this.user.picture.large}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">
        ${this.user.login.username}
        </h5>
        <p class="card-text">
        ${this.user.location.city}, ${this.user.location.state}, ${this.user.location.country}
        </p>
      </div>
    </div>
    </div>`;
  }
}

class ProfileLike {
  likeFn;
  dislikeFn;
  detailPage$;

  constructor(likeFn, dislikeFn, detailPage$) {
    this.likeFn = likeFn;
    this.dislikeFn = dislikeFn;
    this.detailPage$ = detailPage$;
    this.onLikeInit();
    this.onDislikeInit();
  }

  onLikeInit() {
    this.detailPage$.on("click", "button#like", e => {
      this.likeFn();
    });
  }

  onDislikeInit() {
    this.detailPage$.on("click", "button#dislike", e => {
      this.dislikeFn();
    });
  }

  render() {
    return `
      <div class="card">
      <div class="text-center p-2 mx-auto">
        <button type="button" class="btn btn-success btn-lg" id="like">
          <img src="/modules/bootstrap-icons/icons/heart.svg" class="rounded" alt="" width="128" height="128" title="Heart-Fill">
          <span class="output"></span>
        </button>
        <button type="button" class="btn btn-info btn-lg" id="dislike">
          <img src="/modules/bootstrap-icons/icons/heart.svg" class="rounded" alt="" width="128" height="128" title="Heart">
          <span class="minus-output"></span>
        </button>
      </div>
      </div>
      `;
  }
}

class ViewController {
  jquery;
  root$;
  pages;
  allUsers;
  pageName = {
    "detailPage" : 0,
    "listPage": 1
  };
  currentPage = this.pageName.listPage;

  constructor(jquery) {
    this.jquery = jquery;
    this.root$ = this.jquery('#root');
    this.getUsers(100).then(users => {
      this.allUsers = users.results;
      this.pages = [
        new DetailView(this.jquery, this.allUsers),
        new ListView(this.allUsers)
        //
      ];

      this.mount();
    });
  }

  mount = () => {
    const nav = new Navigation(this.jquery);
    this.root$.html(`
      ${nav.render()}
      ${this.pages[this.currentPage].render()}
    `);
  }

  getUsers(amount) {
    return fetch(`https://randomuser.me/api/?results=${amount}`).then(
      response => {
        return response.json();
      }
    );
  }
}

class Navigation {
  jquery;
  constructor(jquery) {
    this.jquery = jquery;
  }

  render() {
    return `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Tinder</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    </div>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Profile <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">List</a>
      </li>
  </div>
  </nav>`;
  }
  
}

class ListView {
  allUsers;

  constructor(allUsers) {
    this.allUsers = allUsers;
  }

  render(){
    let result = "<ul class='list-group'>";
    console.log
    this.allUsers
      .map( user => console.log(user))
      .filter(user => (user && user.like && user.like== false))
      .map (user => {
        result += `<li class="list-group-item">${user.name.title} ${user.name.first} ${user.name.last}</li>`;
      });
    return result + "</ul>";
  }

}