/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp, no-unused-vars, react/no-unused-state */
import React from 'react';
import keyCode from 'rc-util/lib/KeyCode';
import expect from 'expect.js';
import {
  Simulate,
  findRenderedDOMComponentWithTag,
  scryRenderedDOMComponentsWithTag,
  findRenderedDOMComponentWithClass,
} from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import InputNumber from '../src';
import '../assets/index.less';

const defaultValue = 98;

describe('InputNumber', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let onChangeFirstArgument;
  let onChangeCallCount = 0;
  let onFocusCallCount = 0;
  let onBlurCallCount = 0;

  class Component extends React.Component {
    state = {
      min: 1,
      max: 200,
      value: defaultValue,
      step: 1,
      disabled: false,
      autoFocus: false,
      readOnly: false,
      name: 'inputNumber',
    };

    onChange = value => {
      onChangeFirstArgument = value;
      onChangeCallCount += 1;
      this.setState({ value });
    };

    onFocus = () => {
      onFocusCallCount += 1;
    };

    onBlur = () => {
      onBlurCallCount += 1;
    };

    triggerBoolean = propName => {
      const prop = {};
      prop[propName] = !this.state[propName];
      this.setState(prop);
    };

    render() {
      return (
        <div>
          <InputNumber
            ref="inputNum"
            {...this.props}
            min={this.state.min}
            max={this.state.max}
            onChange={this.onChange}
            value={this.state.value}
            step={this.state.step}
            disabled={this.state.disabled}
            autoFocus={this.state.autoFocus}
            readOnly={this.state.readOnly}
            name={this.state.name}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
      );
    }
  }

  let inputNumber;
  let example;
  let inputElement;
  beforeEach(() => {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
    inputElement = ReactDOM.findDOMNode(inputNumber.input);
    onChangeCallCount = 0;
    onFocusCallCount = 0;
    onBlurCallCount = 0;
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    onChangeCallCount = 0;
    onFocusCallCount = 0;
    onBlurCallCount = 0;
  });

  describe('keyboard works', () => {
    it('up works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
      });
      expect(inputNumber.state.value).to.be(99);
    });

    it('down works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN,
      });
      expect(inputNumber.state.value).to.be(97);
    });

    it('combination keys works', () => {
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN,
        shiftKey: true,
      });
      expect(inputNumber.state.value).to.be(88);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
        ctrlKey: true,
      });
      expect(inputNumber.state.value).to.be(88.1);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
        shiftKey: true,
      });
      expect(inputNumber.state.value).to.be(98.1);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN,
        ctrlKey: true,
      });
      expect(inputNumber.state.value).to.be(98);
    });
  });

  describe('disable keyboard works', () => {
    it("value shouldn't change if keyboard is disabled", () => {
      example = ReactDOM.render(<Component keyboard={false} />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
      });
      expect(inputNumber.state.value).to.be(98);

      Simulate.keyDown(inputElement, {
        keyCode: keyCode.DOWN,
      });
      expect(inputNumber.state.value).to.be(98);
    });
  });

  describe('clickable', () => {
    it('up button works', () => {
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(97);
    });

    it('up button works on empty input', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(1);
    });

    it('down button works on empty input', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(-1);
    });

    it('up button works on empty input with min and max', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={6} max={10} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(6);
    });

    it('up button works null input with min and max', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={null} min={6} max={10} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(null);
    });

    it('down button works on empty input with min and max', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={6} max={10} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(6);
    });

    it('should not disable up and down buttons', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      expect(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up').className.indexOf(
          'disabled',
        ) > 0,
      ).to.be(false);
      expect(
        findRenderedDOMComponentWithClass(
          example,
          'rc-input-number-handler-down',
        ).className.indexOf('disabled') > 0,
      ).to.be(false);
    });

    it('should record current properties upon mouse up', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={123} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);

      inputNumber = example.refs.inputNum;
      const inputField = ReactDOM.findDOMNode(inputNumber.input);

      expect(inputNumber.currentValue).to.be(undefined);
      expect(inputNumber.cursorStart).to.be(undefined);
      expect(inputNumber.cursorEnd).to.be(undefined);
      Simulate.mouseUp(inputField);

      expect(inputNumber.cursorStart).to.be(0);
      expect(inputNumber.cursorEnd).to.be(0);
      expect(inputNumber.currentValue).to.be('123');
    });
  });

  describe('long press', () => {
    it('up button works', done => {
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      setTimeout(() => {
        expect(inputNumber.state.value).to.be(99);
        setTimeout(() => {
          expect(inputNumber.state.value).to.above(99);
          done();
        }, 200);
      }, 500);
    });

    it('down button works', done => {
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      setTimeout(() => {
        expect(inputNumber.state.value).to.be(97);
        setTimeout(() => {
          expect(inputNumber.state.value).to.below(97);
          done();
        }, 200);
      }, 500);
    });
  });

  describe('check props works', () => {
    it('max', () => {
      for (let i = 0; i < 3; i += 1) {
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'),
        );
      }
      expect(inputNumber.state.value).to.be(101);
    });

    it('min', () => {
      for (let i = 0; i < 100; i += 1) {
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
        );
      }
      expect(inputNumber.state.value).to.be(1);
    });

    it('disabled', () => {
      example.triggerBoolean('disabled');
      expect(inputNumber.props.disabled).to.be(true);
    });

    it('readonly', () => {
      example.triggerBoolean('readOnly');
      expect(inputNumber.props.readOnly).to.be(true);
    });

    it('autofocus', () => {
      example.triggerBoolean('autoFocus');
      expect(inputNumber.props.autoFocus).to.be(true);
    });

    it('step', () => {
      example.setState({ step: 5 });
      for (let i = 0; i < 3; i += 1) {
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
        );
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 5);
    });

    it('step read only', () => {
      // testing in read only.
      example.setState({ step: 5 });
      example.triggerBoolean('readOnly');
      for (let i = 0; i < 3; i += 1) {
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
        );
      }
      expect(inputNumber.state.value).to.be(defaultValue);
    });

    it('decimal step', () => {
      example.setState({ step: 0.1 });
      for (let i = 0; i < 3; i += 1) {
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
        );
      }
      expect(inputNumber.state.value).to.be(defaultValue - 3 * 0.1);
    });

    it('controlled component will restore when blur input', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6' } });
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('6');
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
    });

    // Fix https://github.com/ant-design/ant-design/issues/7334
    it('controlled component will show limited value when input is not focused', () => {
      class Demo extends React.Component {
        state = {
          value: 2,
        };

        changeValue = () => {
          this.setState({ value: '103aa' });
        };

        render() {
          return (
            <div>
              <button type="button" onClick={this.changeValue}>
                change value
              </button>
              <InputNumber ref="inputNum" min={1} max={10} value={this.state.value} />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2');
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(10);
      expect(inputElement.value).to.be('10');
    });

    // https://github.com/ant-design/ant-design/issues/7358
    it('controlled component should accept undefined value', () => {
      class Demo extends React.Component {
        state = {
          value: 2,
        };

        changeValue = () => {
          this.setState({ value: undefined });
        };

        render() {
          return (
            <div>
              <button type="button" onClick={this.changeValue}>
                change value
              </button>
              <InputNumber ref="inputNum" min={1} max={10} value={this.state.value} />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2');
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(undefined);
      expect(inputElement.value).to.be('');
    });
  });

  describe('check value changes with readonly props set to true', () => {
    it('no value changes after readonly works', () => {
      example.triggerBoolean('readOnly');
      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(98);
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(98);
    });
  });

  describe('input directly', () => {
    it('input valid number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6' } });
      expect(inputElement.value).to.be('6');
      expect(onChangeFirstArgument).to.be(6);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6');
      expect(onChangeFirstArgument).to.be(6);
    });

    it('input invalid number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: 'xx' } });
      expect(inputElement.value).to.be('xx');
      expect(onChangeFirstArgument).to.be('xx');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('input invalid string with number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '2x' } });
      expect(inputElement.value).to.be('2x');
      expect(onChangeFirstArgument).to.be('2x');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('2');
      expect(onChangeFirstArgument).to.be(2);
    });

    it('input invalid decimal point with max number', () => {
      example.setState({ max: 10 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '15.' } });
      expect(inputElement.value).to.be('15.');
      expect(onChangeFirstArgument).to.be('15.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('10');
      expect(onChangeFirstArgument).to.be(10);
    });

    it('input invalid decimal point with min number', () => {
      example.setState({ min: 5 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '3.' } });
      expect(inputElement.value).to.be('3.');
      expect(onChangeFirstArgument).to.be('3.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('5');
      expect(onChangeFirstArgument).to.be(5);
    });

    it('input negative symbol', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-' } });
      expect(inputElement.value).to.be('-');
      expect(onChangeFirstArgument).to.be('-');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('input negative number', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-98' } });
      expect(inputElement.value).to.be('-98');
      expect(onChangeFirstArgument).to.be(-98);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('-98');
      expect(onChangeFirstArgument).to.be(-98);
    });

    // https://github.com/ant-design/ant-design/issues/9439
    it('input negative zero', () => {
      example.setState({ min: -100 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '-0' } });
      expect(inputElement.value).to.be('-0');
      expect(onChangeFirstArgument).to.be(0);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('0');
      expect(onChangeFirstArgument).to.be(0);
    });

    it('input decimal number with integer step', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.2' } });
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
    });

    it('input decimal number with decimal step', () => {
      example.setState({ step: 0.1 });
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.2' } });
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1.2');
      expect(onChangeFirstArgument).to.be(1.2);
    });

    it('input empty text and blur', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '' } });
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be('');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('');
      expect(onChangeFirstArgument).to.be(null);
    });

    it('blur on default input', () => {
      const onChange = sinon.spy();
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" onChange={onChange} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.blur(inputElement);
      expect(onChange.called).to.be(false);
    });

    it('pressEnter works', () => {
      const onPressEnter = sinon.spy();
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" onPressEnter={onPressEnter} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.keyDown(inputElement, { keyCode: keyCode.ENTER });
      expect(onPressEnter.called).to.be(true);
    });
  });

  describe('default value', () => {
    it('default value should be empty', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('');
    });

    it('default value should be empty when step is decimal', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={0.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('');
    });

    it('default value should be 1', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" defaultValue={1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1');
    });

    it('default value could be null', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" defaultValue={null} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(null);
      expect(inputElement.value).to.be('');
    });

    it("default value shouldn't higher than max", () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} defaultValue={13} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
    });

    it("default value shouldn't lower than min", () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} defaultValue={-1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0);
    });

    it('default value can be a string greater than 16 characters', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" max={10} defaultValue="-3.637978807091713e-12" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(-3.637978807091713e-12);
    });
  });

  describe('value', () => {
    it("value shouldn't higher than max", () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} value={13} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
    });

    it("value shouldn't lower than min", () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" min={0} max={10} value={-1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0);
    });

    it('value can be a string greater than 16 characters', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" max={10} value="-3.637978807091713e-12" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(-3.637978807091713e-12);
    });

    it('value decimal over six decimal not be scientific notation', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" precision={7} step={0.0000001} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputElement.value).to.be('0.0000001');
      expect(inputElement.value).not.to.be('1e-7');
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputElement.value).to.be('0.0000002');
      expect(inputElement.value).not.to.be('2e-7');
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputElement.value).to.be('0.0000001');
      expect(inputElement.value).not.to.be('1e-7');
    });

    it('value should be max safe integer when it exceeds max safe integer', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={1e24} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputElement.value).to.be((2 ** 53 - 1).toString());
    });

    it('value can be changed when dynamic setting max', () => {
      class Demo extends React.Component {
        state = {
          max: 10,
          value: 11,
        };

        onChange = value => {
          this.setState({ value });
        };

        changeMax = () => {
          this.setState({
            value: 11,
            max: 20,
          });
        };

        render() {
          return (
            <div>
              <InputNumber
                ref="inputNum"
                max={this.state.max}
                onChange={this.onChange}
                value={this.state.value}
              />
              <button type="button" onClick={this.changeMax}>
                change max
              </button>
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(11);
    });

    it('value can be changed when dynamic setting min', () => {
      class Demo extends React.Component {
        state = {
          min: 10,
          value: 9,
        };

        onChange = value => {
          this.setState({ value });
        };

        changeMax = () => {
          this.setState({
            value: 9,
            min: 0,
          });
        };

        render() {
          return (
            <div>
              <InputNumber
                ref="inputNum"
                min={this.state.min}
                onChange={this.onChange}
                value={this.state.value}
              />
              <button type="button" onClick={this.changeMax}>
                change min
              </button>
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(10);
      Simulate.click(findRenderedDOMComponentWithTag(example, 'button'));
      expect(inputNumber.state.value).to.be(9);
    });
  });

  describe('decimal', () => {
    it('decimal value', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={1} value={2.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('decimal defaultValue', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={1} defaultValue={2.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('increase and decrease decimal InputNumber by integer step', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={1} defaultValue={2.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(3.1);
      expect(inputElement.value).to.be('3.1');
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.1');
    });

    it('small value and step', () => {
      class Demo extends React.Component {
        state = {
          value: 0.000000001,
        };

        onChange = v => {
          this.setState({
            value: v,
          });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              step={0.000000001}
              min={-10}
              max={10}
              onChange={this.onChange}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(0.000000001);
      expect(inputElement.value).to.be('0.000000001');
      for (let i = 0; i < 10; i += 1) {
        // plus until change precision
        Simulate.mouseDown(
          findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'),
        );
      }
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(0.000000011);
      expect(inputElement.value).to.be('0.000000011');
    });

    it('small step with integer value', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={1} step="0.000000001" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      expect(inputElement.value).to.be('1.000000000');
    });

    it('custom decimal separator', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" decimalSeparator="," />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1,1' } });
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1,1');
      expect(inputNumber.state.value).to.be(1.1);
    });
  });

  describe('GitHub issues', () => {
    // https://github.com/react-component/input-number/issues/32
    it('issue 32', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={0.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '2' } });
      expect(inputNumber.state.value).to.be(undefined);
      expect(inputElement.value).to.be('2');
      Simulate.blur(inputElement);
      expect(inputNumber.state.value).to.be(2);
      expect(inputElement.value).to.be('2.0');
    });

    // https://github.com/react-component/input-number/issues/197
    it('issue 197', () => {
      class Demo extends React.Component {
        state = {
          value: NaN,
        };

        onChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={1}
              value={this.state.value}
              onChange={this.onChange}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: 'foo' } });
    });

    // https://github.com/react-component/input-number/issues/222
    it('issue 222', () => {
      class Demo extends React.Component {
        state = {
          value: 1,
          max: NaN,
        };

        onChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={1}
              max={this.state.max}
              value={this.state.value}
              onChange={this.onChange}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: 'foo' } });
    });

    // https://github.com/react-component/input-number/issues/35
    it('issue 35', () => {
      let num;
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={0.01}
              defaultValue={2}
              onChange={value => {
                num = value;
              }}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      for (let i = 1; i <= 400; i += 1) {
        Simulate.keyDown(inputElement, {
          keyCode: keyCode.DOWN,
        });
        // no number like 1.5499999999999999
        expect((num.toString().split('.')[1] || '').length).to.below(3);
        const expectedValue = Number(((200 - i) / 100).toFixed(2));
        expect(inputNumber.state.value).to.be(expectedValue);
        expect(num).to.be(expectedValue);
      }

      for (let i = 1; i <= 300; i += 1) {
        Simulate.keyDown(inputElement, {
          keyCode: keyCode.UP,
        });
        // no number like 1.5499999999999999
        expect((num.toString().split('.')[1] || '').length).to.below(3);
        const expectedValue = Number(((i - 200) / 100).toFixed(2));
        expect(num).to.be(expectedValue);
        expect(inputNumber.state.value).to.be(expectedValue);
      }
    });

    // https://github.com/ant-design/ant-design/issues/4229
    it('long press not trigger onChange in uncontrolled component', done => {
      let num;
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber
              ref="inputNum"
              defaultValue={0}
              onChange={value => {
                num = value;
              }}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;

      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      setTimeout(() => {
        expect(num).to.be(1);
        setTimeout(() => {
          expect(num).to.above(1);
          done();
        }, 200);
      }, 500);
    });

    // https://github.com/ant-design/ant-design/issues/4757
    it('should allow to input text like "1."', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1.' } });
      expect(inputElement.value).to.be('1.');
      expect(onChangeFirstArgument).to.be('1.');
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('1');
      expect(onChangeFirstArgument).to.be(1);
    });

    // https://github.com/ant-design/ant-design/issues/5012
    // https://github.com/react-component/input-number/issues/64
    it('controller InputNumber should be able to input number like 1.00* and 1.10*', () => {
      let num;
      class Demo extends React.Component {
        state = {
          value: 2,
        };

        onChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={value => {
                num = value;
                this.onChange(value);
              }}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6.0' } });
      expect(inputElement.value).to.be('6.0');
      expect(num).to.be(6);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6');
      expect(num).to.be(6);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '6.10' } });
      expect(inputElement.value).to.be('6.10');
      expect(num).to.be(6.1);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('6.1');
      expect(num).to.be(6.1);
    });

    it('onChange should not be called when input is not changed', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1' } });
      expect(onChangeCallCount).to.be(1);
      expect(onChangeFirstArgument).to.be(1);
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(1);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '' } });
      expect(onChangeCallCount).to.be(2);
      expect(onChangeFirstArgument).to.be('');
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(3);
      expect(onChangeFirstArgument).to.be(null);
      Simulate.focus(inputElement);
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(3);
    });

    // https://github.com/ant-design/ant-design/issues/5235
    it('input long number', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '111111111111111111111' } });
      expect(inputElement.value).to.be('111111111111111111111');
      Simulate.change(inputElement, { target: { value: '11111111111111111111111111111' } });
      expect(inputElement.value).to.be('11111111111111111111111111111');
    });

    // https://github.com/ant-design/ant-design/issues/7363
    it('uncontrolled input should trigger onChange always when blur it', () => {
      const onChange = sinon.spy();
      inputNumber = ReactDOM.render(
        <InputNumber min={1} max={10} onChange={onChange} />,
        container,
      );
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '123' } });
      expect(onChange.callCount).to.be(1);
      expect(onChange.calledWith(123)).to.be(true);
      Simulate.blur(inputElement);
      expect(onChange.callCount).to.be(2);
      expect(onChange.calledWith(10)).to.be(true);

      // repeat it, it should works in same way
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '123' } });
      expect(onChange.callCount).to.be(3);
      expect(onChange.calledWith(123)).to.be(true);
      Simulate.blur(inputElement);
      expect(onChange.callCount).to.be(4);
      expect(onChange.calledWith(10)).to.be(true);
    });

    // https://github.com/ant-design/ant-design/issues/7867
    it('focus should not cut precision of input value', () => {
      class Demo extends React.Component {
        state = {
          value: 2,
        };

        onBlur = () => {
          this.setState({ value: 2 });
        };

        render() {
          return (
            <InputNumber ref="inputNum" value={this.state.value} step={0.1} onBlur={this.onBlur} />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('2.0');
      Simulate.focus(inputElement);
      expect(inputElement.value).to.be('2.0');
    });

    // https://github.com/ant-design/ant-design/issues/7940
    it('should not format during input', () => {
      class Demo extends React.Component {
        state = {
          value: '',
        };

        onChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              step={0.1}
              onChange={this.onChange}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '1' } });
      expect(inputElement.value).to.be('1');
    });

    // https://github.com/ant-design/ant-design/issues/8196
    it('Allow inputing 。', () => {
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '8。1' } });
      expect(inputElement.value).to.be('8.1');
    });

    it('focus input when click up/down button ', () => {
      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(true);
      expect(document.activeElement).to.be(inputElement);
      expect(onFocusCallCount).to.be(1);
      Simulate.blur(inputElement);
      expect(onBlurCallCount).to.be(1);
      expect(ReactDOM.findDOMNode(inputNumber).className.indexOf('focused') > 0).to.be(false);
    });

    // https://github.com/ant-design/ant-design/issues/25614
    it("focus value should be '' when clear the input", () => {
      let targetValue;
      class Demo extends React.Component {
        state = {
          value: 1,
        };

        render() {
          return (
            <div>
              <InputNumber
                ref="inputNum"
                min={1}
                max={10}
                onBlur={e => {
                  targetValue = e.target.value;
                }}
                value={this.state.value}
              />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(1);
      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '' } });
      Simulate.blur(inputElement);
      expect(targetValue).to.be('');
    });

    it('should set input value as formatted when blur', () => {
      let valueOnBlur;
      function onBlur(e) {
        valueOnBlur = e.target.value;
      }
      class Demo extends React.Component {
        state = {
          value: 1,
        };

        render() {
          return (
            <div>
              <InputNumber
                ref="inputNum"
                onBlur={onBlur}
                formatter={value => `${value * 100}%`}
                value={this.state.value}
              />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('100%');
      expect(valueOnBlur).to.be('100%');
    });

    // https://github.com/ant-design/ant-design/issues/11574
    it('should trigger onChange when max or min change', () => {
      const onChange = sinon.spy();
      class Demo extends Component {
        state = {
          value: 10,
          min: 0,
          max: 20,
        };

        onChange = value => {
          this.setValue(value);
          onChange(value);
        };

        setMax(max) {
          this.setState({ max });
        }

        setMin(min) {
          this.setState({ min });
        }

        setValue(value) {
          this.setState({ value });
        }

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={this.onChange}
              max={this.state.max}
              min={this.state.min}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      example.setMin(11);
      expect(inputElement.value).to.be('11');
      expect(onChange.calledWith(11)).to.be(true);

      example.setValue(15);

      example.setMax(14);
      expect(inputElement.value).to.be('14');
      expect(onChange.calledWith(14)).to.be(true);
    });

    // https://github.com/react-component/input-number/issues/120
    it('should not reset value when parent rerenders with the same `value` prop', () => {
      class Demo extends React.Component {
        state = { value: 40 };

        onChange = () => {
          this.forceUpdate();
        };

        render() {
          return <InputNumber ref="inputNum" value={this.state.value} onChange={this.onChange} />;
        }
      }

      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '401' } });

      // Demo rerenders and the `value` prop is still 40, but the user input should
      // be retained
      expect(inputElement.value).to.be('401');
    });

    // https://github.com/ant-design/ant-design/issues/16710
    it('should use correct precision when change it to 0', () => {
      class Demo extends React.Component {
        state = {
          precision: 2,
        };

        onPrecisionChange = precision => {
          this.setState({ precision });
        };

        render() {
          const { precision } = this.state;
          return (
            <div>
              <InputNumber onChange={this.onPrecisionChange} />
              <InputNumber precision={precision} defaultValue={1.23} />
            </div>
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      const [precisionInput, numberInput] = scryRenderedDOMComponentsWithTag(example, 'input');
      expect(numberInput.value).to.be('1.23');
      Simulate.focus(precisionInput);
      Simulate.change(precisionInput, { target: { value: '0' } });
      Simulate.blur(precisionInput);
      expect(numberInput.value).to.be('1');
    });

    // https://github.com/react-component/input-number/issues/235
    describe('cursor position', () => {
      const setUpCursorTest = (
        initialValue,
        changedValue,
        keyCodeValue,
        selectionStart,
        selectionEnd,
      ) => {
        class Demo extends React.Component {
          onChange = value => {
            this.setState({ value });
          };
          render() {
            return <InputNumber ref="inputNum" value={initialValue} onChange={this.onChange} />;
          }
        }
        example = ReactDOM.render(<Demo />, container);
        inputNumber = example.refs.inputNum;
        inputNumber.input.selectionStart = selectionStart;
        inputNumber.input.selectionEnd = selectionEnd || selectionStart;
        inputElement = ReactDOM.findDOMNode(inputNumber.input);
        Simulate.focus(inputElement);
        Simulate.keyDown(inputElement, { keyCode: keyCodeValue });
        Simulate.change(inputElement, { target: { value: changedValue } });
      };

      it('should be maintained on delete with identical consecutive digits', () => {
        setUpCursorTest(99999, '9999', keyCode.DELETE, 3);
        expect(inputNumber.input.selectionStart).to.be(3);
      });

      it('should be maintained on delete with unidentical consecutive digits', () => {
        setUpCursorTest(12345, '1235', keyCode.DELETE, 3);
        expect(inputNumber.input.selectionStart).to.be(3);
      });

      it('should be one step earlier on backspace with identical consecutive digits', () => {
        setUpCursorTest(99999, '9999', keyCode.BACKSPACE, 3);
        expect(inputNumber.input.selectionStart).to.be(2);
      });

      it('should be one step earlier on backspace with unidentical consecutive digits', () => {
        setUpCursorTest(12345, '1245', keyCode.BACKSPACE, 3);
        expect(inputNumber.input.selectionStart).to.be(2);
      });

      it('should be at the start of selection on delete with identical consecutive digits', () => {
        setUpCursorTest(99999, '999', keyCode.DELETE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(1);
      });

      it('should be at the start of selection on delete with unidentical consecutive digits', () => {
        // eslint-disable-line
        setUpCursorTest(12345, '145', keyCode.DELETE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(1);
      });

      it('should be at the start of selection on backspace with identical consecutive digits', () => {
        // eslint-disable-line
        setUpCursorTest(99999, '999', keyCode.BACKSPACE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(1);
      });

      it('should be at the start of selection on backspace with unidentical consecutive digits', () => {
        // eslint-disable-line
        setUpCursorTest(12345, '145', keyCode.BACKSPACE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(1);
      });

      it('should be one step later on new digit with identical consecutive digits', () => {
        setUpCursorTest(99999, '999999', keyCode.NINE, 3);
        expect(inputNumber.input.selectionStart).to.be(4);
      });

      it('should be one step later on new digit with unidentical consecutive digits', () => {
        setUpCursorTest(12345, '123945', keyCode.NINE, 3);
        expect(inputNumber.input.selectionStart).to.be(4);
      });

      it('should be one step later than the start of selection on new digit with identical consecutive digits', () => {
        // eslint-disable-line
        setUpCursorTest(99999, '9999', keyCode.NINE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(2);
      });

      it('should be one step laterthan the start of selection on new digit with unidentical consecutive digits', () => {
        // eslint-disable-line
        setUpCursorTest(12345, '1945', keyCode.NINE, 1, 3);
        expect(inputNumber.input.selectionStart).to.be(2);
      });
    });
  });

  // https://github.com/ant-design/ant-design/issues/28366
  describe('cursor position when last string exists', () => {
    const setUpCursorTest = (initValue, prependValue) => {
      class Demo extends React.Component {
        state = {
          value: initValue,
        };

        onChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={this.state.value}
              onChange={this.onChange}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputNumber.input.selectionStart = 0;
      inputNumber.input.selectionEnd = 0;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      for (let i = 0; i < prependValue.length; i += 1) {
        Simulate.keyDown(inputElement, { keyCode: keyCode.ONE });
      }
      Simulate.change(inputElement, { target: { value: prependValue + initValue } });
    };

    it('shold fix caret position on case 1', () => {
      // '$ 1'
      setUpCursorTest('', '1');
      expect(inputNumber.input.selectionStart).to.be(3);
    });
    it('shold fix caret position on case 2', () => {
      // '$ 111'
      setUpCursorTest('', '111');
      expect(inputNumber.input.selectionStart).to.be(5);
    });
    it('shold fix caret position on case 3', () => {
      // '$ 111'
      setUpCursorTest('1', '11');
      expect(inputNumber.input.selectionStart).to.be(4);
    });
    it('shold fix caret position on case 4', () => {
      // '$ 123,456'
      setUpCursorTest('456', '123');
      expect(inputNumber.input.selectionStart).to.be(6);
    });
  });

  describe(`required prop`, () => {
    it(`should add required attr to the input tag when get passed as true`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" required />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(inputTag.getAttribute(`required`)).not.to.be(null);
    });

    it(`should not add required attr to the input as default props when not being supplied`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(inputTag.getAttribute(`required`)).to.be(null);
    });

    it(`should not add required attr to the input tag when get passed as false`, () => {
      ReactDOM.render(<InputNumber id="required-input-test" required={false} />, container);
      const inputTag = container.querySelector('#required-input-test');
      expect(inputTag.getAttribute(`required`)).to.be(null);
    });
  });

  describe('Pattern prop', () => {
    it(`should render with a pattern attribute if the pattern prop is supplied`, () => {
      ReactDOM.render(<InputNumber id="pattern-input-test" pattern="\d*" />, container);
      const patternAttribute = container
        .querySelector('#pattern-input-test')
        .getAttribute(`pattern`);
      expect(patternAttribute).to.equal('\\d*');
    });

    it(`should render with no pattern attribute if the pattern prop is not supplied`, () => {
      ReactDOM.render(<InputNumber id="pattern-input-test" />, container);
      const patternAttribute = container
        .querySelector('#pattern-input-test')
        .getAttribute(`pattern`);
      expect(patternAttribute).to.be(null);
    });
  });

  describe('precision', () => {
    it('decimal step should not display complete precision', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={0.01} value={2.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.10');
    });

    it('string step should display complete precision', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step="1.000" value={2.1} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputNumber.state.value).to.be(2.1);
      expect(inputElement.value).to.be('2.100');
    });

    it('prop precision is specified', () => {
      class Demo extends React.Component {
        onChange = value => {
          onChangeFirstArgument = value;
        };

        render() {
          return (
            <InputNumber ref="inputNum" precision={2} defaultValue={2} onChange={this.onChange} />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.value).to.be('2.00');
      Simulate.change(inputElement, { target: { value: '3.456' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(3.46);
      expect(inputElement.value).to.be('3.46');
      Simulate.change(inputElement, { target: { value: '3.465' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(3.47);
      expect(inputElement.value).to.be('3.47');
      Simulate.change(inputElement, { target: { value: '3.455' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(3.46);
      expect(inputElement.value).to.be('3.46');
      Simulate.change(inputElement, { target: { value: '1' } });
      Simulate.blur(inputElement);
      expect(onChangeFirstArgument).to.be(1);
      expect(inputElement.value).to.be('1.00');
    });

    it('should not trigger onChange when blur InputNumber with precision', () => {
      class Demo extends React.Component {
        onChange = () => {
          onChangeCallCount += 1;
        };

        render() {
          return (
            <InputNumber ref="inputNum" precision={2} defaultValue={2} onChange={this.onChange} />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.blur(inputElement);
      expect(onChangeCallCount).to.be(0);
    });
  });

  describe('formatter', () => {
    it('formatter on default', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" step={1} value={5} formatter={num => `$ ${num}`} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5');
    });

    it('formatter on mousedown', () => {
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber ref="inputNum" sep={1} defaultValue={5} formatter={num => `$ ${num}`} />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.mouseDown(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6');
      Simulate.mouseDown(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5');
    });

    it('formatter on touchstart', () => {
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={1}
              defaultValue={5}
              useTouch
              formatter={num => `${num} ¥`}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('6 ¥');
      Simulate.touchStart(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('5 ¥');
    });

    it('formatter on keydown', () => {
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber ref="inputNum" sep={1} defaultValue={5} formatter={num => `$ ${num} ¥`} />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 ¥');
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5 ¥');
    });

    it('formatter on direct input', () => {
      let onChangeFirstArgumentFormat;

      class Demo extends React.Component {
        state = {
          value: 5,
        };

        onChange = value => {
          onChangeFirstArgumentFormat = value;
          this.setState({ value });
        };

        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={1}
              defaultValue={5}
              formatter={num => `$ ${num}`}
              onChange={this.onChange}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);

      Simulate.focus(inputElement);
      Simulate.change(inputElement, { target: { value: '100' } });
      expect(inputElement.value).to.be('$ 100');
      expect(onChangeFirstArgumentFormat).to.be(100);
      Simulate.blur(inputElement);
      expect(inputElement.value).to.be('$ 100');
      expect(inputNumber.state.value).to.be(100);
    });

    it('formatter and parser', () => {
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber
              ref="inputNum"
              step={1}
              defaultValue={5}
              useTouch
              formatter={num => `$ ${num} boeing 737`}
              parser={num => num.toString().split(' ')[1]}
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.focus(inputElement);
      Simulate.keyDown(inputElement, { keyCode: keyCode.UP });
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 boeing 737');
      Simulate.keyDown(inputElement, { keyCode: keyCode.DOWN });
      expect(inputNumber.state.value).to.be(5);
      expect(inputElement.value).to.be('$ 5 boeing 737');
      Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(6);
      expect(inputElement.value).to.be('$ 6 boeing 737');
    });
  });

  describe('onPaste props', () => {
    it('passes onPaste event handler', () => {
      const onPaste = sinon.spy();
      class Demo extends React.Component {
        render() {
          return <InputNumber value={1} ref="inputNum" onPaste={onPaste} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.paste(inputElement);
      expect(onPaste.called).to.be(true);
    });
  });

  describe('onStep props', () => {
    it('triggers onStep when stepping value up or down', () => {
      const onStep = sinon.spy();
      class Demo extends React.Component {
        render() {
          return <InputNumber value={1} ref="inputNum" onStep={onStep} />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      Simulate.keyDown(inputElement, {
        keyCode: keyCode.UP,
      });
      expect(onStep.called).to.be(true);
      expect(onStep.calledWith(2)).to.be(true);
    });
  });

  describe('aria and data props', () => {
    it('passes data-* attributes', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={1} data-test="test-id" data-id="12345" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('data-test')).to.be('test-id');
      expect(inputElement.getAttribute('data-id')).to.be('12345');
    });

    it('passes aria-* attributes', () => {
      class Demo extends React.Component {
        render() {
          return (
            <InputNumber
              ref="inputNum"
              value={1}
              aria-labelledby="test-id"
              aria-label="some-label"
            />
          );
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('aria-labelledby')).to.be('test-id');
      expect(inputElement.getAttribute('aria-label')).to.be('some-label');
    });

    it('passes role attribute', () => {
      class Demo extends React.Component {
        render() {
          return <InputNumber ref="inputNum" value={1} role="searchbox" />;
        }
      }
      example = ReactDOM.render(<Demo />, container);
      inputNumber = example.refs.inputNum;
      inputElement = ReactDOM.findDOMNode(inputNumber.input);
      expect(inputElement.getAttribute('role')).to.be('searchbox');
    });
  });
});

describe('Mobile inputNumber use TouchEvents', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  class Component extends React.Component {
    state = {
      min: 1,
      max: 200,
      value: defaultValue,
      step: 1,
      disabled: false,
      autoFocus: false,
      readOnly: false,
      name: 'inputNumber',
    };

    onChange = value => {
      this.setState({ value });
    };

    triggerBoolean = propName => {
      const prop = {};
      prop[propName] = !this.state[propName];
      this.setState(prop);
    };

    render() {
      return (
        <div>
          <InputNumber
            ref="inputNum"
            min={this.state.min}
            max={this.state.max}
            onChange={this.onChange}
            value={this.state.value}
            step={this.state.step}
            disabled={this.state.disabled}
            autoFocus={this.state.autoFocus}
            readOnly={this.state.readOnly}
            name={this.state.name}
            useTouch
          />
        </div>
      );
    }
  }

  let inputNumber;
  let example;
  let inputElement;
  beforeEach(() => {
    example = ReactDOM.render(<Component />, container);
    inputNumber = example.refs.inputNum;
    inputElement = ReactDOM.findDOMNode(inputNumber.input);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  describe('touchable', () => {
    it('up button works', () => {
      Simulate.touchStart(findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-up'));
      expect(inputNumber.state.value).to.be(99);
    });

    it('down button works', () => {
      Simulate.touchStart(
        findRenderedDOMComponentWithClass(example, 'rc-input-number-handler-down'),
      );
      expect(inputNumber.state.value).to.be(97);
    });
  });

  // https://github.com/ant-design/ant-design/issues/17593
  it('onBlur should be sync', () => {
    class Demo extends React.Component {
      render() {
        return (
          <InputNumber
            onBlur={({ target: { value } }) => {
              expect(value).to.be('1');
            }}
            precision={0}
            ref="inputNum"
          />
        );
      }
    }
    example = ReactDOM.render(<Demo />, container);
    inputNumber = example.refs.inputNum;
    inputElement = ReactDOM.findDOMNode(inputNumber.input);
    Simulate.focus(inputElement);
    inputElement.value = '1.2';
    Simulate.change(inputElement);
    Simulate.blur(inputElement);
    expect(inputElement.value).to.be('1');
  });
});
