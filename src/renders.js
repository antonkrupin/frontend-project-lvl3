/* eslint-disable no-param-reassign */
const renderMarkupFeed = (title, description) => {
  const row = document.createElement('div');
  row.classList.add('row', 'feed');

  const titleRow = document.createElement('div');
  titleRow.classList.add('row');

  const titleCol = document.createElement('div');
  titleCol.classList.add('col');

  const descriptionRow = document.createElement('div');
  descriptionRow.classList.add('row');

  const descriptionCol = document.createElement('div');
  descriptionCol.classList.add('col');

  const h3Title = document.createElement('h3');
  h3Title.textContent = title;

  const h3Deiscription = document.createElement('h3');
  h3Deiscription.textContent = description;

  titleCol.append(h3Title);
  descriptionCol.append(h3Deiscription);
  titleRow.append(titleCol);
  descriptionRow.append(descriptionCol);

  row.append(titleRow);
  row.append(descriptionRow);

  return row;
};

const renderMarkupPost = (text, link, buttonText = 'Просмотр') => {
  const row = document.createElement('div');
  row.classList.add('row', 'post');

  const themeCol = document.createElement('div');
  themeCol.classList.add('col-9');

  const themeH4 = document.createElement('h4');

  const themeLink = document.createElement('a');
  themeLink.setAttribute('href', link);
  themeLink.setAttribute('target', '_blank');
  themeLink.textContent = text;

  const buttonCol = document.createElement('div');
  buttonCol.classList.add('col-3');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary');
  button.textContent = buttonText;

  themeH4.append(themeLink);
  themeCol.append(themeH4);
  buttonCol.append(button);
  row.append(themeCol);
  row.append(buttonCol);

  return row;
};

const renderPost = (theme, link) => renderMarkupPost(theme, link);

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('#feeds');
  feedsSection.prepend(renderMarkupFeed(title, description));
};

const renderFeeds = (state) => {
  state.forEach((el) => {
    /* if (!el.render) {
      renderFeed(el.title, el.description);
      const postsSection = document.querySelector('#posts');
      const div = document.createElement('div');
      div.classList.add('one-feed');
      el.items.forEach((item) => {
        div.append(renderPost(item[0], item[2]));
      });
      postsSection.prepend(div);
      el.render = true;
    } */
    renderFeed(el.title, el.description);
    const postsSection = document.querySelector('#posts');
    const div = document.createElement('div');
    div.classList.add('one-feed');
    el.items.forEach((item) => {
      if (!item[4].rendered) {
        div.append(renderPost(item[0], item[2]));
      }
      item[4].rendered = true;
    });
    postsSection.prepend(div);
    el.render = true;
  });
};

export default renderFeeds;
