import React from 'react';

const FormElement = ({
  input,
  label,
  error,
}: {
  input: any;
  label: string;
  error?: string;
}) => (
  <div className="form-element">
    <label>{label}</label>
    <div>{input}</div>
  </div>
);

export default FormElement;
