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

const renderMarkupPost = (text, description, link, buttonText = 'Просмотр') => {
  const row = document.createElement('div');
  row.classList.add('row', 'post');

  const themeCol = document.createElement('div');
  themeCol.classList.add('col-9');

  const themeH4 = document.createElement('h4');

  const themeLink = document.createElement('a');
  themeLink.classList.add('fw-bold');
  themeLink.setAttribute('href', link);
  themeLink.setAttribute('target', '_blank');
  themeLink.setAttribute('data-description', description);
  themeLink.textContent = text;

  const buttonCol = document.createElement('div');
  buttonCol.classList.add('col-3');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');
  button.textContent = buttonText;

  themeH4.append(themeLink);
  themeCol.append(themeH4);
  buttonCol.append(button);
  row.append(themeCol);
  row.append(buttonCol);

  return row;
};

const renderPost = (theme, description, link) => renderMarkupPost(theme, description, link);

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('#feeds');
  /* if (feedsSection.children.length === 0) {
    feedsSection.prepend(renderMarkupFeed(title, description));
  } */
  feedsSection.prepend(renderMarkupFeed(title, description));
};

const renderFeeds = (state) => {
  state.forEach((el) => {
    const postsSection = document.querySelector('#posts');
    let div = document.getElementById(`${el.link}`);

    if (!el.render) {
      renderFeed(el.title, el.description);
    }

    if (div === null) {
      div = document.createElement('div');
      div.setAttribute('id', `${el.link}`);
    }

    el.items.forEach((item) => {
      if (!item[4].rendered) {
        div.append(renderPost(item[0], item[1], item[2]));
      }
      item[4].rendered = true;
    });
    postsSection.prepend(div);
    el.render = true;
  });
};

export const updateFeeds = (state) => {
  state.forEach((el) => {
    const div = document.getElementById(`${el.link}`);
    const div1 = document.createElement('div');
    el.items.forEach((item) => {
      if (!item[4].rendered) {
        div1.append(renderPost(item[0], item[1], item[2]));
      }
      item[4].rendered = true;
    });
    div.replaceWith(div1);
  });
};

export default renderFeeds;
