import React from "react";

const FormField = ({label,name,type='text',value,onChange,placeholder,required,rows})=>{
     return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          required={required}
        />
      ) : type === 'select' ? (
        <select name={name} value={value} onChange={onChange} required={required}>
          <option value="">Select...</option>
          <option value="weekdays">Weekdays only</option>
          <option value="weekends">Weekends only</option>
          <option value="both">Both weekdays & weekends</option>
          <option value="flexible">Flexible / On-call</option>
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={type === 'number' ? 0 : undefined}
          max={type === 'number' ? 120 : undefined}
        />
      )}
    </div>
  );
}

export default React.memo(FormField)