class Select {
  constructor (selector) {
    this.selector = selector;
    this.el = document.querySelector(this.selector) || false;
    if (!this.el) {
      console.info(`Селектор ${this.selector} не найден`);
      return;
    }
    this.init();
  }
  init () {
    this.el.querySelector('.field-select__head').addEventListener('click', e => {
      // let selectElementNode = e.currentTarget.closest('.js-field-select');
      // selectElementNode.classList.toggle('is-active');
      this.el.classList.toggle('is-active');
    });
    [].slice.call(this.el.querySelectorAll('.field-select__item')).forEach(item => {
      item.addEventListener('click', e => {
        this.el.querySelector('.field-select__caption').innerText = e.currentTarget.innerText;
        this.el.querySelector('.field-select__input').value = e.currentTarget.getAttribute('data-value');
        this.el.querySelector('.field-select__caption').classList.add('is-selected');
        this.el.classList.toggle('is-active');
        [].slice.call(document.querySelectorAll('[data-delivery-price]')).forEach(item => {
          item.innerText = e.currentTarget.getAttribute('data-price');
        });
      });
    });
  }
}

export default Select;
