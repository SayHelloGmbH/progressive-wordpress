import React from 'react';

const FormElement = ({
  input,
  label,
  name,
  error,
}: {
  input: any;
  label: string;
  name: string;
  error?: {
    type: string;
    message: string;
  };
}) => (
  <div className="form-element">
    <label>{label}</label>
    <div>{input}</div>
    {error && <p>{error.message}</p>}
  </div>
);

export default FormElement;
