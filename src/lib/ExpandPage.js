const expandTextarea = () => {
  const elem = document.getElementById('root');
  const iconElem = document.getElementById('expand_button');

  if (elem.classList.contains('expand')) {
    elem.classList.remove('expand');
  } else {
    elem.classList.add('expand');
  }

  if (iconElem.classList.contains('icon-shrink-3')) {
    iconElem.classList.add('icon-expand-diagonal');
    iconElem.classList.remove('icon-shrink-3');
  } else {
    iconElem.classList.add('icon-shrink-3');
    iconElem.classList.remove('icon-expand-diagonal');
  }
};

export default expandTextarea;
