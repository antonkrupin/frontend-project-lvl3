/* eslint-disable max-len */
import _ from 'lodash';

/* eslint-disable no-param-reassign */
const createTitle = (text) => {
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = text;

  cardBody.append(title);
  div.append(cardBody);
  return div;
};

const buttonHandler = (button) => {
  const modal = document.querySelector('#exampleModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const readButton = modal.querySelector('.modal-footer a');

  const closest = button.closest('li');
  const link = closest.querySelector('a');

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');

  modalTitle.textContent = link.textContent;
  modalBody.textContent = link.getAttribute('data-description');

  readButton.setAttribute('href', link.getAttribute('href'));
};

const renderMarkupFeed = (title, description) => {
  // const row = document.createElement('div');
  // row.classList.add('row', 'feed');

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title;

  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = description;

  /* const titleRow = document.createElement('div');
  titleRow.classList.add('row');

  const titleCol = document.createElement('div');
  titleCol.classList.add('col');

  const descriptionRow = document.createElement('div');
  descriptionRow.classList.add('row');

  const descriptionCol = document.createElement('div');
  descriptionCol.classList.add('col');

  const h3Title = document.createElement('h3');
  h3Title.classList.add('h-6', 'm-0');
  h3Title.textContent = title;

  const h3Deiscription = document.createElement('h3');
  h3Deiscription.textContent = description;

  titleCol.append(h3Title);
  descriptionCol.append(h3Deiscription);
  titleRow.append(titleCol);
  descriptionRow.append(descriptionCol); */

  li.append(h3);
  li.append(p);

  return li;
};

const renderMarkupPost = (text, description, link, buttonText = 'Просмотр') => {
  // const row = document.createElement('div');
  // row.classList.add('row', 'post');

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  // const themeCol = document.createElement('div');
  // themeCol.classList.add('col-9');

  // const themeH4 = document.createElement('h4');

  const themeLink = document.createElement('a');
  themeLink.classList.add('fw-bold');
  themeLink.setAttribute('href', link);
  themeLink.setAttribute('target', '_blank');
  themeLink.setAttribute('data-description', description);
  themeLink.textContent = text;

  // const buttonCol = document.createElement('div');
  // buttonCol.classList.add('col-3');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');

  button.addEventListener('click', (event) => {
    buttonHandler(event.target);
  });

  button.textContent = buttonText;

  // themeH4.append(themeLink);
  // themeCol.append(themeH4);
  // buttonCol.append(button);
  li.append(themeLink);
  li.append(button);

  return li;
};

const renderPost = (postTitle, postDescription, postLink) => renderMarkupPost(postTitle, postDescription, postLink);

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('.feeds');
  const feedsCard = document.querySelector('.feeds > .card');
  feedsCard.after(renderMarkupFeed(title, description));
  feedsSection.prepend(feedsCard);
  // feedsSection.prepend(renderMarkupFeed(title, description));
};

const renderAll = (feeds, posts) => {
  const postsSection = document.querySelector('.posts');
  const feedsSection = document.querySelector('.feeds');
  /* let feedsAndPostsTitle = document.querySelector('.feedsSection .container .row .col-8 h1');
  if (feedsAndPostsTitle === null) {
    feedsAndPostsTitle = document.querySelector('.feedsSection .container');
    feedsAndPostsTitle.prepend(createFeedsAndPostsTitle());
  } */

  // const feedsAndPostsTitle = document.querySelector('.feedsSection .container .row .col-8 h1') ?? document.querySelector('.feedsSection .container').prepend(createFeedsAndPostsTitle());

  // eslint-disable-next-line no-unused-expressions
  document.querySelector('.posts .card') ?? postsSection.prepend(createTitle('Посты'));
  // eslint-disable-next-line no-unused-expressions
  document.querySelector('.feeds .card') ?? feedsSection.prepend(createTitle('Фиды'));

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
      const postsCard = document.querySelector('.posts > .card');

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

      postsCard.after(div);
      postsSection.prepend(postsCard);
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
