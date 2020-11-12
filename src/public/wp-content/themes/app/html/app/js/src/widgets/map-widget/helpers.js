/** Object marker **/
function getObjectMarkerTemplate() {
  return document.querySelector('#tpl-object-marker');
}

export function createObjectMarker(data, options = {}) {
  const markerTemplate = getObjectMarkerTemplate();
  const tpl = markerTemplate.content.cloneNode(true);
  const container = tpl.querySelector('[data-container]');

  container.dataset.color = data.color;
  if (options.shadow) container.classList.add('shadow');

  const iconWrapperNode = tpl.querySelector('[data-icon]');
  if (data.icon) iconWrapperNode.innerHTML = iconWrapperNode
    .innerHTML.replace(/\[\[iconName]]/ig, data.icon);

  return tpl;
}

/** Object card **/
function getObjectCardTemplate() {
  return document.querySelector('#tpl-object-card');
}

export function createObjectCard(data) {
  const cardTemplate = getObjectCardTemplate();
  const tpl = cardTemplate.content.cloneNode(true);

  tpl.querySelector('[data-icon]').appendChild(createObjectMarker(data.marker));
  tpl.querySelectorAll(`[data-field]`).forEach(field => {
    const fieldValue = data[field.dataset.field];

    if (fieldValue) field.append(fieldValue);
    else field.closest('[data-field]').remove();
  });

  return tpl;
}

/** Object details **/
function getDetailsTemplate() {
  return document.querySelector('#tpl-object-details');
}

export function createObjectDetails(data) {
  const detailsTemplate = getDetailsTemplate();
  const tpl = detailsTemplate.content.cloneNode(true);

  tpl.querySelectorAll(`[data-field]`).forEach(field => {
    const fieldValue = data[field.dataset.field];

    if (fieldValue) field.append(fieldValue);
    else field.closest('[data-item]').remove();
  });

  const phoneWrapperNode = tpl.querySelector('[data-phone]');
  if (!data.phone) phoneWrapperNode.closest('[data-item]').remove();
  else phoneWrapperNode.innerHTML = phoneWrapperNode.innerHTML
    .replace(/\[\[phone]]/ig, data.phone);

  return tpl;
}
