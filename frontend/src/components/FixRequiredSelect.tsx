import React from "react";
import PropTypes from "prop-types";
import { useRef } from "react";

const noop = () => {
  // no operation (do nothing real quick)
};

const FixRequiredSelect = (props) => {
  const { place, setPlace } = props; // place from props
  const { SelectComponent, required } = props; // SelectComponent from props
  const { isDisabled } = props; // isDisabled from props
  const enableRequired = !isDisabled;
  let selectRef = useRef<HTMLInputElement>(null); // select component ref
  const onChange = (value, actionMeta) => {
    if (props.index === undefined) {
      setPlace(value);
    } else {
      place.splice(props.index, 1, value);
      setPlace([...place]);
    }
  };
  return (
    <div className="relative">
      <SelectComponent
        {...props}
        ref={selectRef}
        onChange={onChange}
        value={props.index === undefined ? place : place[props.index]}
      />
      {enableRequired && (
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: "absolute",
            opacity: 0,
            top: "30px",
            height: "1px",
          }}
          value={
            props.index === undefined ? place.value : place[props.index].value
          }
          onChange={() => {}}
          onFocus={() => selectRef.current?.focus()}
          required={required}
        />
      )}
    </div>
  );
};
FixRequiredSelect.defaultProps = {
  onChange: noop,
};
FixRequiredSelect.propTypes = {
  // react-select component class (e.g. Select, Creatable, Async)
  selectComponent: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
export default FixRequiredSelect;
