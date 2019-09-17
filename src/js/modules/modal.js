"use strict";

class Modal {
  constructor ({
    targetModal,
    triggers = [],
    onShow = () => {},
    onClose = () => {},
    openTrigger = 'data-modal-trigger',
    closeTrigger = 'data-modal-close',
    disableScroll = false,
    disableFocus = false,
    awaitCloseAnimation = false,
    debugMode = false
   }) {
    // this.options = Object.assign({}, options);
    this.modal = document.getElementById(targetModal);
    this.config = { debugMode, disableScroll, openTrigger, closeTrigger, onShow, onClose, awaitCloseAnimation, disableFocus };
    if (triggers.length > 0) this.registerTriggers(...triggers);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }
  registerTriggers (...triggers) {
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.showModal())
    });
  }
  showModal () {
    this.activeElement = document.activeElement;
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.classList.add('is-open');
    // this.setFocusToFirstNode();
    this.scrollBehaviour('disable');
    this.addEventListeners();
    this.config.onShow(this.modal);
  }
  closeModal () {
    const modal = this.modal;
    this.modal.setAttribute('aria-hidden', 'true');
    this.removeEventListeners();
    this.scrollBehaviour('enable');
    this.activeElement.focus();
    this.config.onClose(this.modal);
    if (this.config.awaitCloseAnimation) {
      this.modal.addEventListener('animationend', function handler () {
        modal.classList.remove('is-open');
        modal.removeEventListener('animationend', handler, false);
      }, false)
    } else {
      modal.classList.remove('is-open');
    }
  }
  addEventListeners () {
    this.modal.addEventListener('touchstart', this.onClick);
    this.modal.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKeydown);
  }
  removeEventListeners () {
    this.modal.removeEventListener('touchstart', this.onClick);
    this.modal.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKeydown);
  }
  onClick (event) {
    if (event.target.hasAttribute(this.config.closeTrigger)) {
      this.closeModal();
      event.preventDefault();
    }
  }
  onKeydown (event) {
    if (event.keyCode === 27) this.closeModal(event);
    if (event.keyCode === 9) this.maintainFocus(event);
  }
  scrollBehaviour (toggle) {
    // if (!this.config.disableScroll) return;
    const body = document.querySelector('body');
    switch (toggle) {
      case 'enable':
        Object.assign(body.style, {overflow: 'initial', height: 'initial'});
        break;
      case 'disable':
        Object.assign(body.style, {overflow: 'hidden', height: '100vh'});
        break;
      default:
    }
  }
}

let activeModal = null;

const generateTriggerMap = (triggers, triggerAttr) => {
  const triggerMap = [];

  triggers.forEach(trigger => {
    const targetModal = trigger.attributes[triggerAttr].value;
    if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
    triggerMap[targetModal].push(trigger)
  });

  return triggerMap;
};

const validateModalPresence = id => {
  if (!document.getElementById(id)) {
    console.warn(`MicroModal v${version}: \u2757Seems like you have missed %c'${id}'`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.')
    console.warn(`%cExample:`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', `<div class="modal" id="${id}"></div>`)
    return false
  }
};

const validateTriggerPresence = triggers => {
  if (triggers.length <= 0) {
    console.warn(`MicroModal v${version}: \u2757Please specify at least one %c'micromodal-trigger'`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.')
    console.warn(`%cExample:`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', `<a href="#" data-micromodal-trigger="my-modal"></a>`)
    return false
  }
};

const validateArgs = (triggers, triggerMap) => {
  validateTriggerPresence(triggers);
  if (!triggerMap) return true;
  for (let id in triggerMap) validateModalPresence(id);
  return true;
};

const init = (config) => {
  const options = Object.assign({}, { openTrigger: 'data-modal-trigger' }, config);
  const triggers = [...document.querySelectorAll(`[${options.openTrigger}]`)];
  // console.log(triggers);
  const triggerMap = generateTriggerMap(triggers, options.openTrigger);
  // if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return;
  for (let key in triggerMap) {
    let value = triggerMap[key];
    options.targetModal = key;
    options.triggers = [...value];
    new Modal(options);
  }
};

const show = (targetModal, config) => {
  const options = config || {};
  options.targetModal = targetModal;
  if (options.debugMode === true && validateModalPresence(targetModal) === false) return;
  activeModal = new Modal(options);
  activeModal.showModal();
};

const close = () => {
  activeModal.closeModal();
};

let VModal = { init, show, close };

export default VModal;
