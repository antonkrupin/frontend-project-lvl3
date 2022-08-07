/* eslint-disable max-len */
import _ from 'lodash';

/* eslint-disable no-param-reassign */
const createFeedsAndPostsTitle = () => {
  const row = document.createElement('div');
  row.classList.add('row');

  const col8 = document.createElement('div');
  col8.classList.add('col-8');

  const col4 = document.createElement('div');
  col4.classList.add('col-4');

  const postsTitle = document.createElement('h1');
  postsTitle.textContent = 'Посты';

  const feedsTitle = document.createElement('h1');
  feedsTitle.textContent = 'Фиды';

  col8.append(postsTitle);
  col4.append(feedsTitle);
  row.append(col8);
  row.append(col4);

  return row;
};

const buttonHandler = (button) => {
  const modal = document.querySelector('#exampleModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const readButton = modal.querySelector('.modal-footer a');

  const closest = button.closest('.post');
  const link = closest.querySelector('a');

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');

  modalTitle.textContent = link.textContent;
  modalBody.textContent = link.getAttribute('data-description');

  readButton.setAttribute('href', link.getAttribute('href'));
};

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
  // themeLink.textContent = text;
  themeLink.innerText = text;

  const buttonCol = document.createElement('div');
  buttonCol.classList.add('col-3');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');

  button.addEventListener('click', (event) => {
    buttonHandler(event.target);
  });

  // button.textContent = buttonText;
  button.innerText = buttonText;

  themeH4.append(themeLink);
  themeCol.append(themeH4);
  buttonCol.append(button);
  row.append(themeCol);
  row.append(buttonCol);

  return row;
};

const renderPost = (postTitle, postDescription, postLink) => renderMarkupPost(postTitle, postDescription, postLink);

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('#feeds');
  feedsSection.prepend(renderMarkupFeed(title, description));
};

const renderAll = (feeds, posts) => {
  const postsSection = document.querySelector('#posts');
  let feedsAndPostsTitle = document.querySelector('.feedsSection .container .row .col-8 h1');
  if (feedsAndPostsTitle === null) {
    feedsAndPostsTitle = document.querySelector('.feedsSection .container');
    feedsAndPostsTitle.prepend(createFeedsAndPostsTitle());
  }
  feeds.forEach((feed) => {
    const {
      id, title, description, rssLink,
    } = feed;

    let div = document.getElementById(`${rssLink}`);
    if (!feed.rendered) {
      renderFeed(title, description);
      feed.rendered = true;
    }

    posts.forEach((post) => {
      if (div === null) {
        div = document.createElement('div');
        div.setAttribute('id', `${rssLink}`);
      }
      const keys = _.keys(post);
      if (keys[0] === id) {
        post[id].forEach((elem) => {
          const { postTitle, postDescription, postLink } = elem;
          if (!elem.rendered) {
            div.append(renderPost(postTitle, postDescription, postLink));
          }
          elem.rendered = true;
        });
      }
      postsSection.prepend(div);
    });
  });
};

export const updateFeeds = (posts) => {
  posts.forEach((post) => {
    const div = document.getElementById(`${post.rssLink}`);
    const { postTitle, postDescription, postLink } = post;
    if (!post.rendered) {
      div.prepend(renderPost(postTitle, postDescription, postLink));
      post.rendered = true;
    }
  });
};

export default renderAll;
