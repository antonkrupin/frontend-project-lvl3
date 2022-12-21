// import _ from 'lodash';

/* const createTitle = (text) => {
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

const findPostByLink = (url, state) => {
  const posts = state.posts.flat().filter((post) => post.itemLink === url);
  return posts[0];
};

export const renderModal = (state) => {
  const href = state.ui.clickedLink;
  const post = findPostByLink(href, state);
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const a = document.querySelector('.full-article');
  a.href = href;
  modalTitle.textContent = post.itemTitle;
  modalBody.textContent = post.itemDescription;
};

const renderMarkupFeed = (title, description) => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'border-0',
    'border-end-0',
  );

  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title;

  const p = document.createElement('p');
  p.classList.add(
    'm-0',
    'small',
    'text-black-50',
  );
  p.textContent = description;

  li.append(h3);
  li.append(p);

  return li;
};

const renderMarkupPost = (text, description, link, buttonText = 'Просмотр') => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );

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

  button.addEventListener('click', (event) => buttonHandler(event.target));

  button.textContent = buttonText;

  li.append(themeLink, button);

  return li;
};

const renderFeed = (title, description) => {
  const feedsSection = document.querySelector('.feeds');
  const feedsCard = document.querySelector('.feeds > .card');
  feedsCard.after(renderMarkupFeed(title, description));
  feedsSection.prepend(feedsCard);
};

const renderAll = (feeds, posts) => {
  const postsSection = document.querySelector('.posts');
  const feedsSection = document.querySelector('.feeds');

  if (!document.querySelector('.posts .card')) {
    postsSection.prepend(createTitle('Посты'));
  }
  if (!document.querySelector('.feeds .card')) {
    feedsSection.prepend(createTitle('Фиды'));
  }

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
      if (post.id === id) {
        const { postTitle, postDescription, postLink } = post.post;
        if (!post.post.rendered) {
          div.append(renderMarkupPost(postTitle, postDescription, postLink));
          post.post.rendered = true;
        }
      }
      postsCard.after(div);
      postsSection.prepend(postsCard);
    });
  });
};

export const updateFeeds = (post) => {
  const div = document.getElementById(`${post.post.rssLink}`);
  const { postTitle, postDescription, postLink } = post.post;
  if (!post.post.rendered) {
    div.prepend(renderMarkupPost(postTitle, postDescription, postLink));
    post.post.rendered = true;
  }
};

export default renderAll; */

export const errorsRender = (elements, i18Instance) => {
  const {
    inputField,
    feedBackField,
    fieldset,
  } = elements;
  inputField.classList.add('is-invalid');
  feedBackField.classList.add('text-danger');
  feedBackField.classList.remove('text-success');
  feedBackField.textContent = i18Instance;
  fieldset.removeAttribute('disabled', 'disabled');
};

const renderFeedsContainer = (elements, i18n) => {
  const { feedsContainer } = elements;
  feedsContainer.textContent = '';
  const feedCard = document.createElement('div');
  const feedCardBody = document.createElement('div');
  const feedCardTitle = document.createElement('h2');
  const feedsUl = document.createElement('ul');

  feedCard.classList.add('card', 'border-0');
  feedCardBody.classList.add('card-body');
  feedCardTitle.classList.add('card-title', 'h4');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  feedsUl.setAttribute('id', 'feedUl');
  feedCardBody.append(feedCardTitle);
  feedCardTitle.textContent = i18n.t('titles.feeds');
  feedCard.append(feedCardBody, feedsUl);
  feedsContainer.append(feedCard);
};

const renderFeedItem = (feed) => {
  const feedLi = document.createElement('li');
  const feedTitle = document.createElement('h3');
  const feedDescription = document.createElement('p');
  const feedsUl = document.querySelector('#feedUl');
  feedLi.classList.add('list-group-item', 'border-0', 'border-end-0');
  feedTitle.classList.add('h6', 'm-0');
  feedDescription.classList.add('m-0', 'small', 'text-black-50');
  feedTitle.textContent = feed.title;
  feedDescription.textContent = feed.description;
  feedLi.append(feedTitle);
  feedLi.append(feedDescription);
  feedsUl.prepend(feedLi);
};

export const renderFeeds = (state, elements, i18n) => {
  renderFeedsContainer(elements, i18n);
  state.feeds.forEach((feed) => {
    renderFeedItem(feed);
  });
};

const renderPostsContainer = (elements) => {
  const { postsContainer } = elements;
  postsContainer.textContent = '';
  const postCard = document.createElement('div');
  const postCardBody = document.createElement('div');
  const postCardTitle = document.createElement('h2');
  const postsUl = document.createElement('ul');

  postCard.classList.add('card', 'border-0');
  postCardBody.classList.add('card-body');
  postCardTitle.classList.add('card-title', 'h4');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  postsUl.setAttribute('id', 'postsUl');
  postCardTitle.textContent = 'Посты';
  postCard.append(postCardBody, postsUl);
  postCardBody.append(postCardTitle);
  postsContainer.append(postCard);
};

const renderPostItem = (post, state, i18) => {
  const postLi = document.createElement('li');
  const postHref = document.createElement('a');
  const postButton = document.createElement('button');
  const postsUl = document.querySelector('#postsUl');
  postHref.setAttribute('href', post.postLink);
  postHref.setAttribute('target', '_blank');
  postLi.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  if (state.ui.viewedPostLinks.has(post.postLink)) {
    postHref.classList.add('fw-normal');
  } else {
    postHref.classList.add('fw-bold');
  }
  postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  postButton.setAttribute('data-bs-dismiss', 'modal');
  postButton.setAttribute('data-bs-toggle', 'modal');
  postButton.setAttribute('data-bs-target', '#modal');

  postHref.textContent = post.postTitle;
  postButton.textContent = i18.t('button.view');

  postLi.append(postHref, postButton);
  postsUl.append(postLi);
  /* if (type === 'new') {
    postsUl.prepend(postLi);
  } else {
    postsUl.append(postLi);
  } */
};

export const renderPosts = (state, elements, i18) => {
  renderPostsContainer(elements);
  state.posts.forEach((post) => {
    renderPostItem(post.post, state, i18);
  });
  /* state.posts
    .flat()
    .sort((a, b) => {
      const aDate = new Date(a.pubDate);
      const bDate = new Date(b.pubDate);
      return (aDate < bDate ? 1 : -1);
    })
    .forEach((post) => {
      renderPostItem(post, 'old', state, i18);
    }); */
};

const findPostByLink = (url, state) => {
  const posts = state.posts.filter((post) => post.post.postLink === url);
  return posts[0];
};

export const renderModal = (state) => {
  const href = state.ui.clickedLink;
  const post = findPostByLink(href, state);
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const a = document.querySelector('.full-article');
  a.href = href;
  modalTitle.textContent = post.post.postTitle;
  modalBody.textContent = post.post.postDescription;
};

export const updateFeeds = (post) => {
  const div = document.getElementById(`${post.post.rssLink}`);
  const { postTitle, postDescription, postLink } = post.post;
  if (!post.post.rendered) {
    div.prepend(renderMarkupPost(postTitle, postDescription, postLink));
    post.post.rendered = true;
  }
};
