/* eslint-disable no-param-reassign */
const createMarkupFeed = (title, description) => {
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

// перекинуть функции
// создания разметки в отдельную папку

const createMarkupPost = (text, link, buttonText = 'Просмотр') => {
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

// добавить разделение по фидам
// чтобы все посты от одного фида были в одной секции

const renderPost = (theme, link) => {
  const postsSection = document.querySelector('#posts');
  postsSection.append(createMarkupPost(theme, link));
};

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('#feeds');
  feedsSection.prepend(createMarkupFeed(title, description));
};

const renderFeeds = (state) => {
  state.map((el) => {
    if (!el.render) {
      renderFeed(el.title, el.description);
      el.items.map((item) => {
        renderPost(item[0], item[2]);
      });
      el.render = true;
    }
  });
};

export default renderFeeds;
