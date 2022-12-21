import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

import parserXML from './parser';
import renderAll, { updateFeeds } from './view';

const validateRss = (state, url) => {
  const rssValidateSchema = yup.object().shape({
    link: yup.string().url().notOneOf(state.rssLinks),
  });

  return rssValidateSchema.validate(url);
};

const downloadRss = (rssUrl) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return axios
    .get(rssLink)
    .then((response) => response.data.contents);
};

export const formStatusHandler = (
  state,
  elements,
  i18Instance,
) => {
  const {
    feedBackField,
    fieldset,
    inputField,
    form,
  } = elements;
  switch (state.formStatus) {
    case 'processing':
      feedBackField.classList.add('text-success');
      feedBackField.classList.remove('text-danger');
      feedBackField.textContent = i18Instance.t('watching');
      break;
    case 'processed':
      fieldset.removeAttribute('disabled', 'disabled');
      inputField.classList.add('is-valid');
      inputField.classList.remove('is-invalid');
      feedBackField.classList.add('text-success');
      feedBackField.classList.remove('text-danger');
      feedBackField.textContent = i18Instance.t('rssAdded');
      renderAll(state.feeds, state.posts);
      form.elements.url.value = '';
      break;
    default:
      throw new Error('Unexpected formStatus value');
  }
};

const errorHandler = (state, error) => {
  switch (error.name) {
    case 'AxiosError': {
      state.errorValue = 'errors.networkProblems';
      break;
    }
    case 'TypeError': {
      state.errorValue = 'errors.notHaveValidRss';
      break;
    }
    case 'ValidationError': {
      state.errorValue = `errors.${error.message}`;
      break;
    }
    default:
      state.errorValue = 'errors.unknown';
  }
};

const handler = (event, state) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const link = formData.get('url').trim();

  event.target.querySelector('fieldset').setAttribute('disabled', 'disabled');

  validateRss(state, { link })
    .then(() => {
      state.formStatus = 'processing';
      return downloadRss(link);
    })
    .then((response) => {
      const id = _.uniqueId();
      const { feed, posts } = parserXML(response, link);
      feed.id = id;
      posts.forEach((post) => {
        state.posts.push({ id, post });
      });

      state.feeds.push(feed);
      state.rssLinks.push(feed.rssLink);
      state.formStatus = 'processed';
    })
    .catch((error) => {
      errorHandler(state, error);
    });
};

const markAsVisited = (element, watchedState) => {
  const { href } = element;
  watchedState.ui.viewedPostLinks.add(href);
};

export const handlePostClick = (element, watchedState) => {
  switch (element.tagName) {
    case 'A': {
      markAsVisited(element, watchedState);
      break;
    }
    case 'BUTTON': {
      const a = element.parentNode.querySelector('a');
      markAsVisited(a, watchedState);
      watchedState.ui.clickedLink = a.href;
      break;
    }
    default:
      throw new Error('unexpected tagname in handlePostClick controller');
  }
};

export const updateRss = (state) => {
  const promises = state.feeds.map(({ id, rssLink }) => downloadRss(rssLink).then((response) => {
    const { posts } = parserXML(response, rssLink);

    const oldPosts = state.posts.filter((post) => post.id === id).map(({ post }) => post);

    const difference = _.differenceBy(posts, oldPosts, 'postDate');

    if (difference.length !== 0) {
      state.posts.unshift({ id, post: difference[0] });
      state.posts.forEach((post) => { updateFeeds(post); });
    }
  }).catch((error) => { state.errorValue = error.name; }));
  Promise.all(promises).then(() => setTimeout(() => updateRss(state), 5000));
};

export default handler;