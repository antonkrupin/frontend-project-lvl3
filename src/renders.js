const renderFeeds = (state) => {
  state.map((el) => {
    if (!el.render) {
      console.log(Object.keys(el));
    }
  });
};

const renderPost = () => {
  console.log('test');
};

const renderFeed = () => {
  console.log('test');
};

export default {
  renderFeeds,
  renderPost,
  renderFeed,
};

/*
<div class="col-8" id="posts">
<h1>Посты</h1>
<div class="row post">
    <div class="col-9">
        <h4>Тема поста</h4>
    </div>
    <div class="col-3">
        <button class="btn btn-outline-primary">Просмотр</button>
    </div>
</div>
</div>

*/
