const createMarkupFeed = (text) => {
  /*const div = document.createElement('div');
  div.classList.add('row', 'feed');*/

  const row = document.createElement('div');
  row.classList.add('row');

  const col = document.createElement('div');
  col.classList.add('col');

  const h3 = document.createElement('h3');
  h3.classList.add('feedTitle');
  h3.textContent = text;

  col.append(h3);
  row.append(col);
  
  return row;
};

const renderPost = () => {

};

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('.feed');
  feedsSection.prepend(createMarkupFeed(description));
  feedsSection.prepend(createMarkupFeed(title));
  /*feedsSection.querySelector('.feedTitle').textContent = title;
  feedsSection.querySelector('.feedDescription').textContent = description;*/
  //createMarkup();
};

const renderFeeds = (state) => {
  state.map((el) => {
    if (!el.render) {
      renderFeed(el.title, el.description);
      el.render = true;
    }
  });
};

export default renderFeeds;

/*
<div class="row feed">
    <div class="row">
        <div class="col-9">
            <h3 class="feedTitle">Title</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-9">
            <h4 class="feedDescription">Description</h4>
        </div>
    </div>
</div>

*/
