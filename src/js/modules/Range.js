class Range {
  constructor (id) {
    this.containerHoverOnPercent = 0;
    this.el = document.querySelector(`#${id}`) || false;
    if (!this.el) { return; }
    this.events = ["mouseenter", "mousemove", "touchstart", "touchmove"];
    this.rangeLower = this.el.querySelector('input[type="range"][data-lower]');
    this.rangeUpper = this.el.querySelector('input[type="range"][data-upper]');
    this.trackerBetween = this.el.querySelector('[data-tracker-between]');
    this.minValue = Number(this.rangeLower.getAttribute('min'));
    this.maxValue = Number(this.rangeUpper.getAttribute('max'));
    this.inputMax = document.querySelector('[name="price_max"]');
    this.inputMin = document.querySelector('[name="price_min"]');
    this.updateTrackerBetween();

    this.events.forEach(eventName => {
      this.el.addEventListener(eventName, event => {
        this.containerHoverOnPercent = event.offsetX / event.target.clientWidth;
        this.moveAppropriateThumbToUpper();
      }, false);
    });

    this.rangeLower.addEventListener('input', event => {
      const lowerValue = Number(event.target.value);
      const upperValue = Number(this.rangeUpper.value);
      if (lowerValue < this.minValue) {
        event.target.value = this.minValue;
      } else if (lowerValue > upperValue) {
        event.target.value = upperValue;
      }

      this.moveAppropriateThumbToUpper();
      this.updateTrackerBetween();
      // console.log(`Min - ${event.target.value}`);
      // console.log(`Max - ${this.rangeUpper.value}`);
      this.inputMin.value = lowerValue;
      this.inputMax.value = upperValue;
    }, false);

    this.rangeUpper.addEventListener('input', event => {
      const lowerValue = Number(this.rangeLower.value);
      const upperValue = Number(event.target.value);
      if (upperValue > this.maxValue) {
        event.target.value = this.maxValue;
      } else if (upperValue < lowerValue) {
        event.target.value = lowerValue;
      }

      this.moveAppropriateThumbToUpper();
      this.updateTrackerBetween();
      this.inputMin.value = lowerValue;
      this.inputMax.value = upperValue;
    }, false);

    this.inputMin.addEventListener('input', event => {
      let val = Number(event.target.value);
      let rangeMax = Number(this.rangeUpper.value);
      if (val > rangeMax) {
        val = rangeMax;
        event.target.value = val;
      }
      this.rangeLower.value = val;
      this.updateTrackerBetween();
    }, false);

    this.inputMax.addEventListener('input', event => {
      this.rangeUpper.value = event.target.value;
      this.updateTrackerBetween();
    }, false);
  }

  updateTrackerBetween () {
    const lowerValue = Number(this.rangeLower.value);
    const upperValue = Number(this.rangeUpper.value);
    this.trackerBetween.style.width = `${(upperValue - lowerValue) / this.maxValue * 100}%`;
    this.trackerBetween.style.left = `${lowerValue / this.maxValue * 100}%`;
  };

  moveAppropriateThumbToUpper () {
    const lowerValue = Number(this.rangeLower.value);
    const upperValue = Number(this.rangeUpper.value);
    const closeValue = this.maxValue / 10;

    if (
      upperValue - lowerValue < closeValue &&
      upperValue > this.maxValue * .9
    ) {
      // this.rangeLower.classList.add('display-upper');
      // this.rangeUpper.classList.remove('display-upper');
    } else if (
      upperValue - lowerValue < closeValue &&
      lowerValue < this.maxValue * .1
    ) {
      // this.rangeLower.classList.remove('display-upper');
      // this.rangeUpper.classList.add('display-upper');
    } else {
      const middleValue = lowerValue + (upperValue - lowerValue) / 2;
      if (this.containerHoverOnPercent < middleValue / this.maxValue) {
        // this.rangeLower.classList.add('display-upper');
        // this.rangeUpper.classList.remove('display-upper');
      } else {
        // this.rangeLower.classList.remove('display-upper');
        // this.rangeUpper.classList.add('display-upper');
      }
    }
  };
}

export default Range;
