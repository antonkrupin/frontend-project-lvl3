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
  const modalButton = modal.querySelector('.modal-footer a');

  const closest = button.closest('li');
  const link = closest.querySelector('a');

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');

  modalTitle.textContent = link.textContent;
  modalBody.textContent = link.getAttribute('data-description');

  modalButton.setAttribute('href', link.getAttribute('href'));
};

const renderMarkupFeed = (title, description) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title;

  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = description;

  li.append(h3);
  li.append(p);

  return li;
};

const renderMarkupPost = (text, description, link, buttonText = 'Просмотр') => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const themeLink = document.createElement('a');
  themeLink.classList.add('fw-bold');
  themeLink.setAttribute('href', link);
  themeLink.setAttribute('target', '_blank');
  themeLink.setAttribute('data-description', description);
  themeLink.textContent = text;

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');

  button.addEventListener('click', (event) => {
    buttonHandler(event.target);
  });

  button.textContent = buttonText;

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
};

const renderAll = (feeds, posts) => {
  const postsSection = document.querySelector('.posts');
  const feedsSection = document.querySelector('.feeds');

  // eslint-disable-next-line no-unused-expressions
  document.querySelector('.posts .card') ?? postsSection.prepend(createTitle('Посты'));
  // eslint-disable-next-line no-unused-expressions
  document.querySelector('.feeds .card') ?? feedsSection.prepend(createTitle('Фиды'));
  /* const div1 = document.querySelector('.list-group') ?? document.createElement('ul');
  div1.classList.add('list-group', 'border-0', 'rounded-0');

  const feedsId = _.flattenDeep(feeds.map((el) => el.id)).reverse();

  feedsId.forEach((feedId) => {
    posts.forEach((post) => {
      if (post[feedId] !== undefined) {
        post[feedId].forEach((p) => {
          const { postTitle, postDescription, postLink } = p;
          if (!p.rendered) {
            postsSection.append(renderPost(postTitle, postDescription, postLink));
            // div1.append(renderPost(postTitle, postDescription, postLink));
          }
          p.rendered = true;
        });
      }
    });
    postsSection.after(div1);
  }); */

  feeds.forEach((feed) => {
    const {
      id, title, description, rssLink,
    } = feed;

    const div = document.getElementById(`${rssLink}`) ?? document.createElement('div');
    div.setAttribute('id', `${rssLink}`);

    if (!feed.rendered) {
      renderFeed(title, description);
      feed.rendered = true;
    }

    posts.forEach((post) => {
      const postsCard = document.querySelector('.posts > .card');

      if (_.keys(post)[0] === id) {
        post[id].forEach((elem) => {
          const { postTitle, postDescription, postLink } = elem;
          console.log(!elem.rendered);
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
