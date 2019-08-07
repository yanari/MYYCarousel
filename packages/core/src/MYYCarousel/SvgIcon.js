import './SvgIcon.css';

import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function resolveTitle (title, children) {
  return title || (typeof children === 'string' ? children : null);
}

function SvgIcon (props) {
  const classSet = cn('svg-icon', props.className, {'spin-please': props.spinner});
  const title = props.title === null ? null : resolveTitle(props.title, props.children);
  return (
    <i
      className = {classSet}
      data-tip = {props.dataTip}
      style = {props.style}
      title = {title}
    >
      <svg className = {'icon-' + props.name}>
        <use xlinkHref = {'#icon-' + props.name}/>
      </svg>
      {props.children && <abbr>{props.children}</abbr>}
    </i>
  );
}

SvgIcon.propTypes = {
  children: PropTypes.node, // Obrigatóriamente uma string, usa no title também
  className: PropTypes.string,
  dataTip: PropTypes.string,
  name: PropTypes.string,
  spinner: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

/**
 * Em alguns casos é necessário usar direto a string html do svg
 * Por exemplo, para carregar os ícones da toolbar do medium editor
 *
 * @param {string} name .
 * @returns {string} .
 */
export function htmlSvgIcon (name) {
  return (
    '<i class="svg-icon"><svg class="icon-' + name + '">'
    + '<use xlink:href="#icon-' + name + '"></use>'
    + '</svg></i>'
  );
}

export default SvgIcon;
